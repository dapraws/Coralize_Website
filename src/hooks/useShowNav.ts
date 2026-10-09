import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Stops per top-level screen. Screen 1 is a 6-slide deck; the encyclopedia
 * gets one stop per specimen so the unattended show walks all three on its
 * own rather than parking on Acropora.
 */
export const SLIDE_COUNTS = [6, 3, 1] as const;
export const SCREEN_HASHES = ["app", "encyclopedia", "biorock"] as const;

/**
 * How long each stop holds, per screen. The Encyclopedia gets far longer than
 * the others because each specimen cycles its own variants at 10s apiece —
 * a 14s stop would cut Acropora off after the first of its three views.
 */
const AUTOPLAY_MS = [14000, 31000, 17000] as const;
/** The 28.4s product film gets enough room to finish before Tour advances. */
const APP_VIDEO_SLIDE = 1;
const APP_VIDEO_HOLD_MS = 30000;

function holdFor({ screen, slide }: Stop) {
  if (screen === 0 && slide === APP_VIDEO_SLIDE) return APP_VIDEO_HOLD_MS;
  return AUTOPLAY_MS[screen] ?? AUTOPLAY_MS[0];
}
/** Quiet time after a visitor touches anything before the show takes over. */
const IDLE_RESUME_MS = 45000;
/** Trackpad flings emit hundreds of wheel events; arm on a quiet gap instead. */
const GESTURE_GAP_MS = 160;
const CURSOR_IDLE_MS = 4000;

export type Stop = { screen: number; slide: number };

/**
 * How the show runs itself.
 *  - "paused": nothing advances; the visitor drives (the default, so someone
 *    walking up is never fighting the deck for control)
 *  - "page":   loops within the current screen, never changes page
 *  - "all":    tours every screen end to end
 */
export type PlayMode = "paused" | "page" | "all";
export const PLAY_MODES: PlayMode[] = ["paused", "page", "all"];

/** Mirrors `MOBILE_BREAKPOINT` in useIsMobile — kept as a plain check so the
 *  event handlers can ask without subscribing to a media query. */
function isSmallScreen() {
  return window.matchMedia("(max-width: 899px)").matches;
}

function hashToScreen(): number {
  const h = window.location.hash.replace("#", "");
  const i = SCREEN_HASHES.indexOf(h as (typeof SCREEN_HASHES)[number]);
  return i >= 0 ? i : 0;
}

