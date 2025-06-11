const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path for the SQLite database file
// It will be created in the 'backend' directory (one level up from 'src') if it doesn't exist.
const DB_PATH = path.resolve(__dirname, '..', '..', 'finance_tracker.db');

// Create a new database instance
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('CRITICAL: Error opening database:', err.message);
    console.error('Application cannot start without a database connection. Exiting.');
    process.exit(1); // Exit if DB connection fails
  } else {
    console.log('Connected to the SQLite database at', DB_PATH);
    // Initialize database schema (create tables if they don't exist)
    initializeDb();
  }
});

// Function to initialize database schema
function initializeDb() {
  db.serialize(() => {
    // Enable foreign key support if needed in the future
    // db.run('PRAGMA foreign_keys = ON;', (pragmaErr) => {
    //   if (pragmaErr) {
    //     console.error('Error enabling foreign keys:', pragmaErr.message);
    //   }
    // });

    // Transactions Table
    // Stores individual income and expense records
    db.run(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,    -- Unique identifier for the transaction
        type TEXT NOT NULL CHECK(type IN ('income', 'expense')), -- Type of transaction: 'income' or 'expense'
        amount REAL NOT NULL CHECK(amount > 0),    -- Monetary value of the transaction, should be positive
        category TEXT NOT NULL,                  -- Category of the transaction (e.g., Food, Salary)
        date TEXT NOT NULL,                      -- Date of the transaction (YYYY-MM-DD)
        description TEXT,                        -- Optional description or notes
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, -- Timestamp of creation
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP  -- Timestamp of last update (application logic should update this field on changes)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating transactions table:', err.message);
      } else {
        console.log('Transactions table checked/created successfully.');
      }
    });

    // Budgets Table
    // Stores budget limits for categories over periods
    db.run(`
      CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,           -- Category for the budget (e.g., Groceries)
        amount REAL NOT NULL CHECK(amount > 0),    -- Budgeted amount, should be positive
        period TEXT NOT NULL CHECK(period IN ('monthly', 'weekly', 'yearly', 'quarterly')), -- Budget period
        startDate TEXT,                          -- Optional start date for the budget period (YYYY-MM-DD)
        endDate TEXT,                            -- Optional end date for the budget period (YYYY-MM-DD)
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP, -- Timestamp of last update (application logic should update this field on changes)
        UNIQUE (category, period) -- Ensures a category can only have one budget per period
      )
    `, (err) => {
      if (err) {
        console.error('Error creating budgets table:', err.message);
      } else {
        console.log('Budgets table checked/created successfully.');
      }
    });

    // Add more table creations here as needed (e.g., users, categories_config)
    // Consider adding indexes for frequently queried columns like 'date' in transactions or 'category' in budgets
    // db.run('CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions (date);');
    // db.run('CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions (category);');
    // db.run('CREATE INDEX IF NOT EXISTS idx_budgets_category_period ON budgets (category, period);');
  });
}

// Export the database instance
module.exports = db;
