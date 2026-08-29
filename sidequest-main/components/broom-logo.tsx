export function BroomLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="24" cy="24" r="24" fill="#16181d" />
      <path
        d="M29.2 10.2c.55-.55 1.45-.55 2 0l1.6 1.6c.55.55.55 1.45 0 2L21.6 25.6"
        stroke="#c8f542"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M21.2 25.2c-3.2 1.1-6.4 3.4-8.2 6.6 2.8.2 6.2-.6 8.8-2.2 2.6-1.6 4.4-3.6 5.2-5.4-2.1.2-4.1.4-5.8 1Z"
        fill="#c8f542"
      />
      <path
        d="M12.8 32.2c1.8 1.6 4.2 2.8 6.8 3.2"
        stroke="#f7f3ea"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M13.6 34.6c1.6 1.2 3.6 2 5.6 2.2"
        stroke="#f7f3ea"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

export function BrandMark() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <BroomLogo />
      <span className="flex items-center gap-1.5">
        <span className="text-[17px] font-semibold tracking-tight text-ink">
          SideQuest
        </span>
        <span className="rounded-full bg-lime px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-ink">
          AU
        </span>
      </span>
    </span>
  );
}
