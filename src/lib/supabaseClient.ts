// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Vite : variables côté navigateur
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl) throw new Error('Missing VITE_SUPABASE_URL')
if (!supabaseAnon) throw new Error('Missing VITE_SUPABASE_ANON_KEY')

// --- utilitaire : purge locale de tous les tokens supabase stockés ---
const clearSbAuth = () => {
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith('sb-') && k.endsWith('-auth-token'))
      .forEach(k => localStorage.removeItem(k))
  } catch {}
}

// --- client supabase "robuste" ---
export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
})

// Si Supabase signale une déconnexion => on nettoie le token corrompu
supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_OUT') clearSbAuth()
})

// A appeler au démarrage de l’app : vérifie que la session stockée est valide.
// Si invalide => on signe out + purge locale (pas besoin d’ouvrir F12).
export async function ensureValidSession() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null

  const { error } = await supabase.auth.getUser()
  if (error) {
    await supabase.auth.signOut()
    clearSbAuth()
    return null
  }
  return session
}

// Optionnel : export pour réutiliser la purge si besoin ponctuel
export function purgeLocalSupabaseTokens() {
  clearSbAuth()
}
