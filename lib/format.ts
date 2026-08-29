export const CITY_STATE: Record<string, string> = {
  Sydney: "NSW",
  Melbourne: "VIC",
  Brisbane: "QLD",
};

export function cityLabel(city: string) {
  const state = CITY_STATE[city];
  return state ? `${city}, ${state}` : city;
}

export function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const h = Math.max(1, Math.round(ms / 3600000));
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export function dueLabel(deadline: string) {
  const d = new Date(deadline + "T12:00:00");
  return `Due ${d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" })}`;
}
