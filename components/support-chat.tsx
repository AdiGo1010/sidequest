"use client";

import { useEffect, useRef, useState } from "react";
import { ChatMarkdown } from "@/components/chat-markdown";
import { useApp } from "@/lib/use-app";

type Message = { role: "user" | "assistant"; content: string };

export function SupportChat() {
  const { me, state } = useApp();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey — I can help you use SideQuest, and match you with open tasks that fit your skills. What are you looking for?",
    },
  ]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, loading, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const openTasks = state.tasks
        .filter((t) => t.status === "open")
        .map((t) => ({
          id: t.id,
          title: t.title,
          category: t.category,
          budget: t.budget,
          location: t.location,
        }));
      const res = await fetch("/api/support-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next,
          tasks: openTasks,
          profile:
            me?.role === "student"
              ? {
                  skills: me.skills,
                  licences: me.licences,
                  location: me.location,
                }
              : undefined,
        }),
      });
      const data = (await res.json()) as { reply?: string };
      setMessages([
        ...next,
        {
          role: "assistant",
          content: data.reply ?? "Something went wrong — try again.",
        },
      ]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Something went wrong — try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open ? (
        <div className="flex h-[28rem] w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_16px_50px_rgba(11,18,25,0.18)]">
          <div className="flex items-center justify-between bg-navy px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">SideQuest helper</p>
              <p className="text-[11px] text-white/60">Ask how it works · get task matches</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full px-2 text-lg leading-none text-white/80"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
          <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto px-3 py-3 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <div
                  className={`inline-block max-w-[90%] rounded-2xl px-3 py-2 leading-5 ${
                    m.role === "user"
                      ? "whitespace-pre-wrap bg-navy text-left text-white"
                      : "bg-sand text-ink"
                  }`}
                >
                  {m.role === "assistant" ? <ChatMarkdown text={m.content} /> : m.content}
                </div>
              </div>
            ))}
            {loading ? <p className="text-xs text-ink-soft">Thinking…</p> : null}
          </div>
          <form
            className="flex gap-2 border-t border-black/5 p-2"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask or describe a gig…"
              className="min-w-0 flex-1 rounded-full border border-black/10 bg-cream px-3 py-2 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-lime px-4 py-2 text-sm font-medium text-ink disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded-full bg-navy px-5 py-3 text-sm font-medium text-lime shadow-lg"
      >
        {open ? "Close" : "Ask SideQuest"}
      </button>
    </div>
  );
}
