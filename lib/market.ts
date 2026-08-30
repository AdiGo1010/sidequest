import type { AppState } from "./types";

export type MarketSlice = Pick<
  AppState,
  "profiles" | "tasks" | "applications" | "messages" | "reviews"
>;

function mergeById<T extends { id: string }>(a: T[], b: T[]) {
  const map = new Map<string, T>();
  for (const row of a) map.set(row.id, row);
  for (const row of b) map.set(row.id, row);
  return [...map.values()];
}

export function emptyMarket(): MarketSlice {
  return {
    profiles: [],
    tasks: [],
    applications: [],
    messages: [],
    reviews: [],
  };
}

export function mergeMarket(local: MarketSlice, remote: MarketSlice): MarketSlice {
  return {
    profiles: mergeById(local.profiles, remote.profiles),
    tasks: mergeById(local.tasks, remote.tasks),
    applications: mergeById(local.applications, remote.applications),
    messages: mergeById(local.messages, remote.messages),
    reviews: mergeById(local.reviews, remote.reviews),
  };
}

export function sliceMarket(state: AppState): MarketSlice {
  return {
    profiles: state.profiles,
    tasks: state.tasks,
    applications: state.applications,
    messages: state.messages,
    reviews: state.reviews,
  };
}
