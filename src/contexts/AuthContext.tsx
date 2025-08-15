import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { login as authLogin, register as authRegister } from '@/services/auth/authService';

export interface User extends SupabaseUser {
  nom?: string;
  prenom?: string;
  telephone?: string;
  whatsapp?: string;
  adresse?: string;
  codeClient?: string;
}
import { supabase } from '@/lib/supabaseClient';

type AuthCtx = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  updateUser: (u: Partial<User>) => void;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<User | null>;
  register: (data: any) => Promise<User | null>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  session: null,
  loading: true,
  isAuthenticated: false,
  updateUser: () => {},
  signOut: async () => {},
  refresh: async () => {},
  login: async () => null,
  register: async () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code') ?? params.get('token');
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ data }) => {
        if (data?.session) {
          setSession(data.session);
          setUser(data.session.user as User);
          window.history.replaceState({}, '', window.location.pathname);
        }
      });
    } else if (window.location.hash.includes('access_token')) {
      // getSessionFromUrl is not typed in our Supabase client, so cast to any
      (supabase.auth as any).getSessionFromUrl().then(({ data }: { data: { session: Session | null } }) => {
        if (data?.session) {
          setSession(data.session); 
          setUser(data.session.user as User); 
          window.history.replaceState({}, '', window.location.pathname);
        }
      });
    }

    let mounted = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(data.session ?? null);
        setUser((data.session?.user as User) ?? null);
      } catch (error) {
        console.error('Error fetching session', error);
        alert('Erreur lors de la récupération de la session.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser((newSession?.user as User) ?? null);
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
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session ?? null);
        setUser((data.session?.user as User) ?? null);
      } catch (error) {
        console.error('Error refreshing session', error);
        alert('Erreur lors de la récupération de la session.');
      }
    },
    login: async (email, password) => {
      const logged = await authLogin(email, password);
      if (logged) setUser(logged as User);
      return logged as User | null;
    },
    register: async (data) => {
      const registered = await authRegister(data as any);
      if (registered) setUser(registered as User);
      return registered as User | null;
    },
  }), [user, session, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}
