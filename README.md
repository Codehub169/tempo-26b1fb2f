# Personal Finance Tracker Dashboard

## Goal
The primary objective of this application is to empower users by providing a clear, intuitive, and efficient way to track their daily income and expenses. It aims to transform financial uncertainty into confidence and clarity through simple transaction tracking, insightful reporting, and budget management.

## Features
- Add, Edit, and Delete Transactions (Income & Expense)
- View Financial Reports (Spending by category, Income vs. Expense)
- Set and Track Budgets
- User Account Management and Settings

## Tech Stack
- **Frontend:** React 18+ with Vite
- **Styling:** Tailwind CSS
- **UI Components:** Chakra UI
- **Backend:** Node.js with Express
- **Database:** SQLite

## Project Structure
```
.
├── backend/
│   ├── src/
│   │   ├── api/          # API versions (v1, v2, etc.)
│   │   ├── config/       # Database, environment config
│   │   ├── middleware/   # Custom middleware
│   │   ├── routes/       # Main API route aggregation
│   │   ├── app.js        # Express app configuration
│   │   └── server.js     # Server initialization
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/   # Reusable UI components
│   │   ├── features/     # Feature-specific modules (dashboard, transactions, etc.)
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/     # API service calls
│   │   ├── contexts/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
├── startup.sh          # Master script to run the application
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (comes with Node.js)

### Setup and Run
1.  **Clone the repository (if applicable)**
    ```bash
    git clone <repository_url>
    cd <project_directory>
    ```

2.  **Make the startup script executable:**
    ```bash
    chmod +x startup.sh
    ```

3.  **Run the application:**
    ```bash
    ./startup.sh
    ```
    This script will:
    - Set the necessary environment variables (e.g., `PORT=9000`).
    - Navigate to the `backend` directory.
    - Install backend dependencies (`npm install`).
    - Start the backend server.
    - (Future) Install frontend dependencies and build the frontend.
    - (Future) The backend server will serve the frontend application.

    The application will be accessible at `http://localhost:9000` once all components are integrated.

## Development

### Backend
- Navigate to `backend/`.
- To run in development mode (with Nodemon for auto-restarts):
  ```bash
  npm run dev
  ```

### Frontend
- (Details to be added once frontend structure is in place)
- Typically, navigate to `frontend/` and run `npm run dev` for Vite's development server.

## API Endpoints
(Details to be added as API is developed)
- `/api/v1/transactions`
- `/api/v1/budgets`
- `/api/v1/reports`

