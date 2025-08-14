import { supabase } from '../../lib/supabaseClient';

export async function handleSignIn(email: string, password: string) {
  // 1) Connexion Auth (email/mot de passe)
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, step: 'auth', error: error.message };

  const { user } = data;

  // 2) Lire le profil PAR ID (RLS: auth.uid() = id)
  const { data: profile, error: selErr } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
  if (selErr) return { ok: false, step: 'selectProfile', error: selErr.message };

  // 3) Créer le profil s’il n’existe pas
  if (!profile) {
    const { error: insErr } = await supabase.from('users').insert({ id: user.id });
    if (insErr) return { ok: false, step: 'insertProfile', error: insErr.message };
  }

  return { ok: true, user };
}
