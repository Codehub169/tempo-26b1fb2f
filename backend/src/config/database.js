const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path for the SQLite database file
// It will be created in the 'backend' directory if it doesn't exist.
const DB_PATH = path.resolve(__dirname, '..', '..', 'finance_tracker.db');

// Create a new database instance
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Initialize database schema (create tables if they don't exist)
    initializeDb();
  }
});

// Function to initialize database schema
function initializeDb() {
  db.serialize(() => {
    // Transactions Table
    // Stores individual income and expense records
    db.run(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,    -- Unique identifier for the transaction
        type TEXT NOT NULL CHECK(type IN ('income', 'expense')), -- Type of transaction: 'income' or 'expense'
        amount REAL NOT NULL,                    -- Monetary value of the transaction
        category TEXT NOT NULL,                  -- Category of the transaction (e.g., Food, Salary)
        date TEXT NOT NULL,                      -- Date of the transaction (YYYY-MM-DD)
        description TEXT,                        -- Optional description or notes
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, -- Timestamp of creation
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP  -- Timestamp of last update
      )
    `, (err) => {
      if (err) {
        console.error('Error creating transactions table:', err.message);
      } else {
        console.log('Transactions table checked/created successfully.');
      }
    });

    // Budgets Table (Placeholder for future implementation)
    // Stores budget limits for categories over periods
    db.run(`
      CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL UNIQUE,           -- Category for the budget (e.g., Groceries)
        amount REAL NOT NULL,                    -- Budgeted amount
        period TEXT NOT NULL CHECK(period IN ('monthly', 'weekly', 'yearly')), -- Budget period
        startDate TEXT,                          -- Optional start date for the budget period
        endDate TEXT,                            -- Optional end date for the budget period
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating budgets table:', err.message);
      } else {
        console.log('Budgets table checked/created successfully.');
      }
    });

    // Add more table creations here as needed (e.g., users, categories)
  });
}

// Export the database instance
module.exports = db;
