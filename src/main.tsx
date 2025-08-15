import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from '@/contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// 🔁 Si on arrive à la racine "/", on redirige vers "/client"
if (typeof window !== 'undefined') {
  const path = window.location.pathname.replace(/\/+$/, ''); // supprime les "/" finaux
  if (path === '' || path === '/') {
    window.location.replace('/client');
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      {/* 👇 Router racine pour que toutes les routes (dont /client) fonctionnent */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
