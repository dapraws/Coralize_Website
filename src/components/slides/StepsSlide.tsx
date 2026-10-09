import { Slide, SlideHead } from "./Slide";
import { SlideEdges } from "./SlideEdges";
import { useSpotlight } from "../../hooks/useSpotlight";
import { howItWorks, howItWorksSection } from "../../content/copy";

export function StepsSlide({
  active,
  autoCycle,
}: {
  active: boolean;
  autoCycle: boolean;
}) {
  const spot = useSpotlight(howItWorks.length, active && autoCycle, 2100);

  return (
    <Slide active={active}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(182,250,254,0.4),transparent_55%)]" />

      <div className="relative flex h-full flex-col justify-center gap-[4vh] px-[6vw] pt-20">
        <SlideHead
          index={howItWorksSection.index}
          label={howItWorksSection.label}
          title={
            <>
              {howItWorksSection.title}{" "}
              <em className="italic text-electric">
                {howItWorksSection.titleAccent}
              </em>
            </>
          }
          aside={howItWorksSection.body}
        />

        <div className="grid gap-6 md:grid-cols-3 md:gap-[1.6vw]">
          {howItWorks.map((s, i) => {
            const on = spot === i;
            return (
              <div
                key={s.step}
                data-pop
                data-spot={spot === -1 ? "idle" : on ? "on" : "dim"}
                className="spot card-surface h-full overflow-hidden rounded-3xl"
                style={
                  on
                    ? {
                        boxShadow:
                          "0 2px 6px rgba(12,24,72,0.06), 0 30px 60px -18px rgba(0,48,192,0.34)",
                      }
                    : undefined
                }
              >
                <div className="relative bg-[radial-gradient(ellipse_at_50%_40%,rgba(182,250,254,0.45),rgba(242,246,255,0)_70%)] px-5 pt-5">
                  <img
                    src={s.art}
                    alt=""
                    className="mx-auto max-h-[30vh] w-full object-contain transition-transform duration-700"
                    style={{ transform: on ? "scale(1.05)" : "scale(1)" }}
                  />
                </div>
                <div className="px-7 pb-7 pt-1">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full font-mono text-[10px] font-semibold transition-colors duration-500"
                      style={{
                        background: on ? "#0030C0" : "rgba(0,48,192,0.10)",
                        color: on ? "#fff" : "#0030C0",
                      }}
                    >
                      {s.step}
                    </span>
                    <h3 className="font-display text-[clamp(1.15rem,1.5vw,1.7rem)] text-ink">
                      {s.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-[clamp(0.72rem,0.82vw,0.9rem)] leading-[1.85] text-ink-soft">
                    {s.body}
                  </p>
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
