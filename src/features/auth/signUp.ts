import { supabase } from '../../lib/supabaseClient';

export type SignUpPayload = {
  email: string;
  password: string;
  prenom?: string;
  nom?: string;
  telephone?: string;
  whatsapp?: string;
  dateNaissance?: string; // 'YYYY-MM-DD'
  adresse?: string;
};

/**
 * Inscription :
 * - crée le compte Auth
 * - si Confirm email = ON : pas de session → l’utilisateur confirme via email
 * - si Confirm email = OFF : session active → on crée le profil immédiatement
 * - redirection email vers /client (pas /auth/callback)
 */
export async function handleSignUp(p: SignUpPayload) {
  const redirectUrl =
    (import.meta as any).env?.VITE_SITE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '');

  // 1) Création du compte Auth
  const { data, error } = await supabase.auth.signUp({
    email: p.email,
    password: p.password,
    options: {
      emailRedirectTo: redirectUrl ? `${redirectUrl}/client` : undefined,
    },
  });
  if (error) return { ok: false, step: 'signUp', error: error.message };

  // 2) Confirm email = ON → pas de session ici
  if (!data?.session || !data?.user) {
    return { ok: true, needEmailConfirmation: true };
  }

  // 3) Confirm email = OFF → on a une session : on crée le profil (FR/EN)
  const user = data.user;

  const { error: profileErr } = await supabase.from('users').insert({
    id: user.id,
    email: user.email,              // ← important
    // valeurs venant du formulaire (si présentes)
    first_name: p.prenom ?? null,
    last_name:  p.nom ?? null,
    address:    p.adresse ?? null,
    phone:      p.telephone ?? null,
    whatsapp:   p.whatsapp ?? null,
    birth_date: p.dateNaissance ?? null,
    // doublon FR (compat)
    prenom: p.prenom ?? null,
    nom:    p.nom ?? null,
  });
  if (profileErr) return { ok: false, step: 'insertProfile', error: profileErr.message };

  return { ok: true };
}
