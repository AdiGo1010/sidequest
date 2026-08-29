"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/use-app";
import type { TaskStatus } from "@/lib/types";

export default function MyTasksPage() {
  const { me, state, hireApplicant, completeTask, leaveReview } = useApp();
  const [tab, setTab] = useState<TaskStatus>("open");

  if (!me) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-center">
        <Link href="/login">Log in as a client to manage tasks</Link>
      </div>
    );
  }
  if (me.role !== "client") {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-center">
        <Link href="/dashboard">Students use the dashboard</Link>
      </div>
    );
  }

  const mine = state.tasks.filter((t) => t.clientId === me.id && t.status === tab);

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My tasks</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Open, in progress, done — pick who you hire from ratings, not vibes alone.
          </p>
        </div>
        <Link
          href="/tasks/new"
          className="rounded-full bg-lime px-4 py-2 text-sm font-medium"
        >
          Post a task
        </Link>
      </div>
      <div className="mt-6 flex gap-2">
        {(["open", "in_progress", "completed"] as TaskStatus[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setTab(s)}
            className={`rounded-full px-4 py-2 text-sm capitalize ${
              tab === s ? "bg-ink text-lime" : "bg-white/70"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>
      <div className="mt-8 space-y-6">
        {mine.map((task) => {
          const apps = state.applications.filter((a) => a.taskId === task.id);
          return (
            <article
              key={task.id}
              className="rounded-3xl border border-black/5 bg-white/70 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link href={`/tasks/${task.id}`} className="text-lg font-semibold">
                    {task.title}
                  </Link>
                  <p className="text-sm text-ink-soft">
                    ${task.budget} · {task.location}
                  </p>
                </div>
                {task.status === "in_progress" ? (
                  <button
                    type="button"
                    onClick={() => completeTask(task.id)}
                    className="rounded-full bg-ink px-4 py-2 text-sm text-lime"
                  >
                    Mark complete
                  </button>
                ) : null}
              </div>
              {task.status === "open" ? (
                <div className="mt-5 space-y-3">
                  <p className="text-sm font-medium">Applicants</p>
                  {apps.length === 0 ? (
                    <p className="text-sm text-ink-soft">None yet.</p>
                  ) : (
                    apps.map((a) => {
                      const student = state.profiles.find((p) => p.id === a.studentId);
                      if (!student) return null;
                      return (
                        <div
                          key={a.id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-cream/80 px-4 py-3"
                        >
                          <div>
                            <Link
                              href={`/profile/${student.id}`}
                              className="font-medium"
                            >
                              {student.fullName}
                              {student.verifiedBadge ? " · verified" : ""}
                            </Link>
                            <p className="text-xs text-ink-soft">
                              {student.rating} ★ ({student.reviewCount}) ·{" "}
                              {student.completedTasks} jobs
                            </p>
                            <p className="mt-1 text-sm">{a.message}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => hireApplicant(task.id, student.id)}
                            className="rounded-full bg-lime px-4 py-2 text-sm font-medium"
                          >
                            Hire
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : null}
              {task.status === "completed" && task.hiredStudentId ? (
                <ReviewBox
                  toId={task.hiredStudentId}
                  taskId={task.id}
                  already={state.reviews.some(
                    (r) => r.taskId === task.id && r.fromId === me.id,
                  )}
                  onSubmit={(rating, comment) =>
                    leaveReview(task.id, task.hiredStudentId!, rating, comment)
                  }
                />
              ) : null}
            </article>
          );
        })}
        {mine.length === 0 ? (
          <p className="text-sm text-ink-soft">Nothing in this column.</p>
        ) : null}
      </div>
    </div>
  );
}

function ReviewBox({
  already,
  onSubmit,
}: {
  toId: string;
  taskId: string;
  already: boolean;
  onSubmit: (rating: number, comment: string) => void;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  if (already) return <p className="mt-4 text-sm text-ink-soft">Review saved.</p>;
  return (
    <form
      className="mt-4 flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(rating, comment);
      }}
    >
      <label className="text-sm">
        Rate the student
        <input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="ml-2 w-16 rounded-xl border border-black/10 px-2 py-1"
        />
      </label>
      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="How did it go?"
        className="rounded-2xl border border-black/10 px-3 py-2 text-sm"
      />
      <button type="submit" className="self-start text-sm font-medium">
        Leave review
      </button>
    </form>
  );
}
