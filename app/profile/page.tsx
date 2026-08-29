"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/use-app";

export default function ProfilePage() {
  const { me, updateProfile, state } = useApp();
  const [bio, setBio] = useState(me?.bio ?? "");
  const [skills, setSkills] = useState(me?.skills.join(", ") ?? "");
  const [licences, setLicences] = useState((me?.licences ?? []).join(", "));

  if (!me) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-center">
        <Link href="/login">Log in to edit your profile</Link>
      </div>
    );
  }

  const reviews = state.reviews.filter((r) => r.toId === me.id);
  const completed = state.tasks.filter(
    (t) => t.hiredStudentId === me.id && t.status === "completed",
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{me.fullName}</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {me.role === "student" ? me.uni : "Client"} · {me.location}
            {me.verifiedBadge ? " · Verified student" : ""}
            {me.residency === "international" ? " · International visa on file" : ""}
          </p>
        </div>
        {me.verifiedBadge ? (
          <span className="rounded-full bg-lime px-3 py-1 text-xs font-bold">
            VERIFIED
          </span>
        ) : (
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs">
            Verified badge (coming soon)
          </span>
        )}
      </div>
      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          updateProfile({
            bio,
            skills: skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            licences: licences
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          });
        }}
      >
        <label className="block text-sm font-medium">
          Bio
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 min-h-28 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3"
          />
        </label>
        <label className="block text-sm font-medium">
          Skills (comma separated)
          <input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3"
          />
        </label>
        {me.role === "student" ? (
          <label className="block text-sm font-medium">
            Licences & certifications (comma separated)
            <input
              value={licences}
              onChange={(e) => setLicences(e.target.value)}
              placeholder="e.g. Driver licence, RSA"
              className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3"
            />
          </label>
        ) : null}
        <button type="submit" className="rounded-full bg-ink px-5 py-2 text-sm text-lime">
          Save profile
        </button>
      </form>
      <section className="mt-10">
        <h2 className="font-semibold">Ratings</h2>
        <p className="text-sm text-ink-soft">
          {me.rating} ★ from {me.reviewCount} reviews · {me.completedTasks} completed
          tasks · ${me.totalEarnings} earned
        </p>
        <ul className="mt-4 space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl bg-white/70 px-4 py-3 text-sm">
              {r.rating} ★ — {r.comment}
            </li>
          ))}
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
