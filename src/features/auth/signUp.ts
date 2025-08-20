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
 * - si Confirm email = ON : pas de session → on attend le clic mail (redirigé vers /client)
 * - si Confirm email = OFF : session active → on crée le profil immédiatement
 * - pour contourner les contraintes NOT NULL héritées, on met '' sur prenom/nom si absents
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

  // 3) Confirm email = OFF → on a une session : créer le profil
  const user = data.user;

  const { error: profileErr } = await supabase.from('users').insert({
    id: user.id,
    email: user.email ?? '',
    // valeurs issues du formulaire
    first_name: p.prenom ?? null,
    last_name:  p.nom ?? null,
    adresse:    p.adresse ?? null,
    phone:      p.telephone ?? null,
    whatsapp:   p.whatsapp ?? null,
    birth_date: p.dateNaissance ?? null,
    // doublon FR (et valeurs de secours pour NOT NULL éventuel)
    prenom: p.prenom ?? '',
    nom:    p.nom ?? '',
  });
  if (profileErr) return { ok: false, step: 'insertProfile', error: profileErr.message };

  return { ok: true };
}
