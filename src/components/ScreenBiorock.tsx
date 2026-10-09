import { ModelStage } from "../three/ModelStage";
import { ReefBackdrop } from "./ReefBackdrop";
import { Polaroid } from "./Polaroid";
import { Slide } from "./slides/Slide";
import { biorock, photos } from "../content/copy";

// Deterministic scatter so the strip looks hand-pinned, not gridded.
const ROTATIONS = [-3.5, 2.5, -1.5, 3, -2.5, 1.5, -3, 2, -1.8, 3.2, -2.2];

const STRIP_H = 300;

export function ScreenBiorock({
  active,
  mobile,
}: {
  active: boolean;
  mobile: boolean;
}) {
  // ── Mobile: stacked and scrollable. The kiosk layout below pins the model,
  // copy and photo strip to absolute regions, which a phone cannot hold.
  if (mobile) {
    return (
      <section className="relative w-full px-5 py-14">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.3em] text-coral">
            {biorock.index}
          </span>
          <span className="h-px w-8 bg-ink/15" />
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-soft/70">
            {biorock.kicker}
          </span>
        </div>

        <h2 className="display-xl mt-4 text-[clamp(2rem,9vw,2.8rem)] text-ink">
          {biorock.headline}{" "}
          <em className="italic text-electric">{biorock.headlineAccent}</em>
        </h2>

        <div className="mt-5 flex items-end gap-4">
          <img
            src="/character/char-thank-you.webp"
            alt=""
            className="w-[104px] flex-none drop-shadow-[0_16px_26px_rgba(3,44,143,0.22)]"
          />
          <p className="text-[13px] leading-[1.85] text-ink-soft">
            {biorock.body}
          </p>
        </div>

        {/* Stacked and centred on a phone — the desktop label/divider/logo row
            leaves the two-line label cramped against the mark. */}
        <div className="card-surface mt-6 flex flex-col items-center gap-3 rounded-2xl px-5 py-5 text-center">
          <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-ink/60">
            In tribute to
          </span>
          <img
            src="/art/biorock-logo.webp"
            alt="Biorock Indonesia"
            className="h-9 w-auto"
          />
        </div>

        <div className="relative mt-6 h-[38vh] min-h-[240px] overflow-hidden rounded-3xl border border-electric/10 bg-paper-2/50">
          <ModelStage modelUrl="/models/biorock-structure.glb" margin={1.0} />
        </div>
        <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-ink/60">
          {biorock.structureLabel}
        </p>

        <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.28em] text-ink/60">
          Field memories — {String(photos.length).padStart(2, "0")} frames
        </p>
        {/* A plain swipeable rail on mobile; the kiosk marquee drifts by itself
            but on a phone the visitor should be the one moving it. */}
        <div
          className="-mx-5 mt-4 flex gap-4 overflow-x-auto px-5"
          style={{ clipPath: "inset(0px 0px -90px 0px)" }}
        >
          {photos.map((p, i) => (
            <Polaroid
              key={p.src}
              src={p.src}
              caption={p.caption}
              index={i + 1}
              rotate={ROTATIONS[i % ROTATIONS.length]}
              className="w-40 flex-none"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <Slide active={active} className="bg-paper">
      <ReefBackdrop focus="74%" textColumn="52%" />

      {/* Model keeps its own column — a centred one ends up behind the copy. */}
      <div
        className="absolute right-0 top-0 hidden md:block md:w-[52%]"
        style={{ bottom: STRIP_H }}
      >
        <ModelStage modelUrl="/models/biorock-structure.glb" margin={1.0} />
      </div>

      <div
        className="absolute inset-x-0 top-0 flex items-center px-8 pt-24 md:w-[48%] md:px-14"
        style={{ bottom: STRIP_H }}
      >
        <div className="flex gap-7">
          <img
            data-pop
            src="/character/char-thank-you.webp"
            alt=""
            className="hidden w-[150px] flex-none self-end drop-shadow-[0_20px_32px_rgba(3,44,143,0.22)] lg:block xl:w-[185px]"
          />

          <div>
            <div data-pop className="flex items-center gap-4">
              <span className="font-mono text-[11px] tracking-[0.3em] text-coral">
                {biorock.index}
              </span>
              <span className="h-px w-12 bg-ink/15" />
              <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-ink-soft/70">
                {biorock.kicker}
              </span>
            </div>

            <h2
              data-pop
              className="display-xl mt-7 text-[clamp(2.25rem,4vw,3.9rem)] text-ink"
            >
              {biorock.headline}{" "}
              <em className="italic text-electric">{biorock.headlineAccent}</em>
            </h2>

            <p
              data-pop
              className="mt-7 max-w-lg text-[clamp(0.8rem,0.95vw,0.95rem)] leading-[1.95] text-ink-soft"
            >
              {biorock.body}
            </p>

            {/* The logo is a credit, so give it a proper lockup — labelled and
                on its own surface — instead of floating loose in the column. */}
            <div
              data-pop
              className="card-surface mt-9 inline-flex items-center gap-6 rounded-2xl py-4 pl-6 pr-8"
            >
              <span className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.24em] text-ink/60">
                In tribute
                <br />
                to
              </span>
              <span className="h-9 w-px bg-ink/10" />
              <img
                src="/art/biorock-logo.webp"
                alt="Biorock Indonesia"
                className="h-[clamp(2.1rem,2.6vw,3rem)] w-auto"
              />
            </div>

            <p
              data-pop
              className="mt-6 flex items-center gap-3 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-ink/60"
            >
              <span className="h-px w-8 flex-none bg-gradient-to-r from-coral to-transparent" />
              {biorock.structureLabel}
            </p>
          </div>
        </div>
      </div>

      <div
        data-pop
        className="absolute inset-x-0 bottom-0 border-t border-electric/10 bg-surface/70 backdrop-blur-md"
        style={{ height: STRIP_H }}
      >
        <div className="flex items-center justify-between px-8 pt-5 md:px-14">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/60">
            Field memories — {String(photos.length).padStart(2, "0")} frames
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/55">
            Hover to pause
          </span>
        </div>

        {/* Nothing on the kiosk scrolls, so the strip drifts on its own. The
            list is duplicated so the loop has no visible seam. */}
        {/* Clip horizontally only. `overflow-hidden` clips all four sides,
            which sliced every polaroid's drop shadow off in a hard straight
            line. A negative bottom inset lets the shadows fall out of the box
            while the marquee still hides its looping edges left and right. */}
        <div
          className="group relative pt-5"
          style={{ clipPath: "inset(0px 0px -90px 0px)" }}
        >
          <div
            className="flex w-max items-start gap-6 px-8 pb-6 group-hover:[animation-play-state:paused] md:px-14"
            style={{ animation: "photo-drift 64s linear infinite" }}
          >
            {[...photos, ...photos].map((p, i) => (
              <Polaroid
                key={`${p.src}-${i}`}
                src={p.src}
                caption={p.caption}
                index={(i % photos.length) + 1}
                rotate={ROTATIONS[i % ROTATIONS.length]}
                className="w-44"
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface to-transparent" />
          <style>{`@keyframes photo-drift { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
        </div>
      </div>
    </Slide>
  );
}
