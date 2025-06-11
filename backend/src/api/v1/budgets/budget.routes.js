const express = require('express');
const budgetController = require('./budget.controller');

const router = express.Router();

// Define budget routes

// GET /api/v1/budgets - Get all budgets
router.get('/', budgetController.getAllBudgets);

// POST /api/v1/budgets - Create a new budget
router.post('/', budgetController.createBudget);

// GET /api/v1/budgets/:id - Get a single budget by ID
router.get('/:id', budgetController.getBudgetById);

// PUT /api/v1/budgets/:id - Update an existing budget
router.put('/:id', budgetController.updateBudget);

// DELETE /api/v1/budgets/:id - Delete a budget
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;
