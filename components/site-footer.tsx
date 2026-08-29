import Link from "next/link";
import { BrandMark } from "./broom-logo";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-auto border-t border-black/5 bg-white/40">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 sm:grid-cols-4 sm:px-8">
        <div className="sm:col-span-2">
          <BrandMark />
          <p className="mt-4 max-w-sm text-sm leading-6 text-ink-soft">
            Built by students, for students. Turn free time, skills, and unused gear
            into paid work — lower fees, real opportunities, equipment when you need
            it.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">For Students</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li>
              <Link href="/tasks">Find work</Link>
            </li>
            <li>
              <Link href="/equipment">Rent equipment</Link>
            </li>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/inbox">Inbox</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">For Clients</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li>
              <Link href="/tasks/new">Post a task</Link>
            </li>
            <li>
              <Link href="/my-tasks">My tasks</Link>
            </li>
            <li>
              <Link href="/terms">Terms</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="mx-auto max-w-6xl px-5 pb-8 text-xs text-ink-soft sm:px-8">
        © 2026 SideQuest Pty Ltd · ABN pending · Made in Australia
      </p>
    </footer>
  );
}
