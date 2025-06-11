#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Starting Personal Finance Tracker Application..."

# Set the port for the application. The frontend will be served through the backend on this port.
export PORT=9000

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
npm install

echo "Running database migrations (if any, handled by application)..."
# Database initialization and migration (e.g., creating tables for SQLite)
# will be handled by the application logic on startup (e.g., in database.js or app.js).

echo "Starting backend server on port $PORT..."
# The backend server will listen on $PORT and will eventually serve the frontend static files.
npm start

# --- Placeholder for Future Frontend Steps ---
# The following steps will be integrated when the frontend is developed:
#
# echo "Navigating to frontend directory..."
# cd ../frontend
#
# echo "Installing frontend dependencies..."
# npm install
#
# echo "Building frontend application..."
# npm run build # Or similar command based on Vite/React setup
#
# echo "Frontend built. Backend server is configured to serve frontend files."
# --- End of Placeholder ---

echo "Application setup complete. Backend is running."
echo "If frontend were integrated, you would access it at http://localhost:$PORT"

# Keep the script running if the server is started in the background
# If npm start runs in foreground, this script will terminate when server stops.
# To keep it running (e.g. in a container), the server process needs to stay in foreground.