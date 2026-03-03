"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { getUserProfile, type UserProfile } from "@/lib/api";

interface AuthContextType {
  token: string | null;
  user: UserProfile | null;
  isLoading: boolean;
  login: (jwt: string) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (jwt: string) => {
    try {
      const profile = await getUserProfile(jwt);
      setUser(profile);
    } catch {
      setToken(null);
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("nigus_token");
      }
    }
  }, []);

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem("nigus_token")
        : null;
    if (stored) {
      setToken(stored);
      fetchProfile(stored).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  const login = useCallback(
    (jwt: string) => {
      setToken(jwt);
      if (typeof window !== "undefined") {
        localStorage.setItem("nigus_token", jwt);
      }
      fetchProfile(jwt);
    },
    [fetchProfile],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("nigus_token");
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (token) {
      await fetchProfile(token);
    }
  }, [token, fetchProfile]);

  return (
    <AuthContext.Provider
      value={{ token, user, isLoading, login, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
