const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler'); // Import the dedicated error handler

const app = express();

// Middleware
// Enable CORS for all routes and origins
// Consider more restrictive CORS policies for production
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

// Catch-all for 404 Not Found errors - for API routes
// This should be placed after all API routes but before the global error handler.
app.use('/api/*', (req, res, next) => {
  const err = new Error('API resource not found on this server.');
  err.statusCode = 404;
  next(err);
});

// If serving frontend static files, that middleware would go here.
// For now, any non-API route that isn't caught will also be a 404 by default Express behavior or fall to below.

// Catch-all for other 404s (e.g. non-API routes if frontend is not served by this Express app directly)
app.use((req, res, next) => {
  // This check ensures we don't send HTML for API calls expecting JSON
  if (!req.path.startsWith('/api')) {
    // In a real SPA setup, this might serve index.html for client-side routing
    // For now, just a generic 404 for non-API routes.
    return res.status(404).send('Resource not found.');
  }
  // If it's an API path that somehow missed the /api/* 404 handler, let it pass to the default Express 404 or error handler.
  next(); 
});

// Use the dedicated error handler middleware
// This must be the last piece of middleware added to the app stack.
app.use(errorHandler);

module.exports = app;
