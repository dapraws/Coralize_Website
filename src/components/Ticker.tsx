import { ticker } from "../content/copy";

/** Slow marquee of specimen codes — the field-journal chrome, in motion. */
export function Ticker() {
  const run = [...ticker, ...ticker];

  return (
    <div className="relative overflow-hidden border-y border-electric/10 bg-surface/60 py-4">
      <div
        className="flex w-max gap-10 whitespace-nowrap"
        style={{ animation: "ticker 46s linear infinite" }}
      >
        {run.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="flex items-center gap-10 font-mono text-[10px] uppercase tracking-[0.34em] text-ink/60"
          >
            {t}
            <span className="h-1 w-1 rounded-full bg-coral/60" />
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-paper to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-paper to-transparent" />
      <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
