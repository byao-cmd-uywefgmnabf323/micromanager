"use client";

import { useMemo } from "react";
import { useHabits } from "@/store/useHabits";
import { toYYYYMMDD } from "@/lib/date";

export function ProgressRing() {
  const habitsAll = useHabits((s) => s.habits);
  const entries = useHabits((s) => s.entries);
  const today = toYYYYMMDD();

  const { doneCount, total } = useMemo(() => {
    const active = habitsAll.filter((h) => !h.isArchived);
    const total = active.length;
    const doneSet = new Set<string>();
    for (const e of entries) {
      if (e.date === today && e.status === "done") doneSet.add(e.habitId);
    }
    return { doneCount: doneSet.size, total };
  }, [habitsAll, entries, today]);

  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  const size = 120;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct / 100);

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size/2} cy={size/2} r={radius} stroke="hsl(var(--muted))" strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={radius} stroke="hsl(var(--primary))" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} fill="none" />
      </svg>
      <div>
        <div className="text-sm text-muted-foreground">Today</div>
        <div className="text-3xl font-semibold">{doneCount}/{total}</div>
        <div className="text-xs text-muted-foreground">{pct}% complete</div>
      </div>
    </div>
  );
}
