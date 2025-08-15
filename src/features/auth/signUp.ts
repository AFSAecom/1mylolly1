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
  // URL stable pour la redirection email : on cible /client (PAS /auth/callback)
  const redirectUrl =
    (import.meta as any).env?.VITE_SITE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '');

  const { data, error } = await supabase.auth.signUp({
    email: p.email,
    password: p.password,
    options: {
      // <-- ICI : on redirige vers /client pour éviter la route manquante
      emailRedirectTo: redirectUrl ? `${redirectUrl}/client` : undefined,
    },
  });

  if (error) {
    return { ok: false, step: 'signUp', error: error.message };
  }

  // Si Confirm email = ON => pas de session ici : on attend le clic email
  if (!data?.session || !data?.user) {
    return { ok: true, needEmailConfirmation: true };
  }

  // Si Confirm email = OFF => on a déjà une session : créer le profil
  const user = data.user;

  const { error: profileErr } = await supabase.from('users').insert({
    id: user.id,
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
