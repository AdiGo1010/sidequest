"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "./broom-logo";
import { useApp } from "@/lib/use-app";

const links = [
  { href: "/tasks", label: "Find Work" },
  { href: "/tasks/new", label: "Post a Task" },
  { href: "/equipment", label: "Equipment" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/calendar", label: "Calendar" },
];

export function SiteNav() {
  const pathname = usePathname();
  const { me, logout } = useApp();

  return (
    <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 pb-12 sm:px-8 md:pb-5">
      <Link href="/" className="shrink-0 transition-transform hover:scale-[1.02]">
        <BrandMark />
      </Link>
      <nav className="hidden items-center gap-8 text-[14.5px] font-medium text-ink md:flex">
        {links.map((l) => (
          <Link
            key={l.href}
            href={
              l.href === "/dashboard" && me?.role === "client" ? "/my-tasks" : l.href
            }
            className={`transition-opacity hover:opacity-70 ${
              pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href + "/"))
                ? "opacity-100"
                : "opacity-80"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <nav className="absolute left-0 right-0 top-full flex justify-center gap-4 px-4 pb-2 text-xs font-medium md:hidden">
        {links.map((l) => (
          <Link
            key={l.href}
            href={
              l.href === "/dashboard" && me?.role === "client" ? "/my-tasks" : l.href
            }
            className="opacity-80"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-4 text-[14.5px] font-medium">
        {me ? (
          <>
            <Link href="/profile" className="hidden sm:inline hover:opacity-70">
              {me.fullName.split(" ")[0]}
            </Link>
            <button type="button" onClick={logout} className="hover:opacity-70">
              Log out
            </button>
          </>
        ) : (
          <Link href="/login" className="hover:opacity-70">
            Log in
          </Link>
        )}
        <Link
          href={me ? (me.role === "client" ? "/my-tasks" : "/dashboard") : "/signup"}
          className="rounded-full bg-ink px-4 py-2 text-sm text-white shadow-sm transition hover:bg-black"
        >
          {me ? (me.role === "client" ? "My tasks" : "Dashboard") : "Join free"}
        </Link>
      </div>
    </header>
  );
}
