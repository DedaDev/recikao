import { useState, useEffect, useRef } from "react";
import { API_BASE } from "../lib/api";

const VOICES = [
  '.xyz',
  "Vučić", "Zmaj od Šipova", "Brnabić",
  "Desingerica", "Aca Lukas", "Jovanka Jolić", "Jovana Jeremić",
];

const TICKER = [...VOICES, ...VOICES, ...VOICES];

const EXAMPLES = [
  {
    id: "prank1",
    tag: "Prevari prijatelje",
    voice: "Aleksandar Vučić",
    img: "/vucic.png",
    text: "Pero Periću, želim ti srećan rođendan, tvoj predsednik Aleksandar Vučić.",
    src: "/examples/prank.wav",
  },
  {
    id: "prank2",
    tag: "Prevari prijatelje",
    voice: "Jovana Jeremić",
    img: "/jovana.png",
    text: "Ja sam jaka žena i treba mi jak muškarac, kao što je Marko Marković iz Beograda.",
    src: "/examples/prank2.wav",
  },
  {
    id: "prank3",
    tag: "Prevari prijatelje",
    voice: "Jovanka Jolić",
    img: "/jovanka.png",
    text: "Ja se iskreno nadam da će ekipa iz bloka 65 uspeti da vrate egipat koji nam je otet.",
    src: "/examples/prank3.wav",
  },
  {
    id: "stream",
    tag: "Stream donacije",
    voice: "Aleksandar Vučić",
    img: "/vucic.png",
    text: "Marko je donirao 10e i kaže: pooozdraaav!",
    src: "/examples/stream.wav",
  },
];

