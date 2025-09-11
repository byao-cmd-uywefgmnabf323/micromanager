"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { useHabits } from "@/store/useHabits";
import { computeBestStreak, computeCurrentStreak } from "@/lib/streaks";

const QUOTES = [
  "Small steps make big changes.",
  "Consistency beats intensity.",
  "Do it for your future self.",
  "Win the day, repeat tomorrow.",
  "Progress over perfection.",
  "Tiny habits, massive results.",
  "Show up, even if it's small.",
  "Your streak is your superpower.",
  "Momentum is built, not found.",
  "Today is a great day to start.",
  "A little each day goes far.",
  "Keep the chain unbroken.",
];

export function QuoteCard() {
  const habits = useHabits((s) => s.habits);
  const entries = useHabits((s) => s.entries);
  const [bump, setBump] = useState(0);
  const todayIndex = useMemo(() => {
    const d = new Date();
    const seed = d.getFullYear() * 1000 + (d.getMonth() + 1) * 50 + d.getDate();
    return seed % QUOTES.length;
  }, []);
  const idx = (todayIndex + bump) % QUOTES.length;

  // Nudge logic: if a habit is 1 day away from matching best streak
  const nudge = useMemo(() => {
    for (const h of habits) {
      if (h.isArchived) continue;
      const cur = computeCurrentStreak(h, entries);
      const best = computeBestStreak(h, entries);
      if (best > 0 && cur === best - 1) {
        return `You're 1 day away from matching your best streak on “${h.title}”!`;
      }
    }
    return undefined;
  }, [habits, entries]);

  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Motivation</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setBump((b) => b + 1)}>Next quote</Button>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-medium leading-relaxed">“{QUOTES[idx]}”</p>
        {nudge && <p className="mt-2 text-sm text-muted-foreground">{nudge}</p>}
      </CardContent>
    </Card>
  );
}
