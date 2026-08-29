"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { TaskCard } from "@/components/task-card";
import { CATEGORIES, CITIES } from "@/lib/categories";
import { useApp } from "@/lib/use-app";
import type { Category } from "@/lib/types";

function TasksInner() {
  const { state } = useApp();
  const params = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "");
  const [location, setLocation] = useState(params.get("location") ?? "");
  const [maxPay, setMaxPay] = useState(params.get("max") ?? "500");

  function sync(next: { q?: string; category?: string; location?: string; max?: string }) {
    const p = new URLSearchParams();
    const query = next.q ?? q;
    const cat = next.category ?? category;
    const loc = next.location ?? location;
    const max = next.max ?? maxPay;
    if (query) p.set("q", query);
    if (cat) p.set("category", cat);
    if (loc) p.set("location", loc);
    if (max && max !== "500") p.set("max", max);
    router.replace(p.toString() ? `/tasks?${p}` : "/tasks");
  }

  const tasks = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return state.tasks.filter((t) => {
      if (category && t.category !== (category as Category)) return false;
      if (location && t.location !== location) return false;
      if (maxPay && t.budget > Number(maxPay)) return false;
      if (needle) {
        const hay = `${t.title} ${t.description} ${t.category}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [state.tasks, category, location, maxPay, q]);

  return (
    <div>
      <PageHero
        title="Find your next gig."
        subtitle={`${tasks.length} live tasks across Australia`}
      >
        <form
          className="mx-auto mt-8 flex max-w-2xl overflow-hidden rounded-full bg-white p-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            sync({ q });
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tasks..."
            className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-ink outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-lime"
          >
            Search
          </button>
        </form>
      </PageHero>

      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[240px_1fr] sm:px-8">
        <aside>
          <p className="text-xs font-semibold tracking-wide text-ink-soft">Category</p>
          <div className="mt-3 flex flex-wrap gap-2 lg:flex-col">
            <FilterPill
              active={!category}
              onClick={() => {
                setCategory("");
                sync({ category: "" });
              }}
            >
              All
            </FilterPill>
            {CATEGORIES.map((c) => (
              <FilterPill
                key={c.name}
                active={category === c.name}
                onClick={() => {
                  setCategory(c.name);
                  sync({ category: c.name });
                }}
              >
                {c.emoji} {c.name}
              </FilterPill>
            ))}
          </div>
          <p className="mt-8 text-xs font-semibold tracking-wide text-ink-soft">
            Location
          </p>
          <select
            className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              sync({ location: e.target.value });
            }}
          >
            <option value="">Anywhere</option>
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <p className="mt-8 text-xs font-semibold tracking-wide text-ink-soft">
            Max budget
          </p>
          <p className="mt-1 text-lg font-semibold">${maxPay}</p>
          <input
            type="range"
            min={20}
            max={500}
            step={10}
            value={Number(maxPay)}
            onChange={(e) => {
              setMaxPay(e.target.value);
              sync({ max: e.target.value });
            }}
            className="mt-2 w-full accent-navy"
          />
        </aside>
        <div>
          <p className="text-sm text-ink-soft">Showing {tasks.length} tasks</p>
          <div className="mt-4 space-y-4">
            {tasks.map((t) => {
              const client = state.profiles.find((p) => p.id === t.clientId);
              const applied = state.applications.filter((a) => a.taskId === t.id).length;
              return (
                <TaskCard key={t.id} task={t} client={client} applied={applied} />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-2 text-left text-sm ${
        active ? "bg-navy text-white" : "border border-black/10 bg-white"
      }`}
    >
      {children}
    </button>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-ink-soft">Loading tasks…</div>}>
      <TasksInner />
    </Suspense>
  );
}
