import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Import the main App component
import './index.css'; // Main CSS file for Tailwind directives and global styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> {/* Render App, which includes ChakraProvider and AppRouter */}
  </React.StrictMode>,
);
