/**
 * Fades a slide's top and bottom edges to the base paper colour.
 *
 * Each slide carries its own tint — one is `paper-2`, one has a video behind
 * it, the hero is a dark reef — so where two slides meet during the vertical
 * transition their differing tones showed as a hard horizontal line. Ending
 * every slide on the same colour means adjacent edges match exactly and the
 * boundary disappears.
 *
 * Render this LAST inside a slide so it sits above that slide's own washes.
 */
export function SlideEdges({
  top = true,
  bottom = true,
  size = "12vh",
}: {
  top?: boolean;
  bottom?: boolean;
  size?: string;
}) {
  return (
    <>
      {top && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-20"
          style={{
            height: size,
            background:
              "linear-gradient(180deg, #F2F6FF 0%, rgba(242,246,255,0.72) 42%, rgba(242,246,255,0.28) 72%, transparent 100%)",
          }}
        />
      )}
      {bottom && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
          style={{
            height: size,
            background:
              "linear-gradient(0deg, #F2F6FF 0%, rgba(242,246,255,0.72) 42%, rgba(242,246,255,0.28) 72%, transparent 100%)",
          }}
        />
      )}
    </>
  );
}
