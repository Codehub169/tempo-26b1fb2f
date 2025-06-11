/**
 * errorHandler.js
 * 
 * Global error handling middleware for the Express application.
 * This middleware catches errors passed by `next(error)` in controllers or other middleware
 * and sends a standardized JSON error response to the client.
 */

const errorHandler = (err, req, res, next) => {
  // Log the error for debugging purposes (in a real app, use a proper logger)
  console.error(err.stack);

  // Default to 500 Internal Server Error if status is not set
  const statusCode = err.statusCode || res.statusCode || 500;
  const message = err.message || 'An unexpected error occurred on the server.';

  // Send a JSON response with the error details
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    // Optionally, include stack trace in development mode
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
