"use client";

import Link from "next/link";
import { GearWell } from "@/components/equipment-photo";
import { PageHero } from "@/components/page-hero";
import { useApp } from "@/lib/use-app";

export default function EquipmentPage() {
  const { state } = useApp();

  return (
    <div>
      <PageHero
        title="Rent the gear. Take the gig."
        subtitle="Tools, cleaning supplies, gardening gear — cheaper than buying for a one-off, so you can deliver better work."
      />
      <div className="mx-auto grid w-full max-w-6xl gap-4 px-5 py-10 sm:grid-cols-2 lg:grid-cols-4 sm:px-8">
        {state.equipment.map((item) => (
          <Link
            key={item.id}
            href={`/equipment/${item.id}`}
            className="sq-card overflow-hidden rounded-3xl bg-white"
          >
            <GearWell category={item.category} name={item.name} />
            <div className="p-4">
              <p className="text-xs text-ink-soft">
                {item.category} · Hub {item.location}
              </p>
              <h2 className="mt-1 font-semibold">{item.name}</h2>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-semibold">${item.dailyRate}/day</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    item.available ? "bg-navy text-white" : "bg-black/10 text-ink-soft"
                  }`}
                >
                  Book
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
