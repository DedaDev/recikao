import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { VoiceDropdown } from "./VoiceDropdown";
import { TipsBanner } from "./TipsBanner";
import { Navbar } from "./home/Navbar";
import { useTTS } from "../hooks/useTTS";
import { usePersons } from "../hooks/usePersons";

const TIPS = [
  "Koristite kvačice (č, š, ć, ž, đ)",
  "Skraćenice pišite kako se izgovaraju (RTS → er te es)",
  "Ponovite slovo za bolje akcentovanje (imamo → imaamo)",
  "Da li ste znali da možete koristiti specijalni token [smeh] pre teksta; probajte [smeh] neki tekst",
];

function AudioPlayer({ audioBase64 }: { audioBase64: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WaveSurfer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    wsRef.current?.destroy();

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "rgba(167,139,250,0.3)",
      progressColor: "#a78bfa",
      cursorColor: "rgba(196,181,253,0.6)",
      cursorWidth: 1,
      height: 36,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      normalize: true,
    });

    ws.load(`data:audio/wav;base64,${audioBase64}`);

    ws.on("ready", () => {
      setReady(true);
      ws.play();
    });
    ws.on("play", () => setPlaying(true));
    ws.on("pause", () => setPlaying(false));
    ws.on("finish", () => setPlaying(false));

    wsRef.current = ws;
    return () => ws.destroy();
  }, [audioBase64]);

  function toggle() {
    wsRef.current?.playPause();
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggle}
        disabled={!ready}
        aria-label={playing ? "Pauziraj" : "Reprodukuj"}
        className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-30"
        style={{
          background: playing ? "#7c3aed" : "rgba(124,58,237,0.15)",
          border: playing ? "none" : "1.5px solid rgba(124,58,237,0.4)",
          boxShadow: playing ? "0 0 18px rgba(124,58,237,0.6)" : "none",
        }}
      >
        {playing ? (
          <svg width="9" height="10" viewBox="0 0 9 10" fill="white">
            <rect x="0" y="0" width="3" height="10" rx="1" />
            <rect x="6" y="0" width="3" height="10" rx="1" />
          </svg>
        ) : (
          <svg width="10" height="11" viewBox="0 0 10 11" fill="#a78bfa" style={{ marginLeft: "2px" }}>
            <path d="M0 0 L10 5.5 L0 11 Z" />
          </svg>
        )}
      </button>

      <div ref={containerRef} className="flex-1" />
    </div>
  );
}

interface Props {
  token: string;
  onLogout: () => void;
}

export function TtsPage({ token, onLogout }: Props) {
  const { persons, serverDown } = usePersons();
  const { text, setText, person, setPerson, loading, error, quota, audioBase64, submit } = useTTS(token, onLogout);
  const limitReached = quota?.remaining === 0;
  const hasFancyText = /[\uD800-\uDFFF]/.test(text);

  let quotaColor = "text-text-voice";
  if (quota?.remaining === 0) quotaColor = "text-red-400";
  else if (quota && quota.remaining <= 3) quotaColor = "text-amber-400";

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-start justify-center p-6 pt-16">
        <div className="w-full max-w-[420px] flex flex-col gap-4">

          <div className="flex items-baseline gap-3 justify-center mb-2">
            <span className="font-oswald text-xl md:text-3xl uppercase tracking-wide text-text-primary whitespace-nowrap">Reci kao</span>
            <VoiceDropdown value={person} onChange={setPerson} disabled={loading || serverDown} voices={persons} />
          </div>

          {serverDown && (
            <div className="bg-red-950/40 border border-red-500/30 rounded-xl px-4 py-3 font-nunito text-red-400 text-sm font-bold text-center">
              ⚠️ Servis trenutno nije dostupan
            </div>
          )}

          {hasFancyText && (
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl px-4 py-3 font-nunito text-amber-400 text-sm font-bold text-center">
              ⚠️ Tekst sadrži specijalne znakove koji neće biti izgovoreni ispravno
            </div>
          )}

          <div className="relative">
            <textarea
              className="w-full border border-brand/30 rounded-xl p-4 pb-8 font-nunito text-text-primary text-base leading-relaxed resize-none outline-none placeholder:text-text-voice/55 focus:border-brand/60 focus:shadow-[0_0_22px_rgba(124,58,237,0.22)] disabled:opacity-40 transition-all duration-200"
              style={{ background: "rgba(124,58,237,0.09)" }}
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 300))}
              placeholder="Unesite tekst..."
              disabled={loading || serverDown || limitReached}
              rows={4}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit(); }}
            />
            <span className={`absolute bottom-3 right-4 font-nunito text-xs ${text.length >= 300 ? "text-red-400" : "text-text-voice/40"}`}>
              {text.length}/300
            </span>
          </div>

          <button
            className="relative w-full font-oswald text-sm tracking-[0.18em] uppercase text-white bg-brand rounded-xl py-3 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:bg-brand-hover active:scale-[0.98] overflow-hidden"
            onClick={submit}
            disabled={loading || !text.trim() || serverDown || limitReached}
          >
            {loading && <span className="btn-fill" />}
            <span className="relative z-10">{loading ? "Generišem..." : "Generiši"}</span>
          </button>

          {error && (
            <p className="font-nunito text-red-400 text-sm font-bold text-center">{error}</p>
          )}

          <p className={`font-nunito text-xs text-center -mt-2 min-h-[1rem] ${quotaColor}`}>
            {quota && quota.remaining === 0 && "Dostigao si dnevni limit — pokušaj sutra"}
            {quota && quota.remaining > 0 && `${quota.remaining} od ${quota.limit} zahteva preostalo danas`}
          </p>

          {!audioBase64 && <div className="mt-20"><TipsBanner tips={TIPS} /></div>}

          {audioBase64 && <div className="mt-20"><AudioPlayer audioBase64={audioBase64} /></div>}

          {audioBase64 && (
            <div className="flex justify-center mt-5">
              <a
                href={`data:audio/wav;base64,${audioBase64}`}
                download="recikao.wav"
                className="inline-flex items-center gap-2 font-oswald text-sm tracking-[0.15em] uppercase text-text-voice border border-brand/25 rounded-xl px-5 py-2.5 hover:border-brand/50 hover:text-brand transition-all no-underline"
                style={{ background: "rgba(124,58,237,0.06)" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M7 9.5L3 5.5h2.5V1h3v4.5H11L7 9.5Z" />
                  <rect x="2" y="11" width="10" height="1.5" rx="0.75" />
                </svg>
                Preuzmi
              </a>
            </div>
          )}

        </div>
      </div>

      <div className="flex justify-center pb-10">
        <a
          href="https://discord.gg/cCn7qV8jrE"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-voice/30 hover:text-brand transition-colors"
        >
          <DiscordIcon />
        </a>
      </div>
    </div>
  );
}

function DiscordIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}
