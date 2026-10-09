import { useEffect, useState } from "react";

/**
 * Cycles a highlight through `count` items while a slide is on screen, so the
 * exhibition version walks a visitor through each item on its own rather than
 * presenting a static grid. Returns -1 when inactive.
 */
export function useSpotlight(count: number, active: boolean, intervalMs = 1700) {
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    if (!active || count <= 0) {
      setIndex(-1);
      return;
    }

    // Small lead-in so the slide's own entrance animation lands first.
    const start = window.setTimeout(() => setIndex(0), 700);
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, intervalMs);

    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer);
      setIndex(-1);
    };
  }, [count, active, intervalMs]);

  // `count` can shrink when the caller switches to a shorter list. State from
  // the previous list survives the render that follows the change (effects run
  // after paint), so clamp here — otherwise callers index past the end.
  return index >= count ? count - 1 : index;
}
