
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Critical Error: Could not find root element to mount to");
  } else {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
} catch (error) {
  console.error("Application failed to start:", error);
  // Display a fallback message if everything fails
  const body = document.querySelector('body');
  if (body) {
    body.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif; text-align: center;">
        <h2>Oops! Something went wrong.</h2>
        <p>The application could not be loaded. Please check the console for details.</p>
      </div>
    `;
  }
}