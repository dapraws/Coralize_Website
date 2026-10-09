import { Slide, SlideHead } from "./Slide";
import { SlideEdges } from "./SlideEdges";
import { FlipCard, CardMeta } from "../FlipCard";
import { useSpotlight } from "../../hooks/useSpotlight";
import { cards, cardsSection } from "../../content/copy";

export function CardsSlide({
  active,
  autoCycle,
}: {
  active: boolean;
  autoCycle: boolean;
}) {
  // Long enough for the 750ms flip to land and be read before moving on.
  const spot = useSpotlight(cards.length, active && autoCycle, 2400);

  return (
    <Slide active={active}>
      <div className="absolute inset-0 bg-paper-2/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_18%,rgba(182,250,254,0.45),transparent_58%)]" />

      <div className="relative flex h-full flex-col justify-center gap-[4vh] px-[6vw] pt-20">
        <SlideHead
          index={cardsSection.index}
          label={cardsSection.label}
          accent="coral"
          title={
            <>
              {cardsSection.titleScan}{" "}
              <span className="text-electric">{cardsSection.titleLearn}</span>{" "}
              <em className="italic text-coral">{cardsSection.titleAct}</em>
            </>
          }
          aside={cardsSection.body}
        />

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-[1.6vw]">
          {cards.map((card, i) => {
            const on = spot === i;
            return (
              <div
                key={card.id}
                data-pop
                data-spot={spot === -1 ? "idle" : on ? "on" : "dim"}
                className="spot group"
              >
                <div className="relative">
                  {/* pointer-events-none is load-bearing: an absolutely
                      positioned sibling paints above the static flip card and
                      would otherwise eat the hover that drives the flip. */}
                  <div
                    className="pointer-events-none absolute -inset-5 rounded-[26px] blur-2xl transition-opacity duration-700"
                    style={{
                      opacity: on ? 1 : 0,
                      background:
                        card.category === "ACTIVITY"
                          ? "rgba(242,104,95,0.22)"
                          : "rgba(0,48,192,0.18)",
                    }}
                  />
                  {/* The show turns each card over in turn; hover still works. */}
                  <FlipCard card={card} flipped={on} />
                </div>
                <CardMeta card={card} index={i + 1} />
              </div>
            );
          })}
        </div>
      </div>
      <SlideEdges />
    </Slide>
  );
}
