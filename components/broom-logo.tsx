export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <img
        src="/brand/sidequest-logo.jpg"
        alt="SideQuest"
        className={
          compact
            ? "h-11 w-auto max-w-[140px] object-contain object-left mix-blend-multiply"
            : "h-14 w-auto max-w-[180px] object-contain object-left mix-blend-multiply"
        }
      />
      <span className="rounded-full bg-lime px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-ink">
        AU
      </span>
    </span>
  );
}
