import { SEED } from "./seed";
import { sliceMarket } from "./market";
import type { AppState } from "./types";

const KEY = "sidequest-state-v2";

let memory: AppState | null = null;
const listeners = new Set<() => void>();
let pushTimer: ReturnType<typeof setTimeout> | null = null;

function cloneSeed(): AppState {
  return structuredClone(SEED);
}

function normalise(state: AppState): AppState {
  if (!Array.isArray(state.messages)) state.messages = [];
  state.profiles = state.profiles.map((p) => ({
    ...p,
    licences: p.licences ?? [],
    fortnightHours: p.fortnightHours ?? 0,
    residency: p.residency ?? (p.role === "student" ? "domestic" : undefined),
  }));
  return state;
}

export function getSnapshot(): AppState {
  if (memory) return memory;
  if (typeof window === "undefined") return cloneSeed();
  try {
    const raw = window.localStorage.getItem(KEY);
    memory = raw ? normalise(JSON.parse(raw) as AppState) : cloneSeed();
  } catch {
    memory = cloneSeed();
  }
  return memory;
}

export function getServerSnapshot(): AppState {
  return SEED;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function persistLocal(next: AppState) {
  memory = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  }
  listeners.forEach((l) => l());
}

function queuePush() {
  if (typeof window === "undefined") return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    const body = sliceMarket(getSnapshot());
    void fetch("/api/market", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => {
      /* keep local copy if the shared db is unreachable */
    });
  }, 400);
}

export function setState(
  updater: (prev: AppState) => AppState,
  opts?: { persistRemote?: boolean },
) {
  const next = updater(structuredClone(getSnapshot()));
  persistLocal(next);
  if (opts?.persistRemote !== false) queuePush();
}

export function applyRemoteSlice(
  slice: ReturnType<typeof sliceMarket>,
) {
  setState(
    (s) => ({
      ...s,
      profiles: slice.profiles.length ? slice.profiles : s.profiles,
      tasks: slice.tasks.length ? slice.tasks : s.tasks,
      applications: slice.applications.length ? slice.applications : s.applications,
      messages: slice.messages,
      reviews: slice.reviews.length ? slice.reviews : s.reviews,
    }),
    { persistRemote: false },
  );
}

export function resetDemo() {
  memory = cloneSeed();
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(KEY);
  }
  listeners.forEach((l) => l());
}

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
