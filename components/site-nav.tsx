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
  { href: "/inbox", label: "Inbox" },
];

export function SiteNav() {
  const pathname = usePathname();
  const { me, logout } = useApp();

  function hrefFor(l: (typeof links)[number]) {
    if (l.href === "/dashboard" && me?.role === "client") return "/my-tasks";
    return l.href;
  }

  function active(l: (typeof links)[number]) {
    const href = hrefFor(l);
    return pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
  }

  return (
    <>
    <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
      <Link href="/" className="shrink-0">
        <BrandMark compact />
      </Link>
      <nav className="hidden items-center gap-1 text-[14px] font-medium text-ink md:flex">
        {links.map((l) => (
          <Link
            key={l.href}
            href={hrefFor(l)}
            className={`rounded-full px-4 py-2 transition ${
              active(l) ? "bg-sand" : "hover:bg-sand/60"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3 text-[14px] font-medium">
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
          className="rounded-full bg-navy px-4 py-2 text-sm text-lime"
        >
          {me ? (me.role === "client" ? "My tasks" : "Dashboard") : "Join free"}
        </Link>
      </div>
    </header>
    <nav className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-5 pb-3 text-xs font-medium md:hidden sm:px-8">
      {links.map((l) => (
        <Link
          key={l.href}
          href={hrefFor(l)}
          className={`shrink-0 rounded-full px-3 py-1.5 ${
            active(l) ? "bg-sand" : "bg-white/70"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
    </>
  );
}
