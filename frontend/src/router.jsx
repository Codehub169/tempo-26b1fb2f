import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// Placeholder for MainLayout - will be created in a future batch
const MainLayout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    {/* Sidebar placeholder - will be part of MainLayout later */}
    <div style={{ width: '260px', backgroundColor: 'var(--color-neutral-900)', color: 'white', padding: '1rem' }}>
      <h1 style={{ fontFamily: 'var(--font-secondary)', fontSize: '1.25rem', color: 'white' }}>FinTrack (Layout)</h1>
      <nav>
        {/* Minimal navigation for placeholder layout */}
        <ul>
          <li><a href="/" style={{color: 'var(--color-neutral-300)'}}>Dashboard</a></li>
          <li><a href="/transactions" style={{color: 'var(--color-neutral-300)'}}>Transactions</a></li>
          <li><a href="/reports" style={{color: 'var(--color-neutral-300)'}}>Reports</a></li>
          <li><a href="/budgets" style={{color: 'var(--color-neutral-300)'}}>Budgets</a></li>
          <li><a href="/settings" style={{color: 'var(--color-neutral-300)'}}>Settings</a></li>
        </ul>
      </nav>
    </div>
    <main style={{ flexGrow: 1, padding: '2rem', backgroundColor: 'var(--color-neutral-100)' }}>
      {children || <Outlet />}
    </main>
  </div>
);

// Placeholder Page Components - will be replaced with actual pages
const DashboardPage = () => <div className="p-4"><h1 className="text-2xl font-semibold font-secondary">Dashboard Page</h1><p className="font-primary">Welcome to your financial dashboard.</p></div>;
const TransactionsPage = () => <div className="p-4"><h1 className="text-2xl font-semibold font-secondary">Transactions Page</h1><p className="font-primary">View and manage your transactions.</p></div>;
const ReportsPage = () => <div className="p-4"><h1 className="text-2xl font-semibold font-secondary">Reports Page</h1><p className="font-primary">Analyze your financial reports.</p></div>;
const BudgetsPage = () => <div className="p-4"><h1 className="text-2xl font-semibold font-secondary">Budgets Page</h1><p className="font-primary">Set and track your budgets.</p></div>;
const SettingsPage = () => <div className="p-4"><h1 className="text-2xl font-semibold font-secondary">Settings Page</h1><p className="font-primary">Manage your application settings.</p></div>;
const NotFoundPage = () => <div className="p-4"><h1 className="text-2xl font-semibold font-secondary">404 - Page Not Found</h1><p className="font-primary">The page you are looking for does not exist.</p></div>;

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
