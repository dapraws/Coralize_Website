import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

const TRANSITION_DURATION = 1.1;

// Trackpad/inertial scrolling emits a long tail of wheel events from a single
// physical fling — hundreds of them, over seconds. Counting those raw events
// would chain several screen transitions per gesture and skip content entirely.
// Instead we "arm" on a quiet gap (the start of a genuinely new gesture) and
// disarm the moment a transition fires, so one gesture moves exactly one screen.
const GESTURE_GAP_MS = 160;

export function useScreenNav(screenCount: number) {
  const [screen, setScreen] = useState(0);
  const isAnimating = useRef(false);
  const armed = useRef(true);
  const lastWheelAt = useRef(0);
  const watchdog = useRef<number | undefined>(undefined);
  const trackRef = useRef<HTMLDivElement>(null);
  const screen1ScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => window.clearTimeout(watchdog.current), []);

  const goTo = useCallback(
    (target: number, opts?: { toBottom?: boolean }) => {
      if (
        isAnimating.current ||
        target === screen ||
        target < 0 ||
        target >= screenCount ||
        !trackRef.current
      ) {
        return;
      }
      isAnimating.current = true;
      armed.current = false;
      const toBottom = opts?.toBottom ?? false;

      const settle = () => {
        setScreen(target);
        isAnimating.current = false;
        if (target === 0 && screen1ScrollRef.current) {
          screen1ScrollRef.current.scrollTop = toBottom
            ? screen1ScrollRef.current.scrollHeight
            : 0;
        }
      };

      const tween = gsap.to(trackRef.current, {
        y: `${-target * 100}vh`,
        duration: TRANSITION_DURATION,
        ease: "power3.inOut",
        onComplete: () => {
          window.clearTimeout(watchdog.current);
          settle();
        },
      });

      // GSAP animates off requestAnimationFrame, which the browser throttles or
      // pauses whenever the page is backgrounded or the kiosk display sleeps. If
      // that happens mid-transition, onComplete never fires and navigation would
      // stay locked for good. Timers keep running, so snap to the end instead.
      window.clearTimeout(watchdog.current);
      watchdog.current = window.setTimeout(() => {
        if (!isAnimating.current) return;
        tween.progress(1).kill();
        settle();
      }, TRANSITION_DURATION * 1000 + 1500);
    },
    [screen, screenCount],
  );

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      const quiet = now - lastWheelAt.current > GESTURE_GAP_MS;
      lastWheelAt.current = now;
      if (quiet && !isAnimating.current) armed.current = true;

      if (isAnimating.current) {
        e.preventDefault();
        return;
      }

      const delta = e.deltaY;
      if (Math.abs(delta) < 2) return;

      // Screen 1 scrolls internally; only hand off once it's parked at the
      // bottom and the visitor starts a fresh gesture from there.
      if (screen === 0) {
        const el = screen1ScrollRef.current;
        if (!el) return;
        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 4;
        if (!atBottom) {
          armed.current = false;
          return;
        }
        if (delta > 0 && armed.current) {
          e.preventDefault();
          goTo(1);
        }
        return;
      }

      e.preventDefault();
      if (!armed.current) return;
      if (delta > 0) {
        goTo(screen + 1);
      } else {
        goTo(screen - 1, { toBottom: screen - 1 === 0 });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [screen, goTo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isAnimating.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (screen === 0) {
          const el = screen1ScrollRef.current;
          if (el && el.scrollHeight - el.scrollTop - el.clientHeight > 4) return;
          goTo(1);
        } else {
          goTo(screen + 1);
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (screen > 0) goTo(screen - 1, { toBottom: screen - 1 === 0 });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [screen, goTo]);

  return { screen, goTo, trackRef, screen1ScrollRef };
}
