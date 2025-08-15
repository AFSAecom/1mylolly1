import { supabase } from '../../lib/supabaseClient';

/**
 * Connexion puis "ensure profile":
 * - se connecte via Auth
 * - upsert du profil dans public.users AVEC email (id = auth.users.id)
 */
export async function handleSignIn(email: string, password: string) {
  // 1) Connexion Auth (email/mot de passe)
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, step: 'auth', error: error.message };

  const { user } = data;

  // 2) Lire le profil PAR id (RLS: auth.uid() = id)
  const { data: profile, error: selErr } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
  if (selErr) return { ok: false, step: 'selectProfile', error: selErr.message };

  // 3) Créer / mettre à jour le profil AVEC email (colonne NOT NULL chez toi)
  if (!profile) {
    const { error: insErr } = await supabase.from('users').insert({
      id: user.id,
      email: user.email,            // <-- IMPORTANT
      first_name: null,
      last_name: null,
      phone: null,
      whatsapp: null,
      birth_date: null,
      address: null,
    });
    if (insErr) return { ok: false, step: 'insertProfile', error: insErr.message };
  } else if (!profile.email && user.email) {
    // au cas où un vieux profil existe sans email
    const { error: updErr } = await supabase
      .from('users')
      .update({ email: user.email })
      .eq('id', user.id);
    if (updErr) return { ok: false, step: 'updateEmail', error: updErr.message };
  }

  return { ok: true, user };
}
