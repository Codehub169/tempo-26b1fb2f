const db = require('../../../config/database');

// Service to get all transactions
function getAllTransactions() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM transactions ORDER BY date DESC, createdAt DESC', [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Service to get a single transaction by ID
function getTransactionById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM transactions WHERE id = ?', [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Service to create a new transaction
function createTransaction({ type, amount, category, date, description }) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO transactions (type, amount, category, date, description) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [type, amount, category, date, description], function (err) {
      if (err) {
        reject(err);
      } else {
        // Return the newly created transaction by fetching it
        getTransactionById(this.lastID)
          .then(resolve)
          .catch(reject);
      }
    });
  });
}

// Service to update an existing transaction
function updateTransaction(id, { type, amount, category, date, description }) {
  return new Promise((resolve, reject) => {
    // Construct the SET part of the SQL query dynamically
    // to only update fields that are provided.
    const fields = [];
    const params = [];

    if (type !== undefined) {
      fields.push('type = ?');
      params.push(type);
    }
    if (amount !== undefined) {
      fields.push('amount = ?');
      params.push(amount);
    }
    if (category !== undefined) {
      fields.push('category = ?');
      params.push(category);
    }
    if (date !== undefined) {
      fields.push('date = ?');
      params.push(date);
    }
    if (description !== undefined) {
      fields.push('description = ?');
      params.push(description);
    }

    if (fields.length === 0) {
      // No fields to update, maybe return current data or an error/message
      return getTransactionById(id).then(resolve).catch(reject); 
    }

    fields.push('updatedAt = CURRENT_TIMESTAMP');
    params.push(id);

    const sql = `UPDATE transactions SET ${fields.join(', ')} WHERE id = ?`;

    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        if (this.changes === 0) {
          resolve(null); // Indicate no row was updated (e.g., transaction not found)
        } else {
          getTransactionById(id)
            .then(resolve)
            .catch(reject);
        }
      }
    });
  });
}

// Service to delete a transaction
function deleteTransaction(id) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM transactions WHERE id = ?';
    db.run(sql, [id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes }); // Return number of rows affected
      }
    });
  });
}

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
