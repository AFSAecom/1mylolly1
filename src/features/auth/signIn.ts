import { supabase } from '../../lib/supabaseClient';

/**
 * Tentative de connexion pour l'interface admin/client.
 *
 * Cette fonction tente une authentification auprès de Supabase
 * avec un délai d'attente configurable. En cas d'échec ou de délai
 * dépassé, une erreur descriptive est renvoyée.
 */
export async function handleSignIn(email: string, password: string) {
  // Durée maximale (en millisecondes) pour l'appel à Supabase Auth
  const TIMEOUT_MS = 8000;
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)
  );

  try {
    // Lancement de l'authentification Supabase en parallèle du compte à rebours
    const signInPromise = supabase.auth.signInWithPassword({ email, password });
    const result: any = await Promise.race([signInPromise, timeoutPromise]);
    const { data, error } = result;

    // Gestion des erreurs retournées par Supabase
    if (error) {
      if (error.message?.includes('Email not confirmed')) {
        return {
          ok: false,
          step: 'auth',
          error: 'Email non confirmée. Vérifiez votre boîte de réception.',
        };
      }
      // On lève l'erreur pour qu'elle soit traitée dans le bloc catch ci‑dessous
      throw new Error(error.message);
    }

    const { user } = data;

    // Lecture du profil dans la table `users` (clé primaire = id/uid)
    const { data: profile, error: selErr } = await supabase
      .from('users')
      .select('*')
      // certaines migrations utilisent `uid` au lieu de `id` ; on tente les deux
      .or(`id.eq.${user.id},uid.eq.${user.id}`)
      .maybeSingle();
    if (selErr) {
      console.error('Erreur lors de la récupération du profil:', selErr);
      return { ok: false, step: 'profile', error: selErr.message };
    }

    // Création du profil s'il n'existe pas encore
    if (!profile) {
      console.warn(`Profil introuvable pour l'utilisateur ${user.id}, création...`);
      const { error: insertErr } = await supabase.from('users').insert({
        id: user.id,
        uid: user.id,
        email: user.email ?? '',
        role: user.email === 'admin@lecompasolfactif.com' ? 'admin' : 'client',
        first_name: null,
        last_name: null,
        adresse: null,
        phone: null,
        whatsapp: null,
        birth_date: null,
        prenom: '',
        nom: '',
      });
      if (insertErr) {
        console.error('Erreur lors de la création du profil:', insertErr);
        return { ok: false, step: 'profile', error: insertErr.message };
      }
    } else {
      // Mise à jour éventuelle du rôle ou de l'email si manquants
      const updates: any = {};
      if (!profile.email && user.email) updates.email = user.email;
      if (!profile.role) {
        updates.role = user.email === 'admin@lecompasolfactif.com' ? 'admin' : 'client';
      }
      if (Object.keys(updates).length > 0) {
        const { error: updErr } = await supabase
          .from('users')
          .update(updates)
          .or(`id.eq.${user.id},uid.eq.${user.id}`);
        if (updErr) {
          console.error('Erreur lors de la mise à jour du profil:', updErr);
          return { ok: false, step: 'profile', error: updErr.message };
        }
      }
    }

    return { ok: true, user };
  } catch (err: any) {
    // Erreur de délai d'attente
    if (err.message === 'timeout') {
      return { ok: false, step: 'auth', error: "Délai d'attente dépassé. Réessayez." };
    }
    return { ok: false, step: 'auth', error: err.message ?? 'Erreur inconnue' };
  }
}
