"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useHabits, selectors } from "@/store/useHabits";
import { HabitCard } from "@/components/HabitCard";

export default function TodayPage() {
  const habits = useHabits((s) => s.habits);
  const checkIn = useHabits((s) => s.checkIn);
  const active = useMemo(() => habits.filter((h) => !h.isArchived), [habits]);
  const [selected, setSelected] = useState<string | null>(active[0]?.id ?? null);
  const focusMap = useRef(new Map<string, { focusMinutes: () => void; focusNote: () => void }>());

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!selected) return;
      if (["D", "S", "P", "M", "N"].includes(e.key.toUpperCase())) {
        e.preventDefault();
      }
      if (e.key.toLowerCase() === "d") checkIn(selected, { status: "done" });
      if (e.key.toLowerCase() === "s") checkIn(selected, { status: "skipped" });
      if (e.key.toLowerCase() === "p") checkIn(selected, { status: "partial" });
      if (e.key.toLowerCase() === "m") focusMap.current.get(selected)?.focusMinutes();
      if (e.key.toLowerCase() === "n") focusMap.current.get(selected)?.focusNote();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, checkIn]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Shortcuts: D (done), S (skipped), P (partial), M (minutes), N (note). Click a card to select.</p>
      <div className="grid gap-3">
        {active.map((h) => (
          <div key={h.id} onClick={() => setSelected(h.id)} className={selected === h.id ? "ring-2 ring-primary rounded-2xl" : ""}>
            <HabitCard
              habit={h}
              onRegisterFocus={(habitId, handlers) => {
                focusMap.current.set(habitId, handlers);
              }}
            />
          </div>
        ))}
      </div>
      {!active.length && <p className="text-sm text-muted-foreground">No habits for today.</p>}
    </div>
  );
}
