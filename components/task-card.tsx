import Link from "next/link";
import type { Profile, Task } from "@/lib/types";
import { cityLabel, dueLabel, timeAgo } from "@/lib/format";

export function appliedDisplay(task: Task, applicationCount: number) {
  return Math.max(applicationCount, task.appliedHint ?? 0);
}

export function TaskCard({
  task,
  client,
  applied,
}: {
  task: Task;
  client?: Profile;
  applied: number;
}) {
  const n = appliedDisplay(task, applied);
  return (
    <article className="sq-card rounded-3xl border border-black/6 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft">
            <span className="rounded-full bg-sand px-2.5 py-1 font-medium text-ink">
              {task.category}
            </span>
            <span>{timeAgo(task.createdAt)}</span>
            <span>{cityLabel(task.location)}</span>
          </div>
          <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight">
            {task.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-soft">
            {task.description}
          </p>
          <p className="mt-3 text-xs text-ink-soft">
            {client ? `${client.rating} ★ · ${client.completedTasks} tasks · ` : ""}
            {n} applied
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <p className="text-2xl font-bold tracking-tight">${task.budget}</p>
          <p className="text-xs text-ink-soft">{dueLabel(task.deadline)}</p>
          <Link
            href={`/tasks/${task.id}`}
            className="inline-flex items-center rounded-full bg-lime px-4 py-2 text-sm font-medium text-ink"
          >
            View →
          </Link>
        </div>
      </div>
    </article>
  );
}

export function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
