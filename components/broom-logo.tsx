export function BrandMark({
  compact = false,
  onDark = false,
}: {
  compact?: boolean;
  onDark?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/sidequest-script.png"
        alt="SideQuest"
        className={
          compact
            ? "h-[4.25rem] w-auto max-w-[220px] object-contain object-left sm:h-20 sm:max-w-[260px]"
            : "h-24 w-auto max-w-[320px] object-contain object-left sm:h-28 sm:max-w-[380px]"
        }
        style={onDark ? { filter: "invert(1)" } : undefined}
      />
      <span
        className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${
          onDark ? "bg-lime text-ink" : "bg-lime text-ink"
        }`}
      >
        AU
      </span>
    </span>
  );
}
