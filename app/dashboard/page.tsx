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
  const pending = apps.filter((a) => a.status === "pending");

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-ink-soft">
            WELCOME BACK
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            Hey, {me.fullName.split(" ")[0]}
          </h1>
        </div>
        <Link
          href="/profile"
          className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm"
        >
          View profile
        </Link>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="TOTAL EARNINGS"
          value={`$${me.totalEarnings.toLocaleString()}`}
          hint="this month on SideQuest"
        />
        <Stat
          label="TASKS COMPLETED"
          value={String(me.completedTasks)}
          hint={`${done.length} on record here`}
        />
        <Stat
          label="ACTIVE APPLICATIONS"
          value={String(apps.length)}
          hint={`${pending.length} pending`}
        />
        <div className="rounded-3xl bg-navy p-6 text-white">
          <p className="text-xs font-semibold tracking-widest text-white/60">RATING</p>
          <p className="mt-3 text-3xl font-bold">{me.rating} ★</p>
          <p className="mt-1 text-sm text-lime">from {me.reviewCount} reviews</p>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold">Active applications</h2>
          <ul className="mt-4 space-y-2">
            {apps.map((a) => {
              const t = state.tasks.find((x) => x.id === a.taskId);
              if (!t) return null;
              return (
                <li key={a.id}>
                  <Link
                    href={`/tasks/${t.id}`}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-4"
                  >
                    <span>
                      <span className="block font-medium">{t.title}</span>
                      <span className="text-xs text-ink-soft">
                        {a.status} · {t.location}
                      </span>
                    </span>
                    <span className="font-semibold">${t.budget}</span>
                  </Link>
                </li>
              );
            })}
            {apps.length === 0 ? (
              <li className="text-sm text-ink-soft">Apply from Find Work.</li>
            ) : null}
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold">Recently completed</h2>
          <ul className="mt-4 space-y-2">
            {done.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/tasks/${t.id}`}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-4"
                >
                  <span>
                    <span className="block font-medium">{t.title}</span>
                    <span className="text-xs text-ink-soft">Paid · completed</span>
                  </span>
                  <span className="font-semibold">${t.budget}</span>
                </Link>
              </li>
            ))}
            {done.length === 0 ? (
              <li className="text-sm text-ink-soft">Finish a gig and it lands here.</li>
            ) : null}
          </ul>
          <Link href="/calendar" className="mt-6 inline-block text-sm font-medium">
            Suggest gigs from your calendar →
          </Link>
        </section>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-6">
      <p className="text-xs font-semibold tracking-widest text-ink-soft">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-ink-soft">{hint}</p>
    </div>
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
