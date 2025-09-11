"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHabits } from "@/store/useHabits";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type PlanMap = Record<number, string[]>; // 0..6 => habitIds
const LS_KEY = "mm_planner_v1";

function loadPlan(): PlanMap {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] } as PlanMap;
    const parsed = JSON.parse(raw) as Partial<PlanMap>;
    return { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], ...parsed } as PlanMap;
  } catch {
    return { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] } as PlanMap;
  }
}

function savePlan(p: PlanMap) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(p)); } catch {}
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function PlannerPage() {
  const habits = useHabits((s) => s.habits);
  const checkIn = useHabits((s) => s.checkIn);
  const active = useMemo(() => habits.filter((h) => !h.isArchived), [habits]);
  const [plan, setPlan] = useState<PlanMap>({ 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] });
  const [selection, setSelection] = useState<Record<number, string | undefined>>({});
  const todayIdx = new Date().getDay();

  useEffect(() => { setPlan(loadPlan()); }, []);
  useEffect(() => { savePlan(plan); }, [plan]);

  function addTo(day: number) {
    const id = selection[day];
    if (!id) return;
    setPlan((p) => ({ ...p, [day]: Array.from(new Set([...(p[day] || []), id])) }));
  }
  function removeFrom(day: number, id: string) {
    setPlan((p) => ({ ...p, [day]: (p[day] || []).filter((x) => x !== id) }));
  }

  function doPlanned(id: string) {
    checkIn(id, { status: "done" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Weekly Planner</h2>
        <Button asChild variant="outline"><Link href="/today">Open Today</Link></Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {DAY_NAMES.map((name, idx) => (
          <Card key={idx} className="rounded-2xl">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">{name} {idx === todayIdx && <Badge variant="secondary" className="rounded-full">Today</Badge>}</CardTitle></CardHeader>
            <CardContent className="pt-2 space-y-2">
              <div className="flex items-center gap-2">
                <Select value={selection[idx] || ""} onValueChange={(v) => setSelection((s) => ({ ...s, [idx]: v }))}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Choose habit" /></SelectTrigger>
                  <SelectContent>
                    {active.map((h) => (
                      <SelectItem key={h.id} value={h.id}>{h.icon ? <span className="mr-1">{h.icon}</span> : null}{h.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => addTo(idx)} disabled={!selection[idx]}>Add</Button>
              </div>
              <div className="space-y-2">
                {(plan[idx] || []).map((id) => {
                  const h = habits.find((x) => x.id === id);
                  if (!h) return null;
                  return (
                    <div key={id} className="flex items-center justify-between rounded-xl border p-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {h.icon && <span className="text-base leading-none">{h.icon}</span>}
                        <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: h.color || "var(--primary)" }} />
                        <span className="truncate text-sm">{h.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {idx === todayIdx && <Button size="sm" onClick={() => doPlanned(id)}>Do now</Button>}
                        <Button size="sm" variant="destructive" onClick={() => removeFrom(idx, id)}>Remove</Button>
                      </div>
                    </div>
                  );
                })}
                {!(plan[idx] || []).length && (
                  <div className="text-sm text-muted-foreground">No planned habits.</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
