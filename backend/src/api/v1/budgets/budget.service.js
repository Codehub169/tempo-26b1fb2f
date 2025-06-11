const db = require('../../../config/database');

/**
 * Budget Service
 * Handles business logic for budget operations.
 */

// Assumed budgets table schema:
// CREATE TABLE IF NOT EXISTS budgets (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   category TEXT NOT NULL,
//   amount REAL NOT NULL,
//   period TEXT NOT NULL DEFAULT 'monthly', -- e.g., 'monthly', 'yearly', 'weekly'
//   createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//   updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//   UNIQUE (category, period)
// );

const budgetService = {
  /**
   * Creates a new budget.
   * @param {object} budgetData - Data for the new budget.
   * @param {string} budgetData.category - The category of the budget.
   * @param {number} budgetData.amount - The budget amount.
   * @param {string} budgetData.period - The budget period (e.g., 'monthly', 'yearly').
   * @returns {Promise<object>} The created budget object.
   */
  createBudget: ({ category, amount, period }) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO budgets (category, amount, period) VALUES (?, ?, ?)';
      db.run(sql, [category, amount, period], function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed: budgets.category, budgets.period')) {
            return reject(new Error('A budget for this category and period already exists.'));
          }
          return reject(err);
        }
        budgetService.getBudgetById(this.lastID)
          .then(resolve)
          .catch(reject);
      });
    });
  },

  /**
   * Retrieves all budgets.
   * @returns {Promise<Array<object>>} A list of all budgets.
   */
  getAllBudgets: () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM budgets ORDER BY category ASC';
      db.all(sql, [], (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  },

  /**
   * Retrieves a single budget by its ID.
   * @param {number} id - The ID of the budget.
   * @returns {Promise<object|undefined>} The budget object or undefined if not found.
   */
  getBudgetById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM budgets WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) {
          return reject(err);
        }
        resolve(row);
      });
    });
  },

  /**
   * Retrieves a budget by category and period.
   * @param {string} category - The category of the budget.
   * @param {string} period - The period of the budget.
   * @returns {Promise<object|undefined>} The budget object or undefined if not found.
   */
  getBudgetByCategoryAndPeriod: (category, period) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM budgets WHERE category = ? AND period = ?';
      db.get(sql, [category, period], (err, row) => {
        if (err) {
          return reject(err);
        }
        resolve(row);
      });
    });
  },

  /**
   * Updates an existing budget.
   * @param {number} id - The ID of the budget to update.
   * @param {object} budgetData - Data to update for the budget.
   * @param {string} [budgetData.category] - The new category.
   * @param {number} [budgetData.amount] - The new amount.
   * @param {string} [budgetData.period] - The new period.
   * @returns {Promise<object|null>} The updated budget object or null if not found.
   */
  updateBudget: (id, { category, amount, period }) => {
    return new Promise((resolve, reject) => {
      const fields = [];
      const params = [];

      if (category !== undefined) {
        fields.push('category = ?');
        params.push(category);
      }
      if (amount !== undefined) {
        fields.push('amount = ?');
        params.push(amount);
      }
      if (period !== undefined) {
        fields.push('period = ?');
        params.push(period);
      }

      if (fields.length === 0) {
        return budgetService.getBudgetById(id).then(resolve).catch(reject); // No fields to update
      }

      fields.push('updatedAt = CURRENT_TIMESTAMP');
      params.push(id);

      const sql = `UPDATE budgets SET ${fields.join(', ')} WHERE id = ?`;

      db.run(sql, params, function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed: budgets.category, budgets.period')) {
            return reject(new Error('A budget for the target category and period already exists.'));
          }
          return reject(err);
        }
        if (this.changes === 0) {
          return resolve(null); // Budget not found or no changes made
        }
        budgetService.getBudgetById(id)
          .then(resolve)
          .catch(reject);
      });
    });
  },

  /**
   * Deletes a budget by its ID.
   * @param {number} id - The ID of the budget to delete.
   * @returns {Promise<{ changes: number }>} Object indicating the number of rows affected.
   */
  deleteBudget: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM budgets WHERE id = ?';
      db.run(sql, [id], function (err) {
        if (err) {
          return reject(err);
        }
        resolve({ changes: this.changes });
      });
    });
  }
};

module.exports = budgetService;
