import { useState } from "react";
import type { CardEntry } from "../content/copy";

/**
 * True on devices with no hover (phones, tablets). A device characteristic,
 * so it is read once rather than subscribed to.
 */
const NO_HOVER =
  typeof window !== "undefined" &&
  window.matchMedia("(hover: none)").matches;

// The printed cards are 5855×7605 — keep that ratio so the art never distorts.
const CARD_RATIO = "5855 / 7605";

/**
 * Flip on hover where hover exists, on tap where it does not.
 *
 * The rotation stays pure CSS off `:hover` / `:focus-visible`. Tap support is
 * added ONLY on hover-less devices, so pointer state and component state can
 * never disagree — that mismatch was the old flicker. Both inputs resolve to
 * the same `--flip-rot`, so they cannot fight even if they overlap.
 *
 * Without this the card was inert on phones: the copy said "Hover to flip",
 * the printed art says "FLIP CARD TO SCAN & VIEW MODEL", and nothing happened.
 */
export function FlipCard({
  card,
  defaultFace = "front",
  flipped = false,
  className = "",
}: {
  card: CardEntry;
  defaultFace?: "front" | "back";
  /** Turns the card over without a pointer — used by the auto-playing show. */
  flipped?: boolean;
  className?: string;
}) {
  const restingOnBack = defaultFace === "back";
  const [tapped, setTapped] = useState(false);
  const turned = flipped || tapped;
  const otherFace = restingOnBack ? "front" : "scan code";

  return (
    <div
      className={`flip ${className}`}
      data-resting={restingOnBack ? "back" : "front"}
      data-flip={turned ? "on" : undefined}
      tabIndex={0}
      role="button"
      aria-pressed={turned}
      onClick={NO_HOVER ? () => setTapped((t) => !t) : undefined}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setTapped((t) => !t);
        }
      }}
      aria-label={`${card.title} — ${card.category} card, ${card.code}. ${
        NO_HOVER ? "Tap" : "Hover"
      } to see the ${otherFace}.`}
      style={{ outline: "none", cursor: NO_HOVER ? "pointer" : undefined }}
    >
      <div className="flip-inner" style={{ aspectRatio: CARD_RATIO }}>
        <img
          src={card.front}
          alt=""
          className="flip-face object-contain"
          draggable={false}
        />
        <img
          src={card.back}
          alt=""
          loading="lazy"
          className="flip-face flip-face--back object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
}

export function CardMeta({
  card,
  index,
}: {
  card: CardEntry;
  index?: number;
}) {
  const activity = card.category === "ACTIVITY";
  return (
    <div className="mt-6 border-t border-electric/10 pt-4">
      <div className="flex items-center justify-between gap-3">
        <span
          className={[
            "rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.24em]",
            activity
              ? "bg-coral/12 text-coral"
              : "bg-electric/8 text-electric",
          ].join(" ")}
        >
          {card.category}
        </span>
        {index !== undefined && (
          <span className="font-display text-lg leading-none text-ink/45">
            {String(index).padStart(2, "0")}
          </span>
        )}
      </div>
      <p className="mt-3.5 font-display text-xl leading-snug text-ink">
        {card.title}
      </p>
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <span className="text-[11px] text-ink-soft/75">{card.action}</span>
        <span className="whitespace-nowrap font-mono text-[9px] tracking-wider text-ink/60">
          {card.code}
        </span>
      </div>
    </div>
  );
}
