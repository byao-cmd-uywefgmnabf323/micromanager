"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { CompactToolbar } from "@/components/common/CompactToolbar";
import { FilterBar } from "@/components/common/FilterBar";
import { DenseTable, DenseRow, DenseCell } from "@/components/common/DenseTable";
import { StatCard } from "@/components/common/StatCard";
import { RightRail } from "@/components/common/RightRail";
import { ProgressRing } from "@/components/ProgressRing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useHabits } from "@/store/useHabits";
import { successRate } from "@/lib/stats";
import { computeCurrentStreak } from "@/lib/streaks";
import { toYYYYMMDD } from "@/lib/date";

export default function PersonalPage() {
  const habits = useHabits((s) => s.habits);
  const entries = useHabits((s) => s.entries);
  const active = habits.filter((h) => !h.isArchived);
  const rate7 = successRate(entries, undefined, 7).rate;
  const topStreak = useMemo(() => active.reduce((m, h) => Math.max(m, computeCurrentStreak(h, entries)), 0), [active, entries]);
  const today = toYYYYMMDD();
  const recent = entries.slice(0, 8);
  const [search, setSearch] = useState("");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-9 min-w-0 space-y-3">
        <Breadcrumbs items={[{ label: "Personal" }]} />
        <CompactToolbar
          title={<div className="text-lg font-semibold">Personal Overview</div>}
          actions={
            <div className="flex items-center gap-2">
              <Button asChild size="sm" className="h-9"><Link href="/habits">Add Habit</Link></Button>
              <Button asChild size="sm" variant="outline" className="h-9"><Link href="/analytics">View Analytics</Link></Button>
            </div>
          }
        />

        {/* Row 1: KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard value={active.length} label="Active Habits" />
          <StatCard value={`${rate7}%`} label="Weekly Completion" />
          <StatCard value={`${topStreak}d`} label="Best Streak" />
        </div>

        {/* Row 2: Recent entries */}
        <section className="space-y-2">
          <FilterBar search={search} onSearch={setSearch} />
          <DenseTable>
            <DenseRow className="grid-cols-[1fr_auto_auto_auto] text-xs text-muted-foreground">
              <DenseCell>Title</DenseCell>
              <DenseCell>Type</DenseCell>
              <DenseCell>Date</DenseCell>
              <DenseCell className="justify-self-end">Actions</DenseCell>
            </DenseRow>
            {recent
              .filter((e) => {
                if (!search) return true;
                const h = habits.find((h) => h.id === e.habitId);
                return h?.title.toLowerCase().includes(search.toLowerCase());
              })
              .map((e) => {
                const h = habits.find((h) => h.id === e.habitId);
                return (
                  <DenseRow key={e.id} className="grid-cols-[1fr_auto_auto_auto]">
                    <DenseCell>
                      <div className="min-w-0 truncate text-sm">{h?.title || "—"}</div>
                    </DenseCell>
                    <DenseCell className="text-xs text-muted-foreground">Habit</DenseCell>
                    <DenseCell className="text-xs text-muted-foreground">{e.date === today ? "Today" : e.date}</DenseCell>
                    <DenseCell className="justify-self-end">
                      <Button asChild size="sm" variant="ghost" className="h-8"><Link href="/today">Open</Link></Button>
                    </DenseCell>
                  </DenseRow>
                );
              })}
          </DenseTable>
        </section>
      </div>

      <RightRail>
        <Card className="rounded-xl"><CardContent className="p-4"><ProgressRing /></CardContent></Card>
        <Card className="rounded-xl"><CardContent className="p-3 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="ghost" className="h-8"><Link href="/today">Track Today</Link></Button>
          <Button asChild size="sm" variant="ghost" className="h-8"><Link href="/analytics">Analytics</Link></Button>
        </CardContent></Card>
        <Card className="rounded-xl"><CardContent className="p-3 space-y-2">
          <div className="text-sm font-medium">Top Streaks</div>
          <div className="space-y-1">
            {active
              .map((h) => ({ h, s: computeCurrentStreak(h, entries) }))
              .sort((a, b) => b.s - a.s)
              .slice(0, 5)
              .map(({ h, s }) => (
                <div key={h.id} className="flex items-center gap-2">
                  <span className="text-base">{h.icon}</span>
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: h.color || "var(--primary)" }} />
                  <div className="flex-1 min-w-0"><div className="text-sm truncate">{h.title}</div></div>
                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border"><span>🔥</span>{s}d</span>
                </div>
              ))}
          </div>
        </CardContent></Card>
      </RightRail>
    </div>
  );
}
