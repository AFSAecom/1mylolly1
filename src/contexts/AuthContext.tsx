import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { handleSignIn } from '@/features/auth/signIn';
import { handleSignUp } from '@/features/auth/signUp';
import { supabase } from '@/lib/supabaseClient';
import { normalizeRole } from '@/lib/utils';

interface User extends SupabaseUser {
  role?: string;
}

export type AuthCtx = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  updateUser: (u: Partial<User>) => void;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  login: typeof handleSignIn;
  register: typeof handleSignUp;
};

/*
 * AuthContext with offline admin support.
 *
 * This context is responsible for providing authentication state
 * throughout the application. It wraps Supabase's auth client and
 * exposes methods for logging in and out. In addition to the default
 * Supabase session handling, this version also supports a simple
 * "offline" mode for the administrator account. When the login
 * function determines that the Supabase Auth service is unavailable
 * but the credentials match the admin user, it stores a flag in
 * localStorage (`offlineAdmin`). The AuthProvider reads this flag on
 * mount and, if present, populates the context with a minimal admin
 * user object. It also adjusts `isAuthenticated` so that the rest of
 * the application treats this offline admin as authenticated. When
 * signing out, the flag is cleared.
 */
const Ctx = createContext<AuthCtx>({
  user: null,
  session: null,
  loading: true,
  isAuthenticated: false,
  updateUser: () => {},
  signOut: async () => {},
  refresh: async () => {},
  login: handleSignIn,
  register: handleSignUp,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to fetch a user's role from the `users` table if not present in metadata
  const getUserWithRole = async (u: SupabaseUser | null): Promise<User | null> => {
    if (!u) return null;
    let role = (u.user_metadata as any)?.role as string | undefined;
    if (!role) {
      const { data } = await supabase
        .from('users')
        .select('role')
        .eq('id', u.id)
        .single();
      role = data?.role ?? undefined;
    }
    const normalized = normalizeRole(role) || 'client'
    return { ...u, role: normalized } as User;
  };

  useEffect(() => {
    // Check if the admin has logged in via the offline fallback
    const offline = typeof window !== 'undefined' && localStorage.getItem('offlineAdmin') === 'true';
    if (offline) {
      // Bypass Supabase session retrieval and set offline admin user
      setSession(null);
      setUser({
        id: 'admin-offline',
        email: 'admin@lecompasolfactif.com',
        role: 'admin',
      } as User);
      setLoading(false);
      return;
    }

    // If not in offline mode, proceed with Supabase auth listener and session fetch
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      setUser(await getUserWithRole(data.session?.user ?? null));
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(await getUserWithRole(newSession?.user ?? null));
      window.dispatchEvent(new CustomEvent('auth:changed'));
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthCtx>(() => {
    const offline = typeof window !== 'undefined' && localStorage.getItem('offlineAdmin') === 'true';
    return {
      user,
      session,
      loading,
      // Consider the offline admin as authenticated even without a session
      isAuthenticated: !!session || (offline && user?.role === 'admin'),
      updateUser: (u: Partial<User>) => {
        setUser((prev) => (prev ? { ...prev, ...u } as User : prev));
      },
      signOut: async () => {
        // Clear offline admin flag and sign out from Supabase
        if (typeof window !== 'undefined') {
          localStorage.removeItem('offlineAdmin');
        }
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
      },
      refresh: async () => {
        const { data } = await supabase.auth.getSession();
        setSession(data.session ?? null);
        setUser(await getUserWithRole(data.session?.user ?? null));
      },
      login: handleSignIn,
      register: handleSignUp,
    };
  }, [user, session, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  return useContext(Ctx);
}