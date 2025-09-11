"use client";

import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useHabits } from "@/store/useHabits";
import { toYYYYMMDD } from "@/lib/date";
import { motion } from "framer-motion";

function usePersistedSet(key: string) {
  const [setState, setSetState] = useState<Set<string>>(new Set());
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setSetState(new Set(JSON.parse(raw)));
    } catch {}
  }, [key]);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(Array.from(setState)));
    } catch {}
  }, [key, setState]);
  return {
    has: (id: string) => setState.has(id),
    add: (id: string) => setSetState((s) => new Set(s).add(id)),
    remove: (id: string) => setSetState((s) => { const n = new Set(s); n.delete(id); return n; }),
    clear: () => setSetState(new Set()),
  };
}

export function Inbox() {
  const habits = useHabits((s) => s.habits);
  const entries = useHabits((s) => s.entries);
  const checkIn = useHabits((s) => s.checkIn);
  const today = toYYYYMMDD();
  const snoozed = usePersistedSet("mm_inbox_snoozed");
  const cleared = usePersistedSet("mm_inbox_cleared");
  const [onlyPending, setOnlyPending] = useState<boolean>(false);

  const statusByHabit = useMemo(() => {
    const map = new Map<string, "done" | "skipped" | "partial" | undefined>();
    for (const e of entries) {
      if (e.date !== today) continue;
      if (!map.has(e.habitId)) map.set(e.habitId, e.status);
    }
    return map;
  }, [entries, today]);

  const activeHabits = useMemo(() => habits.filter((h) => !h.isArchived), [habits]);

  const primary = activeHabits.filter((h) => !snoozed.has(h.id) && !cleared.has(h.id));
  const other = activeHabits.filter((h) => cleared.has(h.id));
  const snoozedList = activeHabits.filter((h) => snoozed.has(h.id));
  const clearedList = other;

  const filteredPrimary = onlyPending
    ? primary.filter((h) => statusByHabit.get(h.id) !== "done")
    : primary;

  function onDone(id: string) {
    checkIn(id, { status: "done" });
  }
  function onSkip(id: string) {
    checkIn(id, { status: "skipped" });
  }
  function onSnooze(id: string) {
    snoozed.add(id);
  }
  function onClear(id: string) {
    cleared.add(id);
  }

  function InboxZero() {
    return (
      <Card className="rounded-2xl">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">🧹</div>
          <div className="text-xl font-semibold">Inbox Zero – You cleared your tasks!</div>
          <div className="mt-1 text-muted-foreground">Enjoy your day and keep the streak alive ✨</div>
        </CardContent>
      </Card>
    );
  }

  function HabitRow({ id, title, color }: { id: string; title: string; color?: string }) {
    const st = statusByHabit.get(id);
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between rounded-xl border p-3 hover:bg-muted/50">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color || "var(--primary)" }} />
            <div className="truncate">
              <div className="font-medium truncate">{title}</div>
              <div className="text-xs text-muted-foreground">{st ? `Today: ${st}` : "No check-in yet"}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => onDone(id)}>Done</Button>
            <Button size="sm" variant="secondary" onClick={() => onSkip(id)}>Skip</Button>
            <Button size="sm" variant="outline" onClick={() => onSnooze(id)}>Snooze</Button>
            <Button size="sm" variant="ghost" asChild><Link href="/habits">Edit</Link></Button>
            <Button size="sm" variant="ghost" onClick={() => onClear(id)}>Clear</Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Tabs defaultValue="primary" className="w-full">
          <TabsList>
            <TabsTrigger value="primary">Primary</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
            <TabsTrigger value="snoozed">Snoozed</TabsTrigger>
            <TabsTrigger value="cleared">Cleared</TabsTrigger>
          </TabsList>
          <div className="ml-auto">
            <Button variant={onlyPending ? "default" : "outline"} size="sm" onClick={() => setOnlyPending((v) => !v)}>Filter: {onlyPending ? "Pending" : "All"}</Button>
          </div>
          <TabsContent value="primary" className="mt-4">
            {filteredPrimary.length === 0 ? (
              <InboxZero />
            ) : (
              <div className="space-y-2">
                {filteredPrimary.map((h) => (
                  <HabitRow key={h.id} id={h.id} title={h.title} color={h.color} />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="other" className="mt-4">
            {other.length === 0 ? (
              <Card className="rounded-2xl"><CardContent className="p-4 text-sm text-muted-foreground">Nothing here.</CardContent></Card>
            ) : (
              <div className="space-y-2">
                {other.map((h) => (
                  <HabitRow key={h.id} id={h.id} title={h.title} color={h.color} />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="snoozed" className="mt-4">
            {snoozedList.length === 0 ? (
              <Card className="rounded-2xl"><CardContent className="p-4 text-sm text-muted-foreground">No snoozed items.</CardContent></Card>
            ) : (
              <div className="space-y-2">
                {snoozedList.map((h) => (
                  <HabitRow key={h.id} id={h.id} title={h.title} color={h.color} />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="cleared" className="mt-4">
            {clearedList.length === 0 ? (
              <Card className="rounded-2xl"><CardContent className="p-4 text-sm text-muted-foreground">No cleared items.</CardContent></Card>
            ) : (
              <div className="space-y-2">
                {clearedList.map((h) => (
                  <HabitRow key={h.id} id={h.id} title={h.title} color={h.color} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Tip card */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-2"><CardTitle className="text-base">ClickTip</CardTitle></CardHeader>
        <CardContent className="pt-0 text-sm text-muted-foreground">
          Hover over a habit to see quick stats. Try keyboard shortcuts on the Today page: D/S/P and M/N.
        </CardContent>
      </Card>
    </div>
  );
}
