import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mx-auto mt-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-10 text-sm text-ink-soft sm:px-8">
      <p>SideQuest AU — for students, by students.</p>
      <div className="flex gap-5">
        <Link href="/calendar" className="hover:text-ink">
          Calendar
        </Link>
        <Link href="/terms" className="hover:text-ink">
          Terms
        </Link>
        <Link href="/privacy" className="hover:text-ink">
          Privacy
        </Link>
      </div>
    </footer>
  );
}
