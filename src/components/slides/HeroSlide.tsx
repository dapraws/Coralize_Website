import { ParallaxReef } from "../ParallaxReef";
import { Slide } from "./Slide";
import { hero, testflight } from "../../content/copy";

/**
 * The dive-in. This is the one slide that goes fully underwater: the reef runs
 * at full saturation and the copy is white over a dark scrim, rather than the
 * reef being bleached so ink-blue type can sit on it. Everything after this
 * slide surfaces back into the bright paper layout.
 */
export function HeroSlide({
  active,
  mobile,
  onTryIt,
}: {
  active: boolean;
  mobile: boolean;
  onTryIt: () => void;
}) {
  return (
    <Slide active={active}>
      <ParallaxReef />

      {/* Contrast for the copy only — a soft vertical scrim, so the reef keeps
          its colour everywhere the text isn't. */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,26,54,0.55)_0%,rgba(4,26,54,0.34)_30%,rgba(4,26,54,0.46)_62%,rgba(4,26,54,0.72)_100%)]" />
      {/* A column of shade down the middle where all the copy sits. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_54%_78%_at_50%_54%,rgba(4,26,54,0.70),rgba(4,26,54,0.34)_58%,transparent_82%)]" />

      <div className="relative flex h-full flex-col items-center justify-center px-[6vw] pt-16 text-center">
        <div data-pop className="relative mb-6">
          {/* Glow pool behind the icon so it doesn't sit flat on the reef. */}
          <span className="absolute left-1/2 top-1/2 h-[190%] w-[190%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bio-cyan/25 blur-2xl" />
          <img
            src="/art/app-icon.webp"
            alt=""
            className="relative w-[clamp(112px,10vw,190px)] rounded-[24%] shadow-[0_18px_44px_-12px_rgba(0,20,50,0.75)] ring-1 ring-white/25"
          />
        </div>

        <div data-pop className="flex items-center gap-4">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-coral-soft" />
          <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-coral-soft">
            {hero.kicker}
          </span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-coral-soft" />
        </div>

        {/* The wordmark art is black; invert it to white for the dark scene. */}
        <img
          data-pop
          src="/art/coralize-type.svg"
          alt="Coralize"
          className="mt-5 w-[min(78vw,340px)] md:w-[min(38vw,500px)]"
          style={{
            filter:
              "brightness(0) invert(1) drop-shadow(0 6px 30px rgba(0,20,50,0.6))",
          }}
        />

        <h1
          data-pop
          className="display-xl mt-6 max-w-[18ch] text-[clamp(2.4rem,5vw,5.4rem)] text-white"
          style={{ textShadow: "0 4px 34px rgba(0,20,50,0.55)" }}
        >
          <span className="block">{hero.line1}</span>
          <span className="block">
            {hero.line2}{" "}
            <em className="italic text-bio-cyan">{hero.line2Accent2}</em>
          </span>
        </h1>

        <p
          data-pop
          className="mt-5 max-w-xl text-[clamp(0.8rem,0.95vw,1rem)] leading-[1.8] text-white/85"
          style={{ textShadow: "0 2px 18px rgba(0,20,50,0.6)" }}
        >
          {hero.sub}
        </p>

        {/* TestFlight up front: the install is the point of the whole booth,
            so don't make a visitor find it four slides down.

            On a phone this must be a REAL LINK. The only install path used to
            be the QR on slide 5, which a phone visitor physically cannot scan
            with the screen that is displaying it — the primary audience could
            not complete the primary action at all.

            On the kiosk it stays a scroll: the booth display is shared and
            unattended, so navigating it away to TestFlight would strand the
            exhibit on a page nobody can back out of. There, the QR is the
            correct affordance — the visitor scans it with their own phone. */}
        {mobile ? (
          <a
            data-pop
            href={testflight.joinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-7 flex min-h-12 items-center gap-3 rounded-full bg-white/95 py-2.5 pl-2.5 pr-6 shadow-[0_14px_34px_-12px_rgba(0,20,50,0.7)] transition-transform duration-300 hover:scale-[1.03]"
          >
            <img
              src="/art/testflight-icon.webp"
              alt=""
              className="h-8 w-8 rounded-[9px]"
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
              {hero.tryCta}
            </span>
          </a>
        ) : (
          <button
            data-pop
            type="button"
            onClick={onTryIt}
            className="group mt-7 flex min-h-12 cursor-pointer items-center gap-3 rounded-full bg-white/95 py-2.5 pl-2.5 pr-6 shadow-[0_14px_34px_-12px_rgba(0,20,50,0.7)] transition-transform duration-300 hover:scale-[1.03]"
          >
            <img
              src="/art/testflight-icon.webp"
              alt=""
              className="h-8 w-8 rounded-[9px]"
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
              {hero.tryCta}
            </span>
          </button>
        )}

        {/* Say the constraint out loud, next to the button that depends on it. */}
        <p
          data-pop
          className="mt-3 font-mono text-[9px] uppercase tracking-[0.24em] text-white/60"
        >
          {testflight.requirement}
        </p>

        <div
          data-pop
          className="mt-8 flex flex-wrap justify-center gap-x-10 gap-y-4 border-t border-white/25 pt-5"
        >
          {hero.specs.map((s) => (
            <div key={s.k}>
              <div className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/55">
                {s.k}
              </div>
              <div className="mt-1.5 font-mono text-[13px] font-medium text-white">
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Use the same shared edge treatment as every other slide so the hero
          enters and exits with identical pacing and opacity falloff. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
        style={{
          height: "8vh",
          background:
            "linear-gradient(0deg, #F2F6FF 0%, rgba(242,246,255,0.72) 42%, rgba(242,246,255,0.28) 72%, transparent 100%)",
        }}
      />
    </Slide>
  );
}
