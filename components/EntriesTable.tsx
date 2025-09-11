"use client";

import { Habit, HabitEntry } from "@/lib/storage";
import { Button } from "@/components/ui/button";

function toCSV(rows: (string | number)[][]) {
  return rows
    .map((r) => r.map((c) => {
      const s = String(c ?? "");
      if (s.includes(",") || s.includes("\n") || s.includes('"')) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    }).join(","))
    .join("\n");
}

export function EntriesTable({ entries, habits }: { entries: HabitEntry[]; habits: Habit[] }) {
  const habitById = new Map(habits.map((h) => [h.id, h] as const));

  function exportCSV() {
    const header = ["date", "habit", "status", "minutes", "note"];
    const rows = entries
      .slice()
      .reverse()
      .map((e) => [e.date, habitById.get(e.habitId)?.title || e.habitId, e.status, e.minutes ?? "", e.note ?? ""]);
    const csv = toCSV([header, ...rows]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `micromanager-entries-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Raw Entries</h3>
        <Button size="sm" onClick={exportCSV}>Export CSV</Button>
      </div>
      <div className="overflow-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Date</th>
              <th className="px-3 py-2 text-left font-medium">Habit</th>
              <th className="px-3 py-2 text-left font-medium">Status</th>
              <th className="px-3 py-2 text-left font-medium">Minutes</th>
              <th className="px-3 py-2 text-left font-medium">Note</th>
            </tr>
          </thead>
          <tbody>
            {entries.slice(0, 300).map((e) => (
              <tr key={e.id} className="border-t">
                <td className="px-3 py-2">{e.date}</td>
                <td className="px-3 py-2 truncate max-w-[240px]">
                  <span className="mr-1">{habitById.get(e.habitId)?.icon || ""}</span>
                  {habitById.get(e.habitId)?.title || e.habitId}
                </td>
                <td className="px-3 py-2 capitalize">{e.status}</td>
                <td className="px-3 py-2">{e.minutes ?? ""}</td>
                <td className="px-3 py-2 truncate max-w-[360px]">{e.note ?? ""}</td>
              </tr>
            ))}
            {!entries.length && (
              <tr><td className="px-3 py-4 text-muted-foreground" colSpan={5}>No entries yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {entries.length > 300 && (
        <p className="text-xs text-muted-foreground">Showing first 300 rows. Use Export CSV for the full dataset.</p>
      )}
    </div>
  );
}
