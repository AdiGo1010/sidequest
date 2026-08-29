import type { Category, Task } from "./types";

export type BusyBlock = { start: Date; end: Date };

const WORK_START_HOUR = 8;
const WORK_END_HOUR = 20;
const MIN_GAP_MS = 2 * 60 * 60 * 1000;

export function freeWindows(busy: BusyBlock[], days = 7): BusyBlock[] {
  const windows: BusyBlock[] = [];
  const now = new Date();
  for (let d = 0; d < days; d++) {
    const day = new Date(now);
    day.setDate(now.getDate() + d);
    const start = new Date(day);
    start.setHours(WORK_START_HOUR, 0, 0, 0);
    const end = new Date(day);
    end.setHours(WORK_END_HOUR, 0, 0, 0);
    if (end <= now) continue;
    const windowStart = start < now ? new Date(now.getTime() + 15 * 60 * 1000) : start;
    const dayBusy = busy
      .filter((b) => b.end > windowStart && b.start < end)
      .map((b) => ({
        start: b.start < windowStart ? windowStart : b.start,
        end: b.end > end ? end : b.end,
      }))
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    let cursor = windowStart;
    for (const block of dayBusy) {
      if (block.start.getTime() - cursor.getTime() >= MIN_GAP_MS) {
        windows.push({ start: new Date(cursor), end: new Date(block.start) });
      }
      if (block.end > cursor) cursor = block.end;
    }
    if (end.getTime() - cursor.getTime() >= MIN_GAP_MS) {
      windows.push({ start: new Date(cursor), end: new Date(end) });
    }
  }
  return windows.slice(0, 6);
}

export function matchTaskToWindow(
  tasks: Task[],
  location: string,
  skills: string[],
): Task | undefined {
  const open = tasks.filter((t) => t.status === "open");
  const local = open.filter((t) => t.location === location);
  const skillMatch = local.find((t) => skills.includes(t.category));
  return skillMatch ?? local[0] ?? open[0];
}

export function categoryForTask(task?: Task, skills?: string[]): Category {
  if (task) return task.category;
  if (skills?.[0]) return skills[0] as Category;
  return "Delivery";
}
