import { useEffect, useRef } from "react";
import { VoiceDropdown } from "./VoiceDropdown";
import { useTTS } from "../hooks/useTTS";

interface Props {
  token: string;
  userName: string;
  onLogout: () => void;
}

export function TtsPage({ token, userName, onLogout }: Props) {
  const { text, setText, person, setPerson, loading, error, serverDown, quota, audioBase64, submit } = useTTS(token, onLogout);
  const audioRef = useRef<HTMLAudioElement>(null);
  const limitReached = quota?.remaining === 0;

  useEffect(() => {
    if (audioBase64 && audioRef.current) {
      audioRef.current.src = `data:audio/wav;base64,${audioBase64}`;
      audioRef.current.play();
    }
  }, [audioBase64]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col gap-4">

        {/* title + voice */}
        <div className="flex items-baseline gap-3 flex-wrap justify-center">
          <span className="font-oswald text-3xl font-bold tracking-wide text-[#2d1e0f]">Reci kao</span>
          <VoiceDropdown value={person} onChange={setPerson} disabled={loading || serverDown} />
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

      </div>
    </div>
  );
}
