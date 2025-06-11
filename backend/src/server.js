// Load environment variables from .env file
require('dotenv').config();

const app = require('./app'); 
const db = require('./config/database'); // Import the db instance

// The PORT environment variable will be set by startup.sh to 9000.
// Fallback to 3001 if not set, though startup.sh ensures it is.
const PORT = process.env.PORT || 3001;

// Start the server and keep a reference to it
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Primary application access (once frontend is integrated): http://localhost:${PORT}`);
  console.log(`Backend health check: http://localhost:${PORT}/api/health`);
});

let shuttingDown = false; // Flag to prevent multiple shutdown attempts

// Graceful shutdown logic
const gracefulShutdown = (signal) => {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`${signal} received. Shutting down gracefully...`);
  
  const shutdownTimeout = setTimeout(() => {
    console.error('Graceful shutdown timeout: Could not close connections in time, forcefully shutting down.');
    process.exit(1); // Non-zero for forced exit
  }, 10000); // 10 seconds timeout

  server.close((err) => {
    if (err) {
      console.error('Error during HTTP server close:', err.message);
    } else {
      console.log('HTTP server closed.');
    }
    
    db.close((dbErr) => {
      if (dbErr) {
        console.error('Error closing SQLite database:', dbErr.message);
      } else {
        console.log('SQLite database connection closed.');
      }
      clearTimeout(shutdownTimeout);
      console.log(`Exiting process with code 0 due to ${signal}.`);
      process.exit(0);
    });
  });
};

// Critical error handler
const criticalErrorHandler = (errorType, error, promiseOrOrigin) => {
  if (shuttingDown) return; // Avoid re-entry if already shutting down
  shuttingDown = true;

  console.error(`CRITICAL ERROR: ${errorType} detected!`);
  if (promiseOrOrigin && errorType === 'Unhandled Rejection') {
    console.error('Promise:', promiseOrOrigin);
  }
  if (promiseOrOrigin && errorType === 'Uncaught Exception') {
    console.error('Origin:', promiseOrOrigin);
  }
  console.error('Error details:', error.stack || error);
  console.error('Application will now attempt to shut down and exit.');

  const forceExitTimeout = setTimeout(() => {
    console.error('Critical error shutdown timeout: Forcefully shutting down.');
    process.exit(1); // Exit with error code
  }, 5000); // 5 seconds for cleanup attempts

  try {
    server.close((serverCloseErr) => {
      if (serverCloseErr) {
        console.error('Error closing HTTP server during critical error shutdown:', serverCloseErr.message);
      } else {
        console.log('HTTP server closed during critical error shutdown.');
      }
      
      db.close((dbErr) => {
        if (dbErr) {
          console.error('Error closing SQLite database during critical error shutdown:', dbErr.message);
        } else {
          console.log('SQLite database connection closed during critical error shutdown.');
        }
        clearTimeout(forceExitTimeout);
        process.exit(1); // Exit with error code after attempting cleanup
      });
    });
  } catch (e) {
    console.error('Synchronous error during server.close() in critical error handler:', e.message);
    // Attempt to close DB even if server.close threw synchronously
    try {
        db.close((dbErr) => {
            if (dbErr) console.error('Error closing DB (after server.close error in critical handler):', dbErr.message);
            else console.log('DB closed (after server.close error in critical handler).');
            clearTimeout(forceExitTimeout);
            process.exit(1);
        });
    } catch (dbCloseError) {
        console.error('Synchronous error during db.close() in critical error handler:', dbCloseError.message);
        clearTimeout(forceExitTimeout);
        process.exit(1);
    }
  }
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT')); // For Ctrl+C

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  criticalErrorHandler('Unhandled Rejection', reason, promise);
});

// Handle uncaught exceptions
// Note: 'uncaughtException' is a crude mechanism. A domain or better error boundaries are preferred in complex apps.
process.on('uncaughtException', (error, origin) => {
  criticalErrorHandler('Uncaught Exception', error, origin);
});
