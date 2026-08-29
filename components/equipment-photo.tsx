const ICONS: Record<string, string> = {
  Cleaning: "🧹",
  Moving: "🛒",
  "Graphic Design": "💧",
  "Tech Help": "🔩",
  Delivery: "📦",
  Tutoring: "📚",
};

export function GearWell({ category, name }: { category: string; name: string }) {
  return (
    <div className="flex h-36 items-center justify-center rounded-t-3xl bg-sand">
      <span className="text-5xl" aria-hidden>
        {ICONS[category] ?? "🧰"}
      </span>
      <span className="sr-only">{name}</span>
    </div>
  );
}
