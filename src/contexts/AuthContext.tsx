import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { loadToken, removeToken, decodeToken, isTokenExpired } from "../lib/auth";

interface AuthState {
  token: string | null;
  userName: string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadToken();
    if (saved && !isTokenExpired(saved)) {
      applyToken(saved);
    } else if (saved) {
      removeToken();
    }
  }, []);

  function applyToken(t: string) {
    const payload = decodeToken(t);
    if (!payload) return;
    setToken(t);
    setUserName((payload.name ?? payload.email).split(" ")[0]);
  }

  function logout() {
    removeToken();
    setToken(null);
    setUserName(null);
  }

  return (
    <AuthContext.Provider value={{ token, userName, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
