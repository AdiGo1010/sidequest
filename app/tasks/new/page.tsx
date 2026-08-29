"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Arrow } from "@/components/task-card";
import { CATEGORIES, CITIES } from "@/lib/categories";
import { useApp } from "@/lib/use-app";
import type { Category } from "@/lib/types";

export default function NewTaskPage() {
  const { me, postTask } = useApp();
  const router = useRouter();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Cleaning" as Category,
    budget: 80,
    location: "Sydney",
    deadline: "",
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!me) {
      router.push("/login");
      return;
    }
    if (me.role !== "client") {
      setError("Switch to a client account to post a task");
      return;
    }
    const id = postTask(form);
    router.push(`/tasks/${id}`);
  }

  return (
    <div className="mx-auto w-full max-w-xl px-5 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Post a task</h1>
      <p className="mt-2 text-sm leading-6 text-ink-soft">
        Lower fees than the usual suspects. Be specific — students apply faster
        when they know the stairs situation.
      </p>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <label className="text-sm font-medium">
          Title
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3"
          />
        </label>
        <label className="text-sm font-medium">
          Description
          <textarea
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 min-h-32 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3"
          />
        </label>
        <label className="text-sm font-medium">
          Category
          <select
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value as Category })
            }
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3"
          >
            {CATEGORIES.map((c) => (
              <option key={c.name}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Budget (AUD)
          <input
            required
            type="number"
            min={20}
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3"
          />
        </label>
        <label className="text-sm font-medium">
          Location
          <select
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3"
          >
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Deadline
          <input
            required
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3"
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-lime py-3 font-medium"
        >
          Publish task <Arrow />
        </button>
      </form>
    </div>
  );
}
