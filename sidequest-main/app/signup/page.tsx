"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Arrow } from "@/components/task-card";
import { createClient } from "@/lib/supabase/client";
import { isAustralianUniEmail, uniFromEmail } from "@/lib/uni";
import { useApp } from "@/lib/use-app";
import type { Role } from "@/lib/types";

export default function SignupPage() {
  const { signup } = useApp();
  const router = useRouter();
  const [role, setRole] = useState<Role>("student");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    location: "Sydney",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (role === "student" && !isAustralianUniEmail(form.email)) {
        throw new Error("Students must sign up with a university email (.edu.au)");
      }
      const sb = createClient();
      if (sb) {
        const { error: authError } = await sb.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: form.fullName,
              role,
              location: form.location,
              uni: role === "student" ? uniFromEmail(form.email) : "",
            },
          },
        });
        if (authError) throw authError;
      }
      signup({ ...form, role });
      router.push(role === "student" ? "/dashboard" : "/my-tasks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join");
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-5 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Join free</h1>
      <p className="mt-2 text-sm leading-6 text-ink-soft">
        Students need a .edu.au email. Clients can use any email. Demo accounts
        live in this browser until you connect Supabase.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-2 rounded-full bg-white/60 p-1">
        {(["student", "client"] as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`rounded-full py-2 text-sm font-medium capitalize transition ${
              role === r ? "bg-ink text-lime" : "text-ink"
            }`}
          >
            {r}
          </button>
        ))}
      </div>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <Field
          label="Full name"
          value={form.fullName}
          onChange={(v) => setForm({ ...form, fullName: v })}
        />
        <Field
          label={role === "student" ? "University email" : "Email"}
          type="email"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
        />
        <Field
          label="Password"
          type="password"
          value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
        />
        <label className="text-left text-sm font-medium">
          City
          <select
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          >
            <option>Sydney</option>
            <option>Melbourne</option>
            <option>Brisbane</option>
          </select>
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-lime py-3 font-medium text-ink"
        >
          Create account <Arrow />
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-soft">
        Already here?{" "}
        <Link href="/login" className="font-medium text-ink">
          Log in
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="text-left text-sm font-medium">
      {label}
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3"
      />
    </label>
  );
}
