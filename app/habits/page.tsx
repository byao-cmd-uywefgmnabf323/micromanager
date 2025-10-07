"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { useHabits } from "@/store/useHabits";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GripVertical, MoreHorizontal, Calendar, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";
import { ProgressRing } from "@/components/ProgressRing";
import { computeCurrentStreak } from "@/lib/streaks";
import { toYYYYMMDD } from "@/lib/date";

function ParamsController({ setQ }: { setQ: (v: string) => void }) {
  const params = useSearchParams();
  useEffect(() => {
    setQ(params.get("q") || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  return null;
}

export default function HabitsPage() {
  const habits = useHabits((s) => s.habits);
  const entries = useHabits((s) => s.entries);
  const addHabit = useHabits((s) => s.addHabit);
  const updateHabit = useHabits((s) => s.updateHabit);
  const deleteHabit = useHabits((s) => s.deleteHabit);
  const archiveHabit = useHabits((s) => s.archiveHabit);
  const unarchiveHabit = useHabits((s) => s.unarchiveHabit);
  const reorderHabits = useHabits((s) => s.reorderHabits);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "x_per_week">("daily");
  const [timesPerWeek, setTimesPerWeek] = useState<number>(3);
  const [targetMinutes, setTargetMinutes] = useState<number | undefined>(undefined);
  const [color, setColor] = useState<string>("#22c55e");
  const hasAny = habits.length > 0;
  const [category, setCategory] = useState<string>("Health");
  const [icon, setIcon] = useState<string>("💪");
  const [search, setSearch] = useState<string>("");
  const [showArchived, setShowArchived] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const today = toYYYYMMDD();

  const matches: (h: typeof habits[number]) => boolean = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return () => true;
    return (h: typeof habits[number]) =>
      h.title.toLowerCase().includes(q) ||
      (h.description || "").toLowerCase().includes(q) ||
      (h.category || "").toLowerCase().includes(q);
  }, [search]);

  function createHabit() {
    if (!title.trim()) return;
    addHabit({ title, description, frequency, timesPerWeek: frequency === "x_per_week" ? timesPerWeek : undefined, targetMinutes, color, category, icon });
    setTitle(""); setDescription(""); setFrequency("daily"); setTimesPerWeek(3); setTargetMinutes(undefined); setCategory("Health"); setIcon("💪");
  }

  function onDragStart(e: React.DragEvent<HTMLElement>, id: string) {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  }
  function onDrop(e: React.DragEvent<HTMLDivElement>, targetId: string) {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (!draggedId || draggedId === targetId) return;
    const ids = habits.filter(h => !h.isArchived).filter(matches).map(h => h.id);
    const from = ids.indexOf(draggedId);
    const to = ids.indexOf(targetId);
    if (from === -1 || to === -1) return;
    const reordered = [...ids];
    const [m] = reordered.splice(from, 1);
    reordered.splice(to, 0, m);
    // keep archived at end in their relative order
    const final = [...reordered, ...habits.filter(h=>h.isArchived).map(h=>h.id)];
    reorderHabits(final);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <Suspense fallback={null}><ParamsController setQ={setSearch} /></Suspense>

      {/* Left column: main content */}
      <div className="lg:col-span-9 min-w-0 space-y-3">
        {/* Filter toolbar */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Card className="rounded-xl">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Input className="h-9 text-sm" placeholder="Search by title, description, or category" value={search} onChange={(e) => setSearch(e.target.value)} />
                {search && (
                  <button className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border hover:bg-accent" onClick={() => setSearch("")}>Clear</button>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {!hasAny && (
          <Card className="rounded-xl">
            <CardContent className="p-6 text-center">
              <div className="text-5xl mb-2">💡</div>
              <p className="text-base font-medium">No habits yet — click “Add Habit” to get started</p>
              <p className="text-xs text-muted-foreground mt-1">Keep it small and consistent. Try something like “2 min stretch”.</p>
            </CardContent>
          </Card>
        )}

        {/* Add Habit - compact card */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Add Habit</h2>
          <Card className="rounded-xl">
            <CardContent className="p-3">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                {/* Row 1 */}
                <Input className="md:col-span-6 lg:col-span-7 h-9 text-sm" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <div className="md:col-span-3 lg:col-span-2">
                  <Select value={frequency} onValueChange={(v: "daily" | "weekly" | "x_per_week") => setFrequency(v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Frequency" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="x_per_week">x per week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-3 lg:col-span-3">
                  <Select value={category} onValueChange={(v: string) => setCategory(v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Study">Study</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Work">Work</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Row 2 */}
                <Input className="md:col-span-6 lg:col-span-7 h-9 text-sm" placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
                <div className="md:col-span-2 lg:col-span-2">
                  {frequency === "x_per_week" ? (
                    <Input type="number" className="h-9 text-sm" placeholder="Times/week" value={timesPerWeek} onChange={(e) => setTimesPerWeek(parseInt(e.target.value || "0"))} />
                  ) : (
                    <Input type="number" className="h-9 text-sm" placeholder="Target minutes" value={targetMinutes ?? ""} onChange={(e) => setTargetMinutes(e.target.value ? parseInt(e.target.value) : undefined)} />
                  )}
                </div>
                <Input className="md:col-span-2 lg:col-span-1 h-9 text-sm" placeholder="Icon (emoji)" value={icon} onChange={(e) => setIcon(e.target.value)} />
                <div className="md:col-span-2 lg:col-span-1 flex items-center">
                  <input aria-label="Color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-12 rounded" />
                </div>
                <div className="md:col-span-2 lg:col-span-1 flex items-center justify-end">
                  <Button className="h-9" onClick={createHabit}>Add</Button>
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">Press Enter to add.</div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Active list - denser, table-like */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Active</h2>
            <div className="text-xs text-muted-foreground">{habits.filter(h=>!h.isArchived).filter(matches).length} items</div>
          </div>
          <div className="grid gap-2">
            {habits.filter((h) => !h.isArchived).filter(matches).map((h) => {
              const curStreak = computeCurrentStreak(h, entries);
              const todayStatus = entries.find(e => e.habitId===h.id && e.date===today)?.status;
              const statusColor = todayStatus === "done" ? "#22c55e" : todayStatus === "partial" ? "#eab308" : todayStatus === "skipped" ? "#ef4444" : "#6b7280";
              const freqLabel = h.frequency === "daily" ? "Daily" : h.frequency === "weekly" ? "Weekly" : `${h.timesPerWeek || 0}×/wk`;
              return (
                <div
                  key={h.id}
                  className="relative grid grid-cols-[20px_1fr_auto_auto_auto_auto] items-center gap-3 px-3 py-2.5 rounded-xl border hover:border-white/15 hover:bg-white/5 transition"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onDrop(e, h.id)}
                >
                  {/* drag */}
                  <span draggable onDragStart={(e) => onDragStart(e, h.id)} className="inline-flex cursor-grab text-muted-foreground"><GripVertical className="h-4 w-4" /></span>
                  {/* title + chips */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      {h.icon && <span className="text-base leading-none">{h.icon}</span>}
                      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: h.color || "var(--primary)" }} />
                      <p className="font-medium truncate text-sm">{h.title}</p>
                      {h.category && <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border text-muted-foreground">{h.category}</span>}
                      <span className="inline-block h-2 w-2 rounded-full ring-1 ring-black/20" style={{ backgroundColor: statusColor }} />
                    </div>
                    {h.description && <p className="text-xs text-muted-foreground truncate mt-0.5">{h.description}</p>}
                  </div>
                  {/* frequency */}
                  <div className="text-xs text-muted-foreground">{freqLabel}</div>
                  {/* target */}
                  <div className="text-xs text-muted-foreground">{h.targetMinutes ? `${h.targetMinutes}m` : "—"}</div>
                  {/* streak chip */}
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border"><span>🔥</span>{curStreak}d</span>
                  </div>
                  {/* actions */}
                  <div className="justify-self-end flex items-center gap-1">
                    <Button asChild size="sm" variant="secondary" className="h-8">
                      <Link href="/today">Track</Link>
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Actions" onClick={() => setOpenMenuId(openMenuId===h.id?null:h.id)}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    {openMenuId === h.id && (
                      <div className="absolute right-2 top-[calc(100%+4px)] z-20 rounded-md border bg-background shadow-sm">
                        <button className="block w-full text-left px-3 py-1.5 text-sm hover:bg-accent" onClick={() => { setOpenMenuId(null); archiveHabit(h.id); }}>Archive</button>
                        <button className="block w-full text-left px-3 py-1.5 text-sm text-destructive hover:bg-accent/60" onClick={() => { setOpenMenuId(null); if (confirm("Delete habit? This will remove its entries.")) deleteHabit(h.id); }}>Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {!habits.filter((h) => !h.isArchived).filter(matches).length && (
              <p className="text-sm text-muted-foreground">No active habits.</p>
            )}
          </div>
        </section>

        {/* Archived - collapsed by default */}
        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Archived</h2>
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border text-muted-foreground">{habits.filter(h=>h.isArchived).length}</span>
            <Button size="sm" variant="ghost" className="h-8 ml-auto" onClick={() => setShowArchived(v => !v)}>{showArchived ? "Hide" : "Show"}</Button>
          </div>
          {showArchived && (
            <div className="grid gap-2">
              {habits.filter((h) => h.isArchived).filter(matches).map((h) => (
                <div key={h.id} className="grid grid-cols-[20px_1fr_auto] items-center gap-3 px-3 py-2.5 rounded-xl border opacity-80">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: h.color || "var(--primary)" }} />
                  <div className="min-w-0"><p className="font-medium truncate text-sm">{h.title}</p></div>
                  <div className="justify-self-end flex items-center gap-1">
                    <Button size="sm" variant="outline" className="h-8" onClick={() => unarchiveHabit(h.id)}>Unarchive</Button>
                    <Button size="sm" variant="destructive" className="h-8" onClick={() => { if (confirm("Delete habit? This will remove its entries.")) deleteHabit(h.id) }}>Delete</Button>
                  </div>
                </div>
              ))}
              {!habits.filter((h) => h.isArchived).filter(matches).length && (
                <p className="text-sm text-muted-foreground">No archived habits.</p>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Right rail: sticky summary */}
      <aside className="lg:col-span-3 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] overflow-auto space-y-3">
        {/* Today summary */}
        <Card className="rounded-xl">
          <CardContent className="p-4">
            <ProgressRing />
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card className="rounded-xl">
          <CardContent className="p-3 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="ghost" className="h-8"><Link href="/today"><Calendar className="h-4 w-4" /><span>Track Today</span></Link></Button>
            <Button asChild size="sm" variant="ghost" className="h-8"><Link href="/analytics"><BarChart3 className="h-4 w-4" /><span>Analytics</span></Link></Button>
          </CardContent>
        </Card>

        {/* Streaks list */}
        <Card className="rounded-xl">
          <CardContent className="p-3 space-y-2">
            <div className="text-sm font-medium">Top Streaks</div>
            <div className="space-y-1">
              {habits.filter(h=>!h.isArchived)
                .map(h=>({ h, s: computeCurrentStreak(h, entries) }))
                .sort((a,b)=>b.s-a.s)
                .slice(0,5)
                .map(({h,s}) => (
                  <div key={h.id} className="flex items-center gap-2">
                    <span className="text-base">{h.icon}</span>
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: h.color || "var(--primary)" }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{h.title}</div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border"><span>🔥</span>{s}d</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
