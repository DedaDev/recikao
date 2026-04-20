import { TICKER } from "./data";

export function TickerSection() {
  return (
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
  );
}