export default function HomePage() {
  const [voiceIdx, setVoiceIdx] = useState(0);
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setVoiceIdx(i => (i + 1) % VOICES.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll('.example-card');
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.15 }
    );
    cards.forEach(c => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  function togglePlay(example: typeof EXAMPLES[number]) {
    if (playing === example.id) {
      audioRef.current?.pause();
      setPlaying(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(example.src);
    audio.onended = () => setPlaying(null);
    audio.play();
    audioRef.current = audio;
    setPlaying(example.id);
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        .odometer-list { transition: transform 0.5s cubic-bezier(0.23,1,0.32,1); }
        .odometer-item { transition: opacity 0.4s, transform 0.4s; }
        .fade-up  { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
        .d2 { animation-delay: 0.2s; }
        .d3 { animation-delay: 0.34s; }
        .d4 { animation-delay: 0.48s; }
        .ticker-track { animation: ticker 30s linear infinite; display: flex; width: max-content; }
        .pulse-ring { animation: pulse-ring 1.2s ease-out infinite; }
        .example-card { opacity: 0; transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1); }
        .example-card.from-left  { transform: translateX(-48px); }
        .example-card.from-right { transform: translateX(48px); }
        .example-card.visible    { opacity: 1 !important; transform: translateX(0) !important; }
      `}</style>

      <div className="min-h-screen bg-surface text-text-primary font-nunito">

        {/* ── Navbar ── */}
        <nav className="sticky top-0 z-50 border-b border-border backdrop-blur-md bg-surface/85">
          <div className="max-w-screen-xl mx-auto px-6 md:px-14 py-4 flex items-center justify-between">
            <a href="/" className="font-oswald text-xl tracking-[0.12em] uppercase no-underline text-text-primary">
              RECI<span className="text-brand ml-[0.15em]">KAO</span>
            </a>

            <div className="flex items-center gap-3">
              <a
                href={`${API_BASE}/auth/google`}
                className="font-nunito font-bold text-sm flex items-center gap-2 text-text-voice bg-brand/12 border border-brand/25 px-[18px] py-2 rounded-lg no-underline transition-colors hover:bg-brand-hover"
              >
                <GoogleIcon />
                Prijavi se
              </a>
              <a
                href="/app"
                className="font-oswald text-xs tracking-[0.18em] uppercase text-white bg-brand px-5 py-[9px] rounded-lg no-underline transition-all hover:bg-brand-hover hover:-translate-y-px"
              >
                Probaj →
              </a>
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="px-6 md:px-14 pt-12 pb-16 md:pt-16 md:pb-24 max-w-screen-xl mx-auto">

          {/* Headline + odometer */}
          <div
            className="fade-up d2 flex items-center gap-[0.25em] font-oswald uppercase tracking-[-0.02em] leading-none"
            style={{ fontSize: "clamp(36px, 6.5vw, 96px)" }}
          >
            <span className="text-text-primary whitespace-nowrap shrink-0">Reci kao</span>

            {/* Vertical odometer */}
            <div className="h-[3em] overflow-hidden relative shrink-0">
              <div className="absolute top-0 inset-x-0 h-[0.8em] bg-gradient-to-b from-surface to-transparent z-2 pointer-events-none" />
              <div className="absolute bottom-0 inset-x-0 h-[0.8em] bg-gradient-to-t from-surface to-transparent z-2 pointer-events-none" />

              <div
                className="odometer-list"
                style={{ transform: `translateY(calc(${1 - voiceIdx} * 1em))` }}
              >
                {VOICES.map((voice, i) => {
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
            Ukucaj bilo koji tekst i čuj ga u glasu javnih ličnosti.
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

        {/* ── Ticker ── */}
        <div className="border-y border-border overflow-hidden py-3 bg-surface-ticker">
          <div className="ticker-track">
            {TICKER.map((name, i) => (
              <span key={i} className="flex items-center">
                <span className="font-oswald text-sm tracking-[0.22em] uppercase whitespace-nowrap px-8 text-text-ticker">
                  {name}
                </span>
                <span className="text-footer-text text-[8px]">◆</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── Examples ── */}
        <section className="px-6 md:px-14 py-24 md:py-32 max-w-screen-xl mx-auto">
          <p className="font-oswald text-xs tracking-[0.4em] uppercase mb-16 text-brand">
            Primeri upotrebe
          </p>

          <div className="flex flex-col gap-6">
            {EXAMPLES.map((example, i) => {
              const isPlaying = playing === example.id;
              const isRight = i % 2 !== 0;
              return (
                <div
                  key={example.id}
                  className={`example-card ${isRight ? 'from-right ml-auto' : 'from-left mr-auto'} w-full md:w-[75%] bg-surface-raised border border-border-card rounded-2xl p-6 md:p-8 transition-colors hover:border-brand/30`}
                >
                  {/* Tag pill */}
                  <span className="inline-block font-oswald text-[10px] tracking-[0.25em] uppercase text-brand border border-brand/30 rounded-full px-3 py-1 mb-5">
                    {example.tag}
                  </span>

                  <div className={`flex items-center gap-5 md:gap-8 ${isRight ? 'flex-row-reverse' : ''}`}>
                    {/* Photo */}
                    <div className="shrink-0 flex flex-col items-center gap-2">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-brand/30">
                        <img src={example.img} alt={example.voice} className="w-full h-full object-cover object-top" />
                      </div>
                      <span className="font-oswald text-[9px] tracking-[0.12em] uppercase text-text-faint whitespace-nowrap text-center">
                        {example.voice}
                      </span>
                    </div>

                    {/* Quote */}
                    <blockquote className="flex-1 font-nunito text-sm md:text-base font-semibold text-text-primary leading-relaxed m-0">
                      "{example.text}"
                    </blockquote>

                    {/* Play */}
                    <button
                      onClick={() => togglePlay(example)}
                      className="shrink-0 relative flex items-center justify-center w-12 h-12 rounded-full bg-brand text-white transition-all hover:bg-brand-hover active:scale-95 cursor-pointer"
                      aria-label={isPlaying ? "Pauziraj" : "Pusti"}
                    >
                      {isPlaying && <span className="pulse-ring absolute inset-0 rounded-full bg-brand" />}
                      <span className="relative z-10">{isPlaying ? <PauseIcon /> : <PlayIcon />}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Voices ── */}
        <section className="border-t border-border px-6 md:px-14 py-24 md:py-32">
          <div className="max-w-screen-xl mx-auto">
            <p className="font-oswald text-xs tracking-[0.4em] uppercase mb-12 text-brand">
              Dostupni glasovi
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-4">
              {VOICES.map(voice => (
                <div key={voice} className="flex items-center gap-3">
                  <div className="w-[3px] h-[3px] rounded-full bg-brand shrink-0" />
                  <span className="font-oswald text-base tracking-[0.06em] uppercase text-text-voice-list">
                    {voice}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="px-6 md:px-14 py-16 md:py-20 bg-gradient-to-br from-[#2e1065] to-[#4c1d95]">
          <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h2 className="font-oswald text-3xl md:text-4xl uppercase text-white tracking-[-0.01em]">
                Spreman da počneš?
              </h2>
              <p className="mt-2 text-sm font-nunito text-white/45">
                Besplatno, bez instalacije. Prijavi se i kreni.
              </p>
            </div>
            <a
              href="/app"
              className="font-oswald text-sm tracking-[0.15em] uppercase shrink-0 text-text-voice bg-surface px-8 py-3.5 rounded-lg no-underline inline-block transition-colors hover:bg-[#1a1430]"
            >
              Probaj odmah →
            </a>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-border px-6 md:px-14 py-5">
          <div className="max-w-screen-xl mx-auto flex items-center justify-between">
            <span className="font-oswald text-sm tracking-[0.12em] uppercase text-footer-text">
              RECI<span className="text-brand ml-[0.15em]">KAO</span>
            </span>
            <span className="text-xs font-nunito text-footer-sub">
              © {new Date().getFullYear()}
            </span>
          </div>
        </footer>

      </div>
    </>
  );
}


function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}
