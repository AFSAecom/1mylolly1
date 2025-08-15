import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from '@/contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// ✅ IMPORTANT : remet l'import du CSS global (Tailwind)
// Si chez toi le fichier s'appelle autrement (ex: "./styles/globals.css"),
// remplace la ligne ci-dessous par le bon chemin.
import './index.css';

// 🔁 Si on arrive à la racine "/", on redirige vers "/client"
if (typeof window !== 'undefined') {
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path === '' || path === '/') {
    window.location.replace('/client');
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
