import { Slide, SlideHead } from "./Slide";
import { SlideEdges } from "./SlideEdges";
import { useSpotlight } from "../../hooks/useSpotlight";
import { aboutUs, team } from "../../content/copy";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.65h.05a4.17 4.17 0 0 1 3.75-2.06c4 0 4.75 2.63 4.75 6.06V21h-4v-5.5c0-1.31-.03-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21h-4V9Z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.2c-3.34.72-4.04-1.42-4.04-1.42-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.73.08-.73 1.21.09 1.85 1.25 1.85 1.25 1.08 1.84 2.83 1.31 3.52 1 .11-.79.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.4 1.24-3.24-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.24a11.5 11.5 0 0 1 6.01 0c2.29-1.56 3.3-1.24 3.3-1.24.66 1.66.24 2.88.12 3.18.77.84 1.24 1.92 1.24 3.24 0 4.63-2.8 5.65-5.48 5.95.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.83.58A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

/**
 * Deliberately uneven placement so the row reads as a crew rather than a
 * filing cabinet: each card gets its own vertical shift and a slight tilt.
 * Wide screens only — on a phone these would just look broken, so the cards
 * sit centred and upright there instead.
 */
const SCATTER = [
  { y: -30, rotate: -3.2 },
  { y: 26, rotate: 2.4 },
  { y: -42, rotate: -1.4 },
  { y: 18, rotate: 3 },
  { y: -20, rotate: -2.2 },
];

export function AboutSlide({
  active,
  autoCycle,
}: {
  active: boolean;
  autoCycle: boolean;
}) {
  const spot = useSpotlight(team.length, active && autoCycle, 1900);

  return (
    <Slide active={active}>
      <div className="absolute inset-0 bg-paper-2/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_16%,rgba(182,250,254,0.45),transparent_58%)]" />

      <div className="relative flex h-full flex-col justify-center gap-[3vh] px-[6vw] pt-16">
        <SlideHead
          index={aboutUs.index}
          label={aboutUs.label}
          title={
            <>
              {aboutUs.title}{" "}
              <em className="italic text-electric">{aboutUs.titleAccent}</em>
            </>
          }
          aside={aboutUs.body}
        />

        {/* Flex-wrap + justify-center so an odd last card centres on a phone
            instead of being stranded at the left of a grid row. pt leaves room
            for the portraits to break out above each card. */}
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-24 pt-[clamp(140px,17vh,215px)] lg:flex-nowrap lg:gap-x-[1.6vw]">
          {team.map((m, i) => {
            const on = spot === i;
            const s = SCATTER[i % SCATTER.length];
            return (
              <div
                key={m.name}
                data-pop
                data-spot={spot === -1 ? "idle" : on ? "on" : "dim"}
                className={[
                  "spot relative lg:block lg:w-auto lg:flex-1 lg:basis-auto",
                  // Mobile stacks 1-2-2: the first card takes a row of its own,
                  // the remaining four pair up beneath it.
                  i === 0
                    ? "flex basis-full justify-center"
                    : "w-[min(40vw,186px)]",
                ].join(" ")}
                style={{
                  ["--y" as string]: `${s.y}px`,
                  ["--rot" as string]: `${s.rotate}deg`,
                }}
              >
                <div
                  className={[
                    "relative lg:w-auto lg:[transform:translateY(var(--y))_rotate(var(--rot))]",
                    i === 0 ? "w-[min(40vw,186px)]" : "w-full",
                  ].join(" ")}
                >
                  {/* Portrait breaks out of the top of the card — the cartoons
                      are the appeal, so let them out of the box. Anchored to
                      the card's top edge and pulled up by a share of its OWN
                      height, so the overlap stays ~26% at every size; keying it
                      off the card's height instead let tall portraits drop far
                      enough to cover the name. */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center">
                    <div className="relative -translate-y-[74%]">
                      <span
                        className="absolute left-1/2 top-1/2 h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl transition-opacity duration-500"
                        style={{
                          background: "rgba(182,250,254,0.6)",
                          opacity: on ? 1 : 0.4,
                        }}
                      />
                      <img
                        src={m.avatar}
                        alt=""
                        className="relative h-[clamp(124px,11.5vw,208px)] w-auto object-contain drop-shadow-[0_20px_32px_rgba(3,44,143,0.28)] transition-transform duration-500"
                        style={{ transform: on ? "scale(1.07)" : "scale(1)" }}
                      />
                    </div>
                  </div>

                  {/* Underwater glass rather than a flat white rectangle. */}
                  <div
                    className="relative rounded-[26px] px-4 pb-5 text-center backdrop-blur-md transition-shadow duration-500"
                    style={{
                      // Clears the ~26% of the portrait hanging into the card.
                      paddingTop: "clamp(52px,4.2vw,76px)",
                      background:
                        "linear-gradient(165deg, rgba(255,255,255,0.92) 0%, rgba(240,248,255,0.78) 48%, rgba(214,236,255,0.62) 100%)",
                      border: "1px solid rgba(255,255,255,0.85)",
                      boxShadow: on
                        ? "inset 0 1px 0 rgba(255,255,255,0.95), 0 26px 52px -18px rgba(0,48,192,0.42)"
                        : "inset 0 1px 0 rgba(255,255,255,0.9), 0 14px 34px -16px rgba(3,44,143,0.3)",
                    }}
                  >
                    {/* Faint caustic pooling at the foot of the glass. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-[26px]"
                      style={{
                        background:
                          "radial-gradient(ellipse 70% 40% at 50% 108%, rgba(182,250,254,0.55), transparent 70%)",
                      }}
                    />

                    <p className="relative font-display text-[clamp(1.1rem,1.5vw,1.7rem)] leading-tight text-ink">
                      {m.name}
                    </p>
                    {/* Role on Coralize: blue, tracked out, small. */}
                    <p className="relative mt-1.5 font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-electric">
                      {m.role}
                    </p>
                    {/* Day job: neutral and quieter, so the two don't compete. */}
                    <p className="relative mt-1 text-[11px] font-light leading-snug text-ink-soft/80">
                      {m.background}
                    </p>

                    <div className="relative mt-4 flex items-center justify-center gap-2">
                      <a
                        href={m.linkedin}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`${m.name} on LinkedIn`}
                        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-white/50 text-ink/45 transition-colors duration-300 hover:border-electric/40 hover:text-electric md:h-8 md:w-8"
                      >
                        <LinkedInIcon className="h-3.5 w-3.5" />
                      </a>
                      <a
                        href={m.github}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`${m.name} on GitHub`}
                        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-white/50 text-ink/45 transition-colors duration-300 hover:border-electric/40 hover:text-electric md:h-8 md:w-8"
                      >
                        <GitHubIcon className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <SlideEdges />
    </Slide>
  );
}
