import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from '@/contexts/AuthContext';

// 🔁 Redirection automatique : si l'URL est "/" (racine),
// on envoie l'utilisateur vers "/client" (là où est ton app).
if (typeof window !== 'undefined') {
  const path = window.location.pathname.replace(/\/+$/, ''); // enlève un "/" final
  if (path === '' || path === '/') {
    window.location.replace('/client');
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
