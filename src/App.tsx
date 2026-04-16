import "./App.css";
import { useAuth } from "./hooks/useAuth";
import { LoginPage } from "./components/LoginPage";
import { TtsPage } from "./components/TtsPage";

export default function App() {
  const { token, userName, logout } = useAuth();

  if (!token) return <LoginPage />;
  return <TtsPage token={token} userName={userName!} onLogout={logout} />;
}
