import type { Category } from "./types";

export const CATEGORIES: { name: Category; blurb: string; icon: string }[] = [
  { name: "Cleaning", blurb: "Kitchens, sharehouses, post-party resets", icon: "spark" },
  { name: "Delivery", blurb: "Campus runs, parcels, last-minute drops", icon: "bike" },
  { name: "Tutoring", blurb: "Stats, chem, essays, first-year survival", icon: "book" },
  { name: "Graphic Design", blurb: "Posters, decks, club merch, logos", icon: "pen" },
  { name: "Moving", blurb: "Utes, boxes, O-week apartment shuffle", icon: "box" },
  { name: "Tech Help", blurb: "Wi-Fi, laptops, printers that hate you", icon: "chip" },
];

export const CITIES = ["Sydney", "Melbourne", "Brisbane"] as const;
