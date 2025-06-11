const budgetService = require('./budget.service');

// Get all budgets
async function getAllBudgets(req, res, next) {
  try {
    const budgets = await budgetService.getAllBudgets();
    res.json(budgets);
  } catch (error) {
    console.error('Error in getAllBudgets:', error);
    next(error);
  }
}

// Get a single budget by ID
async function getBudgetById(req, res, next) {
  try {
    const { id } = req.params;
    const budget = await budgetService.getBudgetById(id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json(budget);
  } catch (error) {
    console.error(`Error in getBudgetById for id ${req.params.id}:`, error);
    next(error);
  }
}

// Create a new budget
async function createBudget(req, res, next) {
  try {
    const budgetData = req.body;
    // Basic validation
    if (!budgetData.category || budgetData.amount === undefined || !budgetData.period) {
      return res.status(400).json({ message: 'Missing required fields: category, amount, period' });
    }
    if (typeof budgetData.amount !== 'number' || budgetData.amount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number.' });
    }
    const validPeriods = ['monthly', 'weekly', 'yearly', 'quarterly'];
    if (!validPeriods.includes(budgetData.period)) {
        return res.status(400).json({ message: `Period must be one of: ${validPeriods.join(', ')}.`});
    }

    const newBudget = await budgetService.createBudget(budgetData);
    res.status(201).json(newBudget);
  } catch (error) {
    console.error('Error in createBudget:', error);
    // Check for specific unique constraint error from service
    if (error.message && error.message.includes('A budget for this category and period already exists.')) {
        return res.status(409).json({ message: error.message });
    }
    next(error);
  }
}

// Update an existing budget
async function updateBudget(req, res, next) {
  try {
    const { id } = req.params;
    const budgetData = req.body;

    if (budgetData.amount !== undefined && (typeof budgetData.amount !== 'number' || budgetData.amount <= 0)) {
        return res.status(400).json({ message: 'Amount must be a positive number.' });
    }
    if (budgetData.period !== undefined) {
        const validPeriods = ['monthly', 'weekly', 'yearly', 'quarterly'];
        if (!validPeriods.includes(budgetData.period)) {
            return res.status(400).json({ message: `Period must be one of: ${validPeriods.join(', ')}.`});
        }
    }

    const updatedBudget = await budgetService.updateBudget(id, budgetData);
    if (!updatedBudget) {
      // This can mean not found, or no actual changes were made to data if service handles it that way.
      // Assuming service returns null if not found or not updated for other reasons.
      const budgetExists = await budgetService.getBudgetById(id);
      if (!budgetExists) {
         return res.status(404).json({ message: 'Budget not found' });
      }
      // If budget exists but not updated (e.g. data was same), return the existing budget or a 200 with no changes message
      return res.json(budgetExists); // Or a specific message like { message: 'No changes made to the budget.' }
    }
    res.json(updatedBudget);
  } catch (error) {
    console.error(`Error in updateBudget for id ${req.params.id}:`, error);
    // Check for specific unique constraint error from service during update
    if (error.message && error.message.includes('A budget for the target category and period already exists.')) {
        return res.status(409).json({ message: error.message });
    }
    next(error);
  }
}

// Delete a budget
async function deleteBudget(req, res, next) {
  try {
    const { id } = req.params;
    const result = await budgetService.deleteBudget(id);
    if (!result || result.changes === 0) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error(`Error in deleteBudget for id ${req.params.id}:`, error);
    next(error);
  }
}

module.exports = {
  getAllBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
};
