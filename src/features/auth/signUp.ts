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
 * - si Confirm email = ON : on attend le clic (pas de session ici)
 * - si Confirm email = OFF : on a une session → on crée le profil AVEC email
 * - redirection email vers /client (pas de /auth/callback)
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

  // 2) Si confirm email = ON → pas de session ici : on arrête là
  if (!data?.session || !data?.user) {
    return { ok: true, needEmailConfirmation: true };
  }

  // 3) Confirm email = OFF → session déjà active : créer le profil AVEC email
  const user = data.user;

  const { error: profileErr } = await supabase.from('users').insert({
    id: user.id,            // FK vers auth.users.id
    email: user.email,      // <-- IMPORTANT (colonne NOT NULL chez toi)
    first_name: p.prenom ?? null,
    last_name: p.nom ?? null,
    phone: p.telephone ?? null,
    whatsapp: p.whatsapp ?? null,
    birth_date: p.dateNaissance ?? null,
    address: p.adresse ?? null,
  });
  if (profileErr) return { ok: false, step: 'insertProfile', error: profileErr.message };

  return { ok: true };
}
