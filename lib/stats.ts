import { Habit, HabitEntry } from "./storage";
import { getLastNDates } from "./date";

export function successRate(entries: HabitEntry[], habit?: Habit, days = 7) {
  const dates = new Set(getLastNDates(days));
  let done = 0;
  let total = 0;
  for (const e of entries) {
    if (!dates.has(e.date)) continue;
    if (habit && e.habitId !== habit.id) continue;
    total += 1;
    if (e.status === "done") done += 1;
  }
  const rate = total ? Math.round((done / total) * 100) : 0;
  return { rate, done, total };
}

export function weekdayBreakdown(entries: HabitEntry[], habit?: Habit) {
  const counts = Array(7).fill(0);
  const dones = Array(7).fill(0);
  for (const e of entries) {
    if (habit && e.habitId !== habit.id) continue;
    const d = new Date(e.date + "T00:00:00");
    const w = d.getDay();
    counts[w] += 1;
    if (e.status === "done") dones[w] += 1;
  }
  const pct = counts.map((c, i) => (c ? Math.round((dones[i] / c) * 100) : 0));
  return { counts, dones, pct };
}

export function minutesSummary(entries: HabitEntry[], habit?: Habit, days = 7) {
  const dates = new Set(getLastNDates(days));
  const dayTotals = new Map<string, number>();
  for (const e of entries) {
    if (!dates.has(e.date)) continue;
    if (habit && e.habitId !== habit.id) continue;
    const prev = dayTotals.get(e.date) || 0;
    dayTotals.set(e.date, prev + (e.minutes || 0));
  }
  const total = Array.from(dayTotals.values()).reduce((a, b) => a + b, 0);
  const avg = days ? Math.round(total / days) : 0;
  return { dayTotals, total, avg };
}
