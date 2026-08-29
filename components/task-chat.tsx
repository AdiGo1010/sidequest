"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/use-app";

export function TaskChat({ taskId }: { taskId: string }) {
  const { me, state, sendMessage } = useApp();
  const [body, setBody] = useState("");
  const task = state.tasks.find((t) => t.id === taskId);
  if (!me || !task) return null;

  const isClient = me.id === task.clientId;
  const applied = state.applications.some(
    (a) => a.taskId === taskId && a.studentId === me.id,
  );
  const hired = task.hiredStudentId === me.id;
  if (!isClient && !applied && !hired) return null;

  const thread = state.messages
    .filter((m) => m.taskId === taskId)
    .slice()
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return (
    <section className="mt-10 rounded-3xl bg-white p-6">
      <h2 className="font-semibold">Messages</h2>
      <p className="mt-1 text-xs text-ink-soft">
        {isClient
          ? "Chat with applicants. Accept or reject them from My tasks."
          : "Chat with the poster. They can accept or reject your request."}
      </p>
      <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto">
        {thread.map((m) => {
          const from = state.profiles.find((p) => p.id === m.fromId);
          const mine = m.fromId === me.id;
          return (
            <li
              key={m.id}
              className={`rounded-2xl px-3 py-2 text-sm ${
                mine ? "ml-8 bg-lime/40" : "mr-8 bg-sand"
              }`}
            >
              <p className="text-[11px] font-medium text-ink-soft">
                {from?.fullName ?? "Someone"}
              </p>
              <p className="mt-0.5">{m.body}</p>
            </li>
          );
        })}
        {thread.length === 0 ? (
          <li className="text-sm text-ink-soft">No messages yet.</li>
        ) : null}
      </ul>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(taskId, body);
          setBody("");
        }}
      >
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a message…"
          className="min-w-0 flex-1 rounded-full border border-black/10 px-4 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-full bg-navy px-4 py-2 text-sm font-medium text-white"
        >
          Send
        </button>
      </form>
      {isClient ? (
        <Link href="/my-tasks" className="mt-4 inline-block text-sm font-medium">
          Accept or reject applicants →
        </Link>
      ) : null}
    </section>
  );
}
