import { useAuth } from "../../hooks/useAuth";
import { useLocation } from "react-router-dom";

export function Navbar() {
  const { token, logout } = useAuth();
  const { pathname } = useLocation();
  const isAppPage = pathname === "/app";

  return (
    <nav className="sticky top-0 z-50 border-b border-border backdrop-blur-md bg-surface/85">
      <div className="max-w-screen-xl mx-auto px-6 md:px-14 py-4 flex items-center justify-between">
        <a href="/" className="font-oswald text-xl tracking-[0.12em] uppercase no-underline text-text-primary">
          RECI<span className="text-text-voice ml-[0.15em]">KAO</span>
        </a>

        {token && (
          <button
            onClick={logout}
            className="font-oswald text-xs tracking-[0.18em] uppercase text-text-voice/50 hover:text-text-voice cursor-pointer transition-colors"
          >
            Odjavi se
          </button>
        )}

        {!token && !isAppPage && (
          <a
            href="/app"
            className="font-oswald text-xs tracking-[0.18em] uppercase text-white bg-brand px-5 py-[9px] rounded-lg no-underline transition-all hover:bg-brand-hover hover:-translate-y-px"
          >
            Probaj →
          </a>
        )}
      </div>
    </nav>
  );
}
