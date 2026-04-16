import { useEffect, useState } from "react";

interface Props {
  tips: string[];
  intervalMs?: number;
}

export function TipsBanner({ tips, intervalMs = 7000 }: Props) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % tips.length);
        setVisible(true);
      }, 400);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [tips.length, intervalMs]);

  return (
    <div className="flex items-center gap-2 bg-[#fdf8f2] border border-[#e0d4c0] rounded-xl px-3 h-10 overflow-hidden">
      <span className="text-sm">💡</span>
      <p
        className="text-xs font-semibold text-[#7a6a58] transition-opacity duration-400"
        style={{ fontFamily: "Nunito, sans-serif", opacity: visible ? 1 : 0 }}
      >
        {tips[index]}
      </p>
    </div>
  );
}
