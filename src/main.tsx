import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// ⚠️ Très important: import du CSS global (Tailwind, etc.)
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);

const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

if (import.meta.env.PROD) {
  root.render(
    <React.StrictMode>
      {app}
    </React.StrictMode>
  );
} else {
  root.render(app);
}
