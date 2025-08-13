"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as loginApi, register as registerApi, logout as logoutApi, me } from "@/lib/auth";
import type { User } from "@/types";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  // PUBLIC_INTERFACE
  login: (email: string, password: string) => Promise<void>;
  // PUBLIC_INTERFACE
  register: (name: string, email: string, password: string) => Promise<void>;
  // PUBLIC_INTERFACE
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * PUBLIC_INTERFACE
 * AuthProvider
 * Provides authentication state and actions to children components.
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from token
  useEffect(() => {
    let active = true;
    async function init() {
      try {
        const data = await me();
        if (active) setUser(data);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }
    init();
    return () => { active = false; };
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    loading,
    async login(email: string, password: string) {
      await loginApi({ email, password });
      const profile = await me().catch(() => null);
      setUser(profile);
    },
    async register(name: string, email: string, password: string) {
      await registerApi({ name, email, password });
      const profile = await me().catch(() => null);
      setUser(profile);
    },
    logout() {
      logoutApi();
      setUser(null);
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * useAuth
 * Hook to access authentication state and actions.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
