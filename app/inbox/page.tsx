"use client";

import Link from "next/link";
import { useApp } from "@/lib/use-app";
import { categoryLabel } from "@/lib/format";

export default function InboxPage() {
  const { me, state } = useApp();

  if (!me) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-center">
        <Link href="/login">Log in to see messages</Link>
      </div>
    );
  }

  const taskIds = new Set(
    state.messages
      .filter((m) => {
        const t = state.tasks.find((x) => x.id === m.taskId);
        if (!t) return false;
        return (
          t.clientId === me.id ||
          t.hiredStudentId === me.id ||
          state.applications.some((a) => a.taskId === t.id && a.studentId === me.id)
        );
      })
      .map((m) => m.taskId),
  );
  state.applications
    .filter((a) => a.studentId === me.id)
    .forEach((a) => taskIds.add(a.taskId));
  state.tasks.filter((t) => t.clientId === me.id).forEach((t) => taskIds.add(t.id));

  const items = [...taskIds]
    .map((id) => state.tasks.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Threads with posters and students on your tasks.
      </p>
      <ul className="mt-8 space-y-2">
        {items.map((t) => {
          const last = state.messages
            .filter((m) => m.taskId === t.id)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
          return (
            <li key={t.id}>
              <Link
                href={`/tasks/${t.id}`}
                className="block rounded-2xl bg-white px-4 py-4"
              >
                <p className="text-xs text-ink-soft">{categoryLabel(t)}</p>
                <p className="font-medium">{t.title}</p>
                <p className="mt-1 line-clamp-1 text-sm text-ink-soft">
                  {last?.body ?? "No messages yet — open to chat."}
                </p>
              </Link>
            </li>
          );
        })}
        {items.length === 0 ? (
          <li className="text-sm text-ink-soft">Nothing in the inbox yet.</li>
        ) : null}
      </ul>
    </div>
  );
}
