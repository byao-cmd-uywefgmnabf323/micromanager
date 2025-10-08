"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { CompactToolbar } from "@/components/common/CompactToolbar";
import { StatCard } from "@/components/common/StatCard";
import { RightRail } from "@/components/common/RightRail";
import { MiniChart } from "@/components/common/MiniChart";
import { ProgressRing } from "@/components/ProgressRing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useHabits } from "@/store/useHabits";
import { successRate } from "@/lib/stats";
import { computeCurrentStreak } from "@/lib/streaks";

export default function HealthPage() {
  const habits = useHabits((s) => s.habits);
  const entries = useHabits((s) => s.entries);
  const active = habits.filter((h) => !h.isArchived);
  const rate7 = successRate(entries, undefined, 7).rate;
  const topStreak = useMemo(() => active.reduce((m, h) => Math.max(m, computeCurrentStreak(h, entries)), 0), [active, entries]);

  // mock chart data
  const nutrition = Array.from({ length: 14 }).map((_, i) => ({ d: i + 1, kcal: Math.round(1800 + Math.sin(i) * 200) }));
  const workouts = Array.from({ length: 14 }).map((_, i) => ({ d: i + 1, sessions: Math.max(0, Math.round(2 + Math.cos(i) * 1)) }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-9 min-w-0 space-y-3">
        <Breadcrumbs items={[{ label: "Health" }]} />
        <CompactToolbar
          title={<div className="text-lg font-semibold">Health Hub</div>}
          actions={<div className="flex items-center gap-2"><Button asChild size="sm" className="h-9"><Link href="/spaces/health/nutrition">Nutrition</Link></Button><Button asChild size="sm" className="h-9"><Link href="/spaces/health/workouts">Workouts</Link></Button></div>}
        />

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard value={`${rate7}%`} label="Weekly Completion" />
          <StatCard value={`${topStreak}d`} label="Best Streak" />
          <StatCard value={active.length} label="Active Habits" />
        </div>

        {/* MiniCharts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className="rounded-xl"><CardContent className="p-3 space-y-1"><div className="text-sm font-medium">Nutrition Intake</div><MiniChart data={nutrition} x="d" y="kcal" type="line" color="#22c55e" /></CardContent></Card>
          <Card className="rounded-xl"><CardContent className="p-3 space-y-1"><div className="text-sm font-medium">Workouts by Day</div><MiniChart data={workouts} x="d" y="sessions" type="bar" color="#6366f1" /></CardContent></Card>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className="rounded-xl"><CardContent className="p-4 flex items-center justify-between"><div><div className="text-sm font-medium">Nutrition</div><div className="text-xs text-muted-foreground">Track meals and calories</div></div><Button asChild size="sm" className="h-8"><Link href="/spaces/health/nutrition">Open</Link></Button></CardContent></Card>
          <Card className="rounded-xl"><CardContent className="p-4 flex items-center justify-between"><div><div className="text-sm font-medium">Workouts</div><div className="text-xs text-muted-foreground">Log sessions and duration</div></div><Button asChild size="sm" className="h-8"><Link href="/spaces/health/workouts">Open</Link></Button></CardContent></Card>
        </div>
      </div>

      <RightRail>
        <Card className="rounded-xl"><CardContent className="p-4"><ProgressRing /></CardContent></Card>
        <Card className="rounded-xl"><CardContent className="p-3 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="ghost" className="h-8"><Link href="/today">Track Today</Link></Button>
          <Button asChild size="sm" variant="ghost" className="h-8"><Link href="/analytics">Analytics</Link></Button>
        </CardContent></Card>
      </RightRail>
    </div>
  );
}
