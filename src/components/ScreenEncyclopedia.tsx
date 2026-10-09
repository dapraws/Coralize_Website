import { useEffect, useState } from "react";
import { ModelStage } from "../three/ModelStage";
import { ReefBackdrop } from "./ReefBackdrop";
import { FlipCard } from "./FlipCard";
import { Slide } from "./slides/Slide";
import { useSpotlight } from "../hooks/useSpotlight";
import { species, cards } from "../content/copy";

const cardById = Object.fromEntries(cards.map((c) => [c.id, c]));

export function ScreenEncyclopedia({
  specimen,
  active,
  mobile,
  autoCycle,
  onSelectSpecimen,
}: {
  specimen: number;
  active: boolean;
  mobile: boolean;
  autoCycle: boolean;
  onSelectSpecimen: (index: number) => void;
}) {
  const entry = species[Math.min(specimen, species.length - 1)];

  // The show cycles this specimen's variants on its own; the first manual
  // click hands control to the visitor until the specimen changes.
  const [manual, setManual] = useState(false);
  const [pickedId, setPickedId] = useState<string | null>(null);

  useEffect(() => {
    setManual(false);
    setPickedId(null);
  }, [entry.id]);

  // 10s per variant: long enough to actually look at the model and read its
  // note. The Encyclopedia's stop length is set from this — see useShowNav.
  const autoIndex = useSpotlight(entry.variants.length, active && !manual && autoCycle, 10000);
  // Fall back to the first variant rather than trusting the index: specimens
  // have different variant counts, and a stale index here blanks the kiosk.
  const variant =
    (pickedId && entry.variants.find((v) => v.id === pickedId)) ||
    entry.variants[autoIndex >= 0 ? autoIndex : 0] ||
    entry.variants[0];

  const card = entry.cardId ? cardById[entry.cardId] : undefined;

  // ── Mobile: a stacked, scrollable section. The kiosk layout below is a
  // full-bleed canvas with absolutely-positioned overlays, which cannot work
  // on a phone — the panels would sit on top of the model.
  if (mobile) {
    return (
      <section className="relative w-full px-5 py-14">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.3em] text-electric">
            № 02
          </span>
          <span className="h-px w-8 bg-ink/15" />
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-soft/70">
            Coral 3D Encyclopedia
          </span>
        </div>

        <h2 className="display-xl mt-4 text-[clamp(2rem,9vw,2.8rem)] text-ink">
          Turn it over <em className="italic text-electric">in 3D.</em>
        </h2>

        {/* Specimen picker: a horizontal rail is the one pattern that fits
            three long names on a narrow screen without wrapping badly. */}
        <div className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-1">
          {species.map((s, i) => {
            const on = s.id === entry.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectSpecimen(i)}
                className={[
                  "flex min-h-11 flex-none cursor-pointer items-center rounded-full border px-4 py-2.5 text-[11px] transition-colors md:min-h-0",
                  on
                    ? "border-transparent bg-electric text-white"
                    : "border-ink/12 bg-surface text-ink-soft",
                ].join(" ")}
              >
                {s.name}
              </button>
            );
          })}
        </div>

        <div className="relative mt-5 h-[46vh] min-h-[280px] overflow-hidden rounded-3xl border border-electric/10 bg-paper-2/50">
          <ModelStage modelUrl={variant.model} pushIn={variant.pushIn} />
          <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-surface/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-ink/45">
            Drag to orbit
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {entry.variants.map((v) => {
            const on = v.id === variant.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  setManual(true);
                  setPickedId(v.id);
                }}
                className={[
                  "flex min-h-11 cursor-pointer items-center rounded-full border px-4 py-2 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors md:min-h-0",
                  on
                    ? "border-transparent bg-electric text-white"
                    : "border-ink/12 bg-surface text-ink-soft",
                ].join(" ")}
              >
                {v.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2.5 font-mono text-[10px] leading-relaxed text-ink/45">
          {variant.note}
        </p>

        <div className="card-surface mt-6 rounded-3xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl leading-tight text-ink">
                {entry.name}
              </h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-electric">
                {entry.scientific}
              </p>
            </div>
            <span className="whitespace-nowrap rounded-full bg-paper-2 px-2.5 py-1 font-mono text-[9px] tracking-widest text-ink/45">
              {entry.specimenCode}
            </span>
          </div>
          <p className="mt-4 text-[13px] leading-[1.85] text-ink-soft">
            {entry.description}
          </p>
          <ul className="mt-4 space-y-2.5 border-t border-ink/10 pt-4">
            {entry.facts.map((fact, i) => (
              <li key={fact} className="flex gap-3">
                <span className="mt-0.5 font-mono text-[9px] tracking-widest text-coral">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[12px] leading-[1.75] text-ink-soft/85">
                  {fact}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {card && (
          <div className="mx-auto mt-6 w-[62%] max-w-[240px]">
            <span className="mb-2 block text-center font-mono text-[9px] uppercase tracking-[0.24em] text-ink/60">
              Its card
            </span>
            <FlipCard card={card} />
          </div>
        )}
      </section>
    );
  }

  return (
    <Slide active={active}>
      <ReefBackdrop focus="48%" textColumn="26%" />

      <div className="absolute inset-0">
        <ModelStage modelUrl={variant.model} pushIn={variant.pushIn} />
      </div>

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between px-[4vw] pb-[4vh] pt-24">
        <div data-pop className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] tracking-[0.3em] text-electric">
              № 02
            </span>
            <span className="h-px w-12 bg-ink/15" />
            <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-ink-soft/70">
              Coral 3D Encyclopedia
            </span>
          </div>
          <span className="hidden rounded-full border border-ink/10 bg-surface/70 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.26em] text-ink/45 backdrop-blur-sm md:block">
            Drag to orbit
          </span>
        </div>

        {/* Specimen rail — reflects the show's current stop. */}
        <div
          data-pop
          className="pointer-events-auto absolute left-[4vw] top-1/2 hidden -translate-y-1/2 flex-col gap-2.5 md:flex"
        >
          {species.map((s, i) => {
            const on = s.id === entry.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectSpecimen(i)}
                aria-current={on ? "true" : undefined}
                className={[
                  "flex cursor-pointer items-center gap-3.5 rounded-2xl border px-5 py-3.5 text-left transition-all duration-500",
                  on
                    ? "border-electric/25 bg-surface shadow-[0_12px_30px_-14px_rgba(12,24,72,0.4)]"
                    : "border-transparent bg-surface/40 opacity-60 hover:border-electric/15 hover:bg-surface/80 hover:opacity-100",
                ].join(" ")}
              >
                <span
                  className={[
                    "font-mono text-[9px] tracking-widest",
                    on ? "text-electric" : "text-ink/30",
                  ].join(" ")}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-[132px]">
                  <span
                    className={[
                      "block font-display text-lg leading-tight",
                      on ? "text-ink" : "text-ink/55",
                    ].join(" ")}
                  >
                    {s.name}
                  </span>
                  <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink/30">
                    {s.specimenCode}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-end justify-between gap-8">
          <div data-pop className="pointer-events-auto flex flex-col gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-ink/60">
              View
            </span>
            <div className="flex flex-wrap gap-2">
              {entry.variants.map((v) => {
                const on = v.id === variant.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setManual(true);
                      setPickedId(v.id);
                    }}
                    className={[
                      "flex min-h-11 cursor-pointer items-center rounded-full border px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-all duration-300 md:min-h-0",
                      on
                        ? "border-transparent bg-electric text-white shadow-[0_10px_24px_-10px_rgba(0,48,192,0.8)]"
                        : "border-ink/12 bg-surface/70 text-ink-soft hover:border-electric/30 hover:text-ink",
                    ].join(" ")}
                  >
                    {v.label}
                  </button>
                );
              })}
            </div>
            <p className="max-w-xs font-mono text-[10px] leading-relaxed text-ink/60">
              {variant.note}
            </p>
          </div>

          <div className="pointer-events-auto flex items-end gap-6">
            {card && (
              <div data-pop className="hidden w-[178px] xl:block">
                <span className="mb-3 block font-mono text-[9px] uppercase tracking-[0.24em] text-ink/60">
                  Its card
                </span>
                <FlipCard card={card} />
              </div>
            )}

            <div data-pop className="card-surface max-w-md rounded-3xl p-7">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <h2 className="font-display text-[clamp(1.5rem,2vw,2.2rem)] leading-tight text-ink">
                    {entry.name}
                  </h2>
                  <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-electric">
                    {entry.scientific}
                  </p>
                </div>
                <span className="whitespace-nowrap rounded-full bg-paper-2 px-3 py-1.5 font-mono text-[9px] tracking-widest text-ink/45">
                  {entry.specimenCode}
                </span>
              </div>

              <p className="mt-5 text-[clamp(0.72rem,0.82vw,0.88rem)] leading-[1.9] text-ink-soft">
                {entry.description}
              </p>

              <ul className="mt-5 space-y-2.5 border-t border-ink/10 pt-4">
                {entry.facts.map((fact, i) => (
                  <li key={fact} className="flex gap-3.5">
                    <span className="mt-0.5 font-mono text-[9px] tracking-widest text-coral">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[clamp(0.68rem,0.76vw,0.82rem)] leading-[1.8] text-ink-soft/85">
                      {fact}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
}
