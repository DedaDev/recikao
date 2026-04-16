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
        className="font-oswald text-3xl font-bold tracking-wide text-[#e03030] border-b-2 border-[#e03030] bg-transparent cursor-pointer disabled:opacity-50 flex items-center gap-1 outline-none"
      >
        {selected?.name ?? "…"}
        <span className="text-lg" style={{ lineHeight: 1 }}>{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 bg-white border-2 border-[#e0d4c0] rounded-xl overflow-hidden shadow-lg z-10 w-52">
          {voices.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => { onChange(v.id); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 font-oswald text-lg tracking-wide cursor-pointer transition-colors
                ${v.id === value ? "bg-[#fff0f0] text-[#e03030]" : "text-[#2d1e0f] hover:bg-[#fdf8f0]"}`}
            >
              {v.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
