// Load environment variables from .env file
require("dotenv").config();

const app = require("./app"); 
// The database module, as per code_context, initializes synchronously upon require
// and exports the sqlite3.Database instance directly. It also handles its own
// critical exit on connection failure.
const database = require("./config/database"); // This is the sqlite3.Database instance

const PORT = process.env.PORT || 3001;
let server; // http.Server instance, will be defined once listening

async function startServer() {
  console.log("[SERVER_STARTUP] Attempting to start server...");
  try {
    // According to the provided context for 'backend/src/config/database.js',
    // the database initializes (connects and creates tables) synchronously when the module is required.
    // It also logs its own success or calls process.exit(1) on failure.
    // Therefore, an explicit 'database.initialize()' call is not needed here and would fail,
    // as the exported 'database' object is the sqlite3.Database instance itself.
    console.log("[SERVER_STARTUP] Database module was loaded and initialized at require-time.");

    console.log("[SERVER_STARTUP] Preparing to start HTTP server on port:", PORT);
    server = app.listen(PORT, () => {
      console.log(`[SERVER_STARTUP] Server is successfully listening on port ${PORT}`);
      console.log(`Server is running on port ${PORT}`);
      console.log(`Primary application access (once frontend is integrated): http://localhost:${PORT}`);
      console.log(`Backend health check: http://localhost:${PORT}/api/health`);
    });
    console.log("[SERVER_STARTUP] app.listen called. Server object defined:", !!server);

    // Handle server-specific events after it's created
    server.on("listening", () => {
        console.log("[SERVER_STARTUP] HTTP server emitted 'listening' event.");
    });

    server.on("error", (error) => {
      console.error("[SERVER_ERROR] HTTP Server emitted 'error' event:", error.message, error.stack);
      // E.g., EADDRINUSE error
      criticalErrorHandler("HTTPServerError", error);
    });

  } catch (error) {
    // This catch block would handle synchronous errors from app.listen(), if any.
    console.error("[SERVER_CRITICAL] Critical error during server startup sequence:", error.message, error.stack);
    if (database && typeof database.close === "function") {
        console.log("[SERVER_CRITICAL] Attempting to close database connection due to startup failure...");
        database.close((dbErr) => {
            if (dbErr) {
              console.error("[SERVER_CRITICAL] Error closing database during startup failure:", dbErr.message);
            } else {
              console.log("[SERVER_CRITICAL] Database connection closed during startup failure.");
            }
            process.exit(1);
        });
    } else {
        console.error("[SERVER_CRITICAL] Database module or close function not available or not the expected instance. Exiting without DB close attempt.");
        process.exit(1);
    }
  }
}

let shuttingDown = false; // Flag to prevent multiple shutdown attempts

// Graceful shutdown logic
const gracefulShutdown = (signal) => {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`${signal} received. Shutting down gracefully...`);
  
  const shutdownTimeout = setTimeout(() => {
    console.error("Graceful shutdown timeout: Could not close connections in time, forcefully shutting down.");
    process.exit(1); // Non-zero for forced exit
  }, 10000); // 10 seconds timeout

  const closeDbAndExit = (exitCode) => {
    if (database && typeof database.close === "function") {
      database.close((dbErr) => {
        if (dbErr) {
          console.error("Error closing SQLite database:", dbErr.message);
        } else {
          console.log("SQLite database connection closed.");
        }
        clearTimeout(shutdownTimeout);
        console.log(`Exiting process with code ${exitCode} due to ${signal}.`);
        process.exit(exitCode);
      });
    } else {
        console.error("Database module or close function not available during graceful shutdown. Exiting without DB close attempt.");
        clearTimeout(shutdownTimeout);
        process.exit(exitCode); // Still exit, but log the issue with DB close.
    }
  };

  if (server && server.listening) { // Check if server exists and is listening
    server.close((err) => {
      if (err) {
        console.error("Error during HTTP server close:", err.message);
      }
      console.log("HTTP server closed.");
      closeDbAndExit(0);
    });
  } else {
    console.log("HTTP server was not running or not fully started. Closing database directly.");
    closeDbAndExit(0); // Assuming 0 for graceful exit even if server wasn't fully up
  }
};

// Critical error handler
const criticalErrorHandler = (errorType, error, promiseOrOrigin) => {
  if (shuttingDown) return;
  shuttingDown = true;

  console.error(`CRITICAL ERROR: ${errorType} detected!`);
  if (promiseOrOrigin && errorType === "Unhandled Rejection") {
    console.error("Promise causing rejection:", promiseOrOrigin);
  }
  if (promiseOrOrigin && errorType === "Uncaught Exception") {
    console.error("Origin of exception:", promiseOrOrigin);
  }
  console.error("Error details:", error ? (error.stack || error) : "No error object available");
  console.error("Application will now attempt to shut down and exit.");

  const forceExitTimeout = setTimeout(() => {
    console.error("Critical error shutdown: Timeout reached. Forcefully shutting down.");
    process.exit(1); 
  }, 5000); // 5 seconds for cleanup attempts

  const attemptDbCloseAndFinalExit = () => {
    if (database && typeof database.close === "function") {
      database.close((dbErr) => {
        if (dbErr) {
          console.error("Error closing SQLite database during critical error shutdown:", dbErr.message);
        } else {
          console.log("SQLite database connection closed during critical error shutdown.");
        }
        clearTimeout(forceExitTimeout);
        process.exit(1);
      });
    } else {
        console.error("Database module or close function not available during critical error shutdown. Exiting without DB close attempt.");
        clearTimeout(forceExitTimeout);
        process.exit(1);
    }
  };

  if (server && server.listening) { // Check if server exists and is listening
    try {
      server.close((serverCloseErr) => {
        if (serverCloseErr) {
          console.error("Error closing HTTP server during critical error shutdown:", serverCloseErr.message);
        } else {
          console.log("HTTP server closed during critical error shutdown.");
        }
        attemptDbCloseAndFinalExit();
      });
    } catch (e) {
      console.error("Synchronous error during server.close() call in critical error handler:", e.message);
      attemptDbCloseAndFinalExit(); // Proceed to DB close even if server.close() call fails
    }
  } else {
    console.log("HTTP server was not running or not initialized during critical error. Closing database directly.");
    attemptDbCloseAndFinalExit();
  }
};

// Listen for termination signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT")); // For Ctrl+C

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  criticalErrorHandler("Unhandled Rejection", reason, promise);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error, origin) => {
  criticalErrorHandler("Uncaught Exception", error, origin);
});

// Start the server initialization process
startServer();
