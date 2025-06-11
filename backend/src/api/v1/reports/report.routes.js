const express = require('express');
const reportController = require('./report.controller');

const router = express.Router();

/**
 * API routes for reports.
 * Base path: /api/v1/reports
 */

// GET /api/v1/reports/spending-by-category?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get('/spending-by-category', reportController.generateSpendingByCategoryReport);

// GET /api/v1/reports/income-vs-expense?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get('/income-vs-expense', reportController.generateIncomeVsExpenseReport);

// GET /api/v1/reports/budget-summary?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&period=monthly
router.get('/budget-summary', reportController.generateBudgetSummaryReport);

module.exports = router;
