"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Message = { role: "user" | "assistant"; content: string };

export default function SupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey! Ask me anything about using SideQuest." },
  ]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const next = [...messages, { role: "user" as const, content: input }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/support-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply }]);
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
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-3 flex h-96 w-80 flex-col rounded-xl border bg-white shadow-xl"
          >
            <div className="border-b p-3 font-semibold">SideQuest Support</div>
            <div className="flex-1 space-y-2 overflow-y-auto p-3 text-sm">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                  <span
                    className={`inline-block rounded-lg px-3 py-2 ${
                      m.role === "user" ? "bg-black text-white" : "bg-gray-100"
                    }`}
                  >
                    {m.content}
                  </span>
                </div>
              ))}
              {loading && <div className="text-gray-400">Typing…</div>}
            </div>
            <div className="flex gap-2 border-t p-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask a question…"
                className="flex-1 rounded border px-2 py-1 text-sm"
              />
              <button
                onClick={sendMessage}
                className="rounded bg-black px-3 py-1 text-sm text-white"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-full bg-black px-4 py-3 text-white shadow-lg"
      >
        {open ? "✕" : "Help"}
      </button>
    </div>
  );
}
