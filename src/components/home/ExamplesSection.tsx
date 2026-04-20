import { useState, useEffect, useRef } from "react";
import AudioMotionAnalyzer from "audiomotion-analyzer";
import { EXAMPLES } from "./data";

function Visualizer({
  isPlaying,
  source,
  audioCtx,
}: {
  isPlaying: boolean;
  source: MediaElementAudioSourceNode | null;
  audioCtx: AudioContext | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying || !source || !audioCtx || !containerRef.current) return;

    const motion = new AudioMotionAnalyzer(containerRef.current, {
      audioCtx,
      connectSpeakers: true,
      mode: 10,
      fillAlpha: 0.2,
      lineWidth: 1.5,
      bgAlpha: 0,
      overlay: true,
      showScaleX: false,
      showScaleY: false,
      showPeaks: false,
      smoothing: 0.78,
      minDecibels: -95,
      maxDecibels: -30,
      minFreq: 60,
      maxFreq: 8000,
    });

    motion.registerGradient("recikao", {
      bgColor: "transparent",
      colorStops: [
        { pos: 0, color: "rgba(109,40,217,0.7)" },
        { pos: 0.5, color: "#7c3aed" },
        { pos: 1, color: "#c4b5fd" },
      ],
    });
    motion.gradient = "recikao";
    motion.connectInput(source);

    return () => {
      motion.disconnectInput(source);
      motion.destroy();
    };
  }, [isPlaying, source, audioCtx]);

  return (
    <div className="flex-1 flex items-center" style={{ height: "44px" }}>
      {isPlaying ? (
        <div ref={containerRef} className="w-full h-full" style={{ position: "relative" }} />
      ) : (
        <div
          className="w-full"
          style={{
            height: "1px",
            background: "repeating-linear-gradient(to right, rgba(124,58,237,0.35) 0, rgba(124,58,237,0.35) 4px, transparent 4px, transparent 12px)",
          }}
        />
      )}
    </div>
  );
}

function PlayerStrip({
  isPlaying,
  source,
  audioCtx,
  onToggle,
}: {
  isPlaying: boolean;
  source: MediaElementAudioSourceNode | null;
  audioCtx: AudioContext | null;
  onToggle: () => void;
}) {
  return (
    <div className="pt-3 border-t border-white/5 flex items-center gap-3">
      <button
        onClick={onToggle}
        aria-label={isPlaying ? "Pauziraj" : "Čuj primer"}
        className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          background: isPlaying ? "#7c3aed" : "rgba(124,58,237,0.15)",
          border: isPlaying ? "none" : "1.5px solid rgba(124,58,237,0.4)",
          boxShadow: isPlaying ? "0 0 18px rgba(124,58,237,0.6)" : "none",
        }}
      >
        {isPlaying ? (
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
      <Visualizer isPlaying={isPlaying} source={source} audioCtx={audioCtx} />
    </div>
  );
}

export function ExamplesSection() {
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    const cards = document.querySelectorAll(".example-card");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.15 }
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  function stop() {
    audioRef.current?.pause();
    setPlaying(null);
  }

  function togglePlay(example: typeof EXAMPLES[number]) {
    if (playing === example.id) { stop(); return; }
    audioRef.current?.pause();

    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    const actx = audioCtxRef.current;
    if (actx.state === "suspended") actx.resume();

    const audio = new Audio(example.src);
    const source = actx.createMediaElementSource(audio);
    sourceRef.current = source;

    audio.onended = () => setPlaying(null);
    audio.play().catch(() => {});
    audioRef.current = audio;
    setPlaying(example.id);
  }

  return (
    <section className="px-6 md:px-14 py-14 md:py-22 max-w-screen-xl mx-auto">
      <div className="flex flex-col gap-8">
        {EXAMPLES.map((example, i) => {
          const isPlaying = playing === example.id;
          const isOdd = i % 2 !== 0;
          return (
            <div
              key={example.id}
              className={`example-card ${isOdd ? "from-right md:ml-auto" : "from-left md:mr-auto"} w-full md:w-[58%] flex flex-col bg-surface-raised border border-border-card rounded-2xl p-5 gap-4 hover:border-brand/40 transition-colors duration-300`}
            >
              <h3 className="font-oswald text-xl md:text-2xl uppercase leading-tight text-text-primary">
                {example.tag}
              </h3>

              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                  <img
                    src={example.img}
                    alt={example.voice}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-oswald text-[10px] tracking-[0.2em] uppercase text-brand/70">
                    {example.voice}
                  </span>
                  <p className="font-nunito text-sm text-text-voice leading-relaxed">
                    "{example.text}"
                  </p>
                </div>
              </div>

              <PlayerStrip
                isPlaying={isPlaying}
                source={isPlaying ? sourceRef.current : null}
                audioCtx={audioCtxRef.current}
                onToggle={() => togglePlay(example)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
