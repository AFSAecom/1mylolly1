import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

/**
 * Vérifie les identifiants d'un client sans toucher à l'instance Supabase globale.
 * Crée une instance éphémère avec persistSession: false, effectue la connexion,
 * récupère le profil éventuel puis se déconnecte pour nettoyer la session.
 */
export async function verifyClientCredentials(
  email: string,
  password: string,
) {
  const client = createClient(supabaseUrl, supabaseAnon, {
    auth: { persistSession: false },
  });

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data?.user) {
      logger.error("Client credential verification failed", error);
      return null;
    }

    const { data: profile, error: profileError } = await client
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      logger.error("Failed to fetch client profile", profileError);
    }

    await client.auth.signOut();

    return {
      user: data.user,
      profile: profile ?? null,
      email: data.user.email,
      codeClient: profile?.code_client ?? null,
    };
  } catch (err) {
    logger.error("Unexpected client verification error", err);
    return null;
  }
}
