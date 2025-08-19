import React, { useEffect, useState } from 'react'
import { supabase, purgeLocalSupabaseTokens } from '@/lib/supabaseClient'
import AdminSpaceView from './AdminSpaceView'

export default function AdminSpace() {
  const [ready, setReady] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    let mounted = true
    const check = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        await supabase.auth.signOut()
        purgeLocalSupabaseTokens()
        if (mounted) { setShowLogin(true); setReady(true) }
        return
      }
      if (mounted) { setShowLogin(false); setReady(true) }
    }
    check()
    return () => { mounted = false }
  }, [])

  if (!ready) return <div style={{padding:24}}>Chargement…</div>
  return <AdminSpaceView />
}
