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
  // 1) créer le compte auth
  const { error: signUpError } = await supabase.auth.signUp({
    email: p.email,
    password: p.password,
  });
  if (signUpError) {
    return { ok: false, step: 'signUp', error: signUpError.message };
  }

  // 2) récupérer l'utilisateur (session requise pour insérer le profil)
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) return { ok: false, step: 'getUser', error: userErr.message };

  // si confirmation e-mail = ON, il n'y a pas encore de session
  if (!user) {
    return { ok: true, needEmailConfirmation: true };
  }

  // 3) créer le profil lié (public.users)
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
