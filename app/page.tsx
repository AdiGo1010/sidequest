"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Arrow } from "@/components/task-card";
import { CATEGORIES } from "@/lib/categories";
import { TRUST_STATS } from "@/lib/seed";
import { useApp } from "@/lib/use-app";

export default function HomePage() {
  const { state } = useApp();
  const completed =
    TRUST_STATS.tasksCompleted +
    state.tasks.filter((t) => t.status === "completed").length;
  const students =
    TRUST_STATS.activeStudents +
    state.profiles.filter((p) => p.role === "student").length;
  const earnings = TRUST_STATS.avgEarnings;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-5 pb-24 pt-10 text-center sm:px-8 sm:pt-16">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/55 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-ink/80 backdrop-blur-md"
      >
        <Sparkle />
        NOW LIVE IN SYDNEY, MELBOURNE & BRISBANE
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="mt-8 max-w-4xl text-[2.35rem] font-bold leading-[1.12] tracking-tight text-ink sm:text-6xl sm:leading-[1.08]"
      >
        Earn money doing what you&apos;re{" "}
        <span className="sq-underline px-1">good at</span>
        <span className="mt-3 block text-[1.65rem] font-semibold tracking-tight text-ink sm:text-4xl">
          for students, by students
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="mt-7 max-w-2xl text-base leading-8 text-ink-soft sm:text-lg"
      >
        Finding a job in Australia — especially Sydney — is brutal when you&apos;re at
        uni. SideQuest is the marketplace for short gigs, campus-adjacent work, and
        the tools to actually take the job.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-3"
      >
        <Link
          href="/tasks"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-lime shadow-lg shadow-black/10 transition hover:scale-[1.02] hover:bg-black"
        >
          Find Work <Arrow />
        </Link>
        <Link
          href="/tasks/new"
          className="inline-flex items-center gap-2 rounded-full bg-lime px-7 py-3.5 text-[15px] font-medium text-ink shadow-lg shadow-lime/30 transition hover:scale-[1.02] hover:bg-lime-deep"
        >
          Post a Task <Arrow />
        </Link>
      </motion.div>

      <section className="mt-20 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { n: completed.toLocaleString(), l: "tasks completed" },
          { n: students.toLocaleString(), l: "active students" },
          { n: `$${earnings}`, l: "average earnings" },
        ].map((s) => (
          <div
            key={s.l}
            className="rounded-3xl border border-black/5 bg-white/55 px-6 py-7 backdrop-blur-sm"
          >
            <p className="text-3xl font-bold tracking-tight">{s.n}</p>
            <p className="mt-1 text-sm text-ink-soft">{s.l}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 w-full max-w-5xl text-left">
        <h2 className="text-center text-2xl font-semibold tracking-tight">
          Featured quests
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm leading-6 text-ink-soft">
          Pick a lane. Rent the gear if you don&apos;t own it yet.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              href={`/tasks?category=${encodeURIComponent(c.name)}`}
              className="sq-card rounded-3xl border border-black/5 bg-white/70 p-6"
            >
              <p className="text-lg font-semibold">{c.name}</p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Sparkle() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M7 1.2l1.1 3.4L11.5 5.7 8.1 7.4 7 10.8 5.9 7.4 2.5 5.7l3.4-1.1L7 1.2z"
        fill="#16181d"
      />
    </svg>
  );
}
