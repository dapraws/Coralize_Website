import { useEffect, useState } from "react";

/**
 * Below this width the site stops being a kiosk slide show and becomes an
 * ordinary scrolling page. Phones can't run the fixed-viewport deck: there's
 * no wheel, heights vary wildly between devices, and content that fits a
 * 2560×1440 booth display does not fit a 390×844 phone.
 */
export const MOBILE_BREAKPOINT = 900;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
