import { useState, useEffect } from "react";
import { VOICES } from "./data";

export function HeroSection() {
  const [voiceIdx, setVoiceIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setVoiceIdx(i => (i + 1) % VOICES.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="px-6 md:px-14 pt-12 pb-16 md:pt-16 md:pb-24 max-w-screen-xl mx-auto">

      <div className="fade-up d2 hero-headline flex items-center gap-[0.25em] font-oswald uppercase tracking-[-0.02em] leading-none">
        <span className="text-text-primary whitespace-nowrap shrink-0">Reci kao</span>

        <div className="h-[3em] overflow-hidden relative shrink-0">
          <div className="absolute top-0 inset-x-0 h-[0.8em] bg-gradient-to-b from-surface to-transparent z-2 pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-[0.8em] bg-gradient-to-t from-surface to-transparent z-2 pointer-events-none" />

          <div
            className="odometer-list"
            style={{ transform: `translateY(calc(${1 - voiceIdx} * 1em))` }}
          >
            {['.xyz', ...VOICES].map((voice, i) => {
              const dist = Math.abs(i - voiceIdx);
              return (
                <div
                  key={voice}
                  className="odometer-item h-[1em] flex items-center text-text-voice whitespace-nowrap origin-left"
                  style={{
                    opacity: dist === 0 ? 1 : dist === 1 ? 0.25 : 0,
                    transform: `scale(${dist === 0 ? 1 : 0.68})`,
                  }}
                >
                  {voice}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="fade-up d3 mt-10 text-base md:text-lg leading-relaxed max-w-xl text-text-muted">
          Upiši tekst na srpskom i čuj ga u glasu poznatih ličnosti!
      </p>

      <div className="fade-up d4 mt-10 flex items-center gap-5 flex-wrap">
        <a
          href="/app"
          className="font-oswald text-sm tracking-[0.15em] uppercase text-white bg-brand px-9 py-3.5 rounded-lg no-underline inline-block transition-all hover:bg-brand-hover hover:-translate-y-px"
        >
          Probaj odmah →
        </a>
        <span className="text-xs font-nunito text-text-ghost">
          Besplatno · 10 generisanja dnevno
        </span>
      </div>
    </section>
  );
}
