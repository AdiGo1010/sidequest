import Link from "next/link";
import type { Task } from "@/lib/types";

export function TaskCard({ task }: { task: Task }) {
  return (
    <Link
      href={`/tasks/${task.id}`}
      className="sq-card block rounded-3xl border border-black/5 bg-white/70 p-6 backdrop-blur-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-medium tracking-wide">
          {task.category}
        </span>
        <span className="text-lg font-semibold">${task.budget}</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight">
        {task.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
        {task.description}
      </p>
      <div className="mt-5 flex items-center justify-between text-xs text-ink-soft">
        <span>{task.location}</span>
        <span className="capitalize">{task.status.replace("_", " ")}</span>
      </div>
    </Link>
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
