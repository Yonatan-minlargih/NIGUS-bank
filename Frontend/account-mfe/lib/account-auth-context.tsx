"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface AccountAuthContextType {
  token: string | null;
  user: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithToken: (token: string) => Promise<void>;
  logout: () => void;
}

const AccountAuthContext = createContext<AccountAuthContextType | undefined>(undefined);

export function AccountAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const validateToken = useCallback(async (jwt: string) => {
    try {
      const response = await fetch('/api/auth/transfer-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: jwt })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(jwt);
        localStorage.setItem('account_token', jwt);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      // 1) Check URL query param first (for token transfer from user service)
      let urlToken: string | null = null;
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const tokenFromUrl = params.get("token");
        if (tokenFromUrl) {
          urlToken = tokenFromUrl;
        }
      }

      if (urlToken) {
        const isValid = await validateToken(urlToken);
        if (isValid) {
          // Clean up the URL so the token is not left in the address bar
          if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.delete("token");
            window.history.replaceState({}, "", url.toString());
          }
          setIsLoading(false);
          return;
        }
      }

      // 2) Check localStorage (for existing sessions)
      const storedToken = localStorage.getItem('account_token');
      if (storedToken) {
        const isValid = await validateToken(storedToken);
        if (isValid) {
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [validateToken]);

  const loginWithToken = useCallback(async (jwt: string) => {
    const isValid = await validateToken(jwt);
    if (!isValid) {
      throw new Error('Invalid token');
    }
  }, [validateToken]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('account_token');
    sessionStorage.removeItem('account_service_token');
  }, []);

  return (
    <AccountAuthContext.Provider value={{
      token,
      user,
      isLoading,
      isAuthenticated: !!token,
      loginWithToken,
      logout
    }}>
      {children}
    </AccountAuthContext.Provider>
  );
}

export function useAccountAuth() {
  const context = useContext(AccountAuthContext);
  if (!context) throw new Error("useAccountAuth must be used within AccountAuthProvider");
  return context;
}
