export const MIN_TASK_BUDGET = 40;
export const INTERNATIONAL_FORTNIGHT_HOURS = 48;

export function estimatedTaskHours(task: {
  budget: number;
  estimatedHours?: number;
}) {
  return task.estimatedHours ?? Math.max(1, Math.round(task.budget / 40));
}

/** Illustrative only — not tax advice. */
export function taxEstimate(earnings: number) {
  const atFifteen = Math.round(earnings * 0.15);
  const underThreshold = earnings < 18200;
  return { atFifteen, underThreshold };
}
