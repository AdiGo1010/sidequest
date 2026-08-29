"use client";

import Link from "next/link";
import { Photo } from "@/components/equipment-photo";
import { useApp } from "@/lib/use-app";

export default function EquipmentPage() {
  const { state } = useApp();

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Equipment rental</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">
        Take jobs you don&apos;t already own the gear for. Daily rates, campus pickup,
        no capital outlay.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {state.equipment.map((item) => (
          <Link
            key={item.id}
            href={`/equipment/${item.id}`}
            className="sq-card overflow-hidden rounded-3xl border border-black/5 bg-white/70"
          >
            <Photo name={item.name} />
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold">{item.name}</h2>
                <span className="text-sm">${item.dailyRate}/day</span>
              </div>
              <p className="mt-2 text-xs text-ink-soft">
                {item.location} · {item.available ? "Available" : "On loan"}
              </p>
              <span className="mt-4 inline-block rounded-full bg-lime px-3 py-1 text-xs font-medium">
                Book
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
