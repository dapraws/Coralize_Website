import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";

/**
 * One full-viewport slide. When it becomes active its `[data-pop]` children
 * animate in one after another — the "pop out one by one" the show is built
 * around. Nothing here scrolls; every slide fills the display exactly.
 */
export function Slide({
  active,
  children,
  className = "",
}: {
  active: boolean;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // An outgoing slide must remain visible while the track moves it away.
  // Hiding it as soon as `active` flips made hero/video content disappear at
  // the start of the transition instead of visually exiting the viewport.
  const hasBeenActive = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>("[data-pop]");
    if (items.length === 0) return;

    // On the scrolling mobile layout every section is on the page at once, so
    // "inactive" is meaningless — hiding them would leave most of the page
    // blank. Show everything and skip the staggered entrance.
    if (window.matchMedia("(max-width: 899px)").matches) {
      hasBeenActive.current = true;
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    if (!active) {
      // Only unseen slides begin hidden. Once a slide has appeared, leave its
      // current presentation intact until it has physically moved offscreen.
      if (!hasBeenActive.current) gsap.set(items, { opacity: 0, y: 34 });
      return;
    }

    hasBeenActive.current = true;

    const tween = gsap.fromTo(
      items,
      { opacity: 0, y: 34 },
      {
        opacity: 1,
        y: 0,
        duration: 0.95,
        ease: "power3.out",
        stagger: 0.11,
        overwrite: "auto",
      },
    );

    // rAF stalls while the tab is hidden or the display sleeps; timers don't.
    const watchdog = window.setTimeout(() => {
      if (tween.progress() < 1) gsap.set(items, { opacity: 1, y: 0 });
    }, 4000);

    return () => {
      window.clearTimeout(watchdog);
      tween.kill();
      // If navigation starts during the entrance stagger, do not leave the
      // outgoing slide frozen at a half-opacity frame. Complete its visual
      // state before the track carries it out of view.
      if (active) gsap.set(items, { opacity: 1, y: 0 });
    };
  }, [active]);

  return (
    <section
      ref={ref}
      aria-hidden={!active}
      // On phones a slide is a normal block that grows with its content —
      // locking it to h-screen with overflow-hidden would silently crop copy
      // on short devices. The kiosk keeps the exact one-viewport behaviour.
      className={`relative w-full shrink-0 max-md:min-h-[100svh] max-md:py-16 md:h-screen md:w-screen md:overflow-hidden ${className}`}
    >
      {children}
    </section>
  );
}

/** Shared slide header: index rail + mono label + serif statement. */
export function SlideHead({
  index,
  label,
  title,
  accent = "electric",
  aside,
}: {
  index: string;
  label: string;
  title: ReactNode;
  accent?: "electric" | "coral";
  aside?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-5">
      <div data-pop>
        <div className="flex items-center gap-4">
          <span
            className={`font-mono text-[11px] tracking-[0.3em] ${
              accent === "coral" ? "text-coral" : "text-electric"
            }`}
          >
            {index}
          </span>
          <span className="h-px w-12 bg-ink/15" />
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-ink-soft/70">
            {label}
          </span>
        </div>
        <h2 className="display-xl mt-5 text-[clamp(2.4rem,4.6vw,4.6rem)] text-ink">
          {title}
        </h2>
      </div>
      {aside && (
        <p
          data-pop
          className="max-w-md text-[13px] leading-[1.9] text-ink-soft"
        >
          {aside}
        </p>
      )}
    </div>
  );
}
