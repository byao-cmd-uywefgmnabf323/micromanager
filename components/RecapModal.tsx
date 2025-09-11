"use client";

import { useEffect, useMemo, useState } from "react";
import { useHabits } from "@/store/useHabits";
import { toYYYYMMDD, addDays } from "@/lib/date";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const LS_DAILY = "mm_recap_daily"; // stores last shown date YYYY-MM-DD
const LS_WEEKLY = "mm_recap_week"; // stores last shown week key YYYY-WW

function getWeekKey(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const diffMs = date.getTime() - yearStart.getTime();
  const weekNo = Math.ceil(((diffMs / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-${String(weekNo).padStart(2, "0")}`;
}

function lastNDates(n: number) {
  const base = new Date(toYYYYMMDD());
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(toYYYYMMDD(addDays(base, -i)));
  return out;
}

export function RecapModal() {
  const habits = useHabits((s) => s.habits);
  const entries = useHabits((s) => s.entries);
  const active = useMemo(() => habits.filter((h) => !h.isArchived), [habits]);
  const today = toYYYYMMDD();
  const weekKey = getWeekKey(new Date());

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"daily" | "weekly" | null>(null);

  useEffect(() => {
    // Decide whether to show daily or weekly recap
    const lastDaily = localStorage.getItem(LS_DAILY);
    const lastWeekly = localStorage.getItem(LS_WEEKLY);
    // Show daily once/day
    if (lastDaily !== today) {
      setMode("daily");
      setOpen(true);
      return;
    }
    // Show weekly once/week on Monday
    const isMonday = new Date().getDay() === 1; // 1=Mon
    if (isMonday && lastWeekly !== weekKey) {
      setMode("weekly");
      setOpen(true);
      return;
    }
  }, [today, weekKey]);

  // Daily recap metrics
  const todayEntries = useMemo(() => entries.filter((e) => e.date === today), [entries, today]);
  const todayDoneSet = useMemo(() => new Set(todayEntries.filter((e) => e.status === "done").map((e) => e.habitId)), [todayEntries]);
  const todaySkippedSet = useMemo(() => new Set(todayEntries.filter((e) => e.status === "skipped").map((e) => e.habitId)), [todayEntries]);

  // Weekly recap metrics
  const last7 = useMemo(() => lastNDates(7), []);
  const perDayDone = useMemo(() => last7.map((d) => new Set(entries.filter((e) => e.date === d && e.status === "done").map((e) => e.habitId)).size), [entries, last7]);
  const weeklyPct = useMemo(() => {
    const activeCount = active.length || 1;
    const ratio = perDayDone.reduce((a, b) => a + b / activeCount, 0) / perDayDone.length;
    return Math.round(ratio * 100);
  }, [perDayDone, active.length]);
  const bestHabit = useMemo(() => {
    const count = new Map<string, number>();
    for (const d of last7) {
      for (const e of entries) {
        if (e.date === d && e.status === "done") count.set(e.habitId, (count.get(e.habitId) || 0) + 1);
      }
    }
    let best: string | undefined;
    let val = -1;
    for (const [id, v] of count) if (v > val) { val = v; best = id; }
    return habits.find((h) => h.id === best);
  }, [entries, habits, last7]);
  const needsAttention = useMemo(() => {
    const actives = active;
    if (!actives.length) return undefined;
    const count = new Map<string, number>();
    for (const h of actives) count.set(h.id, 0);
    for (const d of last7) {
      for (const e of entries) {
        if (e.date === d && e.status === "done") count.set(e.habitId, (count.get(e.habitId) || 0) + 1);
      }
    }
    let worst = actives[0].id;
    let val = Number.POSITIVE_INFINITY;
    for (const h of actives) {
      const v = count.get(h.id) || 0;
      if (v < val) { val = v; worst = h.id; }
    }
    return habits.find((h) => h.id === worst);
  }, [entries, habits, active, last7]);

  function close() {
    setOpen(false);
    if (mode === "daily") localStorage.setItem(LS_DAILY, today);
    if (mode === "weekly") localStorage.setItem(LS_WEEKLY, weekKey);
    setMode(null);
  }

  if (!mode) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) close(); }}>
      <DialogContent className="rounded-2xl sm:max-w-lg">
        {mode === "daily" && (
          <>
            <DialogHeader>
              <DialogTitle>Daily Recap</DialogTitle>
              <DialogDescription>Here’s how you did today</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground">Completed</div>
                <div className="text-lg font-semibold">{todayDoneSet.size} / {active.length}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground">Missed</div>
                <div className="text-lg font-semibold">{todaySkippedSet.size}</div>
              </div>
              <div className="text-xs text-muted-foreground">Keep it up! See Analytics for trends.</div>
            </div>
            <div className="flex justify-end pt-2"><Button onClick={close}>Got it</Button></div>
          </>
        )}
        {mode === "weekly" && (
          <>
            <DialogHeader>
              <DialogTitle>Weekly Recap</DialogTitle>
              <DialogDescription>Your last 7 days at a glance</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Completion</div><div className="text-2xl font-semibold">{weeklyPct}%</div></div>
                <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Best Habit</div><div className="text-sm font-medium truncate">{bestHabit ? (<><span className="mr-1">{bestHabit.icon}</span>{bestHabit.title}</>) : "—"}</div></div>
                <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Needs Attention</div><div className="text-sm font-medium truncate">{needsAttention ? (<><span className="mr-1">{needsAttention.icon}</span>{needsAttention.title}</>) : "—"}</div></div>
              </div>
              <div className="text-xs text-muted-foreground">Tip: Plan your week in the Planner to boost your consistency.</div>
            </div>
            <div className="flex justify-end pt-2"><Button onClick={close}>Close</Button></div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
