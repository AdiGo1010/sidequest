export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <img
        src="/brand/sidequest-script.png"
        alt="SideQuest"
        className={
          compact
            ? "h-[4.25rem] w-auto max-w-[220px] object-contain object-left sm:h-20 sm:max-w-[260px]"
            : "h-24 w-auto max-w-[320px] object-contain object-left sm:h-28 sm:max-w-[380px]"
        }
        style={{
          filter: "invert(1)",
          mixBlendMode: "multiply",
        }}
      />
      <span className="rounded-full bg-lime px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-ink">
        AU
      </span>
    </span>
  );
}
