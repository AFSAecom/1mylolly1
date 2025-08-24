import { supabase } from '../../lib/supabaseClient';

/**
 * Connexion puis "ensure profile" :
 * - login via Auth
 * - si le profil n'existe pas, on le crée avec toutes les colonnes attendues
 *   (id = auth.users.id). On met des valeurs de secours ('') si besoin.
 *
 * Cette version ajoute un délai d'attente pour éviter qu'un appel à Supabase
 * reste bloqué indéfiniment. Si la requête de connexion ne répond pas dans
 * TIMEOUT_MS millisecondes, une erreur est renvoyée et l'interface peut
 * afficher un message clair au lieu de spinner indéfiniment.
 */
export async function handleSignIn(email: string, password: string) {
  // 1) Auth email/mot de passe avec délai d'attente (par exemple 8 secondes)
  const TIMEOUT_MS = 8000;
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)
  );

  try {
    // On lance la requête de connexion Supabase et on met en concurrence
    // avec le délai d'attente. Promise.race renvoie le premier résultat.
    const signInPromise = supabase.auth.signInWithPassword({ email, password });
    const result: any = await Promise.race([signInPromise, timeoutPromise]);
    const { data, error } = result;

    if (error) {
      if (error.message?.includes('Email not confirmed')) {
        return {
          ok: false,
          step: 'auth',
          error: 'Email non confirmée. Vérifiez votre boîte de réception.',
        };
      }
      return { ok: false, step: 'auth', error: error.message };
    }

    const { user } = data;

    // 2) Lire le profil PAR id (RLS: auth.uid() = id)
    const {
      data: profile,
      error: selErr,
    } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    if (selErr) return { ok: false, step: 'selectProfile', error: selErr.message };

    // 3) Créer le profil s'il n'existe pas (email + colonnes FR/EN)
    if (!profile) {
      const { error: insErr } = await supabase.from('users').insert({
        id: user.id,
        email: user.email ?? '', // valeur de secours si email est NOT NULL / UNIQUE
        // valeur par défaut du rôle (admin forcé pour l'email spécifique)
        role: user.email === 'admin@lecompasolfactif.com' ? 'admin' : 'client',
        // valeurs par défaut pour toutes les colonnes additionnelles
        first_name: null,
        last_name: null,
        adresse: null,
        phone: null,
        whatsapp: null,
        birth_date: null,
        // français : valeurs de secours pour contourner un éventuel NOT NULL
        prenom: '',
        nom: '',
      });
      if (insErr) return { ok: false, step: 'insertProfile', error: insErr.message };
    } else {
      // profil existant mais complétion possible
      if (!profile.email && user.email) {
        // ancien profil sans email → on le complète
        const { error: updErr } = await supabase
          .from('users')
          .update({ email: user.email })
          .eq('id', user.id);
        if (updErr) return { ok: false, step: 'updateEmail', error: updErr.message };
      }
      if (!profile.role) {
        const { error: updRoleErr } = await supabase
          .from('users')
          .update({
            role: user.email === 'admin@lecompasolfactif.com' ? 'admin' : 'client',
          })
          .eq('id', user.id);
        if (updRoleErr)
          return { ok: false, step: 'updateRole', error: updRoleErr.message };
      }
    }

    return { ok: true, user };
  } catch (err: any) {
    // Gérer le délai d'attente ou toute autre erreur réseau
    if (err.message === 'timeout') {
      return { ok: false, step: 'auth', error: "Délai d'attente dépassé. Réessayez." };
    }
    return { ok: false, step: 'auth', error: err.message ?? 'Erreur inconnue' };
  }
}
