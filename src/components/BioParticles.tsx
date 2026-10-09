import { useMemo } from "react";

type Dot = {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
};

export function BioParticles({ count = 28 }: { count?: number }) {
  const dots = useMemo<Dot[]>(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 5,
        duration: 8 + Math.random() * 10,
        delay: Math.random() * -18,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-bio-cyan"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            filter: "blur(1px)",
            opacity: 0.35,
            boxShadow: "0 0 8px 2px rgba(182,250,254,0.55)",
            animation: `drift ${d.duration}s ease-in-out ${d.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes drift {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50% { transform: translateY(-24px) translateX(10px); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
