import { Slide } from "./Slide";
import { SlideEdges } from "./SlideEdges";
import { useSpotlight } from "../../hooks/useSpotlight";
import { testflight } from "../../content/copy";

export function TestFlightSlide({
  active,
  autoCycle,
  mobile,
}: {
  active: boolean;
  autoCycle: boolean;
  mobile: boolean;
}) {
  const spot = useSpotlight(testflight.steps.length, active && autoCycle, 1800);

  return (
    <Slide active={active}>
      <div className="absolute inset-0 bg-paper-2/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_45%,rgba(182,250,254,0.55),transparent_55%)]" />

      <div className="relative flex h-full items-center px-[6vw] pt-16">
        <div className="grid w-full items-center gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <div data-pop className="flex items-center gap-4">
              <span className="font-mono text-[11px] tracking-[0.3em] text-electric">
                {testflight.index}
              </span>
              <span className="h-px w-12 bg-ink/15" />
              <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-ink-soft/70">
                {testflight.label}
              </span>
            </div>

            <h2
              data-pop
              className="display-xl mt-6 text-[clamp(2.1rem,4vw,4rem)] text-ink"
            >
              {testflight.title}{" "}
              <em className="italic text-electric">{testflight.titleAccent}</em>
            </h2>

            <p
              data-pop
              className="mt-6 max-w-md text-[clamp(0.82rem,0.95vw,1rem)] leading-[1.9] text-ink-soft"
            >
              {testflight.body}
            </p>

            <ol data-pop className="mt-8 space-y-3.5">
              {testflight.steps.map((s, i) => {
                const on = spot === i;
                return (
                  <li key={s} className="flex items-center gap-3.5">
                    <span
                      className="flex h-7 w-7 flex-none items-center justify-center rounded-full font-mono text-[9px] transition-all duration-500"
                      style={{
                        background: on ? "#0030C0" : "transparent",
                        color: on ? "#fff" : "#0030C0",
                        borderWidth: 1,
                        borderColor: on ? "#0030C0" : "rgba(0,48,192,0.25)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="text-[clamp(0.78rem,0.9vw,0.95rem)] transition-colors duration-500"
                      style={{ color: on ? "#0C1848" : "#40518A" }}
                    >
                      {s}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div data-pop className="md:col-span-5">
            <div className="card-surface mx-auto w-full max-w-[400px] rounded-3xl p-8 text-center">
              <img
                src="/art/testflight-icon.webp"
                alt="TestFlight"
                className="mx-auto h-14 w-14 rounded-[14px] shadow-[0_8px_20px_-8px_rgba(12,24,72,0.5)]"
              />
              <p className="mt-3 font-display text-xl text-ink">TestFlight</p>

              {/* You cannot scan a QR with the screen displaying it, so the
                  phone gets a tappable link. On a desktop the QR is still the
                  fastest route: the visitor scans it with the phone they will
                  actually install on. */}
              {mobile ? (
                <>
                  <a
                    href={testflight.joinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex min-h-12 w-full items-center justify-center rounded-full bg-electric px-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white shadow-[0_10px_28px_-10px_rgba(0,48,192,0.8)] transition-transform duration-300 active:scale-[0.98]"
                  >
                    {testflight.linkCta}
                  </a>
                  <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-soft">
                    {testflight.requirement}
                  </p>
                </>
              ) : (
                <>
                  {/* Keep the QR on plain white with a quiet margin — tinting
                      or cropping a QR breaks scanning. */}
                  <div className="mt-4 rounded-2xl border border-electric/12 bg-white p-3">
                    <img
                      src="/art/testflight-qr.webp"
                      alt="Scan to join the Coralize TestFlight build"
                      className="aspect-square w-full object-contain"
                    />
                  </div>
                  <p className="mt-4 font-mono text-[10px] leading-relaxed text-ink-soft">
                    {testflight.note}
                  </p>
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-soft/80">
                    {testflight.requirement}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <SlideEdges />
    </Slide>
  );
}
