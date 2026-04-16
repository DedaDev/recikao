import { useState, useEffect } from "react";
import { loadToken, storeToken, removeToken, decodeToken, isTokenExpired } from "../lib/auth";

export interface AuthState {
  token: string | null;
  userName: string | null;
  logout: () => void;
}

export function useAuth(): AuthState {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const callbackToken = params.get("token");

    if (callbackToken) {
      storeToken(callbackToken);
      window.history.replaceState({}, "", "/app");
      applyToken(callbackToken);
      return;
    }

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

  return { token, userName, logout };
}
