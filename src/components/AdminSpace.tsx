// src/components/AdminSpace.tsx
import React, { useEffect, useState } from 'react'
import { supabase, purgeLocalSupabaseTokens } from '@/lib/supabaseClient'
import AdminSpaceView from './AdminSpaceView'

export default function AdminSpace() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        // Vérifie l’utilisateur courant ; si absent, nettoie proprement
        const { data, error } = await supabase.auth.getUser()
        if (error || !data?.user) {
          try { await supabase.auth.signOut() } catch {}
          try { purgeLocalSupabaseTokens() } catch {}
        }
      } catch (e) {
        // Ne bloque jamais l’UI si erreur
        console.error('Auth guard failed:', e)
      } finally {
        if (!cancelled) setReady(true) // ✅ garantit de sortir du “Chargement…”
      }
    })()

    return () => { cancelled = true }
  }, [])

  if (!ready) return <div style={{ padding: 24 }}>Chargement…</div>

  // La vue gère elle-même l’affichage login/admin
  return <AdminSpaceView />
}
