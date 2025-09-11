"use client";

import { useMemo, useState } from "react";
import { useHabits } from "@/store/useHabits";
import { toYYYYMMDD } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Check, X } from "lucide-react";

export function ProgressWidget() {
  const habitsAll = useHabits((s) => s.habits);
  const entries = useHabits((s) => s.entries);
  const checkIn = useHabits((s) => s.checkIn);
  const today = toYYYYMMDD();
  const [open, setOpen] = useState(false);

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

  const size = 60;
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct / 100);

  const active = useMemo(() => habitsAll.filter((h) => !h.isArchived), [habitsAll]);
  const statusByHabit = useMemo(() => {
    const map = new Map<string, "done" | "skipped" | "partial" | undefined>();
    for (const e of entries) {
      if (e.date !== today) continue;
      if (!map.has(e.habitId)) map.set(e.habitId, e.status);
    }
    return map;
  }, [entries, today]);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="rounded-2xl border bg-background/90 backdrop-blur p-3 shadow-lg w-[320px] max-w-[92vw]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <svg width={size} height={size} className="rotate-[-90deg]">
              <circle cx={size/2} cy={size/2} r={radius} stroke="hsl(var(--muted))" strokeWidth={stroke} fill="none" />
              <circle cx={size/2} cy={size/2} r={radius} stroke="hsl(var(--primary))" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} fill="none" />
            </svg>
            <div>
              <div className="text-sm font-medium">Today</div>
              <div className="text-xs text-muted-foreground">{doneCount}/{total} completed</div>
            </div>
          </div>
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setOpen((v) => !v)} aria-label="Toggle quick actions">
            {open ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
        {open && (
          <div className="mt-3 max-h-64 overflow-auto space-y-2">
            {active.length === 0 && <div className="text-sm text-muted-foreground">No active habits</div>}
            {active.map((h) => {
              const st = statusByHabit.get(h.id);
              return (
                <div key={h.id} className="flex items-center justify-between gap-2 rounded-xl border p-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {h.icon && <span className="text-base leading-none">{h.icon}</span>}
                    <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: h.color || "var(--primary)" }} />
                    <span className="truncate text-sm">{h.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant={st === "done" ? "default" : "outline"} className="h-7 w-7 rounded-full" onClick={() => checkIn(h.id, { status: "done" })}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant={st === "skipped" ? "destructive" : "outline"} className="h-7 w-7 rounded-full" onClick={() => checkIn(h.id, { status: "skipped" })}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
