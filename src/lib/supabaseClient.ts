// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// IMPORTANT : n'utilise jamais la service_role key côté frontend.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
