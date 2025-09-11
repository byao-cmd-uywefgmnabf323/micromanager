"use client";

import { Habit, HabitEntry } from "@/lib/storage";
import { successRate, minutesSummary, weekdayBreakdown } from "@/lib/stats";
import { computeCurrentStreak, computeBestStreak } from "@/lib/streaks";
import { getLastNDates } from "@/lib/date";

export type AIContext = {
  summary: {
    activeHabits: number;
    totalEntries: number;
    success7: number;
    success30: number;
  };
  bestWorst: {
    best?: { id: string; title: string; icon?: string; currentStreak: number; bestStreak: number };
    needsAttention?: { id: string; title: string; icon?: string; currentStreak: number; bestStreak: number };
  };
  charts: {
    minutes30: Array<{ date: string; minutes: number }>;
    weekdayPct: Array<{ weekday: string; pct: number }>;
  };
  habits: Array<{ id: string; title: string; icon?: string; category?: string; color?: string; frequency: string; timesPerWeek?: number }>;
};

export function buildAIContext(habits: Habit[], entries: HabitEntry[]): AIContext {
  const active = habits.filter((h) => !h.isArchived);
  const success7 = successRate(entries, undefined, 7).rate;
  const success30 = successRate(entries, undefined, 30).rate;
  const days30 = getLastNDates(30);
  const minutes = minutesSummary(entries, undefined, 30);
  const minutes30 = days30.map((d) => ({ date: d, minutes: minutes.dayTotals.get(d) || 0 }));
  const weekday = weekdayBreakdown(entries);
  const weekdayPct = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((w, i) => ({ weekday: w, pct: weekday.pct[i] }));

  // per-habit "done" counts last 30 days
  const doneCount = new Map<string, number>();
  for (const e of entries) {
    if (e.status !== "done") continue;
    if (!days30.includes(e.date)) continue;
    doneCount.set(e.habitId, (doneCount.get(e.habitId) || 0) + 1);
  }
  let bestId: string | undefined;
  let bestVal = -1;
  for (const [id, v] of doneCount) if (v > bestVal) { bestVal = v; bestId = id; }
  // needsAttention = lowest among active
  let worstId: string | undefined;
  let worstVal = Number.POSITIVE_INFINITY;
  for (const h of active) {
    const v = doneCount.get(h.id) || 0;
    if (v < worstVal) { worstVal = v; worstId = h.id; }
  }
  const bestHabit = bestId ? habits.find((h) => h.id === bestId) : undefined;
  const worstHabit = worstId ? habits.find((h) => h.id === worstId) : undefined;

  return {
    summary: {
      activeHabits: active.length,
      totalEntries: entries.length,
      success7,
      success30,
    },
    bestWorst: {
      best: bestHabit ? {
        id: bestHabit.id,
        title: bestHabit.title,
        icon: (bestHabit as any).icon,
        currentStreak: computeCurrentStreak(bestHabit, entries),
        bestStreak: computeBestStreak(bestHabit, entries),
      } : undefined,
      needsAttention: worstHabit ? {
        id: worstHabit.id,
        title: worstHabit.title,
        icon: (worstHabit as any).icon,
        currentStreak: computeCurrentStreak(worstHabit, entries),
        bestStreak: computeBestStreak(worstHabit, entries),
      } : undefined,
    },
    charts: {
      minutes30,
      weekdayPct,
    },
    habits: habits.map((h) => ({ id: h.id, title: h.title, icon: (h as any).icon, category: h.category, color: h.color, frequency: h.frequency, timesPerWeek: h.timesPerWeek })),
  };
}
