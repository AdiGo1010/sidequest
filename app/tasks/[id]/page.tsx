"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Arrow } from "@/components/task-card";
import { TaskChat } from "@/components/task-chat";
import { categoryLabel } from "@/lib/format";
import { useApp } from "@/lib/use-app";

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { state, me, applyToTask } = useApp();
  const router = useRouter();
  const task = state.tasks.find((t) => t.id === id);
  const client = state.profiles.find((p) => p.id === task?.clientId);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const applied = state.applications.some(
    (a) => a.taskId === id && a.studentId === me?.id,
  );

  if (!task) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16 text-center">
        <p>That quest wandered off.</p>
        <Link href="/tasks" className="mt-4 inline-block font-medium">
          Back to Find Work
        </Link>
      </div>
    );
  }

  function apply(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!me) {
      router.push("/login");
      return;
    }
    if (me.role !== "student") {
      setError("Only students can apply");
      return;
    }
    try {
      applyToTask(id, message || "I can take this on.");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not apply");
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
      <p className="text-sm font-medium text-ink-soft">{categoryLabel(task)}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">{task.title}</h1>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <span className="rounded-full bg-white/70 px-3 py-1">${task.budget}</span>
        <span className="rounded-full bg-white/70 px-3 py-1">{task.location}</span>
        <span className="rounded-full bg-white/70 px-3 py-1">Due {task.deadline}</span>
        <span className="rounded-full bg-white/70 px-3 py-1 capitalize">
          {(task.jobType ?? "one_off").replace("_", "-")}
        </span>
        <span className="rounded-full bg-white/70 px-3 py-1 capitalize">
          {task.status.replace("_", " ")}
        </span>
      </div>
      <p className="mt-8 text-base leading-8 text-ink-soft">{task.description}</p>
      {task.requiredSkills ? (
        <p className="mt-4 text-sm">
          <span className="font-medium">Skills:</span> {task.requiredSkills}
        </p>
      ) : null}
      {task.requiredEquipment ? (
        <p className="mt-2 text-sm">
          <span className="font-medium">Equipment:</span> {task.requiredEquipment}{" "}
          <Link href="/equipment" className="font-medium">
            Rent on SideQuest
          </Link>
        </p>
      ) : null}
      {client ? (
        <Link
          href={`/profile/${client.id}`}
          className="mt-6 inline-block text-sm font-medium"
        >
          Posted by {client.fullName}
        </Link>
      ) : null}

      {task.status === "open" && (
        <form
          onSubmit={apply}
          className="mt-10 rounded-3xl border border-black/5 bg-white/70 p-6"
        >
          <h2 className="font-semibold">Apply</h2>
          {applied ? (
            <p className="mt-3 text-sm text-ink-soft">Application sent.</p>
          ) : (
            <>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="A short note — availability, gear, why you’re a fit."
                className="mt-3 min-h-28 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
              />
              {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
              <button
                type="submit"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-sm font-medium"
              >
                Apply <Arrow />
              </button>
            </>
          )}
        </form>
      )}
      <TaskChat taskId={id} />
    </div>
  );
}
