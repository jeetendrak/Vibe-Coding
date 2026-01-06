
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Shim process for browser environments to prevent crashes when accessing process.env.API_KEY
// Use (window as any) to bypass TypeScript error about the 'process' property not being on the window object
if (typeof window !== 'undefined' && !(window as any).process) {
  (window as any).process = { env: {} };
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
