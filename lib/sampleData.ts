import { Habit, HabitEntry } from "./storage";
import { toYYYYMMDD } from "./date";

export function seedHabits(): Habit[] {
  const now = new Date().toISOString();
  return [
    {
      id: crypto.randomUUID(),
      title: "Morning Walk",
      description: "15-minute brisk walk",
      frequency: "daily",
      targetMinutes: 15,
      category: "Health",
      color: "#22c55e",
      isArchived: false,
      createdAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: "Read",
      description: "Read 20 pages",
      frequency: "x_per_week",
      timesPerWeek: 4,
      category: "Growth",
      color: "#6366f1",
      isArchived: false,
      createdAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: "Code",
      description: "45 min side project",
      frequency: "weekly",
      category: "Career",
      color: "#f59e0b",
      isArchived: false,
      createdAt: now,
    },
  ];
}

export function seedEntries(habits: Habit[]): HabitEntry[] {
  const today = toYYYYMMDD(new Date());
  const yesterday = toYYYYMMDD(new Date(Date.now() - 86400000));
  const h0 = habits[0]?.id;
  const h1 = habits[1]?.id;
  const h2 = habits[2]?.id;
  const now = new Date().toISOString();
  const entries: HabitEntry[] = [];
  if (h0)
    entries.push(
      { id: crypto.randomUUID(), habitId: h0, date: yesterday, status: "done", minutes: 15, createdAt: now },
      { id: crypto.randomUUID(), habitId: h0, date: today, status: "done", minutes: 16, createdAt: now }
    );
  if (h1)
    entries.push(
      { id: crypto.randomUUID(), habitId: h1, date: yesterday, status: "partial", minutes: 10, createdAt: now }
    );
  if (h2)
    entries.push(
      { id: crypto.randomUUID(), habitId: h2, date: today, status: "skipped", minutes: 0, createdAt: now }
    );
  return entries;
}
