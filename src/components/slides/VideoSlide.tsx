import { useEffect, useRef, useState } from "react";
import { Slide } from "./Slide";
import { SlideEdges } from "./SlideEdges";
import { videoSection } from "../../content/copy";

function PlayIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <span className="flex gap-1" aria-hidden="true">
      <span className="h-4 w-1 rounded-full bg-current" />
      <span className="h-4 w-1 rounded-full bg-current" />
    </span>
  ) : (
    <span
      aria-hidden="true"
      className="ml-1 block h-0 w-0 border-y-[8px] border-l-[12px] border-y-transparent border-l-current"
    />
  );
}

export function VideoSlide({
  active,
  autoCycle,
  mobile,
}: {
  active: boolean;
  autoCycle: boolean;
  mobile: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!active) {
      video.pause();
      video.currentTime = 0;
      setPlaying(false);
      return;
    }

    // Manual means nothing begins by itself. Loop/Tour may present the film,
    // but always muted so kiosk autoplay remains browser-safe and considerate.
    if (autoCycle) {
      video.currentTime = 0;
      video.muted = true;
      setMuted(true);
      void video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
      video.currentTime = 0;
      setPlaying(false);
    }
  }, [active, autoCycle]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  };

  const toggleMuted = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <Slide active={active}>
      <div className="absolute inset-0 bg-paper-2/45" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_38%,rgba(182,250,254,0.72),transparent_48%)]" />
      <div className="absolute -left-[10vw] top-[22vh] h-[42vw] w-[42vw] rounded-full border border-electric/[0.06]" />

      <div className="relative flex h-full flex-col justify-center px-[6vw] pt-20">
        <div className="mb-6 md:hidden">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-electric">
              {videoSection.index}
            </span>
            <span className="h-px w-10 bg-ink/20" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft/70">
              {videoSection.label}
            </span>
          </div>
          <h2 className="display-xl mt-5 text-[clamp(2.4rem,10vw,3.2rem)] text-ink">
            {videoSection.title}{" "}
            <em className="italic text-electric">{videoSection.titleAccent}</em>
          </h2>
          <p className="mt-4 max-w-xl text-[0.78rem] leading-[1.8] text-ink-soft">
            {videoSection.body}
          </p>
        </div>

        <div className="relative mx-auto w-[min(88vw,1800px)] max-w-[1800px] max-md:w-full max-md:max-w-[720px]">
          <div className="absolute -inset-5 rounded-[2.25rem] bg-bio-cyan/35 blur-3xl md:-inset-8" />
          <div className="relative overflow-hidden rounded-[1.6rem] border border-white/80 bg-deep-ocean shadow-[0_38px_90px_-30px_rgba(3,44,143,0.46)] md:rounded-[2rem]">
            <video
              ref={videoRef}
              src="/video/coralize-in-action.mp4"
              poster="/video/coralize-in-action-poster.webp"
              preload="metadata"
              playsInline
              controls={mobile}
              muted={muted}
              loop={autoCycle}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              className="aspect-video w-full bg-deep-ocean object-contain max-md:aspect-[4/3]"
            />

            {!playing && (
              <>
                {/* Some browsers paint a flat video surface before the native
                    poster is composited. Keep an explicit preview in the DOM
                    so Manual mode always has a meaningful first frame. */}
                <img
                  src="/video/coralize-in-action-poster.webp"
                  alt=""
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={togglePlayback}
                  className="absolute inset-0 flex cursor-pointer items-center justify-center bg-deep-ocean/10 transition-colors hover:bg-deep-ocean/5"
                  aria-label="Play Coralize in action"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/35 bg-white/92 text-electric shadow-[0_14px_40px_-12px_rgba(8,26,73,0.7)] backdrop-blur md:h-20 md:w-20">
                    <PlayIcon playing={false} />
                  </span>
                </button>
              </>
            )}

            {/* This scrim exists only so the white copy below is readable over
                the poster. Once the film is playing the copy is gone, so the
                scrim has no job left and would just darken the footage — fade
                it out on the same curve as the text. */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 z-10 bg-deep-ocean/10 transition-opacity duration-700 md:bg-[linear-gradient(90deg,rgba(8,26,73,0.86)_0%,rgba(8,26,73,0.58)_28%,rgba(8,26,73,0.12)_68%,transparent_100%),linear-gradient(180deg,rgba(8,26,73,0.4)_0%,transparent_38%,rgba(8,26,73,0.12)_100%)] ${playing ? "opacity-0" : "opacity-100"}`}
            />

            <div
              aria-hidden={playing}
              className={`pointer-events-none absolute left-7 top-7 z-20 hidden max-w-[min(78%,620px)] text-white transition-opacity duration-700 md:left-14 md:top-14 md:block ${playing ? "opacity-0" : "opacity-100"}`}
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] tracking-[0.3em] text-bio-cyan">
                  {videoSection.index}
                </span>
                <span className="h-px w-10 bg-white/40" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/75">
                  {videoSection.label}
                </span>
              </div>
              <h2 className="display-xl mt-5 text-[clamp(2.4rem,4.6vw,4.8rem)]">
                {videoSection.title}{" "}
                <em className="italic text-bio-cyan">
                  {videoSection.titleAccent}
                </em>
              </h2>
              <p className="mt-5 max-w-[34rem] text-[clamp(0.72rem,0.9vw,0.95rem)] leading-[1.85] text-white/82">
                {videoSection.body}
              </p>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-30 hidden items-end justify-between bg-gradient-to-t from-deep-ocean/78 via-deep-ocean/25 to-transparent px-4 pb-4 pt-16 text-white md:flex md:px-7 md:pb-6">
              <button
                type="button"
                onClick={togglePlayback}
                className="flex min-h-11 cursor-pointer items-center gap-3 rounded-full border border-white/20 bg-deep-ocean/45 px-4 font-mono text-[9px] uppercase tracking-[0.2em] backdrop-blur-md transition-colors hover:bg-deep-ocean/65"
                aria-label={playing ? "Pause video" : "Play video"}
              >
                <PlayIcon playing={playing} />
                {playing ? "Pause" : "Play video"}
              </button>

              <div className="flex items-center gap-3">
                <span className="hidden font-mono text-[9px] uppercase tracking-[0.22em] text-white/65 sm:inline">
                  Scan a card · bring coral to life
                </span>
                <button
                  type="button"
                  onClick={toggleMuted}
                  className="min-h-11 cursor-pointer rounded-full border border-white/20 bg-deep-ocean/45 px-4 font-mono text-[9px] uppercase tracking-[0.18em] backdrop-blur-md transition-colors hover:bg-deep-ocean/65"
                  aria-label={muted ? "Unmute video" : "Mute video"}
                >
                  {muted ? "Sound off" : "Sound on"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideEdges />
    </Slide>
  );
}
