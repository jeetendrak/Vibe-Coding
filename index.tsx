import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Shim process for browser environments to prevent crashes when accessing process.env.API_KEY
if (typeof window !== 'undefined') {
  if (!(window as any).process) {
    (window as any).process = { env: {} };
  } else if (!(window as any).process.env) {
    (window as any).process.env = {};
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Critical Error: Could not find root element with id 'root'");
}