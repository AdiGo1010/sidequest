"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Arrow } from "@/components/task-card";
import { resetDemo } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/lib/use-app";

export default function LoginPage() {
  const { login } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const sb = createClient();
      if (sb) {
        const password =
          (e.currentTarget.querySelector('input[type="password"]') as HTMLInputElement)
            ?.value ?? "";
        const { error: authError } = await sb.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) {
          try {
            login(email);
          } catch {
            throw authError;
          }
        } else {
          try {
            login(email);
          } catch {
            /* supabase user without local demo profile */
          }
        }
      } else {
        login(email);
      }
      const stored = JSON.parse(
        window.localStorage.getItem("sidequest-state-v2") ||
          window.localStorage.getItem("sidequest-state-v1") ||
          "{}",
      ) as { currentUserId?: string; profiles?: { id: string; role: string }[] };
      const role = stored.profiles?.find((p) => p.id === stored.currentUserId)?.role;
      await router.push(role === "client" ? "/my-tasks" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log in");
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-5 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Log in</h1>
      <p className="mt-2 text-sm leading-6 text-ink-soft">
        Try a demo student:{" "}
        <button
          type="button"
          className="font-medium text-ink underline"
          onClick={() => setEmail("maya.chen@student.unsw.edu.au")}
        >
          maya.chen@student.unsw.edu.au
        </button>{" "}
        or client:{" "}
        <button
          type="button"
          className="font-medium text-ink underline"
          onClick={() => setEmail("priya@localstudio.co")}
        >
          priya@localstudio.co
        </button>
        . Password is not checked in demo mode.
      </p>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <label className="text-sm font-medium">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3"
          />
        </label>
        <label className="text-sm font-medium">
          Password
          <input
            type="password"
            defaultValue="demo"
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3"
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink py-3 font-medium text-lime"
        >
          Log in <Arrow />
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-soft">
        New here?{" "}
        <Link href="/signup" className="font-medium text-ink">
          Join free
        </Link>
      </p>
      <button
        type="button"
        className="mt-6 w-full text-center text-xs text-ink-soft underline"
        onClick={() => {
          resetDemo();
          setEmail("");
        }}
      >
        Reset demo data in this browser
      </button>
    </div>
  );
}
