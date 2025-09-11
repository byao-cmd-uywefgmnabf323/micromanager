import { Habit, HabitEntry } from "./storage";
import { addDays, parseYYYYMMDD, toYYYYMMDD } from "./date";

export function computeCurrentStreak(habit: Habit, entries: HabitEntry[]): number {
  // Count consecutive days from today backwards with status=done
  if (!entries.length) return 0;
  const byDate = new Map<string, HabitEntry[]>();
  for (const e of entries) {
    if (e.habitId !== habit.id) continue;
    const arr = byDate.get(e.date) || [];
    arr.push(e);
    byDate.set(e.date, arr);
  }
  let streak = 0;
  let day = new Date();
  day.setHours(0, 0, 0, 0);
  while (true) {
    const key = toYYYYMMDD(day);
    const list = byDate.get(key) || [];
    const doneToday = list.some((e) => e.status === "done");
    if (doneToday) {
      streak += 1;
      day = addDays(day, -1);
    } else {
      break;
    }
  }
  return streak;
}

export function computeBestStreak(habit: Habit, entries: HabitEntry[]): number {
  // Scan all entries sorted by date, count runs of consecutive done days
  const dates = Array.from(
    new Set(
      entries.filter((e) => e.habitId === habit.id && e.status === "done").map((e) => e.date)
    )
  ).sort();
  if (dates.length === 0) return 0;
  let best = 1;
  let current = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = parseYYYYMMDD(dates[i - 1]);
    const cur = parseYYYYMMDD(dates[i]);
    const diff = (cur.getTime() - prev.getTime()) / (1000 * 3600 * 24);
    if (diff === 1) {
      current += 1;
    } else {
      best = Math.max(best, current);
      current = 1;
    }
  }
  best = Math.max(best, current);
  return best;
}
