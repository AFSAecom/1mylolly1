// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Vite n'expose au navigateur que les variables préfixées par VITE_
const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl)  throw new Error('Missing VITE_SUPABASE_URL')
if (!supabaseAnon) throw new Error('Missing VITE_SUPABASE_ANON_KEY')

export const supabase = createClient(supabaseUrl, supabaseAnon)
