"use client";

import Link from "next/link";
import { INTERNATIONAL_FORTNIGHT_HOURS, taxEstimate } from "@/lib/compliance";
import { useApp } from "@/lib/use-app";

export default function DashboardPage() {
  const { me, state, leaveReview } = useApp();

  if (!me) {
    return <Gate href="/login" label="Log in to see your dashboard" />;
  }
  if (me.role !== "student") {
    return <Gate href="/my-tasks" label="Client accounts live on My tasks" />;
  }

  const apps = state.applications.filter((a) => a.studentId === me.id);
  const done = state.tasks.filter(
    (t) => t.hiredStudentId === me.id && t.status === "completed",
  );
  const pending = apps.filter((a) => a.status === "pending");
  const hours = me.fortnightHours ?? 0;
  const tax = taxEstimate(me.totalEarnings);
  const remaining =
    me.residency === "international"
      ? Math.max(0, INTERNATIONAL_FORTNIGHT_HOURS - hours)
      : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-ink-soft">
            COMMAND CENTRE
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            Hey, {me.fullName.split(" ")[0]}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink-soft">
            Task history, hours, earnings, and an illustrative tax figure for your
            return.
          </p>
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
          label="HOURS THIS FORTNIGHT"
          value={`${hours}h`}
          hint={
            remaining === null
              ? "Domestic — no cap"
              : `${remaining}h left of ${INTERNATIONAL_FORTNIGHT_HOURS}h visa cap`
          }
        />
        <Stat
          label="ILLUSTRATIVE TAX (15%)"
          value={`$${tax.atFifteen.toLocaleString()}`}
          hint={
            tax.underThreshold
              ? "Under $18,200 FY threshold — not tax advice"
              : "For returns — confirm with ATO / an accountant"
          }
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
          <ul className="mt-4 space-y-4">
            {done.map((t) => (
              <li key={t.id} className="rounded-2xl bg-white px-4 py-4">
                <Link
                  href={`/tasks/${t.id}`}
                  className="flex items-center justify-between gap-3"
                >
                  <span>
                    <span className="block font-medium">{t.title}</span>
                    <span className="text-xs text-ink-soft">Paid · completed</span>
                  </span>
                  <span className="font-semibold">${t.budget}</span>
                </Link>
                <StudentReview
                  already={state.reviews.some(
                    (r) => r.taskId === t.id && r.fromId === me.id,
                  )}
                  onSubmit={(rating, comment) =>
                    leaveReview(t.id, t.clientId, rating, comment)
                  }
                />
              </li>
            ))}
            {done.length === 0 ? (
              <li className="text-sm text-ink-soft">Finish a gig and it lands here.</li>
            ) : null}
          </ul>
          <Link href="/calendar" className="mt-6 inline-block text-sm font-medium">
            Sync calendar — only see jobs around class →
          </Link>
        </section>
      </div>
      <p className="mt-10 text-xs text-ink-soft">
        {pending.length} pending applications · {me.completedTasks} tasks on record
      </p>
    </div>
  );
}

function StudentReview({
  already,
  onSubmit,
}: {
  already: boolean;
  onSubmit: (rating: number, comment: string) => void;
}) {
  if (already) {
    return <p className="mt-2 text-xs text-ink-soft">You rated this poster.</p>;
  }
  return (
    <form
      className="mt-3 flex flex-wrap items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const rating = Number((form.elements.namedItem("rating") as HTMLInputElement).value);
        const comment = (form.elements.namedItem("comment") as HTMLInputElement).value;
        onSubmit(rating, comment);
      }}
    >
      <input
        name="rating"
        type="number"
        min={1}
        max={5}
        defaultValue={5}
        className="w-14 rounded-xl border border-black/10 px-2 py-1 text-xs"
        aria-label="Rate poster"
      />
      <input
        name="comment"
        placeholder="Rate the poster"
        className="min-w-0 flex-1 rounded-xl border border-black/10 px-2 py-1 text-xs"
      />
      <button type="submit" className="text-xs font-medium">
        Save
      </button>
    </form>
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
