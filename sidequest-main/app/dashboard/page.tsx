"use client";

import Link from "next/link";
import { useApp } from "@/lib/use-app";

export default function DashboardPage() {
  const { me, state } = useApp();

  if (!me) {
    return (
      <Gate href="/login" label="Log in to see your dashboard" />
    );
  }
  if (me.role !== "student") {
    return <Gate href="/my-tasks" label="Client accounts live on My tasks" />;
  }

  const apps = state.applications.filter((a) => a.studentId === me.id);
  const done = state.tasks.filter(
    (t) => t.hiredStudentId === me.id && t.status === "completed",
  );
  const active = state.tasks.filter(
    (t) => t.hiredStudentId === me.id && t.status === "in_progress",
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Hi {me.fullName.split(" ")[0]} — {me.uni}
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat n={`$${me.totalEarnings}`} l="total earnings" />
        <Stat n={String(apps.length)} l="applications" />
        <Stat n={String(done.length)} l="completed jobs" />
      </div>
      <section className="mt-10">
        <h2 className="text-lg font-semibold">Active jobs</h2>
        <List
          items={active.map((t) => ({
            href: `/tasks/${t.id}`,
            title: t.title,
            meta: `$${t.budget} · ${t.location}`,
          }))}
          empty="No jobs in progress yet."
        />
      </section>
      <section className="mt-8">
        <h2 className="text-lg font-semibold">Applications</h2>
        <List
          items={apps.map((a) => {
            const t = state.tasks.find((x) => x.id === a.taskId);
            return {
              href: `/tasks/${a.taskId}`,
              title: t?.title ?? "Task",
              meta: a.status,
            };
          })}
          empty="Apply from Find Work."
        />
      </section>
      <section className="mt-8">
        <h2 className="text-lg font-semibold">Completed</h2>
        <List
          items={done.map((t) => ({
            href: `/tasks/${t.id}`,
            title: t.title,
            meta: `$${t.budget}`,
          }))}
          empty="Finish a gig and it lands here."
        />
      </section>
      <Link
        href="/calendar"
        className="mt-10 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-lime"
      >
        Suggest gigs from your calendar
      </Link>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
      <p className="text-2xl font-bold">{n}</p>
      <p className="text-sm text-ink-soft">{l}</p>
    </div>
  );
}

function List({
  items,
  empty,
}: {
  items: { href: string; title: string; meta: string }[];
  empty: string;
}) {
  if (!items.length) return <p className="mt-2 text-sm text-ink-soft">{empty}</p>;
  return (
    <ul className="mt-3 space-y-2">
      {items.map((i) => (
        <li key={i.href + i.title}>
          <Link
            href={i.href}
            className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3 text-sm"
          >
            <span className="font-medium">{i.title}</span>
            <span className="capitalize text-ink-soft">{i.meta}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Gate({ href, label }: { href: string; label: string }) {
  return (
    <div className="mx-auto max-w-md px-5 py-16 text-center">
      <Link href={href} className="font-medium">
        {label}
      </Link>
    </div>
  );
}
