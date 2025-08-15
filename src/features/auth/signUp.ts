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

export async function handleSignUp(p: SignUpPayload) {
  // URL stable pour la redirection email (si confirm email = ON)
  const redirectUrl =
    (import.meta as any).env?.VITE_SITE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '');

  // 1) Créer le compte
  const { data, error } = await supabase.auth.signUp({
    email: p.email,
    password: p.password,
    options: {
      // si la confirmation d’email est activée, Supabase redirigera ici après clic
      emailRedirectTo: redirectUrl ? `${redirectUrl}/auth/callback` : undefined,
    },
  });

  if (error) {
    // Exemple d’erreurs possibles : throttle (429), email désactivé, etc.
    return { ok: false, step: 'signUp', error: error.message };
  }

  // 2) Si la confirmation email est ON, data.session === null
  // => on n'essaie PAS de lire l'utilisateur, on demande juste de confirmer l'email
  if (!data?.session || !data?.user) {
    return { ok: true, needEmailConfirmation: true };
  }

  // 3) Confirmation email OFF : on a déjà une session => créer le profil lié
  const user = data.user;

  const { error: profileErr } = await supabase.from('users').insert({
    id: user.id, // FK vers auth.users.id
    first_name: p.prenom ?? null,
    last_name: p.nom ?? null,
    phone: p.telephone ?? null,
    whatsapp: p.whatsapp ?? null,
    birth_date: p.dateNaissance ?? null,
    address: p.adresse ?? null,
  });

  if (profileErr) {
    return { ok: false, step: 'insertProfile', error: profileErr.message };
  }

  return { ok: true };
}
