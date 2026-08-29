"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GearWell } from "@/components/equipment-photo";
import { Arrow } from "@/components/task-card";
import { useApp } from "@/lib/use-app";

export default function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { state, me, bookEquipment } = useApp();
  const router = useRouter();
  const item = state.equipment.find((e) => e.id === id);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!item) {
    return (
      <div className="px-5 py-16 text-center">
        <Link href="/equipment">Listing gone</Link>
      </div>
    );
  }

  function book(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!me) {
      router.push("/login");
      return;
    }
    if (me.role !== "student") {
      setError("Students book equipment for jobs");
      return;
    }
    try {
      bookEquipment(id, start, end);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not book");
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10">
      <div className="overflow-hidden rounded-3xl bg-white">
        <GearWell category={item.category} name={item.name} />
        <div className="p-6">
          <p className="text-xs font-medium tracking-wide text-ink-soft">
            {item.category}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{item.name}</h1>
          <p className="mt-3 leading-7 text-ink-soft">{item.description}</p>
          <p className="mt-4 text-sm">
            ${item.dailyRate} / day · {item.location} ·{" "}
            {item.available ? "Available" : "Currently on loan"}
          </p>
          {done ? (
            <p className="mt-6 text-sm font-medium">Booked. Pickup details in email (soon).</p>
          ) : (
            <form onSubmit={book} className="mt-6 grid gap-3 sm:grid-cols-2">
              <label className="text-sm">
                Start
                <input
                  required
                  type="date"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-black/10 px-3 py-2"
                />
              </label>
              <label className="text-sm">
                End
                <input
                  required
                  type="date"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-black/10 px-3 py-2"
                />
              </label>
              {error ? (
                <p className="sm:col-span-2 text-sm text-red-700">{error}</p>
              ) : null}
              <button
                type="submit"
                className="sm:col-span-2 mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-lime py-3 font-medium"
              >
                Book <Arrow />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
