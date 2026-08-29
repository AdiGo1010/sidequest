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
          BUILT BY STUDENTS, FOR STUDENTS
        </div>
        <h1 className="mt-7 max-w-3xl text-[2.15rem] font-bold leading-[1.14] tracking-tight sm:text-5xl">
          What if every student could turn free time, skills, and unused gear into{" "}
          <span className="sq-underline">paid work</span>
          <span className="mt-3 block text-[1.35rem] font-semibold leading-snug sm:text-3xl">
            — without high fees or endless applications?
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg">
          This is SideQuest: a marketplace built for university students who want
          flexible freelance work that fits around their studies. Lower fees, real
          opportunities, and equipment rental — so any student can take on any task.
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
        <p className="mt-6 max-w-2xl text-sm leading-6 text-ink-soft">
          Not Airtasker. Not Fiverr. The difference is you — we&apos;re built for
          students tired of the same line:{" "}
          <span className="italic text-ink">
            “Unfortunately, we&apos;ve decided to progress with other applicants.”
          </span>
        </p>
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

      <section className="mx-auto mt-20 grid w-full max-w-6xl gap-6 px-5 sm:grid-cols-2 sm:px-8">
        <div className="rounded-3xl bg-white p-8">
          <p className="text-xs font-semibold tracking-widest text-ink-soft">
            GETTING STARTED
          </p>
          <h2 className="mt-2 text-2xl font-bold">Join as a student — or post work</h2>
          <p className="mt-4 text-sm leading-6 text-ink-soft">
            Sign up on Login or Join. Students who want to accept tasks register with a
            valid .edu.au email. Other emails can still join and post work, but can&apos;t
            take student tasks.
          </p>
          <Link href="/signup" className="mt-5 inline-block text-sm font-medium">
            Join free →
          </Link>
        </div>
        <div className="rounded-3xl bg-white p-8">
          <p className="text-xs font-semibold tracking-widest text-ink-soft">
            THE DASHBOARD
          </p>
          <h2 className="mt-2 text-2xl font-bold">Your command centre</h2>
          <p className="mt-4 text-sm leading-6 text-ink-soft">
            Task history, hours worked, earnings, and an illustrative tax figure for
            your return. International students are capped at 48 hours per fortnight —
            extra applications block once you hit it. Domestic students have no cap.
            The Ask SideQuest chat (bottom right) answers how-to questions and matches
            you with open tasks.
          </p>
          <Link href="/dashboard" className="mt-5 inline-block text-sm font-medium">
            Open dashboard →
          </Link>
        </div>
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
            Find Work →
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

      <section className="mx-auto mt-20 grid w-full max-w-6xl gap-6 px-5 lg:grid-cols-3 sm:px-8">
        <div className="rounded-3xl bg-white p-8">
          <p className="text-xs font-semibold tracking-widest text-ink-soft">
            FINDING WORK
          </p>
          <h2 className="mt-2 text-xl font-bold">Filter around your life</h2>
          <p className="mt-3 text-sm leading-6 text-ink-soft">
            Category, location, pay, date, and job type. Sync Google Calendar and we
            surface jobs that fit around class. Recommendations use your licences and
            experience — a driver&apos;s licence or gardening hours means more of those
            jobs.
          </p>
        </div>
        <div className="rounded-3xl bg-white p-8">
          <p className="text-xs font-semibold tracking-widest text-ink-soft">
            POSTING WORK
          </p>
          <h2 className="mt-2 text-xl font-bold">Pay like an adult</h2>
          <p className="mt-3 text-sm leading-6 text-ink-soft">
            Description, location, date, budget, skills, and gear. Tasks start at $40+,
            always at or above minimum wage — no youth wage discount. If you&apos;re doing
            the job, you get paid like an adult.
          </p>
        </div>
        <div className="rounded-3xl bg-white p-8">
          <p className="text-xs font-semibold tracking-widest text-ink-soft">
            HOW JOBS MATCH
          </p>
          <h2 className="mt-2 text-xl font-bold">Profile, then dual ratings</h2>
          <p className="mt-3 text-sm leading-6 text-ink-soft">
            List skills and certifications; we recommend tasks that fit. Taskers and
            posters rate each other — like Uber. Higher rating, faster approvals.
          </p>
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
          Don&apos;t own the tools? Rent them.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-ink-soft">
          Cleaning supplies, gardening gear, or whatever the task needs — cheaper than
          buying for a one-off, so you can deliver better work and a stronger rating.
        </p>
        <Link
          href="/equipment"
          className="mt-6 inline-flex rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-white"
        >
          Browse equipment
        </Link>
      </section>

      <section className="mt-20 bg-navy px-5 py-16 text-center text-white sm:px-8">
        <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
          Join us — and start your first Side Quest today.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/70">
          Find opportunities. Get tasks completed. Build your future. Students earn,
          gain experience, rent gear, and manage hours. Posters get verified, reliable
          student help when they need it.
        </p>
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
