import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Vivid layered reef for the hero.
 *
 * An earlier version washed these plates with a near-opaque paper overlay and
 * desaturating filters so ink-blue text would read on top. That drained the
 * colour out of them and looked bad. The plates now run at **full saturation,
 * unfiltered** — the way the source art looks — and legibility is solved the
 * other way round: the copy on this slide is white, over a dark gradient that
 * only covers the text, not the scene.
 *
 * They are also no longer blown up. Each plate sits at its natural scale with
 * only a small amount of overscan for the parallax offset; over-scaling a
 * 1672px plate across a 2560px kiosk made it soft and oversized.
 */

type Layer = {
  src: string;
  /** Pointer response, px at full deflection. Higher = nearer the camera. */
  depth: number;
  className: string;
  style?: React.CSSProperties;
};

const LAYERS: Layer[] = [
  {
    src: "/parallax/ocean-background.webp",
    depth: 5,
    className: "inset-0 h-full w-full object-cover",
  },
  {
    src: "/parallax/light-rays.webp",
    depth: 11,
    className: "inset-x-0 top-0 h-[78%] w-full object-cover",
    style: { mixBlendMode: "screen", opacity: 0.9 },
  },
  {
    src: "/parallax/coral-midground.webp",
    depth: 20,
    className: "inset-x-0 bottom-0 w-full object-contain object-bottom",
    style: { opacity: 0.85 },
  },
  {
    src: "/parallax/coral-reef-a.webp",
    depth: 34,
    className: "inset-x-0 bottom-0 w-full object-contain object-bottom",
  },
  {
    src: "/parallax/fish.webp",
    depth: 50,
    // Same treatment as the foreground corners: bleed the layer past both
    // edges so the fish that would have been sliced by the viewport sit
    // off-screen instead. The bleed exceeds this layer's own pan range.
    className: "inset-y-0 h-full object-cover",
    style: {
      opacity: 0.95,
      left: "calc(-1 * max(8%, 150px))",
      // An absolutely positioned <img> with `width: auto` resolves to its
      // intrinsic width, so left+right alone will NOT stretch it — the width
      // has to be stated explicitly.
      width: "calc(100% + 2 * max(8%, 150px))",
      maxWidth: "none",
    },
  },
  // Foreground is two corner pieces, not one full-width plate — a single
  // plate stretched across the viewport shows its own cropped edges as hard
  // vertical cuts.
  //
  // NOTE the `-v2` filenames. `public/_headers` caches /parallax/* immutably
  // for a year, so re-keying these while keeping the same name left every
  // browser that had already loaded the old cut-out stuck with it. A replaced
  // asset in an immutably-cached folder MUST get a new filename.
  //
  // They deliberately **bleed off the page**: each is inset past the viewport
  // edge by more than the largest parallax offset, so panning can never drag
  // an edge into view. Their outer sides are meant to be off-screen.
  {
    src: "/parallax/coral-foreground-a-left-v2.webp",
    depth: 76,
    className: "w-[74%] object-contain object-left-bottom",
    style: {
      transformOrigin: "bottom left",
      // The bleed must always exceed this layer's own pan range (`depth` px),
      // or a hard edge slides into view at full pointer deflection. A bare
      // percentage isn't enough on a narrow window, hence the px floor.
      left: "calc(-1 * max(10%, 170px))",
      bottom: "calc(-1 * max(4%, 60px))",
    },
  },
  {
    src: "/parallax/coral-foreground-a-right-v2.webp",
    depth: 82,
    className: "w-[74%] object-contain object-right-bottom",
    style: {
      transformOrigin: "bottom right",
      right: "calc(-1 * max(10%, 170px))",
      bottom: "calc(-1 * max(4%, 60px))",
    },
  },
];

export function ParallaxReef() {
  const layerRefs = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layers = layerRefs.current.filter(Boolean);
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
      layers.forEach((el, i) => {
        const d = LAYERS[i].depth;
        // With nobody at the booth the scene drifts on a slow sine instead.
        const px = idle ? Math.sin(s * 0.14 + i * 0.7) * 0.6 : pointer.x;
        const py = idle ? Math.cos(s * 0.1 + i * 0.5) * 0.4 : pointer.y;
        gsap.to(el, {
          x: -px * d,
          y: -py * d * 0.4,
          duration: idle ? 1.4 : 1,
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
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#0b3f6b]">
      {LAYERS.map((l, i) => (
        <img
          key={l.src}
          ref={(el) => {
            if (el) layerRefs.current[i] = el;
          }}
          src={l.src}
          alt=""
          aria-hidden="true"
          draggable={false}
          // Just enough overscan to cover the parallax offset — nothing more.
          className={`absolute scale-[1.06] will-change-transform ${l.className}`}
          style={l.style}
        />
      ))}
    </div>
  );
}
