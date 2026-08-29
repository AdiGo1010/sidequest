import Link from "next/link";
import { Arrow, TaskCard } from "@/components/task-card";
import { CATEGORIES, TRUST_STATS } from "@/lib/categories";
import { SEED } from "@/lib/seed";

export default function HomePage() {
  const open = SEED.tasks.filter((t) => t.status === "open").slice(0, 6);

  return (
    <div className="pb-0">
      <section className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-16">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-ink">
          <span aria-hidden>✦</span>
          NOW LIVE IN SYDNEY, MELBOURNE & BRISBANE
        </div>
        <h1 className="mt-7 max-w-3xl text-[2.4rem] font-bold leading-[1.12] tracking-tight sm:text-6xl">
          Earn money doing what you&apos;re{" "}
          <span className="sq-underline">good at</span>
          <span className="mt-2 block text-[1.55rem] font-semibold sm:text-4xl">
            — for students, by students.
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-ink-soft sm:text-lg">
          Skip the rejection emails. Pick up real freelance gigs from people in your
          city — cleaning, design, tutoring, deliveries. Cash in your account by the
          weekend.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/tasks"
            className="inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 text-[15px] font-medium text-white"
          >
            Find Work <Arrow />
          </Link>
          <Link
            href="/tasks/new"
            className="inline-flex items-center gap-2 rounded-full border border-ink bg-lime px-7 py-3.5 text-[15px] font-medium text-ink"
          >
            Post a Task <Arrow />
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-2 text-xs font-medium text-ink-soft">
          {["Get paid in 24h", ".edu.au verified", "Rent the gear"].map((t) => (
            <span key={t} className="rounded-full bg-white/80 px-3 py-1.5">
              {t}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-3 px-5 sm:grid-cols-4 sm:px-8">
        {[
          { n: "12,400+", l: "Tasks completed" },
          { n: "3,200+", l: "Active students" },
          { n: `$${TRUST_STATS.avgHourly}`, l: "Avg. hourly earn" },
          { n: String(TRUST_STATS.universities), l: "Universities" },
        ].map((s) => (
          <div key={s.l} className="rounded-3xl bg-white px-5 py-6">
            <p className="text-2xl font-bold tracking-tight sm:text-3xl">{s.n}</p>
            <p className="mt-1 text-xs text-ink-soft sm:text-sm">{s.l}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-20 w-full max-w-6xl px-5 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-ink-soft">BROWSE</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Pick your side quest
            </h2>
          </div>
          <Link href="/tasks" className="text-sm font-medium">
            All categories →
          </Link>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              href={`/tasks?category=${encodeURIComponent(c.name)}`}
              className="sq-card flex items-center gap-4 rounded-3xl bg-white px-5 py-5"
            >
              <span className="text-2xl" aria-hidden>
                {c.emoji}
              </span>
              <span>
                <span className="block font-semibold">{c.name}</span>
                <span className="text-sm text-ink-soft">{c.blurb}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 grid w-full max-w-6xl gap-6 px-5 sm:grid-cols-2 sm:px-8">
        <div className="rounded-3xl bg-white p-8">
          <p className="text-xs font-semibold tracking-widest text-ink-soft">
            FOR STUDENTS
          </p>
          <h2 className="mt-2 text-2xl font-bold">Side cash, on your schedule</h2>
          <ol className="mt-6 space-y-4 text-sm leading-6">
            <li>
              <span className="font-semibold">01</span> — Sign up free with your
              .edu.au email
            </li>
            <li>
              <span className="font-semibold">02</span> — Browse local tasks & apply
              with one tap
            </li>
            <li>
              <span className="font-semibold">03</span> — Get the job done & cash hits
              your bank
            </li>
          </ol>
        </div>
        <div className="rounded-3xl bg-white p-8">
          <p className="text-xs font-semibold tracking-widest text-ink-soft">
            FOR CLIENTS
          </p>
          <h2 className="mt-2 text-2xl font-bold">Get help, fast & affordable</h2>
          <ol className="mt-6 space-y-4 text-sm leading-6">
            <li>
              <span className="font-semibold">01</span> — Post your task — title,
              budget, deadline
            </li>
            <li>
              <span className="font-semibold">02</span> — Pick from verified student
              applicants
            </li>
            <li>
              <span className="font-semibold">03</span> — Pay only when the job&apos;s
              complete
            </li>
          </ol>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-6xl px-5 sm:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-ink-soft">LIVE NOW</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Fresh tasks today
            </h2>
          </div>
          <Link href="/tasks" className="text-sm font-medium">
            View all →
          </Link>
        </div>
        <div className="mt-8 space-y-4">
          {open.map((t) => {
            const client = SEED.profiles.find((p) => p.id === t.clientId);
            const applied = SEED.applications.filter((a) => a.taskId === t.id).length;
            return (
              <TaskCard key={t.id} task={t} client={client} applied={applied} />
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-6xl px-5 sm:px-8">
        <p className="text-xs font-semibold tracking-widest text-ink-soft">
          EQUIPMENT RENTAL
        </p>
        <h2 className="mt-2 max-w-xl text-3xl font-bold tracking-tight">
          Don&apos;t own it? Rent it.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-ink-soft">
          Take on jobs you couldn&apos;t otherwise. Power tools, cleaning gear, design
          tablets — all available by the day from city hubs.
        </p>
        <div className="mt-6 flex gap-3 text-3xl" aria-hidden>
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sand">
            🔩
          </span>
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sand">
            🧹
          </span>
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sand">
            💦
          </span>
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sand">
            🪜
          </span>
        </div>
        <Link
          href="/equipment"
          className="mt-6 inline-flex rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-white"
        >
          Browse equipment
        </Link>
      </section>

      <section className="mt-20 bg-navy px-5 py-16 text-center text-white sm:px-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Your next paycheque is one tap away.
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-lime px-6 py-3 text-sm font-medium text-ink"
          >
            Join as a student
          </Link>
          <Link
            href="/tasks/new"
            className="rounded-full border border-white/30 px-6 py-3 text-sm font-medium"
          >
            Post your first task
          </Link>
        </div>
      </section>
    </div>
  );
}
