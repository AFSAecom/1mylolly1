// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css' // garde-le même s'il n'existe pas, sinon supprime cette ligne

// ✅ Appel unique : vérifie la session au démarrage et purge si elle est invalide
import { ensureValidSession } from './lib/supabaseClient'
ensureValidSession().catch(() => {})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
