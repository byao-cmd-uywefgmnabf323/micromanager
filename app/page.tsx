"use client";

import { useHabits } from "@/store/useHabits";
import { RecapCard } from "@/components/RecapCard";
import { MonthlyCompletions } from "@/components/MonthlyCompletions";
import { AchievementsWatcher } from "@/components/AchievementsWatcher";
import { MiniStats } from "@/components/MiniStats";

export default function DashboardPage() {
  const habits = useHabits((s) => s.habits);
  const activeHabits = habits.filter(h => !h.isArchived);

  return (
    <div className="space-y-3">
      <AchievementsWatcher />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-xs text-neutral-400 mt-0.5">A quick overview of your progress.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-3">
        <div className="rounded-lg bg-neutral-950/50 p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <RecapCard />
            <MonthlyCompletions />
            <MiniStats />
          </div>
        </div>
      </div>
    </div>
  );
}
