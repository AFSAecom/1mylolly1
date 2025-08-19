// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Vite: on lit via import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl) throw new Error('Missing VITE_SUPABASE_URL')
if (!supabaseAnon) throw new Error('Missing VITE_SUPABASE_ANON_KEY')

// Singleton + options d’auth robustes
export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    persistSession: true,         // garde la session valide
    autoRefreshToken: true,       // refresh auto
    detectSessionInUrl: true,     // utile si un provider redirige
    flowType: 'pkce',             // plus sûr pour le web
    // storage: localStorage,      // (par défaut) on peut expliciter si besoin
  }
})

// Optionnel mais utile: si Supabase signale un token invalide, on nettoie proprement
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    try {
      localStorage.removeItem('sb-' + supabaseUrl.split('https://')[1].split('.')[0] + '-auth-token')
    } catch {}
  }
})
