import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Screen-to-screen transition: three skewed panels sweep across, the view is
 * swapped behind them at the peak, then they clear. Imperative rather than
 * state-driven so the swap lands exactly at full cover.
 */
export function SweepTransition({
  screen,
  onSwap,
}: {
  screen: number;
  /** Fired when the panels fully cover the viewport — swap the view here. */
  onSwap: (screen: number) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement[]>([]);
  const first = useRef(true);
  const onSwapRef = useRef(onSwap);
  onSwapRef.current = onSwap;

  useEffect(() => {
    if (first.current) {
      first.current = false;
      onSwapRef.current(screen);
      return;
    }

    const root = rootRef.current;
    const panels = panelsRef.current.filter(Boolean);
    if (!root || panels.length === 0) {
      onSwapRef.current(screen);
      return;
    }

    gsap.set(root, { display: "block" });
    gsap.set(panels, { xPercent: -115 });

    const tl = gsap.timeline({
      onComplete: () => gsap.set(root, { display: "none" }),
    });

    tl.to(panels, {
      xPercent: 0,
      duration: 0.8,
      ease: "power2.inOut",
      stagger: 0.09,
    })
      .add(() => onSwapRef.current(screen))
      .to(panels, {
        xPercent: 115,
        duration: 0.95,
        ease: "power2.inOut",
        stagger: 0.09,
      });

    // rAF can stall (backgrounded tab / display asleep). Timers still fire, so
    // make sure the swap happens and the panels never stick over the content.
    const watchdog = window.setTimeout(() => {
      if (tl.progress() < 1) {
        tl.progress(1);
        onSwapRef.current(screen);
        gsap.set(root, { display: "none" });
      }
    }, 3600);

    return () => {
      window.clearTimeout(watchdog);
      tl.kill();
    };
  }, [screen]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 hidden overflow-hidden"
    >
      {[
        "linear-gradient(115deg, #B6FAFE 0%, #7FD8F5 100%)",
        "linear-gradient(115deg, #0030C0 0%, #032C8F 100%)",
        "linear-gradient(115deg, #F2F6FF 0%, #FFFFFF 100%)",
      ].map((bg, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) panelsRef.current[i] = el;
          }}
          className="absolute inset-y-[-14%] left-[-14%] w-[128%]"
          style={{ background: bg, transform: "skewX(-9deg)" }}
        />
      ))}
    </div>
  );
}
