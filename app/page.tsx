"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useHabits } from "@/store/useHabits";
import { RecapCard } from "@/components/RecapCard";
import { MonthlyCompletions } from "@/components/MonthlyCompletions";
import { AchievementsWatcher } from "@/components/AchievementsWatcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ProgressRing";
import { LineChart, BarChart } from "@/components/Charts";
import { toYYYYMMDD, addDays } from "@/lib/date";
import { computeBestStreak } from "@/lib/streaks";
import { Flame, Timer, Star, Activity, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  const habits = useHabits((s) => s.habits);
  const entries = useHabits((s) => s.entries);
  const checkIn = useHabits((s) => s.checkIn);

  const activeHabits = useMemo(() => habits.filter((h) => !h.isArchived), [habits]);
  const today = toYYYYMMDD();

  function lastNDates(n: number) {
    const dates: string[] = [];
    const base = new Date(toYYYYMMDD());
    for (let i = n - 1; i >= 0; i--) {
      dates.push(toYYYYMMDD(addDays(base, -i)));
    }
    return dates;
  }

  const weeklyPct = useMemo(() => {
    const windowDates = lastNDates(7);
    const doneSetByDay = new Map<string, Set<string>>();
    for (const d of windowDates) doneSetByDay.set(d, new Set());
    for (const e of entries) {
      if (!doneSetByDay.has(e.date)) continue;
      if (e.status !== "done") continue;
      doneSetByDay.get(e.date)!.add(e.habitId);
    }
    const active = activeHabits.length || 1;
    let sum = 0;
    for (const d of windowDates) sum += (doneSetByDay.get(d)?.size || 0) / active;
    return Math.round((sum / windowDates.length) * 100);
  }, [entries, activeHabits]);

  const minutesToday = useMemo(() => {
    return entries.filter((e) => e.date === today).reduce((a, b) => a + (b.minutes || 0), 0);
  }, [entries, today]);

  const longestStreak = useMemo(() => {
    let best = 0;
    for (const h of activeHabits) best = Math.max(best, computeBestStreak(h, entries));
    return best;
  }, [activeHabits, entries]);

  const bestHabitName = useMemo(() => {
    const windowDates = new Set(lastNDates(7));
    const per = new Map<string, number>();
    for (const e of entries) {
      if (!windowDates.has(e.date)) continue;
      if (e.status !== "done") continue;
      per.set(e.habitId, (per.get(e.habitId) || 0) + 1);
    }
    let bestId: string | null = null;
    let bestVal = -1;
    for (const [id, v] of per) { if (v > bestVal) { bestVal = v; bestId = id; } }
    return bestId ? (habits.find((h) => h.id === bestId)?.title || "—") : "—";
  }, [entries, habits]);

  const weeklyTrend = useMemo(() => {
    const days = lastNDates(7);
    const map = new Map<string, Set<string>>();
    for (const d of days) map.set(d, new Set());
    for (const e of entries) { if (map.has(e.date) && e.status === "done") map.get(e.date)!.add(e.habitId); }
    return days.map((d) => ({ d: d.slice(5), count: map.get(d)?.size || 0 }));
  }, [entries]);

  const todaysNotDone = useMemo(() => {
    const doneSet = new Set(entries.filter((e) => e.date === today && e.status === "done").map((e) => e.habitId));
    return activeHabits.filter((h) => !doneSet.has(h.id)).slice(0, 6);
  }, [activeHabits, entries, today]);

  function markDone(habitId: string) {
    checkIn(habitId, { status: "done" });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <AchievementsWatcher />

      {/* Main left column */}
      <div className="lg:col-span-9 min-w-0 space-y-4">
        {/* Greeting + progress bar */}
        <Card className="rounded-2xl">
          <CardContent className="p-4 space-y-2">
            <div className="text-xl font-semibold">👋 Welcome back!</div>
            <div className="text-sm text-muted-foreground">You’ve completed {weeklyPct}% of your habits this week.</div>
            <div className="h-2 w-full rounded-full bg-white/10" aria-label={`Weekly completion ${weeklyPct}%`}>
              <div className="h-2 rounded-full bg-primary" style={{ width: `${weeklyPct}%` }} />
            </div>
          </CardContent>
        </Card>

        {/* Summary stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <Link href="/analytics" className="group">
            <Card className="rounded-2xl hover:bg-white/5 hover:shadow-md transition">
              <CardContent className="p-4 space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Activity className="h-4 w-4" /> Weekly Completion</div>
                <div className="text-2xl font-bold" aria-label={`${weeklyPct}% weekly completion`}>{weeklyPct}%</div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/habits" className="group">
            <Card className="rounded-2xl hover:bg-white/5 hover:shadow-md transition">
              <CardContent className="p-4 space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">🧩 Active Habits</div>
                <div className="text-2xl font-bold" aria-label={`${activeHabits.length} active habits`}>{activeHabits.length}</div>
              </CardContent>
            </Card>
          </Link>
          <Card className="rounded-2xl hover:bg-white/5 hover:shadow-md transition">
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Timer className="h-4 w-4" /> Minutes Tracked (Today)</div>
              <div className="text-2xl font-bold" aria-label={`${minutesToday} minutes today`}>{minutesToday}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl hover:bg-white/5 hover:shadow-md transition">
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Flame className="h-4 w-4" /> Longest Streak</div>
              <div className="text-2xl font-bold" aria-label={`${longestStreak} days longest streak`}>{longestStreak}d</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl hover:bg-white/5 hover:shadow-md transition">
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Star className="h-4 w-4" /> Best Habit</div>
              <div className="text-2xl font-bold truncate" aria-label={`Best habit ${bestHabitName}`}>{bestHabitName}</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <section className="space-y-2">
          <div>
            <h2 className="text-xl font-semibold">Your week at a glance 📊</h2>
            <p className="text-sm text-muted-foreground">Charts and summaries to understand your progress.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <RecapCard />
              <div className="flex justify-end">
                <Button asChild size="sm" className="h-9" aria-label="See details in Analytics"><Link href="/analytics">See Details</Link></Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <MonthlyCompletions />
              <div className="flex justify-end">
                <Button asChild size="sm" className="h-9" aria-label="See details in Analytics"><Link href="/analytics">See Details</Link></Button>
              </div>
            </div>
          </div>
        </section>

        {/* Today’s Focus */}
        <section className="space-y-2">
          <div>
            <h2 className="text-xl font-semibold">Today’s goals 🏁</h2>
            <p className="text-sm text-muted-foreground">Keep it up! You’re almost at your goal 🎯</p>
          </div>
          <div className="grid gap-2">
            {todaysNotDone.map((h) => (
              <div key={h.id} className="flex items-center justify-between rounded-xl border px-3 py-2.5 hover:bg-white/5 transition">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base">{h.icon}</span>
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: h.color || "var(--primary)" }} />
                  <span className="text-sm font-medium truncate">{h.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="h-8" aria-label={`Mark ${h.title} as done`} onClick={() => markDone(h.id)}>Mark as Done</Button>
                </div>
              </div>
            ))}
            {!todaysNotDone.length && (
              <div className="text-sm text-muted-foreground">All set for today! <span aria-hidden>✅</span></div>
            )}
          </div>
        </section>
      </div>

      {/* Right summary rail */}
      <aside className="lg:col-span-3 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] overflow-auto space-y-3">
        <Card className="rounded-2xl"><CardContent className="p-4"><ProgressRing /></CardContent></Card>
        <Card className="rounded-2xl">
          <CardContent className="p-3 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="ghost" className="h-8"><Link href="/today">Track Today</Link></Button>
            <Button asChild size="sm" variant="ghost" className="h-8"><Link href="/habits">Add Habit</Link></Button>
            <Button asChild size="sm" variant="ghost" className="h-8"><Link href="/analytics">Analytics</Link></Button>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="p-4 pb-1"><CardTitle className="text-sm">Weekly Progress</CardTitle></CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="h-28"><BarChart data={weeklyTrend} dataKeyX="d" dataKeyY="count" color="#6366f1" /></div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl"><CardContent className="p-4 text-sm text-muted-foreground">“Consistency is what turns actions into habits 💪”</CardContent></Card>
      </aside>
    </div>
  );
}
