const transactionService = require('./transaction.service');

// Get all transactions
async function getAllTransactions(req, res, next) {
  try {
    // Basic filtering and pagination can be added here from req.query
    const transactions = await transactionService.getAllTransactions();
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    next(error); // Pass error to global error handler
  }
}

// Get a single transaction by ID
async function getTransactionById(req, res, next) {
  try {
    const { id } = req.params;
    const transaction = await transactionService.getTransactionById(id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    console.error(`Error fetching transaction ${req.params.id}:`, error);
    next(error);
  }
}

// Create a new transaction
async function createTransaction(req, res, next) {
  try {
    const { type, amount, category, date, description } = req.body;
    // Basic validation
    if (!type || !amount || !category || !date) {
      return res.status(400).json({ message: 'Missing required fields: type, amount, category, date' });
    }
    if (type !== 'income' && type !== 'expense') {
      return res.status(400).json({ message: 'Type must be either \'income\' or \'expense\'' });
    }
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const newTransaction = await transactionService.createTransaction({ type, amount, category, date, description });
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    next(error);
  }
}

// Update an existing transaction
async function updateTransaction(req, res, next) {
  try {
    const { id } = req.params;
    const transactionData = req.body;

    // Basic validation for type and amount if provided
    if (transactionData.type && transactionData.type !== 'income' && transactionData.type !== 'expense') {
      return res.status(400).json({ message: 'Type must be either \'income\' or \'expense\'' });
    }
    if (transactionData.amount !== undefined && (typeof transactionData.amount !== 'number' || transactionData.amount <= 0)) {
        return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const updatedTransaction = await transactionService.updateTransaction(id, transactionData);
    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found or not updated' });
    }
    res.json(updatedTransaction);
  } catch (error) {
    console.error(`Error updating transaction ${req.params.id}:`, error);
    next(error);
  }
}

// Delete a transaction
async function deleteTransaction(req, res, next) {
  try {
    const { id } = req.params;
    const result = await transactionService.deleteTransaction(id);
    if (!result || result.changes === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction deleted successfully' }); // Or res.status(204).send();
  } catch (error) {
    console.error(`Error deleting transaction ${req.params.id}:`, error);
    next(error);
  }
}

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
