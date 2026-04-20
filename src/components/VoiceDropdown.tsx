import { useState, useEffect, useRef } from "react";
import type { Person } from "../hooks/usePersons";

interface Props {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  voices: Person[];
}

export function VoiceDropdown({ value, onChange, disabled, voices }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = voices.find((v) => v.id === value);

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
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className="font-oswald text-xl md:text-3xl uppercase tracking-wide text-text-voice border-b-2 border-text-voice/40 bg-transparent cursor-pointer disabled:opacity-40 flex items-center gap-1 outline-none transition-colors hover:text-text-primary hover:border-text-primary/40 whitespace-nowrap"
      >
        {selected?.name ?? "…"}
        <span className="text-lg leading-none">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 bg-surface-raised border border-border-card rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 w-56">
          {voices.map((v) => {
            const isSelected = v.id === value;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => { onChange(v.id); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 font-oswald text-lg tracking-wide uppercase cursor-pointer transition-colors ${isSelected ? "bg-brand/10 text-brand" : "text-text-primary hover:bg-white/5"}`}
              >
                {v.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
