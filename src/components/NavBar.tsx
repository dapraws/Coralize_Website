import { SLIDE_COUNTS } from "../hooks/useShowNav";
import type { PlayMode } from "../hooks/useShowNav";

/** The three play modes, in the order they appear in the control. */
const MODES: { id: PlayMode; label: string; hint: string }[] = [
  { id: "paused", label: "Manual", hint: "Paused — you drive" },
  { id: "page", label: "Loop", hint: "Loop this section" },
  { id: "all", label: "Tour", hint: "Play every section" },
];

function ModeIcon({ mode }: { mode: PlayMode }) {
  if (mode === "paused") {
    return (
      <span className="flex gap-[3px]">
        <span className="block h-2.5 w-[3px] rounded-full bg-current" />
        <span className="block h-2.5 w-[3px] rounded-full bg-current" />
      </span>
    );
  }
  if (mode === "page") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <path
          d="M4 9a5 5 0 0 1 5-5h6a5 5 0 0 1 0 10H9a5 5 0 0 1-5-5Z"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <path
          d="m7 17 3-3-3-3"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <span
      className="block h-0 w-0"
      style={{
        borderTop: "5px solid transparent",
        borderBottom: "5px solid transparent",
        borderLeft: "8px solid currentColor",
      }}
    />
  );
}

const SCREENS = [
  { index: 0, num: "01", label: "The App", short: "App", id: "app" },
  {
    index: 1,
    num: "02",
    label: "Encyclopedia",
    short: "3D",
    id: "encyclopedia",
  },
  { index: 2, num: "03", label: "Biorock", short: "Biorock", id: "biorock" },
];

export function NavBar({
  screen,
  slide,
  progress,
  mode,
  mobile,
  onSelect,
  onChooseMode,
}: {
  screen: number;
  slide: number;
  progress: number;
  mode: PlayMode;
  mobile: boolean;
  onSelect: (screen: number) => void;
  onChooseMode: (mode: PlayMode) => void;
}) {
  const slideCount = SLIDE_COUNTS[screen];

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="pointer-events-auto flex items-center justify-between gap-2 px-3 py-3 md:px-12 md:py-5">
        {/* On its own frosted pill: the hero behind it is a dark reef, so a
            bare black wordmark sitting straight on the scene is unreadable. */}
        <button
          type="button"
          onClick={() => onSelect(0)}
          className="group flex flex-none cursor-pointer items-center gap-2 rounded-full border border-electric/10 bg-surface/85 py-1.5 pl-1.5 pr-3 shadow-[0_8px_28px_-12px_rgba(12,24,72,0.28)] backdrop-blur-xl md:gap-3 md:pr-5"
          aria-label="Coralize — back to the start"
        >
          <img
            src="/art/app-icon.webp"
            alt=""
            className="h-7 w-7 rounded-[8px] shadow-[0_4px_14px_-4px_rgba(3,44,143,0.5)] transition-transform duration-500 group-hover:scale-105 md:h-9 md:w-9 md:rounded-[10px]"
          />
          {/* The real wordmark, not letterspaced type standing in for it. */}
          <img
            src="/art/coralize-type.svg"
            alt="Coralize"
            className="h-[11px] w-auto md:h-[15px]"
          />
        </button>

        <div className="flex items-center gap-4">
          <nav
            aria-label="Sections"
            className="flex flex-none items-center gap-0.5 rounded-full border border-electric/10 bg-surface/85 p-1 shadow-[0_8px_28px_-12px_rgba(12,24,72,0.28)] backdrop-blur-xl md:gap-1 md:p-1.5"
          >
            {SCREENS.map((s) => {
              const active = screen === s.index;
              return (
                <button
                  key={s.index}
                  type="button"
                  onClick={() =>
                    mobile
                      ? document.getElementById(s.id)?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        })
                      : onSelect(s.index)
                  }
                  aria-current={active && !mobile ? "true" : undefined}
                  className={[
                    "relative flex min-h-11 cursor-pointer items-center rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 md:min-h-0 md:px-5 md:py-2 md:tracking-[0.2em]",
                    active && !mobile
                      ? "text-white"
                      : "text-ink-soft hover:text-ink",
                  ].join(" ")}
                >
                  {active && !mobile && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-electric"
                      style={{
                        boxShadow: "0 6px 18px -6px rgba(0,48,192,0.75)",
                      }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <span className="hidden font-mono opacity-60 md:inline">
                      {s.num}
                    </span>
                    <span className="md:hidden">{s.short}</span>
                    <span className="hidden md:inline">{s.label}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Play mode: Manual (default) / Loop this section / Tour all.
              Kiosk only — the mobile layout is a plain scrolling page.
              A segmented control rather than a cycling button, so what the
              show is about to do is readable at a glance from across a booth. */}
          <div
            role="radiogroup"
            aria-label="Playback mode"
            hidden={mobile}
            className="flex items-center gap-1 rounded-full border border-electric/10 bg-surface/85 p-1.5 shadow-[0_8px_28px_-12px_rgba(12,24,72,0.28)] backdrop-blur-xl"
          >
            {MODES.map((m) => {
              const on = mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  title={m.hint}
                  onClick={() => onChooseMode(m.id)}
                  className={[
                    "relative flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.16em] transition-colors duration-300",
                    on ? "text-white" : "text-ink-soft hover:text-ink",
                  ].join(" ")}
                >
                  {on && (
                    <>
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-electric"
                        style={{
                          boxShadow: "0 6px 18px -6px rgba(0,48,192,0.75)",
                        }}
                      />
                      {/* Time to the next stop, drawn around the active mode. */}
                      {m.id !== "paused" && (
                        <svg
                          viewBox="0 0 100 40"
                          preserveAspectRatio="none"
                          className="absolute inset-0 h-full w-full"
                          aria-hidden="true"
                        >
                          <rect
                            x="1"
                            y="1"
                            width="98"
                            height="38"
                            rx="19"
                            fill="none"
                            stroke="rgba(255,255,255,0.85)"
                            strokeWidth="2"
                            pathLength={100}
                            strokeDasharray={100}
                            strokeDashoffset={100 * (1 - progress)}
                            style={{
                              transition: "stroke-dashoffset 0.25s linear",
                            }}
                          />
                        </svg>
                      )}
                    </>
                  )}
                  <span className="relative flex items-center">
                    <ModeIcon mode={m.id} />
                  </span>
                  <span className="relative hidden lg:inline">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Slide pips sit at the foot of the screen so they never collide with
          a slide's own top-left kicker. */}
      {slideCount > 1 && !mobile && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-electric/10 bg-surface/75 px-4 py-2.5 shadow-[0_8px_24px_-14px_rgba(12,24,72,0.4)] backdrop-blur-md">
            {Array.from({ length: slideCount }, (_, i) => (
              <span
                key={i}
                className="block rounded-full transition-all duration-500"
                style={{
                  width: i === slide ? 22 : 6,
                  height: 6,
                  background: i === slide ? "#0030C0" : "rgba(12,24,72,0.18)",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
