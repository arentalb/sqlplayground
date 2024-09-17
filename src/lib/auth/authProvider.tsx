"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface user {
  username: string;
  id: string;
  role: string;
}
interface AuthContextType {
  user: user | null;
  refreshUser: () => void;
  clearUser: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<user | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    try {
      const response = await fetch("/api/auth");
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchUser();
  }, []);

  async function refreshUser() {
    setUser(null);
    await fetchUser();
  }

  function clearUser() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  );
}
