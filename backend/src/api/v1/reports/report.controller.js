const reportService = require('./report.service');

/**
 * Report Controller
 * Handles HTTP requests for generating financial reports.
 */
const reportController = {
  /**
   * Generates a report of spending by category within a date range.
   * @param {import('express').Request} req - Express request object. Query params: startDate, endDate.
   * @param {import('express').Response} res - Express response object.
   * @param {import('express').NextFunction} next - Express next middleware function.
   */
  generateSpendingByCategoryReport: async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'startDate and endDate query parameters are required.' });
      }
      // Basic date validation (can be more robust)
      if (isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
        return res.status(400).json({ message: 'Invalid date format for startDate or endDate.' });
      }

      const report = await reportService.getSpendingByCategory({ startDate, endDate });
      res.json(report);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Generates a report comparing total income and expenses within a date range.
   * @param {import('express').Request} req - Express request object. Query params: startDate, endDate.
   * @param {import('express').Response} res - Express response object.
   * @param {import('express').NextFunction} next - Express next middleware function.
   */
  generateIncomeVsExpenseReport: async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'startDate and endDate query parameters are required.' });
      }
      if (isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
        return res.status(400).json({ message: 'Invalid date format for startDate or endDate.' });
      }

      const report = await reportService.getIncomeVsExpense({ startDate, endDate });
      res.json(report);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Generates a summary of budget performance.
   * @param {import('express').Request} req - Express request object. Query params: startDate, endDate, period (optional).
   * @param {import('express').Response} res - Express response object.
   * @param {import('express').NextFunction} next - Express next middleware function.
   */
  generateBudgetSummaryReport: async (req, res, next) => {
    try {
      const { startDate, endDate, period } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'startDate and endDate query parameters are required.' });
      }
      if (isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
        return res.status(400).json({ message: 'Invalid date format for startDate or endDate.' });
      }
      // Period is optional, default handling can be in service or here
      const report = await reportService.getBudgetSummary({ startDate, endDate, period: period || 'monthly' });
      res.json(report);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = reportController;
