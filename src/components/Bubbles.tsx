import { useMemo } from "react";

type Bubble = {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
};

/** Soft glassy bubbles, matching the ones in the app render. */
export function Bubbles({ count = 18 }: { count?: number }) {
  const bubbles = useMemo<Bubble[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 37) % 100,
        top: (i * 61) % 100,
        size: 8 + ((i * 13) % 34),
        duration: 11 + ((i * 7) % 12),
        delay: -((i * 5) % 18),
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${b.left}%`,
            top: `${b.top}%`,
            width: b.size,
            height: b.size,
            background:
              "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95), rgba(182,250,254,0.5) 42%, rgba(0,48,192,0.10) 72%, rgba(0,48,192,0.03))",
            border: "1px solid rgba(255,255,255,0.6)",
            boxShadow: "0 4px 14px -6px rgba(3,44,143,0.35)",
            animation: `float-up ${b.duration}s ease-in-out ${b.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes float-up {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.35; }
          50% { transform: translateY(-30px) translateX(12px); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}
