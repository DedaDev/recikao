import { useEffect, useRef } from "react";
import { VoiceDropdown } from "./VoiceDropdown";
import { TipsBanner } from "./TipsBanner";
import { useTTS } from "../hooks/useTTS";
import { usePersons } from "../hooks/usePersons";

const TIPS = [
  "Koristite kvačice  (č, š, ć, ž, đ)",
  "Skraćenice pišite kako se izgovaraju (RTS → er te es)",
  'Ponovite slovo za bolje akcentovanje (imamo → imaamo)',
  'Da li ste znali da možete koristiti specijalni token [smeh] pre teksta; probajte [smeh] neki tekst'
];

interface Props {
  token: string;
  userName: string;
  onLogout: () => void;
}

export function TtsPage({ token, userName, onLogout }: Props) {
  const { persons, serverDown } = usePersons();
  const { text, setText, person, setPerson, loading, error, quota, audioBase64, submit } = useTTS(token, onLogout);
  const audioRef = useRef<HTMLAudioElement>(null);
  const limitReached = quota?.remaining === 0;
  const hasFancyText = /[\uD800-\uDFFF]/.test(text);

  useEffect(() => {
    if (audioBase64 && audioRef.current) {
      audioRef.current.src = `data:audio/wav;base64,${audioBase64}`;
      audioRef.current.play();
    }
  }, [audioBase64]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col gap-4">

        {/* title + voice */}
        <div className="flex items-baseline gap-3 flex-wrap justify-center">
          <span className="font-oswald text-3xl font-bold tracking-wide text-[#2d1e0f]">Reci kao</span>
          <VoiceDropdown value={person} onChange={setPerson} disabled={loading || serverDown} voices={persons} />
        </div>

        {/* user + logout */}
        <div className="flex items-center justify-between -mt-1">
          <span
            className="text-xs text-[#c4b49a] font-semibold truncate"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {userName}
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="text-xs text-[#c4b49a] hover:text-[#e03030] font-bold cursor-pointer transition-colors"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Odjavi se
          </button>
        </div>

        {/* server down banner */}
        {serverDown && (
          <div className="bg-[#fff3f3] border-2 border-[#e03030] rounded-xl px-4 py-3 text-[#e03030] text-sm font-bold text-center">
            ⚠️ Servis trenutno nije dostupan
          </div>
        )}

        {/* fancy unicode warning */}
        {hasFancyText && (
          <div className="bg-[#fffbf0] border-2 border-[#e0a030] rounded-xl px-4 py-3 text-[#a06000] text-sm font-bold text-center" style={{ fontFamily: "Nunito, sans-serif" }}>
            ⚠️ Tekst sadrži specijalne znakove koji neće biti izgovoreni ispravno
          </div>
        )}

        {/* textarea */}
        <div className="relative">
          <textarea
            className="w-full bg-white border-2 border-[#e0d4c0] rounded-xl p-4 pb-8 text-[#2d1e0f] font-semibold text-base leading-relaxed resize-none outline-none placeholder-[#c4b49a] focus:border-[#e03030] disabled:opacity-50 transition-colors"
            style={{ fontFamily: "Nunito, sans-serif" }}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 300))}
            placeholder="Unesite tekst..."
            disabled={loading || serverDown || limitReached}
            rows={4}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit(); }}
          />
          <span
            className={`absolute bottom-3 right-4 text-xs font-bold ${text.length >= 300 ? "text-[#e03030]" : "text-[#c4b49a]"}`}
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {text.length}/300
          </span>
        </div>

        <TipsBanner tips={TIPS} />

        {/* submit button */}
        <button
          className={`relative w-full text-white font-bold text-base rounded-xl py-3 cursor-pointer disabled:cursor-not-allowed transition-all shadow-[0_4px_12px_rgba(224,48,48,0.25)] overflow-hidden bg-[#e03030] ${!loading ? "hover:bg-[#c82020] active:scale-[0.98]" : ""}`}
          style={{ fontFamily: "Nunito, sans-serif", opacity: (!text.trim() || serverDown || limitReached) && !loading ? 0.5 : 1 }}
          onClick={submit}
          disabled={loading || !text.trim() || serverDown || limitReached}
        >
          {loading && <span className="btn-fill" />}
          <span className="relative z-10">{loading ? "Generišem..." : "Generiši!"}</span>
        </button>

        {error && (
          <p className="text-[#e03030] text-sm font-bold text-center">{error}</p>
        )}

        {/* quota */}
        {quota && (
          <p
            className={`text-xs font-bold text-center -mt-2 ${quota.remaining === 0 ? "text-[#e03030]" : quota.remaining <= 3 ? "text-[#c05c00]" : "text-[#c4b49a]"}`}
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {quota.remaining === 0
              ? "Dostigao si dnevni limit — pokušaj sutra"
              : `${quota.remaining} od ${quota.limit} zahteva preostalo danas`}
          </p>
        )}

        {/* audio player */}
        <audio
          ref={audioRef}
          controls
          className="w-full rounded-lg"
          style={{ opacity: audioBase64 ? 1 : 0 }}
        />

        {/* download button */}
        {audioBase64 && (
          <a
            href={`data:audio/wav;base64,${audioBase64}`}
            download="recikao.wav"
            className="w-full text-center text-xs font-bold text-[#c4b49a] hover:text-[#e03030] transition-colors -mt-2"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Preuzmi audio ↓
          </a>
        )}

      </div>

      {/* Discord */}
      <a
        href="https://discord.gg/cCn7qV8jrE"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-12 text-[#c4b49a] hover:text-[#e03030] transition-colors"
      >
        <DiscordIcon />
      </a>
    </div>
  );
}

function DiscordIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}
