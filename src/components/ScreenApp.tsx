import { useEffect, useRef } from "react";
import gsap from "gsap";
import { HeroSlide } from "./slides/HeroSlide";
import { StepsSlide } from "./slides/StepsSlide";
import { VideoSlide } from "./slides/VideoSlide";
import { CardsSlide } from "./slides/CardsSlide";
import { TestFlightSlide } from "./slides/TestFlightSlide";
import { AboutSlide } from "./slides/AboutSlide";

/**
 * Screen 1 is a vertical deck of full-viewport slides. Nothing scrolls on the
 * kiosk — the track is transformed, so every slide lands exactly on the
 * display bounds. On mobile the track is inert and the slides simply stack
 * into a normal scrolling page (see `Slide`).
 */
export function ScreenApp({
  slide,
  visible,
  mobile,
  autoCycle,
  onSettled,
  onTryIt,
}: {
  slide: number;
  visible: boolean;
  mobile: boolean;
  autoCycle: boolean;
  onSettled: () => void;
  onTryIt: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (mobile) {
      // Never transform the track on a phone; the page scrolls instead.
      gsap.set(track, { y: 0 });
      onSettled();
      return;
    }

    if (first.current) {
      first.current = false;
      gsap.set(track, { y: `${-slide * 100}vh` });
      onSettled();
      return;
    }

    const tween = gsap.to(track, {
      y: `${-slide * 100}vh`,
      duration: 1.35,
      ease: "power2.inOut",
      onComplete: onSettled,
    });

    // rAF pauses when the tab is hidden or the kiosk display sleeps, which
    // would leave the deck stuck mid-move and navigation locked. Timers run.
    const watchdog = window.setTimeout(() => {
      if (tween.progress() < 1) {
        tween.progress(1).kill();
        onSettled();
      }
    }, 3000);

    return () => {
      window.clearTimeout(watchdog);
      tween.kill();
    };
  }, [slide, mobile, onSettled]);

  return (
    <div className="w-full md:h-screen md:w-screen md:overflow-hidden md:bg-paper">
      <div ref={trackRef} className="md:will-change-transform">
        <HeroSlide active={mobile || (visible && slide === 0)} mobile={mobile} onTryIt={onTryIt} />
        <VideoSlide
          active={mobile || (visible && slide === 1)}
          autoCycle={autoCycle}
          mobile={mobile}
        />
        <StepsSlide
          active={mobile || (visible && slide === 2)}
          autoCycle={autoCycle}
        />
        <CardsSlide
          active={mobile || (visible && slide === 3)}
          autoCycle={autoCycle}
        />
        <div id="tryit" style={{ scrollMarginTop: 64 }}>
          <TestFlightSlide
            active={mobile || (visible && slide === 4)}
            autoCycle={autoCycle}
            mobile={mobile}
          />
        </div>
        <AboutSlide
          active={mobile || (visible && slide === 5)}
          autoCycle={autoCycle}
        />
      </div>
    </div>
  );
}
