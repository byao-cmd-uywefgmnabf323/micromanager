"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useHabits } from "@/store/useHabits";
import { successRate, minutesSummary } from "@/lib/stats";
import { toYYYYMMDD } from "@/lib/date";

export function MiniStats() {
  const entries = useHabits((s) => s.entries);
  const today = toYYYYMMDD();
  const todayMinutes = entries
    .filter((e) => e.date === today)
    .reduce((a, b) => a + (b.minutes || 0), 0);
  const rate7 = successRate(entries, undefined, 7).rate;
  const avgMin7 = minutesSummary(entries, undefined, 7).avg;

  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="rounded-2xl"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Today Minutes</p><p className="text-2xl font-semibold">{todayMinutes}</p></CardContent></Card>
      <Card className="rounded-2xl"><CardContent className="p-4"><p className="text-xs text-muted-foreground">7-day Completion</p><p className="text-2xl font-semibold">{rate7}%</p></CardContent></Card>
      <Card className="rounded-2xl"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Avg min/day (7d)</p><p className="text-2xl font-semibold">{avgMin7}</p></CardContent></Card>
    </div>
  );
}
