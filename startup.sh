#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Starting Personal Finance Tracker Application..."

# Set the port for the application. The frontend will be served through the backend on this port.
export PORT=${PORT:-9000}

# Navigate to the backend directory
if [ ! -d "backend" ]; then
  echo "Error: backend directory not found. Please ensure the project structure is correct."
  exit 1
fi
cd backend

echo "Installing backend dependencies..."
if [ ! -f "package.json" ]; then
    echo "Error: backend/package.json not found."
    exit 1
fi

# Use npm ci for faster, more reliable builds if package-lock.json exists, otherwise npm install
if [ -f "package-lock.json" ]; then
  echo "Using npm ci for installation."
  npm ci
else
  echo "Using npm install for installation."
  npm install
fi

echo "Running database migrations (if any, handled by application)..."
# Database initialization and migration (e.g., creating tables for SQLite)
# will be handled by the application logic on startup (e.g., in database.js or app.js).

echo "Starting backend server on port $PORT..."
# The backend server will listen on $PORT and will eventually serve the frontend static files.
# Using exec to make the Node.js process the main process for the container.
# This ensures signals are passed correctly and it's the only process the container manager watches.
exec node src/server.js

# The lines below will not be reached if 'exec node src/server.js' is used,
# as exec replaces the current shell process.
# This is intended, as the Node server's logs will indicate its status.

# --- Placeholder for Future Frontend Steps ---
# The following steps will be integrated when the frontend is developed:
#
# echo "Navigating to frontend directory..."
# cd ../frontend # Assuming startup.sh is run from project root
#
# echo "Installing frontend dependencies..."
# if [ -f "package-lock.json" ]; then npm ci; else npm install; fi
#
# echo "Building frontend application..."
# npm run build # Or similar command based on Vite/React setup
#
# echo "Frontend built. Backend server is configured to serve frontend files."
# --- End of Placeholder ---

# echo "Application setup complete. Backend is running."
# echo "If frontend were integrated, you would access it at http://localhost:$PORT"
