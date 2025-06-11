const db = require('../../../config/database');

/**
 * Report Service
 * Handles business logic for generating financial reports.
 */
const reportService = {
  /**
   * Calculates total spending grouped by category within a given date range.
   * @param {object} params - Parameters for the report.
   * @param {string} params.startDate - The start date (YYYY-MM-DD).
   * @param {string} params.endDate - The end date (YYYY-MM-DD).
   * @returns {Promise<Array<object>>} Array of objects { category: string, totalSpent: number }.
   */
  getSpendingByCategory: ({ startDate, endDate }) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT category, SUM(amount) as totalSpent
        FROM transactions
        WHERE type = 'expense'
          AND date BETWEEN ? AND ?
        GROUP BY category
        ORDER BY totalSpent DESC
      `;
      db.all(sql, [startDate, endDate], (err, rows) => {
        if (err) {
          console.error('Error in getSpendingByCategory DB call:', err.message);
          return reject(err);
        }
        resolve(rows.map(row => ({ ...row, totalSpent: parseFloat(row.totalSpent.toFixed(2)) })));
      });
    });
  },

  /**
   * Calculates total income and total expenses within a given date range.
   * @param {object} params - Parameters for the report.
   * @param {string} params.startDate - The start date (YYYY-MM-DD).
   * @param {string} params.endDate - The end date (YYYY-MM-DD).
   * @returns {Promise<object>} Object { totalIncome: number, totalExpenses: number, netBalance: number }.
   */
  getIncomeVsExpense: ({ startDate, endDate }) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as totalIncome,
          SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as totalExpenses
        FROM transactions
        WHERE date BETWEEN ? AND ?
      `;
      db.get(sql, [startDate, endDate], (err, row) => {
        if (err) {
          console.error('Error in getIncomeVsExpense DB call:', err.message);
          return reject(err);
        }
        // Ensure row is not null or undefined before accessing properties
        const totalIncome = parseFloat(((row && row.totalIncome) || 0).toFixed(2));
        const totalExpenses = parseFloat(((row && row.totalExpenses) || 0).toFixed(2));
        const netBalance = parseFloat((totalIncome - totalExpenses).toFixed(2));
        resolve({ totalIncome, totalExpenses, netBalance });
      });
    });
  },

  /**
   * Generates a summary of budget performance for a given period.
   * It compares actual spending against budgeted amounts for specified budget periods.
   * @param {object} params - Parameters for the report.
   * @param {string} params.startDate - The start date for transaction lookup (YYYY-MM-DD).
   * @param {string} params.endDate - The end date for transaction lookup (YYYY-MM-DD).
   * @param {string} params.period - The budget period to filter by (e.g., 'monthly', 'yearly').
   * @returns {Promise<Array<object>>} 
   *          Array of objects { category: string, budgetedAmount: number, totalSpent: number, remainingAmount: number, status: string }.
   */
  getBudgetSummary: ({ startDate, endDate, period }) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          b.category,
          b.amount as budgetedAmount,
          COALESCE(SUM(t.amount), 0) as totalSpent
        FROM budgets b
        LEFT JOIN transactions t 
          ON b.category = t.category 
          AND t.type = 'expense' 
          AND t.date BETWEEN ? AND ?
        WHERE b.period = ?
        GROUP BY b.category, b.amount, b.period
        ORDER BY b.category ASC
      `;
      db.all(sql, [startDate, endDate, period], (err, rows) => {
        if (err) {
          console.error('Error in getBudgetSummary DB call:', err.message);
          return reject(err);
        }
        if (!rows || rows.length === 0) {
          return resolve([]); // No budgets found for this period or no matching transactions
        }

        const summary = rows.map(row => {
          const budgetedAmount = parseFloat(row.budgetedAmount.toFixed(2));
          const totalSpent = parseFloat(row.totalSpent.toFixed(2));
          const remainingAmount = parseFloat((budgetedAmount - totalSpent).toFixed(2));
          let status = 'On Track';
          if (totalSpent > budgetedAmount) status = 'Over Budget';
          else if (budgetedAmount > 0 && totalSpent >= budgetedAmount * 0.9) status = 'Nearing Limit'; // Check budgetedAmount > 0 to avoid 0 * 0.9

          return {
            category: row.category,
            budgetedAmount,
            totalSpent,
            remainingAmount,
            status
          };
        });
        resolve(summary);
      });
    });
  }
};

module.exports = reportService;
