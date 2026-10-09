export function Polaroid({
  src,
  caption,
  rotate,
  index,
  className = "",
}: {
  src: string;
  caption: string;
  rotate: number;
  index?: number;
  className?: string;
}) {
  return (
    <figure
      className={[
        "group relative flex-none cursor-pointer rounded-[3px] bg-white p-2.5 pb-0 transition-transform duration-500 ease-out hover:z-10",
        className,
      ].join(" ")}
      style={{
        transform: `rotate(${rotate}deg)`,
        boxShadow:
          "0 1px 2px rgba(12,24,72,0.10), 0 18px 34px -14px rgba(12,24,72,0.45)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "rotate(0deg) scale(1.09) translateY(-6px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${rotate}deg)`;
      }}
    >
      <div className="relative overflow-hidden">
        <img
          src={src}
          alt={caption}
          loading="lazy"
          className="block h-36 w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <figcaption className="flex items-baseline justify-between gap-2 px-0.5 py-2.5">
        <span className="truncate font-mono text-[9px] uppercase tracking-[0.06em] text-ink/60">
          {caption}
        </span>
        {index !== undefined && (
          <span className="font-mono text-[10px] text-ink/55">
            {String(index).padStart(2, "0")}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
