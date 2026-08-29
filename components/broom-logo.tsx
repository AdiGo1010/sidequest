export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <SideQuestWordmark compact={compact} />
      <span className="rounded-full bg-lime px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-ink">
        AU
      </span>
    </span>
  );
}

export function SideQuestWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`relative inline-block font-bold leading-none tracking-tight text-ink ${
        compact ? "text-[15px]" : "text-[17px]"
      }`}
      aria-label="SideQuest"
    >
      <span className="relative z-[1] ml-5 block text-[0.82em]">Side</span>
      <span className="relative mt-[1px] block text-[1.12em]">
        <BroomNudge className={compact ? "h-7 w-5" : "h-8 w-6"} />
        Quest
      </span>
    </span>
  );
}

function BroomNudge({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 28 56"
      className={`absolute -left-5 -top-5 ${className}`}
      fill="none"
      aria-hidden
    >
      <path d="M10 10 L18 50" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
      <path
        d="M4 8.2 C8.5 5 16.5 5.2 22 9.2 C16 12.2 10 14 4.8 13.4 C3.2 11.6 2.8 9.4 4 8.2Z"
        fill="currentColor"
      />
      <path
        d="M3.6 11 L7.4 14.4 M6.2 8.6 L10.2 13 M9.4 7.2 L13.2 12.2 M13 7 L16 12"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  );
}
