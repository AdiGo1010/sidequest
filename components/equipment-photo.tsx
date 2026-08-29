function iconFor(name: string, category: string) {
  const n = name.toLowerCase();
  if (n.includes("pressure")) return "💦";
  if (n.includes("steam") || n.includes("mop") || n.includes("caddy")) return "🧹";
  if (n.includes("dolly") || n.includes("blanket")) return "🛒";
  if (n.includes("dslr") || n.includes("camera") || n.includes("lens")) return "📷";
  if (n.includes("drill") || n.includes("driver")) return "🔩";
  if (n.includes("bike") || n.includes("pannier") || n.includes("cargo")) return "🚲";
  if (category === "Cleaning") return "🧽";
  if (category === "Moving") return "📦";
  if (category === "Graphic Design") return "🎨";
  if (category === "Tech Help") return "💻";
  if (category === "Delivery") return "📦";
  if (category === "Tutoring") return "📚";
  return "🧰";
}

export function GearWell({ category, name }: { category: string; name: string }) {
  return (
    <div className="flex h-36 items-center justify-center rounded-t-3xl bg-sand">
      <span className="text-5xl" aria-hidden>
        {iconFor(name, category)}
      </span>
      <span className="sr-only">{name}</span>
    </div>
  );
}
