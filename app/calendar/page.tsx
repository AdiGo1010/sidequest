"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Arrow } from "@/components/task-card";
import { categoryForTask, matchTaskToWindow } from "@/lib/calendar-suggest";
import { useApp } from "@/lib/use-app";

type RemoteEvent = { id?: string | null; title: string; start?: string; end?: string };
type WindowSlot = { start: string; end: string };

export default function CalendarPage() {
  const { me, state, generateSuggestions, confirmSuggestion } = useApp();
  const [remote, setRemote] = useState<{
    connected: boolean;
    events: RemoteEvent[];
    windows: WindowSlot[];
  } | null>(null);
  const [pushError, setPushError] = useState("");

  useEffect(() => {
    fetch("/api/google/events")
      .then((r) => r.json())
      .then(setRemote)
      .catch(() => setRemote({ connected: false, events: [], windows: [] }));
  }, []);

  async function confirm(id: string, title: string, start: string, end: string, location?: string) {
    setPushError("");
    confirmSuggestion(id, { title, start, end });
    if (remote?.connected) {
      const res = await fetch("/api/google/events/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, start, end, location }),
      });
      if (!res.ok) {
        setPushError("Saved on SideQuest. Connect Google (or reconnect) to push to Calendar.");
      }
    }
  }

  const googleSuggestions =
    me && remote?.connected
      ? remote.windows.slice(0, 4).map((w, i) => {
          const task = matchTaskToWindow(state.tasks, me.location, me.skills);
          const category = categoryForTask(task, me.skills);
          return {
            id: `g-${i}-${w.start}`,
            category,
            reason: `Free ${formatRange(w.start, w.end)}. ${
              task
                ? `“${task.title}” in ${task.location} ($${task.budget}) fits this window.`
                : `A ${category} gig would slot in here.`
            }`,
            start: w.start,
            end: w.end,
            task,
            confirmed: state.calendarEvents.some(
              (e) => e.start === w.start && e.source === "sidequest",
            ),
          };
        })
      : [];

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Calendar quests</h1>
      <p className="mt-3 text-sm leading-7 text-ink-soft">
        Connect Google Calendar. SideQuest only surfaces jobs that fit around class
        — then writes confirmed gigs back onto the calendar.
      </p>

      {!me || me.role !== "student" ? (
        <p className="mt-8 text-sm">
          <Link href="/login" className="font-medium">
            Log in as a student
          </Link>{" "}
          to connect a calendar.
        </p>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/api/google/connect"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-lime"
            >
              {remote?.connected ? "Reconnect Google" : "Connect Google Calendar"}{" "}
              <Arrow />
            </a>
            <button
              type="button"
              onClick={generateSuggestions}
              className="inline-flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-sm font-medium"
            >
              Suggest from demo timetable
            </button>
          </div>
          {remote?.connected ? (
            <p className="mt-3 text-xs text-ink-soft">Google is connected for this browser.</p>
          ) : (
            <p className="mt-3 text-xs text-ink-soft">
              Without Google keys, demo mode still works — we fake class gaps.
            </p>
          )}

          {remote?.connected && remote.events.length ? (
            <section className="mt-10">
              <h2 className="font-semibold">Coming up</h2>
              <ul className="mt-3 space-y-2">
                {remote.events.slice(0, 8).map((e) => (
                  <li
                    key={e.id ?? e.title}
                    className="rounded-2xl bg-white/70 px-4 py-3 text-sm"
                  >
                    <span className="font-medium">{e.title}</span>
                    <span className="ml-2 text-ink-soft">
                      {e.start ? formatRange(e.start, e.end ?? e.start) : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mt-10">
            <h2 className="font-semibold">Suggestions</h2>
            <ul className="mt-3 space-y-3">
              {googleSuggestions.map((s) => (
                <li key={s.id} className="rounded-3xl border border-black/5 bg-white/70 p-5">
                  <p className="text-xs font-medium tracking-wide text-ink-soft">
                    {s.category}
                  </p>
                  <p className="mt-2 text-sm leading-6">{s.reason}</p>
                  {s.confirmed ? (
                    <p className="mt-3 text-xs font-medium">On your SideQuest calendar.</p>
                  ) : (
                    <button
                      type="button"
                      className="mt-3 text-sm font-medium"
                      onClick={() =>
                        confirm(
                          s.id,
                          `SideQuest · ${s.task?.title ?? s.category}`,
                          s.start,
                          s.end,
                          s.task?.location,
                        )
                      }
                    >
                      Confirm & add to calendar
                    </button>
                  )}
                </li>
              ))}
              {state.suggestions
                .filter((s) => s.studentId === me.id)
                .map((s) => (
                  <li key={s.id} className="rounded-3xl border border-black/5 bg-white/70 p-5">
                    <p className="text-xs font-medium tracking-wide text-ink-soft">
                      {s.category}
                    </p>
                    <p className="mt-2 text-sm leading-6">{s.reason}</p>
                    {s.confirmed ? (
                      <p className="mt-3 text-xs font-medium">Confirmed.</p>
                    ) : (
                      <button
                        type="button"
                        className="mt-3 text-sm font-medium"
                        onClick={() => {
                          const task = state.tasks.find((t) => t.id === s.taskId);
                          confirm(
                            s.id,
                            `SideQuest · ${task?.title ?? s.category}`,
                            s.start,
                            s.end,
                            task?.location,
                          );
                        }}
                      >
                        Confirm & add to calendar
                      </button>
                    )}
                  </li>
                ))}
            </ul>
            {!googleSuggestions.length &&
            !state.suggestions.filter((s) => s.studentId === me.id).length ? (
              <p className="mt-2 text-sm text-ink-soft">
                Connect Google or generate demo suggestions.
              </p>
            ) : null}
          </section>

          {pushError ? <p className="mt-4 text-sm text-red-700">{pushError}</p> : null}

          <section className="mt-10">
            <h2 className="font-semibold">Confirmed on SideQuest</h2>
            <ul className="mt-3 space-y-2">
              {state.calendarEvents
                .filter((e) => e.source === "sidequest")
                .map((e) => (
                  <li key={e.id} className="rounded-2xl bg-white/70 px-4 py-3 text-sm">
                    {e.title}
                    <span className="ml-2 text-ink-soft">
                      {formatRange(e.start, e.end)}
                    </span>
                  </li>
                ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}

function formatRange(start: string, end: string) {
  const a = new Date(start);
  const b = new Date(end);
  const sameDay = a.toDateString() === b.toDateString();
  const d = a.toLocaleString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
  const t = b.toLocaleString("en-AU", { hour: "numeric", minute: "2-digit" });
  return sameDay ? `${d} – ${t}` : `${d} → ${t}`;
}
