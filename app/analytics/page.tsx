"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heatmap } from "@/components/Heatmap";
import { LineChart, BarChart } from "@/components/Charts";
import { useHabits } from "@/store/useHabits";
import { getLastNDates } from "@/lib/date";
import { minutesSummary, weekdayBreakdown, successRate } from "@/lib/stats";
import { EntriesTable } from "@/components/EntriesTable";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { AskAIButton } from "@/components/ai/AskAI";

export default function AnalyticsPage() {
  const entries = useHabits((s) => s.entries);
  const habits = useHabits((s) => s.habits);
  if (!entries.length) {
    return (
      <div className="space-y-6">
        <Card className="rounded-2xl">
          <CardHeader><CardTitle>Analytics</CardTitle></CardHeader>
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-3">📊</div>
            <p className="text-lg font-medium">Data will appear here once you start tracking habits</p>
            <p className="text-sm text-muted-foreground mt-1">Log a few check-ins on the Home or Today page to see charts and trends.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  const [onlyNotes, setOnlyNotes] = useState(false);
  const notesDateSet = useMemo(() => new Set(entries.filter((e) => (e.note || "").trim().length > 0).map((e) => e.date)), [entries]);
  const filteredEntries = useMemo(() => (onlyNotes ? entries.filter((e) => notesDateSet.has(e.date)) : entries), [entries, onlyNotes, notesDateSet]);
  const days = getLastNDates(30);
  const minutes = minutesSummary(filteredEntries, undefined, 30);
  const lineData = days.map((d) => ({ date: d.slice(5), minutes: minutes.dayTotals.get(d) || 0 }));
  const weekday = weekdayBreakdown(filteredEntries);
  const barData = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((w, i) => ({ w, pct: weekday.pct[i] }));
  const rate7 = successRate(filteredEntries, undefined, 7).rate;
  const rate30 = successRate(filteredEntries, undefined, 30).rate;
  const rate90 = successRate(filteredEntries, undefined, 90).rate;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <AskAIButton preset="Create a personalized analysis of my consistency and clear next-step recommendations." />
        <Button size="sm" variant={onlyNotes ? "default" : "outline"} onClick={() => setOnlyNotes((v) => !v)}>
          {onlyNotes ? "Showing: Days with journal notes" : "Filter: Notes only"}
        </Button>
      </div>
      <section className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-2xl"><CardHeader><CardTitle>Heatmap (90d)</CardTitle></CardHeader><CardContent><Heatmap days={90} /></CardContent></Card>
        <Card className="rounded-2xl"><CardHeader><CardTitle>Overview</CardTitle></CardHeader><CardContent><div className="grid grid-cols-3 gap-3"><div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Entries</div><div className="text-2xl font-semibold">{filteredEntries.length}</div></div><div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Habits</div><div className="text-2xl font-semibold">{habits.length}</div></div><div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Notes</div><div className="text-2xl font-semibold">{entries.filter((e) => !!e.note).length}</div></div></div></CardContent></Card>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-2xl"><CardHeader><CardTitle>Minutes (30d)</CardTitle></CardHeader><CardContent><LineChart data={lineData} dataKeyX="date" dataKeyY="minutes" /></CardContent></Card>
        <Card className="rounded-2xl"><CardHeader><CardTitle>Weekday Consistency</CardTitle></CardHeader><CardContent><BarChart data={barData} dataKeyX="w" dataKeyY="pct" /></CardContent></Card>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl"><CardHeader><CardTitle>7-Day %</CardTitle></CardHeader><CardContent className="p-4 text-3xl font-semibold">{rate7}%</CardContent></Card>
        <Card className="rounded-2xl"><CardHeader><CardTitle>30-Day %</CardTitle></CardHeader><CardContent className="p-4 text-3xl font-semibold">{rate30}%</CardContent></Card>
        <Card className="rounded-2xl"><CardHeader><CardTitle>90-Day %</CardTitle></CardHeader><CardContent className="p-4 text-3xl font-semibold">{rate90}%</CardContent></Card>
      </section>
      <section className="space-y-3">
        <EntriesTable entries={filteredEntries} habits={habits} />
      </section>
    </div>
  );
}
