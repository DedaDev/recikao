import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { LoginPage } from "./components/LoginPage";
import { TtsPage } from "./components/TtsPage";
import HomePage from "./pages/HomePage.tsx";
import { storeToken } from "./lib/auth";

function AuthCallback() {
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    if (token) storeToken(token);
    window.location.replace("/app");
  }, []);

  return null;
}

function AppRoutes() {
  const { token, logout } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/app"
        element={
          token
            ? <TtsPage token={token} onLogout={logout} />
            : <LoginPage />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
