// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string
if (!supabaseUrl) throw new Error('Missing VITE_SUPABASE_URL')
if (!supabaseAnon) throw new Error('Missing VITE_SUPABASE_ANON_KEY')

// utilitaires
const clearSbAuth = () => {
  try {
    // supprime toute entrée de type sb-*-auth-token pour repartir propre
    Object.keys(localStorage)
      .filter(k => k.startsWith('sb-') && k.endsWith('-auth-token'))
      .forEach(k => localStorage.removeItem(k))
  } catch {}
}

export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    // storage: localStorage, // (défaut) explicitable si besoin
    // storageKey: 'lolly-auth', // optionnel : clé fixe si tu veux
  },
})

// “pare-feu” : si Supabase signale une déconnexion, on nettoie le token corrompu
supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_OUT') clearSbAuth()
})

// À appeler au bootstrap de l’app : on vérifie que la session stockée est réellement valide.
// Si invalide → on nettoie et on laisse l’écran de login.
export async function ensureValidSession() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  const { error: userErr } = await supabase.auth.getUser()
  if (userErr) {
    await supabase.auth.signOut()  // invalide proprement côté serveur
    clearSbAuth()                  // évite le besoin de “Clear site data”
    return null
  }
  return session
}
