import { useState, type CSSProperties, type Ref } from "react";
import { ATLAS, FISH, PLATE } from "./fishSprites";

/**
 * The hero's fish, one sprite each, swimming across the reef — head-first, so
 * the few that face left in the plate swim right → left.
 *
 * The sprites are cut from the old flat `fish.webp` plate by
 * `scripts/cut-fish.py` and packed into one atlas, so this is a single image
 * request. `--u` is the plate's *contain* scale, not cover: every fish crosses
 * the full width, so a cover scale on a portrait phone blew them up and packed
 * the whole school into a narrow lane. Height is a share of the layer instead,
 * so the school still fills the hero top to bottom. Each fish loops along its
 * own lane: each lane starts one fish-width off the left edge and ends just past
 * the right, and the layer itself bleeds past the viewport, so no fish ever
 * pops in or out on screen.
 *
 * All motion is CSS keyframes — no rAF, which the kiosk pauses when the
 * display sleeps. Negative delays scatter the fish along their lanes so the
 * reef is already full when the page opens.
 *
 * This is ambient, like the bubbles: it keeps swimming in Manual mode.
 */

/** Deterministic 0..1 noise, so the school looks the same every load. */
const rand = (i: number, k: number) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const u = (n: number) => `calc(${n} * var(--u))`;

/** Plate px below which a fish is too small for a visible tail. */
const TAIL_MIN_W = 70;
/** Plate px below which a fish is dropped on phones, to keep the count down. */
const MOBILE_MIN_W = 50;
/** Share of the sprite width, from the tail end, that wags. */
const TAIL = 0.34;

export function FishSchool({
  ref,
  className,
  style,
}: {
  ref?: Ref<HTMLDivElement>;
  className?: string;
  style?: CSSProperties;
}) {
  const [still] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  // The global reduced-motion rule collapses every animation to its first
  // frame, which would park every fish off-screen. Show the original plate.
  if (still) {
    return (
      <img
        ref={ref as Ref<HTMLImageElement>}
        src="/parallax/fish.webp"
        alt=""
        aria-hidden="true"
        draggable={false}
        className={`${className} object-cover`}
        style={style}
      />
    );
  }

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={className}
      style={
        {
          ...style,
          containerType: "size",
          "--u": `min(100cqw / ${PLATE.w}, 100cqh / ${PLATE.h})`,
        } as CSSProperties
      }
    >
      {/* Plate x is unused: the lane decides where along the crossing a fish is. */}
      {FISH.map(([, py, w, h, ax, ay, left], i) => {
        const big = Math.min(w / 200, 1); // 0 small .. 1 largest fish
        const swim = 44 + big * 46 + rand(i, 1) * 16; // s per crossing
        const bob = 3.2 + rand(i, 2) * 3;
        const wag = 0.45 + big * 0.7 + rand(i, 3) * 0.2;
        const sprite: CSSProperties = {
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${ATLAS.src})`,
          backgroundSize: `${u(ATLAS.w)} ${u(ATLAS.h)}`,
          backgroundPosition: `${u(-ax)} ${u(-ay)}`,
        };
        // A left-facing fish runs its lane in reverse (right → left) and wags
        // the tail on its right. It is not mirrored to swim right instead: the
        // school is meant to cross both ways.
        const tailSide = left ? "right" : "left";
        const seam = left ? (1 - TAIL) * 100 : TAIL * 100;

        return (
          <div
            key={i}
            className={`fish-lane absolute ${w < MOBILE_MIN_W ? "max-[899px]:hidden" : ""}`}
            style={{
              top: `${(py / PLATE.h) * 100}%`,
              left: u(-w),
              width: `calc(100% + ${u(w)})`,
              height: u(h),
              animation: `fish-lane ${swim}s linear ${-rand(i, 4) * swim}s infinite ${left ? "reverse" : "normal"}`,
            }}
          >
            <div
              className="fish-body absolute left-0 top-0 h-full"
              style={{
                width: u(w),
                animation: `fish-bob ${bob}s ease-in-out ${-rand(i, 5) * bob}s infinite alternate`,
                ["--bob" as string]: u(3 + big * 6),
              }}
            >
              {w < TAIL_MIN_W ? (
                <div style={sprite} />
              ) : (
                <>
                  <div
                    style={{
                      ...sprite,
                      // 1% overlap so the seam never shows a hairline gap.
                      clipPath:
                        tailSide === "left"
                          ? `inset(0 0 0 ${TAIL * 100 - 1}%)`
                          : `inset(0 ${TAIL * 100 - 1}% 0 0)`,
                    }}
                  />
                  <div
                    style={{
                      ...sprite,
                      clipPath:
                        tailSide === "left"
                          ? `inset(0 ${100 - TAIL * 100}% 0 0)`
                          : `inset(0 0 0 ${100 - TAIL * 100}%)`,
                      transformOrigin: `${seam}% 50%`,
                      animation: `fish-tail ${wag}s ease-in-out ${-rand(i, 6) * wag}s infinite alternate`,
                    }}
                  />
                </>
              )}
            </div>
          </div>
        );
      })}
      <style>{`
        .fish-lane { will-change: transform; }
        @keyframes fish-lane {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
        @keyframes fish-bob {
          from { transform: translateY(calc(-1 * var(--bob))) rotate(-1.5deg); }
          to { transform: translateY(var(--bob)) rotate(1.5deg); }
        }
        @keyframes fish-tail {
          from { transform: perspective(220px) rotateY(-30deg) skewY(5deg); }
          to { transform: perspective(220px) rotateY(30deg) skewY(-5deg); }
        }
      `}</style>
    </div>
  );
}
