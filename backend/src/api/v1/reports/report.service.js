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
          return reject(err);
        }
        const totalIncome = parseFloat((row.totalIncome || 0).toFixed(2));
        const totalExpenses = parseFloat((row.totalExpenses || 0).toFixed(2));
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
      // Step 1: Get all budgets for the specified period
      const budgetSql = 'SELECT category, amount FROM budgets WHERE period = ?';
      db.all(budgetSql, [period], (err, budgets) => {
        if (err) {
          return reject(err);
        }
        if (!budgets || budgets.length === 0) {
          return resolve([]); // No budgets found for this period
        }

        // Step 2: For each budget, get the total spent in that category within the date range
        const promises = budgets.map(budget => {
          return new Promise((resolveInner, rejectInner) => {
            const spendingSql = `
              SELECT SUM(amount) as totalSpent
              FROM transactions
              WHERE type = 'expense'
                AND category = ?
                AND date BETWEEN ? AND ?
            `;
            db.get(spendingSql, [budget.category, startDate, endDate], (errSpending, result) => {
              if (errSpending) {
                return rejectInner(errSpending);
              }
              const totalSpent = parseFloat((result.totalSpent || 0).toFixed(2));
              const budgetedAmount = parseFloat(budget.amount.toFixed(2));
              const remainingAmount = parseFloat((budgetedAmount - totalSpent).toFixed(2));
              let status = 'On Track';
              if (totalSpent > budgetedAmount) status = 'Over Budget';
              else if (totalSpent >= budgetedAmount * 0.9) status = 'Nearing Limit';

              resolveInner({
                category: budget.category,
                budgetedAmount,
                totalSpent,
                remainingAmount,
                status
              });
            });
          });
        });

        Promise.all(promises)
          .then(resolve)
          .catch(reject);
      });
    });
  }
};

module.exports = reportService;
