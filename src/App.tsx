import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { LoginPage } from "./components/LoginPage";
import { TtsPage } from "./components/TtsPage";
import HomePage from "./pages/HomePage.tsx";

function AppRoutes() {
  const { token, logout } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
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
