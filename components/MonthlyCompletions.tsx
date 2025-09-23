"use client";

import { useMemo } from "react";
import { useHabits } from "@/store/useHabits";
import { toYYYYMMDD, addDays } from "@/lib/date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/Charts";

function lastNDates(n: number) {
  const dates: string[] = [];
  const base = new Date(toYYYYMMDD());
  for (let i = n - 1; i >= 0; i--) {
    dates.push(toYYYYMMDD(addDays(base, -i)));
  }
  return dates;
}

export function MonthlyCompletions({ days = 30 }: { days?: number }) {
  const entries = useHabits((s) => s.entries);
  const habits = useHabits((s) => s.habits);
  const activeCount = habits.filter((h) => !h.isArchived).length || 1;

  const daysArr = useMemo(() => lastNDates(days), [days]);
  const perDayDone = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const d of daysArr) map.set(d, new Set());
    for (const e of entries) {
      if (!map.has(e.date)) continue;
      if (e.status !== "done") continue;
      map.get(e.date)!.add(e.habitId);
    }
    return map;
  }, [entries, daysArr]);

  const data = useMemo(() => {
    return daysArr.map((d) => ({ date: d.slice(5), completions: perDayDone.get(d)?.size || 0 }));
  }, [daysArr, perDayDone]);

  return (
    <Card className="rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm hover:border-neutral-700 transition-colors">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-2xl font-semibold">Monthly Completions</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-2">
        <div className="h-72">
          <LineChart data={data} dataKeyX="date" dataKeyY="completions" color="#22c55e" />
        </div>
      </CardContent>
    </Card>
  );
}
