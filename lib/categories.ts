import type { Category } from "./types";

export const CATEGORIES: { name: Category; blurb: string; emoji: string }[] = [
  { name: "Cleaning", blurb: "Kitchens, sharehouses, post-party resets", emoji: "🧽" },
  { name: "Delivery", blurb: "Campus runs, parcels, last-minute drops", emoji: "📦" },
  { name: "Tutoring", blurb: "Stats, chem, essays, first-year survival", emoji: "📚" },
  { name: "Graphic Design", blurb: "Posters, decks, club merch, logos", emoji: "🎨" },
  { name: "Moving", blurb: "Utes, boxes, O-week apartment shuffle", emoji: "🛻" },
  { name: "Tech Help", blurb: "Wi-Fi, laptops, printers that hate you", emoji: "💻" },
  { name: "Other", blurb: "Anything else — name the category yourself", emoji: "✏️" },
];

export const CITIES = ["Sydney", "Melbourne", "Brisbane"] as const;

export const TRUST_STATS = {
  tasksCompleted: 12400,
  activeStudents: 3200,
  avgHourly: 48,
  universities: 27,
};
