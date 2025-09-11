"use client";

import { useMemo } from "react";
import { useHabits } from "@/store/useHabits";
import { toYYYYMMDD, addDays } from "@/lib/date";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

function lastNDates(n: number) {
  const dates: string[] = [];
  const base = new Date(toYYYYMMDD());
  for (let i = n - 1; i >= 0; i--) {
    dates.push(toYYYYMMDD(addDays(base, -i)));
  }
  return dates;
}

export function MiniTimeline({ days = 7 }: { days?: number }) {
  const entries = useHabits((s) => s.entries);
  const habits = useHabits((s) => s.habits);
  const activeCount = habits.filter((h) => !h.isArchived).length || 1;

  const dates = useMemo(() => lastNDates(days), [days]);
  const perDay = useMemo(() => {
    const map = new Map<string, { done: number; partial: number; skipped: number }>();
    for (const d of dates) map.set(d, { done: 0, partial: 0, skipped: 0 });
    for (const e of entries) {
      if (!map.has(e.date)) continue;
      const obj = map.get(e.date)!;
      if (e.status === "done") obj.done++;
      else if (e.status === "partial") obj.partial++;
      else if (e.status === "skipped") obj.skipped++;
    }
    return map;
  }, [entries, dates]);

  function symbol(d: string) {
    const v = perDay.get(d)!;
    if (v.done > 0) return "✅";
    if (v.partial > 0) return "⏳";
    if (v.skipped > 0) return "❌";
    return "•";
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2"><CardTitle className="text-base">Last {days} days</CardTitle></CardHeader>
      <CardContent className="pt-2">
        <TooltipProvider>
          <div className="flex items-center gap-2">
            {dates.map((d) => {
              const v = perDay.get(d)!;
              const pct = Math.round((v.done / activeCount) * 100);
              return (
                <Tooltip key={d}>
                  <TooltipTrigger asChild>
                    <div className="h-8 w-8 rounded-full flex items-center justify-center bg-muted text-base">
                      {symbol(d)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">{d}</div>
                    <div className="text-xs">Done: {v.done}</div>
                    <div className="text-xs">Partial: {v.partial}</div>
                    <div className="text-xs">Skipped: {v.skipped}</div>
                    <div className="text-xs">Completion: {pct}%</div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
