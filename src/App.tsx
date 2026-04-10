import { useState, useEffect, useRef } from "react";
import "./App.css";

const API_BASE = "https://api.saobracajke.net/api";

const VOICES = [
  { id: "vucic",       label: "Vučić" },
  { id: "zmaj",        label: "Zmaj od Šipova" },
  { id: "brnabic",     label: "Brnabić" },
  { id: "desingerica", label: "Desingerica" },
  { id: "aca_lukas",     label: "Aca Lukas" },
  { id: "jovanka_jolic",  label: "Jovanka Jolić" },
  { id: "jovana_jeremic", label: "Jovana Jeremić" },
];

function VoiceDropdown({ value, onChange, disabled }: {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = VOICES.find(v => v.id === value)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        className="font-oswald text-3xl font-bold tracking-wide text-[#e03030] border-b-2 border-[#e03030] bg-transparent cursor-pointer disabled:opacity-50 flex items-center gap-1 outline-none"
        onClick={() => !disabled && setOpen(o => !o)}
        disabled={disabled}
        type="button"
      >
        {selected.label}
        <span className="text-lg" style={{ lineHeight: 1 }}>{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 bg-white border-2 border-[#e0d4c0] rounded-xl overflow-hidden shadow-lg z-10 w-52">
          {VOICES.map(v => (
            <button
              key={v.id}
              type="button"
              className={`w-full text-left px-4 py-2.5 font-oswald text-lg tracking-wide cursor-pointer transition-colors
                ${v.id === value
                  ? "bg-[#fff0f0] text-[#e03030]"
                  : "text-[#2d1e0f] hover:bg-[#fdf8f0]"
                }`}
              onClick={() => { onChange(v.id); setOpen(false); }}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


export default function App() {
  const [text, setText] = useState("");
  const [person, setPerson] = useState("vucic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasAudio, setHasAudio] = useState(false);
  const [serverDown, setServerDown] = useState(false);
  const [quota, setQuota] = useState<{ remaining: number; limit: number } | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetch(`${API_BASE}/tts/health`)
      .then((r) => { if (!r.ok) setServerDown(true); })
      .catch(() => setServerDown(true));

    fetch(`${API_BASE}/tts/quota`)
      .then((r) => r.json())
      .then((d) => setQuota(d))
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, person }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.remaining !== undefined) setQuota({ remaining: 0, limit: quota?.limit ?? 10 });
        throw new Error(data.error ?? "Greška");
      }

      if (data.remaining !== undefined) setQuota({ remaining: data.remaining, limit: quota?.limit ?? 10 });

      if (audioRef.current) {
        audioRef.current.src = `data:audio/wav;base64,${data.audio_base64}`;
        audioRef.current.play();
        setHasAudio(true);
      }
    } catch (e: any) {
      setError(e.message || "Nešto je pošlo po krivu 😬");
    } finally {
      setLoading(false);
    }
  };

  const limitReached = quota?.remaining === 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col gap-4">

        {/* title */}
        <div className="flex items-baseline gap-3 flex-wrap justify-center">
          <span className="font-oswald text-3xl font-bold tracking-wide text-[#2d1e0f]">
            Reci kao
          </span>
          <VoiceDropdown value={person} onChange={setPerson} disabled={loading || serverDown} />
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
            style={{ fontFamily: 'Nunito, sans-serif' }}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 300))}
            placeholder="Unesite tekst..."
            disabled={loading || serverDown || limitReached}
            rows={4}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit();
            }}
          />
          <span
            className={`absolute bottom-3 right-4 text-xs font-bold ${text.length >= 300 ? "text-[#e03030]" : "text-[#c4b49a]"}`}
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            {text.length}/300
          </span>
        </div>

        {/* button */}
        <button
          className={`relative w-full text-white font-bold text-base rounded-xl py-3 cursor-pointer disabled:cursor-not-allowed transition-all shadow-[0_4px_12px_rgba(224,48,48,0.25)] overflow-hidden ${loading ? "bg-[#e03030]" : "bg-[#e03030] hover:bg-[#c82020] active:scale-[0.98]"}`}
          style={{ fontFamily: 'Nunito, sans-serif', opacity: (!text.trim() || serverDown || limitReached) && !loading ? 0.5 : 1 }}
          onClick={handleSubmit}
          disabled={loading || !text.trim() || serverDown || limitReached}
        >
          {loading && <span className="btn-fill" />}
          <span className="relative z-10">
            {loading ? "Generišem..." : "Generiši!"}
          </span>
        </button>

        {error && (
          <p className="text-[#e03030] text-sm font-bold text-center">{error}</p>
        )}

        {/* quota under button */}
        {quota && (
          <p
            className={`text-xs font-bold text-center -mt-2 ${quota.remaining === 0 ? "text-[#e03030]" : quota.remaining <= 3 ? "text-[#c05c00]" : "text-[#c4b49a]"}`}
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            {quota.remaining === 0
              ? "Dostigao si dnevni limit — pokušaj sutra"
              : `${quota.remaining} od ${quota.limit} zahteva preostalo danas`}
          </p>
        )}

        {/* audio */}
        <audio
          ref={audioRef}
          controls
          className="w-full rounded-lg"
          style={{ opacity: hasAudio ? 1 : 0 }}
        />
      </div>
    </div>
  );
}
