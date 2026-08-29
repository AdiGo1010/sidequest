"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Arrow } from "@/components/task-card";
import { CATEGORIES, CITIES } from "@/lib/categories";
import { MIN_TASK_BUDGET } from "@/lib/compliance";
import { useApp } from "@/lib/use-app";
import type { Category, JobType } from "@/lib/types";

export default function NewTaskPage() {
  const { me, postTask } = useApp();
  const router = useRouter();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Cleaning" as Category,
    customCategory: "",
    budget: 80,
    location: "Sydney",
    deadline: "",
    jobType: "one_off" as JobType,
    requiredSkills: "",
    requiredEquipment: "",
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
    if (form.category === "Other" && !form.customCategory.trim()) {
      setError("Type the exact category — e.g. pet sitting, photography, IKEA build");
      return;
    }
    if (form.budget < MIN_TASK_BUDGET) {
      setError(`Pay starts at $${MIN_TASK_BUDGET}+ — adult rate, no youth wage.`);
      return;
    }
    try {
      const id = postTask({
        ...form,
        customCategory:
          form.category === "Other" ? form.customCategory.trim() : undefined,
      });
      router.push(`/tasks/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not publish");
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl px-5 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Post a task</h1>
      <p className="mt-2 text-sm leading-6 text-ink-soft">
        Description, location, date, budget, and any skills or equipment. Tasks start
        at ${MIN_TASK_BUDGET}+ — at or above minimum wage, no youth discount.
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
        {form.category === "Other" ? (
          <label className="text-sm font-medium">
            What kind of job is it, exactly?
            <input
              required
              value={form.customCategory}
              onChange={(e) => setForm({ ...form, customCategory: e.target.value })}
              placeholder="e.g. Pet sitting, IKEA assembly, event staffing"
              className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3"
            />
          </label>
        ) : null}
        <label className="text-sm font-medium">
          Job type
          <select
            value={form.jobType}
            onChange={(e) =>
              setForm({ ...form, jobType: e.target.value as JobType })
            }
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3"
          >
            <option value="one_off">One-off</option>
            <option value="ongoing">Ongoing</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          Budget (AUD) — min ${MIN_TASK_BUDGET}
          <input
            required
            type="number"
            min={MIN_TASK_BUDGET}
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3"
          />
        </label>
        <label className="text-sm font-medium">
          Required skills (optional)
          <input
            value={form.requiredSkills}
            onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })}
            placeholder="e.g. driver's licence, gardening"
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3"
          />
        </label>
        <label className="text-sm font-medium">
          Required equipment (optional)
          <input
            value={form.requiredEquipment}
            onChange={(e) =>
              setForm({ ...form, requiredEquipment: e.target.value })
            }
            placeholder="e.g. steam mop — or rent on SideQuest"
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
