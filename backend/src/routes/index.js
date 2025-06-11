const express = require('express');
const transactionRoutes = require('../api/v1/transactions/transaction.routes');
// const budgetRoutes = require('../api/v1/budgets/budget.routes'); // Placeholder
// const reportRoutes = require('../api/v1/reports/report.routes'); // Placeholder

const router = express.Router();

// Version 1 API routes
const v1Router = express.Router();

// Mount transaction routes under /v1/transactions
v1Router.use('/transactions', transactionRoutes);

// Placeholder for mounting budget routes
// v1Router.use('/budgets', budgetRoutes);

// Placeholder for mounting report routes
// v1Router.use('/reports', reportRoutes);

// Mount v1Router under the /v1 path
router.use('/v1', v1Router);

module.exports = router;
