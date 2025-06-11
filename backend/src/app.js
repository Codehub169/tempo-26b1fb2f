const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');

const app = express();

// Middleware
// Enable CORS for all routes and origins
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Mount API routes
// All API version 1 routes will be prefixed with /api/v1
app.use('/api', apiRoutes);

// Simple health check endpoint (can be expanded)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'API is healthy' });
});

// Catch-all for 404 Not Found errors
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found on this server.' });
});

// Basic error handler middleware
// This can be expanded into a more sophisticated error handler in middleware/errorHandler.js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected error occurred.',
    // Optionally include stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
