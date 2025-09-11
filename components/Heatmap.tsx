"use client";

import { useMemo } from "react";
import { useHabits } from "@/store/useHabits";
import { getLastNDates } from "@/lib/date";
import { motion } from "framer-motion";

function colorForCell(statuses: ("done" | "partial" | "skipped")[]) {
  if (statuses.includes("done")) return "bg-green-500/80";
  if (statuses.includes("partial")) return "bg-yellow-500/60";
  if (statuses.includes("skipped")) return "bg-red-500/40";
  return "bg-muted";
}

export function Heatmap({ days = 90 }: { days?: number }) {
  const entries = useHabits((s) => s.entries);
  const data = useMemo(() => {
    const dates = getLastNDates(days);
    return dates.map((d) => {
      const list = entries.filter((e) => e.date === d);
      const statuses = list.map((e) => e.status);
      return { date: d, statuses };
    });
  }, [entries, days]);

  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
      {data.map((c) => (
        <motion.div
          key={c.date}
          className={`h-4 w-4 rounded ${colorForCell(c.statuses)}`}
          title={`${c.date}`}
          initial={{ opacity: 0.4, scale: 0.9 }}
          animate={{ opacity: 1, scale: c.statuses.length ? 1 : 0.95 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        />
      ))}
    </div>
  );
}
