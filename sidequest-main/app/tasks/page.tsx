"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TaskCard } from "@/components/task-card";
import { CATEGORIES, CITIES } from "@/lib/categories";
import { useApp } from "@/lib/use-app";
import type { Category } from "@/lib/types";

function TasksInner() {
  const { state } = useApp();
  const params = useSearchParams();
  const router = useRouter();
  const [category, setCategory] = useState(params.get("category") ?? "");
  const [location, setLocation] = useState(params.get("location") ?? "");
  const [minPay, setMinPay] = useState(params.get("min") ?? "");
  const [posted, setPosted] = useState(params.get("posted") ?? "");

  function sync(next: {
    category?: string;
    location?: string;
    min?: string;
    posted?: string;
  }) {
    const p = new URLSearchParams();
    const cat = next.category ?? category;
    const loc = next.location ?? location;
    const min = next.min ?? minPay;
    const post = next.posted ?? posted;
    if (cat) p.set("category", cat);
    if (loc) p.set("location", loc);
    if (min) p.set("min", min);
    if (post) p.set("posted", post);
    router.replace(p.toString() ? `/tasks?${p}` : "/tasks");
  }

  const tasks = useMemo(() => {
    return state.tasks.filter((t) => {
      if (category && t.category !== (category as Category)) return false;
      if (location && t.location !== location) return false;
      if (minPay && t.budget < Number(minPay)) return false;
      if (posted) {
        const age = Date.now() - new Date(t.createdAt).getTime();
        if (age > Number(posted) * 86400000) return false;
      }
      return true;
    });
  }, [state.tasks, category, location, minPay, posted]);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Find work</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">
        Filter by what you&apos;re actually good at, where you can get to, and what
        pays enough for the tram home.
      </p>
      <div className="mt-6 grid gap-3 rounded-3xl border border-black/5 bg-white/60 p-4 sm:grid-cols-4">
        <label className="text-xs font-medium tracking-wide text-ink-soft">
          Category
          <select
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-sm text-ink"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              sync({ category: e.target.value });
            }}
          >
            <option value="">Any</option>
            {CATEGORIES.map((c) => (
              <option key={c.name}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium tracking-wide text-ink-soft">
          Location
          <select
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-sm text-ink"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              sync({ location: e.target.value });
            }}
          >
            <option value="">Any</option>
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium tracking-wide text-ink-soft">
          Min pay
          <select
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-sm text-ink"
            value={minPay}
            onChange={(e) => {
              setMinPay(e.target.value);
              sync({ min: e.target.value });
            }}
          >
            <option value="">Any</option>
            <option value="40">$40+</option>
            <option value="80">$80+</option>
            <option value="150">$150+</option>
          </select>
        </label>
        <label className="text-xs font-medium tracking-wide text-ink-soft">
          Date posted
          <select
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-sm text-ink"
            value={posted}
            onChange={(e) => {
              setPosted(e.target.value);
              sync({ posted: e.target.value });
            }}
          >
            <option value="">Any time</option>
            <option value="1">Last day</option>
            <option value="7">Last week</option>
            <option value="30">Last month</option>
          </select>
        </label>
      </div>
      <p className="mt-6 text-sm text-ink-soft">{tasks.length} tasks</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} />
        ))}
      </div>
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-ink-soft">Loading tasks…</div>}>
      <TasksInner />
    </Suspense>
  );
}
