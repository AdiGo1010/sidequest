import { SEED } from "./seed";
import type { AppState } from "./types";

const KEY = "sidequest-state-v1";

let memory: AppState | null = null;
const listeners = new Set<() => void>();

function cloneSeed(): AppState {
  return structuredClone(SEED);
}

export function getSnapshot(): AppState {
  if (memory) return memory;
  if (typeof window === "undefined") return cloneSeed();
  try {
    const raw = window.localStorage.getItem(KEY);
    memory = raw ? (JSON.parse(raw) as AppState) : cloneSeed();
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

export function setState(updater: (prev: AppState) => AppState) {
  const next = updater(structuredClone(getSnapshot()));
  memory = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  }
  listeners.forEach((l) => l());
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
