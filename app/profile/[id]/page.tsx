"use client";

import { use } from "react";
import Link from "next/link";
import { useApp } from "@/lib/use-app";

export default function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { state, me } = useApp();
  const person = state.profiles.find((p) => p.id === id);

  if (!person) {
    return (
      <div className="px-5 py-16 text-center">
        <Link href="/">Profile not found</Link>
      </div>
    );
  }

  if (me?.id === person.id) {
    /* keep public view too */
  }

  const reviews = state.reviews.filter((r) => r.toId === person.id);
  const completed = state.tasks.filter(
    (t) => t.hiredStudentId === person.id && t.status === "completed",
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{person.fullName}</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {person.role === "student" ? person.uni : "Client"} · {person.location}
          </p>
        </div>
        {person.verifiedBadge ? (
          <span className="rounded-full bg-lime px-3 py-1 text-xs font-bold">
            VERIFIED
          </span>
        ) : null}
      </div>
      <p className="mt-6 leading-7 text-ink-soft">{person.bio}</p>
      {person.skills?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {[...person.skills, ...(person.licences ?? [])].map((s) => (
            <span key={s} className="rounded-full bg-white/70 px-3 py-1 text-xs">
              {s}
            </span>
          ))}
        </div>
      ) : null}
      <p className="mt-6 text-sm">
        {person.rating} ★ ({person.reviewCount}) · {person.completedTasks} jobs
        {person.role === "student" ? ` · $${person.totalEarnings} earned` : ""}
      </p>
      <section className="mt-8">
        <h2 className="font-semibold">Reviews</h2>
        <ul className="mt-3 space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl bg-white/70 px-4 py-3 text-sm">
              {r.rating} ★ — {r.comment}
            </li>
          ))}
          {reviews.length === 0 ? (
            <li className="text-sm text-ink-soft">No reviews yet.</li>
          ) : null}
        </ul>
      </section>
      {completed.length ? (
        <section className="mt-8">
          <h2 className="font-semibold">Completed tasks</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {completed.map((t) => (
              <li key={t.id}>
                <Link href={`/tasks/${t.id}`}>{t.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
