/**
 * Backdrop for the two 3D screens.
 *
 * Kept at full saturation — the earlier near-opaque paper wash drained the
 * colour and looked bad. Legibility is handled with a soft bright pool in the
 * centre (where the specimen stands) and a light bed only under the bottom
 * rail, so the reef keeps its colour at the edges where nothing sits on it.
 */
export function ReefBackdrop({
  focus = "50%",
  /** Width of the paper bed under a left-hand text column, e.g. "48%". */
  textColumn,
}: {
  focus?: string;
  textColumn?: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <img
        src="/art/coral-corridor.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-[1.04] object-cover"
      />
      {/* Bright pool so the model reads against the reef without bleaching it. */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 52% 58% at ${focus} 44%, rgba(242,246,255,0.86), rgba(242,246,255,0.42) 45%, rgba(242,246,255,0.06) 78%)`,
        }}
      />
      {/* Beds for the top rail and the bottom controls. */}
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-paper/85 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-paper/85 to-transparent" />

      {/* Ink-blue body copy can't sit straight on a vivid reef — give the text
          column its own paper bed rather than bleaching the whole plate. */}
      {textColumn && (
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: textColumn,
            background:
              "linear-gradient(90deg, rgba(242,246,255,0.97) 0%, rgba(242,246,255,0.93) 55%, rgba(242,246,255,0.62) 82%, transparent 100%)",
          }}
        />
      )}
    </div>
  );
}
