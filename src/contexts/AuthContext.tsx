import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

interface User extends SupabaseUser {
  role?: string;
}

type AuthCtx = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  updateUser: (u: Partial<User>) => void;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  session: null,
  loading: true,
  isAuthenticated: false,
  updateUser: () => {},
  signOut: async () => {},
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserWithRole = async (u: SupabaseUser | null): Promise<User | null> => {
    if (!u) return null;
    let role = (u.user_metadata as any)?.role as string | undefined;
    if (!role) {
      const { data } = await supabase
        .from('users')
        .select('role')
        .eq('id', u.id)
        .single();
      role = data?.role;
    }
    return { ...u, role } as User;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code') ?? params.get('token');
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(async ({ data }) => {
        if (data?.session) {
          setSession(data.session);
          setUser(await getUserWithRole(data.session.user));
          window.history.replaceState({}, '', window.location.pathname);
        }
      });
    } else if (window.location.hash.includes('access_token')) {
      // getSessionFromUrl is not typed in our Supabase client, so cast to any
      (supabase.auth as any).getSessionFromUrl().then(async ({ data }: { data: { session: Session | null } }) => {
        if (data?.session) {
          setSession(data.session);
          setUser(await getUserWithRole(data.session.user));
          window.history.replaceState({}, '', window.location.pathname);
        }
      });
    }

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

  const value = useMemo<AuthCtx>(() => ({
    user,
    session,
    loading,
    isAuthenticated: !!session,
    updateUser: (u) => {
      setUser((prev) => (prev ? { ...prev, ...u } as User : prev));
    },
    signOut: async () => { await supabase.auth.signOut(); },
    refresh: async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setUser(await getUserWithRole(data.session?.user ?? null));
    },
  }), [user, session, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}
