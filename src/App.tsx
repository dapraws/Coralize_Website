import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { Loader } from "@react-three/drei";
import { useShowNav } from "./hooks/useShowNav";
import { useIsMobile } from "./hooks/useIsMobile";
import { NavBar } from "./components/NavBar";
import { SweepTransition } from "./components/SweepTransition";
import { ShowErrorBoundary } from "./components/ShowErrorBoundary";
import { ScreenApp } from "./components/ScreenApp";
// Lazy: these two own all the three.js/drei weight, and neither is on screen
// when the hero paints. The chunk is prefetched right after paint (below), so
// the kiosk still never stalls on a screen change.
const ScreenEncyclopedia = lazy(() =>
  import("./components/ScreenEncyclopedia").then((m) => ({
    default: m.ScreenEncyclopedia,
  })),
);
const ScreenBiorock = lazy(() =>
  import("./components/ScreenBiorock").then((m) => ({
    default: m.ScreenBiorock,
  })),
);

// Model warm-up, in the order the show reaches them.
//
// These used to fire at module scope, all seven at once, before the hero had
// painted — 23MB (one is 18MB of polyp geometry) racing the hero's own images
// for bandwidth, which is what made first load feel broken. The kiosk still
// needs them warm: a stall on first view of a specimen reads as a dead
// exhibit. So warm them AFTER first paint, one at a time, so the hero always
// wins the network.
const MODELS = [
  "/models/coral.glb",
  "/models/coral_with_drupella.glb",
  "/models/drupella.glb",
  "/models/polyp_normal.glb",
  "/models/polyp_sliced.glb",
  "/models/biorock-structure.glb",
  "/models/coral_with_polyps.glb", // 18MB — last, it is needed last.
];

function useWarmModels() {
  useEffect(() => {
    const ac = new AbortController();
    // A beat after paint, so the hero's own images win the network first.
    const timer = window.setTimeout(async () => {
      // Pull the 3D chunk down first — it is small next to the models and is
      // what screen 2 needs before it can render anything at all.
      void import("./components/ScreenEncyclopedia");
      for (const m of MODELS) {
        // `fetch`, not useGLTF.preload: preload is fire-and-forget (it returns
        // void), so awaiting it would NOT serialize anything — all seven would
        // still go out at once. Warming the HTTP cache instead means each
        // model downloads in turn, and useGLTF later reads it from cache with
        // no network hit. It also keeps them out of GPU memory until used.
        await fetch(m, { signal: ac.signal, cache: "force-cache" }).catch(
          () => {},
        );
      }
    }, 1200);
    return () => {
      ac.abort();
      window.clearTimeout(timer);
    };
  }, []);
}

export default function App() {
  const { stop, mode, choose, progress, goToScreen, goToSlide, settle } =
    useShowNav();
  const mobile = useIsMobile();
  useWarmModels();
  // Nothing may cycle on its own in Manual — not the slides, and not the
  // per-slide spotlights or the Encyclopedia's variant carousel either.
  const autoCycle = mode !== "paused" && !mobile;

  // What's actually painted. Lags `stop.screen` until the sweep covers the
  // viewport, so the swap is never visible.
  const [shown, setShown] = useState(stop.screen);
  const handleSwap = useCallback((next: number) => setShown(next), []);

  // On a phone the whole site is one scrolling document: every section is
  // present, in order, and the visitor scrolls it like any other page.
  if (mobile) {
    return (
      <div className="grain min-h-screen w-full overflow-x-hidden bg-paper">
        <ShowErrorBoundary onRecover={() => goToScreen(0)}>
        <Suspense fallback={null}>
          <Suspense fallback={null}>
          {/* Anchors for the mobile navbar, offset so the fixed bar doesn't
              cover a section's heading when you jump to it. */}
          <div id="app" style={{ scrollMarginTop: 64 }}>
            <ScreenApp
              slide={0}
              visible
              mobile
              autoCycle={false}
              onSettled={settle}
              onTryIt={() =>
                document
                  .getElementById("tryit")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            />
          </div>
          <div id="encyclopedia" style={{ scrollMarginTop: 64 }}>
            <ScreenEncyclopedia
              specimen={stop.slide}
              active
              mobile
              autoCycle={false}
              onSelectSpecimen={goToSlide}
            />
          </div>
          <div id="biorock" style={{ scrollMarginTop: 64 }}>
            <ScreenBiorock active mobile />
          </div>
          </Suspense>
          </Suspense>
      </ShowErrorBoundary>

        <NavBar
          screen={stop.screen}
          slide={stop.slide}
          progress={progress}
          mode={mode}
          mobile
          onSelect={goToScreen}
          onChooseMode={choose}
        />

        <Loader
          containerStyles={{ background: "#F2F6FF" }}
          innerStyles={{ background: "rgba(0,48,192,0.10)", width: "60vw" }}
          barStyles={{ background: "#0030C0" }}
          dataStyles={{
            fontFamily: "JetBrains Mono, monospace",
            color: "#0C1848",
            fontSize: "10px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
          dataInterpolation={(p) => `Surfacing coral data — ${p.toFixed(0)}%`}
        />
      </div>
    );
  }

  return (
    <div className="grain fixed inset-0 overflow-hidden bg-paper">
      <ShowErrorBoundary onRecover={() => goToScreen(0)}>
        <Suspense fallback={null}>
        {shown === 0 && (
          <ScreenApp
            slide={stop.slide}
            visible={stop.screen === 0}
            mobile={false}
            autoCycle={autoCycle}
            onSettled={settle}
            onTryIt={() => goToSlide(4)}
          />
        )}
        {shown === 1 && (
          <ScreenEncyclopedia
            specimen={stop.slide}
            active={stop.screen === 1}
            mobile={false}
            autoCycle={autoCycle}
            onSelectSpecimen={goToSlide}
          />
        )}
        {shown === 2 && <ScreenBiorock active={stop.screen === 2} mobile={false} />}
        </Suspense>
      </ShowErrorBoundary>

      <SweepTransition screen={stop.screen} onSwap={handleSwap} />

      <NavBar
        screen={stop.screen}
        slide={stop.slide}
        progress={progress}
        mode={mode}
        mobile={false}
        onSelect={goToScreen}
        onChooseMode={choose}
      />

      <Loader
        containerStyles={{ background: "#F2F6FF" }}
        innerStyles={{ background: "rgba(0,48,192,0.10)", width: "260px" }}
        barStyles={{ background: "#0030C0" }}
        dataStyles={{
          fontFamily: "JetBrains Mono, monospace",
          color: "#0C1848",
          fontSize: "10px",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
        }}
        dataInterpolation={(p) => `Surfacing coral data — ${p.toFixed(0)}%`}
      />
    </div>
  );
}
