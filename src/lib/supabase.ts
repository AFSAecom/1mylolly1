import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create Supabase client with proper configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    // For development - disable email confirmation requirement
    flowType: "pkce",
    // Additional settings for development
    debug: true,
  },
  global: {
    headers: {
      "X-Client-Info": "le-compas-olfactif",
    },
  },
  // Add realtime configuration
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
