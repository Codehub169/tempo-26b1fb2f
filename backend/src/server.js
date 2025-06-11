// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
// const app = require('./app'); // This will be uncommented and used when app.js is created in a later batch.

// The PORT environment variable will be set by startup.sh to 9000.
// Fallback to 3001 if not set, though startup.sh ensures it is.
const PORT = process.env.PORT || 3001;

// --- Temporary Express App Setup ---
// This basic Express app setup is temporary until 'app.js' is introduced in a subsequent batch.
// 'app.js' will contain the main Express application logic, middleware, and route configurations.
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Basic health check endpoint for the API
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP',
    message: 'Backend is running smoothly.',
    timestamp: new Date().toISOString()
  });
});

// Placeholder for API v1 routes - to be expanded in app.js
app.get('/api/v1', (req, res) => {
  res.status(200).json({ message: 'Welcome to FinTrack API v1 - Temporary Server' });
});

// Catch-all for undefined routes - temporary, will be handled more robustly in app.js
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `The requested URL ${req.originalUrl} was not found on this server. (Temporary Handler)`
  });
});

// Global error handler - temporary, will be replaced by dedicated middleware in app.js
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack || err.message || err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred. (Temporary Handler)'
  });
});
// --- End of Temporary Express App Setup ---

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Primary application access (once frontend is integrated): http://localhost:${PORT}`);
  console.log(`Backend health check: http://localhost:${PORT}/api/health`);
});
