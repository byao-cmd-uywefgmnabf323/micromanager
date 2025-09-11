"use client";

import { useEffect, useMemo, useState } from "react";
import { useHabits } from "@/store/useHabits";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";

export default function HabitsPage() {
  const habits = useHabits((s) => s.habits);
  const addHabit = useHabits((s) => s.addHabit);
  const updateHabit = useHabits((s) => s.updateHabit);
  const deleteHabit = useHabits((s) => s.deleteHabit);
  const archiveHabit = useHabits((s) => s.archiveHabit);
  const unarchiveHabit = useHabits((s) => s.unarchiveHabit);
  const reorderHabits = useHabits((s) => s.reorderHabits);
  const params = useSearchParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "x_per_week">("daily");
  const [timesPerWeek, setTimesPerWeek] = useState<number>(3);
  const [targetMinutes, setTargetMinutes] = useState<number | undefined>(undefined);
  const [color, setColor] = useState<string>("#22c55e");
  const hasAny = habits.length > 0;
  const [category, setCategory] = useState<string>("Health");
  const [icon, setIcon] = useState<string>("💪");
  const [search, setSearch] = useState<string>(params.get("q") || "");

  useEffect(() => {
    setSearch(params.get("q") || "");
  }, [params]);

  const matches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return (h: typeof habits[number]) => true;
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
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Filter</h2>
        <Card className="rounded-2xl"><CardContent className="p-4">
          <Input placeholder="Search by title, description, or category" value={search} onChange={(e) => setSearch(e.target.value)} />
        </CardContent></Card>
      </section>
      {!hasAny && (
        <Card className="rounded-2xl">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-3">💡</div>
            <p className="text-lg font-medium">No habits yet — click “Add Habit” to get started</p>
            <p className="text-sm text-muted-foreground mt-1">Keep it small and consistent. Try something like “2 min stretch”.</p>
          </CardContent>
        </Card>
      )}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Add Habit</h2>
        <Card className="rounded-2xl"><CardContent className="p-4 grid gap-3 sm:grid-cols-2">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="flex items-center gap-2">
            <Select value={frequency} onValueChange={(v: any) => setFrequency(v)}>
              <SelectTrigger><SelectValue placeholder="Frequency" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="x_per_week">x per week</SelectItem>
              </SelectContent>
            </Select>
            {frequency === "x_per_week" && (
              <Input type="number" className="w-28" value={timesPerWeek} onChange={(e) => setTimesPerWeek(parseInt(e.target.value || "0"))} />
            )}
          </div>
          <Input type="number" placeholder="Target minutes (optional)" value={targetMinutes ?? ""} onChange={(e) => setTargetMinutes(e.target.value ? parseInt(e.target.value) : undefined)} />
          <div className="flex items-center gap-2">
            <Select value={category} onValueChange={(v: any) => setCategory(v)}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Study">Study</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
              </SelectContent>
            </Select>
            <Input className="w-28" placeholder="Icon (emoji)" value={icon} onChange={(e) => setIcon(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Color</span>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-12 rounded" />
          </div>
          <div className="sm:col-span-2">
            <Button onClick={createHabit}>Add Habit</Button>
          </div>
        </CardContent></Card>
      </section>
      <Separator />
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Active</h2>
        <div className="grid gap-2">
          {habits.filter((h) => !h.isArchived).filter(matches).map((h) => (
            <div
              key={h.id}
              className="flex items-center gap-2 rounded-xl border p-3"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, h.id)}
            >
              <span draggable onDragStart={(e) => onDragStart(e, h.id)} className="inline-flex">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
              </span>
              {h.icon && <span className="text-lg leading-none">{h.icon}</span>}
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: h.color || "var(--primary)" }} />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{h.title} {h.category && <Badge variant="outline" className="ml-2 rounded-full text-[10px] align-middle">{h.category}</Badge>}</p>
                {h.description && <p className="text-sm text-muted-foreground truncate">{h.description}</p>}
              </div>
              <Button size="sm" variant="secondary" onClick={() => archiveHabit(h.id)}>Archive</Button>
              <Button size="sm" variant="destructive" onClick={() => { if (confirm("Delete habit? This will remove its entries.")) deleteHabit(h.id) }}>Delete</Button>
            </div>
          ))}
          {!habits.filter((h) => !h.isArchived).filter(matches).length && (
            <p className="text-sm text-muted-foreground">No active habits.</p>
          )}
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Archived</h2>
        <div className="grid gap-2">
          {habits.filter((h) => h.isArchived).filter(matches).map((h) => (
            <div key={h.id} className="flex items-center gap-2 rounded-xl border p-3 opacity-70">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: h.color || "var(--primary)" }} />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{h.title}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => unarchiveHabit(h.id)}>Unarchive</Button>
              <Button size="sm" variant="destructive" onClick={() => { if (confirm("Delete habit? This will remove its entries.")) deleteHabit(h.id) }}>Delete</Button>
            </div>
          ))}
          {!habits.filter((h) => h.isArchived).filter(matches).length && (
            <p className="text-sm text-muted-foreground">No archived habits.</p>
          )}
        </div>
      </section>
    </div>
  );
}
