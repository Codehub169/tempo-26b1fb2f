const express = require('express');
const transactionController = require('./transaction.controller');

const router = express.Router();

// GET /api/v1/transactions - Get all transactions
router.get('/', transactionController.getAllTransactions);

// POST /api/v1/transactions - Create a new transaction
router.post('/', transactionController.createTransaction);

// GET /api/v1/transactions/:id - Get a single transaction by ID
router.get('/:id', transactionController.getTransactionById);

// PUT /api/v1/transactions/:id - Update an existing transaction
router.put('/:id', transactionController.updateTransaction);

// DELETE /api/v1/transactions/:id - Delete a transaction
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
