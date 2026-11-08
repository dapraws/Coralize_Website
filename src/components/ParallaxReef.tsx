import { useEffect, useRef } from "react";
import gsap from "gsap";
import { FishSchool } from "./FishSchool";

/**
 * Vivid layered reef for the hero.
 *
 * The plates run at **full saturation, unfiltered** — the way the source art
 * looks. An earlier version washed them under a paper overlay so ink text
 * could sit on top; it drained the colour. Legibility is solved by the copy's
 * own dark scrim instead.
 *
 * Composition follows the reference art (`Media/coral-wallpaper.png`,
 * `coral-vibrant.png`): open water across the top, a distant ridge low on the
 * horizon, reef islands framing the two sides, and a clear corridor down the
 * middle where the copy sits. An earlier version stacked every piece in the
 * centre at near the same scale — the islands hid the ridge, the corners
 * overlapped each other, and with no open water there was no depth to read,
 * so the parallax felt like flat cards sliding about.
 *
 * Depth comes from three cues, not one:
 * - **scale** — far pieces are drawn smaller (the ridge, the far fish band),
 * - **occlusion** — small fish swim *behind* the islands, big ones in front,
 * - **motion** — one camera: every layer drifts in the same direction, by an
 *   amount set by its `depth`. Giving each layer its own drift phase made
 *   them slide against each other, which read as forced, not as depth.
 *
 * Placement lives in `.reef-*` classes in index.css (kiosk + phone).
 * Bleed rule: a plate whose art runs to its own edge (ridge, corners) must
 * bleed past the viewport by more than its pan range, or a hard cut slides
 * into view. The islands have natural edges and need no bleed. Never crop a
 * plate with object-cover to make it fit — enlarge it whole and bleed.
 */

type Layer = {
  key: string;
  /** Pointer response, px at full deflection. Higher = nearer the camera. */
  depth: number;
  className: string;
  src?: string;
  /** Render a swimming FishSchool band instead of a static plate. */
  fish?: "near" | "far";
};

const LAYERS: Layer[] = [
  {
    key: "ocean",
    src: "/parallax/ocean-background.webp",
    depth: 4,
    className: "inset-0 h-full w-full scale-[1.04] object-cover",
  },
  {
    key: "rays",
    src: "/parallax/light-rays.webp",
    depth: 9,
    className: "reef-rays",
  },
  { key: "ridge", src: "/parallax/coral-midground.webp", depth: 16, className: "reef-ridge" },
  { key: "fish-far", fish: "far", depth: 24, className: "reef-fish" },
  { key: "island-l", src: "/parallax/coral-reef-b.webp", depth: 34, className: "reef-island-l" },
  { key: "island-r", src: "/parallax/coral-reef-a.webp", depth: 38, className: "reef-island-r" },
  { key: "fish-near", fish: "near", depth: 56, className: "reef-fish" },
  // Foreground is two corner pieces, not one full-width plate — a single
  // plate stretched across the viewport shows its own cropped edges as hard
  // vertical cuts. `-v2`: /parallax/* is cached immutably, so a replaced
  // asset MUST get a new filename.
  {
    key: "corner-l",
    src: "/parallax/coral-foreground-a-left-v2.webp",
    depth: 80,
    className: "reef-corner-l",
  },
  {
    key: "corner-r",
    src: "/parallax/coral-foreground-a-right-v2.webp",
    depth: 86,
    className: "reef-corner-r",
  },
];

export function ParallaxReef() {
  const layerRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pointer = { x: 0, y: 0 };
    let lastMove = 0;

    const onMove = (e: MouseEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      lastMove = Date.now();
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // setInterval, not rAF — the kiosk display sleeps and rAF pauses with it.
    const t0 = Date.now();
    const timer = window.setInterval(() => {
      const idle = Date.now() - lastMove > 2500;
      const s = (Date.now() - t0) / 1000;
      // One camera for the whole scene. With nobody at the booth it sways on
      // a slow Lissajous; every layer shares it, scaled by depth.
      const cx = idle ? Math.sin(s * 0.13) * 0.7 : pointer.x;
      const cy = idle ? Math.sin(s * 0.09 + 1.2) * 0.45 : pointer.y;
      layerRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = LAYERS[i].depth;
        gsap.to(el, {
          x: -cx * d,
          y: -cy * d * 0.45,
          duration: idle ? 1.6 : 1.1,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    }, 90);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#0b3f6b]"
      // A size container: the `.reef-*` layout and FishSchool both size off it.
      style={{ containerType: "size" }}
    >
      {LAYERS.map((l, i) => {
        const ref = (el: HTMLElement | null) => {
          layerRefs.current[i] = el;
        };
        const className = `absolute will-change-transform ${l.className}`;
        return l.fish ? (
          <FishSchool key={l.key} band={l.fish} ref={ref} className={className} />
        ) : (
          <img
            key={l.key}
            ref={ref}
            src={l.src}
            alt=""
            aria-hidden="true"
            draggable={false}
            className={className}
          />
        );
      })}
    </div>
  );
}
