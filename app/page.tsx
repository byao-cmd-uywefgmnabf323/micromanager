"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHabits } from "@/store/useHabits";
import { RecapCard } from "@/components/RecapCard";
import { MonthlyCompletions } from "@/components/MonthlyCompletions";
import { AchievementsWatcher } from "@/components/AchievementsWatcher";
import Link from "next/link";

export default function DashboardPage() {
  const habits = useHabits((s) => s.habits);
  const activeHabits = habits.filter(h => !h.isArchived);

  return (
    <div className="space-y-6">
      <AchievementsWatcher />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-neutral-400 mt-1">A quick overview of your progress.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Weekly Recap (Full Width) */}
        <RecapCard />

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonthlyCompletions />
          
          <Card className="rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm hover:border-neutral-700 transition-colors">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/today">Track Today</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/habits">Manage Habits</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/analytics">View Analytics</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
