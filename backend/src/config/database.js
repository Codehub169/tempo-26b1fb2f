const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path for the SQLite database file
// It will be created in the 'backend' directory (one level up from 'src/config') if it doesn't exist.
const DB_PATH = path.resolve(__dirname, '..', '..', 'finance_tracker.db');

// Function to initialize database schema
// It takes the db instance and a completion callback (err)
function initializeDbSchema(dbInstance, callback) {
  dbInstance.serialize(() => {
    let initializationError = null;

    // Transactions Table
    // Stores individual income and expense records
    dbInstance.run(`
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
        console.error('CRITICAL: Error creating transactions table:', err.message);
        if (!initializationError) initializationError = err; // Capture first error
      } else {
        console.log('Transactions table checked/created successfully.');
      }
    });

    // Budgets Table
    // Stores budget limits for categories over periods
    dbInstance.run(`
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
        console.error('CRITICAL: Error creating budgets table:', err.message);
        if (!initializationError) initializationError = err; // Capture first error
      } else {
        console.log('Budgets table checked/created successfully.');
      }
    });

    // Add a final operation to the queue. Its callback will run after all preceding operations.
    // This ensures that the main callback (signaling schema initialization completion) 
    // is invoked only after all table creation attempts have finished.
    dbInstance.run('SELECT 1', (err) => { // A dummy operation to ensure queue flushes for table creation checks
        if (err && !initializationError) {
            // This specific dummy SELECT 1 should not error, but if it did, capture it.
            initializationError = err; 
        }
        // This callback is the last in the serialize queue for schema initialization.
        // It signals completion of table creation attempts.
        callback(initializationError); 
    });
  });
}

// Create a new database instance. The instance is exported directly.
// Its readiness (connection and schema initialization) is handled asynchronously.
const db = new sqlite3.Database(DB_PATH, (connectErr) => {
  if (connectErr) {
    console.error('CRITICAL: Error opening database connection:', connectErr.message);
    console.error('Application cannot start without a database connection. Exiting.');
    process.exit(1); // Exit if DB connection fails
  } else {
    console.log('Successfully connected to the SQLite database at', DB_PATH);
    
    // Now initialize the schema
    initializeDbSchema(db, (initErr) => {
      if (initErr) {
        console.error('CRITICAL: Database schema initialization failed:', initErr.message);
        console.error('Application cannot continue. Attempting to close database and exiting.');
        db.close((closeErr) => {
          if (closeErr) console.error('Error closing database during shutdown:', closeErr.message);
          process.exit(1);
        });
      } else {
        console.log('Database schema checked/initialized successfully.');
        // The 'db' instance is now fully ready (connected and schema initialized).
        // Services requiring 'db' can now safely use it.
      }
    });
  }
});

// Export the database instance. Callers should be aware that DB operations
// might fail if used before the async initialization (connection + schema) completes.
// However, critical errors during this setup now lead to process.exit(1), preventing
// the application from running in an inconsistent state.
module.exports = db;