export function useShowNav() {
  const [stop, setStop] = useState<Stop>(() => ({
    screen: hashToScreen(),
    slide: 0,
  }));
  const [mode, setMode] = useState<PlayMode>("paused");
  // Drives the progress ring; separate from `stop` so a re-render of the ring
  // doesn't re-trigger the transition effects.
  const [tick, setTick] = useState(0);

  const stopRef = useRef(stop);
  stopRef.current = stop;

  const busy = useRef(false);
  const armed = useRef(true);
  const lastWheelAt = useRef(0);
  const lastInteraction = useRef(Date.now());
  const lastAdvance = useRef(Date.now());
  const modeRef = useRef(mode);
  modeRef.current = mode;
  /** The last play mode a person deliberately picked, restored after idle. */
  const preferredMode = useRef<PlayMode | null>(null);
  /** Guards the idle reset so it fires once per idle period, not every tick. */
  const resetSinceIdle = useRef(false);

  /** Set the play mode from the on-screen control. */
  const choose = useCallback((next: PlayMode) => {
    preferredMode.current = next === "paused" ? null : next;
    lastAdvance.current = Date.now();
    lastInteraction.current = Date.now();
    setMode(next);
  }, []);

  const go = useCallback((next: Stop, opts?: { fromAuto?: boolean }) => {
    const cur = stopRef.current;
    if (busy.current) return;
    if (next.screen === cur.screen && next.slide === cur.slide) return;

    busy.current = true;
    lastAdvance.current = Date.now();
    if (!opts?.fromAuto) {
      lastInteraction.current = Date.now();
      // A visitor taking the wheel stops the show until they walk away.
      setMode("paused");
    }
    setStop(next);

    // Cleared by the view once its transition finishes; this is the floor.
    window.setTimeout(() => {
      busy.current = false;
    }, next.screen !== cur.screen ? 1900 : 1400);
  }, []);

  const next = useCallback(
    (opts?: { fromAuto?: boolean }) => {
      const { screen, slide } = stopRef.current;
      if (slide < SLIDE_COUNTS[screen] - 1) {
        go({ screen, slide: slide + 1 }, opts);
      } else if (opts?.fromAuto && modeRef.current === "page") {
        // "Loop page" wraps within the current screen and never changes page,
        // so a booth can be parked on one section indefinitely.
        go({ screen, slide: 0 }, opts);
      } else if (screen < SLIDE_COUNTS.length - 1) {
        go({ screen: screen + 1, slide: 0 }, opts);
      } else {
        go({ screen: 0, slide: 0 }, opts);
      }
    },
    [go],
  );

  const prev = useCallback(() => {
    const { screen, slide } = stopRef.current;
    if (slide > 0) {
      go({ screen, slide: slide - 1 });
    } else if (screen > 0) {
      go({ screen: screen - 1, slide: SLIDE_COUNTS[screen - 1] - 1 });
    }
  }, [go]);

  const goToScreen = useCallback(
    (screen: number) => go({ screen, slide: 0 }),
    [go],
  );

  /** Jump to a specific stop within the current screen (e.g. a specimen). */
  const goToSlide = useCallback(
    (slide: number) => go({ screen: stopRef.current.screen, slide }),
    [go],
  );

  /** Called by views when their transition animation lands. */
  const settle = useCallback(() => {
    busy.current = false;
  }, []);

  // ── Wheel: one fling = one stop ────────────────────────────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // On phones the site is an ordinary scrolling page — hijacking the
      // wheel/scroll there would make it impossible to read.
      if (isSmallScreen()) return;
      e.preventDefault();
      const now = Date.now();
      const quiet = now - lastWheelAt.current > GESTURE_GAP_MS;
      lastWheelAt.current = now;
      if (quiet && !busy.current) armed.current = true;

      if (busy.current || !armed.current) return;
      if (Math.abs(e.deltaY) < 2) return;

      armed.current = false;
      if (e.deltaY > 0) next();
      else prev();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  // ── Keyboard ───────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // "F" toggles fullscreen — the booth runs edge-to-edge on the Studio
      // Display, and this avoids hunting for a browser menu on the day.
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        if (document.fullscreenElement) {
          void document.exitFullscreen().catch(() => {});
        } else {
          void document.documentElement.requestFullscreen().catch(() => {});
        }
        return;
      }
      if (isSmallScreen()) return;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        next();
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // ── Interaction tracking, idle reset, cursor hiding ────────────────
  useEffect(() => {
    let cursorHidden = false;
    const wake = () => {
      lastInteraction.current = Date.now();
      resetSinceIdle.current = false;
      if (cursorHidden) {
        document.body.classList.remove("cursor-idle");
        cursorHidden = false;
      }
    };
    const events = ["mousemove", "mousedown", "keydown", "wheel", "touchstart"];
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }));

    const timer = window.setInterval(() => {
      const idleFor = Date.now() - lastInteraction.current;

      if (!cursorHidden && idleFor > CURSOR_IDLE_MS) {
        document.body.classList.add("cursor-idle");
        cursorHidden = true;
      }

      // The idle reset returns the deck to the hero for the next visitor, and
      // restores whichever play mode was last chosen.
      //
      // It only applies when someone HAS chosen a play mode. In Manual the
      // deck must never move on its own — a reset firing here was the last
      // thing still behaving like autoplay after 45s of not touching anything.
      if (
        preferredMode.current &&
        idleFor > IDLE_RESUME_MS &&
        !resetSinceIdle.current
      ) {
        resetSinceIdle.current = true;
        setMode(preferredMode.current);
        lastAdvance.current = Date.now();
        const cur = stopRef.current;
        if (cur.screen !== 0 || cur.slide !== 0) {
          go({ screen: 0, slide: 0 }, { fromAuto: true });
        }
      }
    }, 700);

    return () => {
      events.forEach((e) => window.removeEventListener(e, wake));
      window.clearInterval(timer);
      document.body.classList.remove("cursor-idle");
    };
  }, [go]);

  // ── Autoplay ───────────────────────────────────────────────────────
  useEffect(() => {
    // setInterval, not rAF: the kiosk display can sleep or the tab can be
    // backgrounded, which pauses rAF entirely and would stall the show.
    const timer = window.setInterval(() => {
      setTick((t) => t + 1);
      // The mobile layout has no deck to advance.
      if (isSmallScreen()) return;
      if (modeRef.current === "paused" || busy.current) return;
      const { screen } = stopRef.current;
      const hold = holdFor(stopRef.current);
      if (Date.now() - lastAdvance.current < hold) return;

      // In "loop page" a single-slide screen has nothing to cycle to. Re-arm
      // the timer instead of calling next(), which would no-op every tick.
      if (modeRef.current === "page" && SLIDE_COUNTS[screen] <= 1) {
        lastAdvance.current = Date.now();
        return;
      }
      next({ fromAuto: true });
    }, 250);
    return () => window.clearInterval(timer);
  }, [next]);

  // ── Deep links ─────────────────────────────────────────────────────
  useEffect(() => {
    const target = `#${SCREEN_HASHES[stop.screen]}`;
    if (window.location.hash !== target) {
      window.history.replaceState(null, "", target);
    }
  }, [stop.screen]);

  useEffect(() => {
    const onHash = () => {
      const s = hashToScreen();
      if (s !== stopRef.current.screen) go({ screen: s, slide: 0 });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [go]);

  const hold = holdFor(stop);
  const elapsed = Math.min(1, (Date.now() - lastAdvance.current) / hold);

  return {
    stop,
    mode,
    choose,
    progress: mode === "paused" ? 0 : elapsed,
    tick,
    next,
    prev,
    goToScreen,
    goToSlide,
    settle,
  };
}
