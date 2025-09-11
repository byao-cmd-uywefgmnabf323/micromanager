"use client";

import { useHabits } from "@/store/useHabits";
import { HabitCard } from "@/components/HabitCard";
import { useMemo } from "react";
import { GripVertical } from "lucide-react";

export function TodayList() {
  const habits = useHabits((s) => s.habits);
  const reorderHabits = useHabits((s) => s.reorderHabits);
  const active = useMemo(() => habits.filter((h) => !h.isArchived), [habits]);

  function onDragStart(e: React.DragEvent<HTMLElement>, id: string) {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  }
  function onDrop(e: React.DragEvent<HTMLDivElement>, targetId: string) {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (!draggedId || draggedId === targetId) return;
    const ids = active.map(h => h.id);
    const from = ids.indexOf(draggedId);
    const to = ids.indexOf(targetId);
    if (from === -1 || to === -1) return;
    const reordered = [...ids];
    const [m] = reordered.splice(from, 1);
    reordered.splice(to, 0, m);
    // append archived ids to keep full order stable
    const final = [...reordered, ...habits.filter(h=>h.isArchived).map(h=>h.id)];
    reorderHabits(final);
  }

  if (!active.length) return <p className="text-sm text-muted-foreground">No active habits. Create one to get started.</p>;
  return (
    <div className="grid gap-3">
      {active.map((h) => (
        <div
          key={h.id}
          className="flex items-start gap-2"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDrop(e, h.id)}
        >
          <div className="pt-4">
            <span draggable onDragStart={(e) => onDragStart(e, h.id)} className="inline-flex">
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <HabitCard habit={h} />
          </div>
        </div>
      ))}
    </div>
  );
}
