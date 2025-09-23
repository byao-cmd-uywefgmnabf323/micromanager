"use client";

import { useMemo, useState } from "react";
import { useHabits } from "@/store/useHabits";
import { toYYYYMMDD, addDays } from "@/lib/date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function lastNDates(n: number) {
  const dates: string[] = [];
  const base = new Date(toYYYYMMDD());
  for (let i = n - 1; i >= 0; i--) {
    dates.push(toYYYYMMDD(addDays(base, -i)));
  }
  return dates;
}

export function RecapCard({ days = 7, showTrend = true }: { days?: number; showTrend?: boolean }) {
  const habits = useHabits((s) => s.habits);
  const entries = useHabits((s) => s.entries);
  const windowDates = useMemo(() => lastNDates(Math.max(days, 7)), [days]);
  const dateSet = useMemo(() => new Set(windowDates), [windowDates]);

  const filtered = useMemo(() => entries.filter((e) => dateSet.has(e.date)), [entries, dateSet]);
  const doneSetByDay = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const e of filtered) {
      if (e.status !== "done") continue;
      if (!map.has(e.date)) map.set(e.date, new Set());
      map.get(e.date)!.add(e.habitId);
    }
    return map;
  }, [filtered]);

  const weeklyPct = useMemo(() => {
    // completion rate = (sum done per day / total active habits per day) averaged across days
    const active = habits.filter((h) => !h.isArchived).length || 1;
    let sum = 0;
    for (const d of windowDates) {
      const done = doneSetByDay.get(d)?.size || 0;
      sum += done / active;
    }
    return Math.round((sum / windowDates.length) * 100);
  }, [habits, windowDates, doneSetByDay]);

  const perHabitDone = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of filtered) {
      if (e.status !== "done") continue;
      map.set(e.habitId, (map.get(e.habitId) || 0) + 1);
    }
    return map;
  }, [filtered]);

  const bestHabit = useMemo(() => {
    let bestId: string | null = null;
    let bestVal = -1;
    for (const [id, v] of perHabitDone) {
      if (v > bestVal) { bestVal = v; bestId = id; }
    }
    return bestId ? habits.find((h) => h.id === bestId) : undefined;
  }, [perHabitDone, habits]);

  const needsAttention = useMemo(() => {
    const actives = habits.filter((h) => !h.isArchived);
    if (!actives.length) return undefined;
    let worstId = actives[0].id;
    let worstVal = Number.POSITIVE_INFINITY;
    for (const h of actives) {
      const v = perHabitDone.get(h.id) || 0;
      if (v < worstVal) { worstVal = v; worstId = h.id; }
    }
    return habits.find((h) => h.id === worstId);
  }, [habits, perHabitDone]);

  const trend = useMemo(() => {
    return windowDates.map((d) => ({ d: d.slice(5), done: doneSetByDay.get(d)?.size || 0 }));
  }, [windowDates, doneSetByDay]);

  return (
    <Card className="rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm hover:border-neutral-700 transition-colors">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-2xl font-semibold">Weekly Recap</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-2 space-y-4">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-1">
            <div className="text-sm text-neutral-400">Weekly completion</div>
            <div className="text-3xl font-bold">{weeklyPct}%</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-neutral-400">Best habit</div>
            <div className="text-lg font-medium truncate">{bestHabit ? (<><span className="mr-1">{bestHabit.icon}</span>{bestHabit.title}</>) : "—"}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-neutral-400">Needs attention</div>
            <div className="text-lg font-medium truncate">{needsAttention ? (<><span className="mr-1">{needsAttention.icon}</span>{needsAttention.title}</>) : "—"}</div>
          </div>
        </div>
        {showTrend && (
          <div className="mt-4 text-xs text-neutral-500">Last {windowDates.length} days done/task count per day</div>
        )}
      </CardContent>
    </Card>
  );
}
