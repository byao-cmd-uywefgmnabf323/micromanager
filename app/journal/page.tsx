"use client";

import { useMemo, useState } from "react";
import { useHabits } from "@/store/useHabits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function JournalPage() {
  const entries = useHabits((s) => s.entries);
  const habits = useHabits((s) => s.habits);
  const [query, setQuery] = useState("");

  const habitById = useMemo(() => new Map(habits.map((h) => [h.id, h] as const)), [habits]);

  const grouped = useMemo(() => {
    const map = new Map<string, { notes: string[]; dones: string[] }>();
    for (const e of entries) {
      if (!map.has(e.date)) map.set(e.date, { notes: [], dones: [] });
      if ((e.note || "").trim()) map.get(e.date)!.notes.push(e.note!.trim());
      if (e.status === "done") map.get(e.date)!.dones.push(e.habitId);
    }
    const days = Array.from(map.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([date, data]) => ({ date, notes: data.notes, dones: data.dones }));
    return days;
  }, [entries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return grouped;
    return grouped.filter((d) => d.notes.some((n) => n.toLowerCase().includes(q)));
  }, [grouped, query]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Journal</h2>
        <Input className="w-64" placeholder="Search notes…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {!entries.length && (
        <Card className="rounded-2xl">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-3">📝</div>
            <p className="text-lg font-medium">No journal entries yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add notes when you check in a habit to build your timeline.</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filtered.map((day) => (
          <Card key={day.date} className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{day.date}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 space-y-2">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Completed</div>
                <div className="flex flex-wrap gap-2">
                  {day.dones.length ? (
                    Array.from(new Set(day.dones)).map((id) => (
                      <Badge key={id} variant="secondary" className="rounded-full">
                        <span className="mr-1">{habitById.get(id)?.icon || ""}</span>
                        {habitById.get(id)?.title || id}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Notes</div>
                <div className="space-y-1">
                  {day.notes.length ? (
                    day.notes.map((n, i) => (
                      <div key={i} className="rounded-lg border p-2 text-sm">{n}</div>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
