"use client";

import { CalendarPlanner } from "@/components/planner/CalendarPlanner";

export default function PlannerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Planner</h1>
      </div>
      <CalendarPlanner />
    </div>
  );
}

