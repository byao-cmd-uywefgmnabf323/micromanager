"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Habit, HabitEntry, loadLocal, saveLocal, StorageKeys } from "@/lib/storage";
import { toYYYYMMDD } from "@/lib/date";
import { seedEntries, seedHabits } from "@/lib/sampleData";

export type CheckInPayload = {
  date?: string; // defaults to today
  status: HabitEntry["status"];
  minutes?: number;
  note?: string;
};

export type HabitsState = {
  habits: Habit[];
  entries: HabitEntry[];
  initialized: boolean;
  // CRUD habits
  addHabit: (h: Omit<Habit, "id" | "createdAt" | "isArchived">) => Habit;
  updateHabit: (id: string, patch: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  archiveHabit: (id: string) => void;
  unarchiveHabit: (id: string) => void;
  reorderHabits: (ids: string[]) => void;
  // Check-ins
  checkIn: (habitId: string, payload: CheckInPayload) => HabitEntry;
  // Import/Export
  exportData: () => { habits: Habit[]; entries: HabitEntry[] };
  importData: (data: { habits: Habit[]; entries: HabitEntry[] }) => void;
  // Maintenance
  clearAll: () => void;
};

function genId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const useHabits = create<HabitsState>()(
  persist(
    (set, get) => ({
      habits: [],
      entries: [],
      initialized: false,

      addHabit: (h) => {
        const nh: Habit = {
          id: genId(),
          title: h.title,
          description: h.description,
          frequency: h.frequency,
          timesPerWeek: h.timesPerWeek,
          targetMinutes: h.targetMinutes,
          category: h.category,
          icon: h.icon,
          color: h.color,
          isArchived: false,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ habits: [nh, ...s.habits] }));
        return nh;
      },

      updateHabit: (id, patch) => {
        set((s) => ({ habits: s.habits.map((h) => (h.id === id ? { ...h, ...patch } : h)) }));
      },

      deleteHabit: (id) => {
        set((s) => ({ habits: s.habits.filter((h) => h.id !== id), entries: s.entries.filter((e) => e.habitId !== id) }));
      },

      archiveHabit: (id) => {
        set((s) => ({ habits: s.habits.map((h) => (h.id === id ? { ...h, isArchived: true } : h)) }));
      },

      unarchiveHabit: (id) => {
        set((s) => ({ habits: s.habits.map((h) => (h.id === id ? { ...h, isArchived: false } : h)) }));
      },

      reorderHabits: (ids) => {
        set((s) => {
          const map = new Map(s.habits.map((h) => [h.id, h] as const));
          const reordered = ids.map((id) => map.get(id)).filter(Boolean) as Habit[];
          const remaining = s.habits.filter((h) => !map.has(h.id));
          return { habits: [...reordered, ...remaining] };
        });
      },

      checkIn: (habitId, payload) => {
        const date = payload.date || toYYYYMMDD();
        const entry: HabitEntry = {
          id: genId(),
          habitId,
          date,
          status: payload.status,
          minutes: payload.minutes,
          note: payload.note,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ entries: [entry, ...s.entries] }));
        return entry;
      },

      exportData: () => {
        const s = get();
        return { habits: s.habits, entries: s.entries };
      },

      importData: (data) => {
        set(() => ({ habits: data.habits || [], entries: data.entries || [] }));
      },

      clearAll: () => {
        set(() => ({ habits: [], entries: [] }));
      },
    }),
    {
      name: "micromanager_store",
      partialize: (s) => ({ habits: s.habits, entries: s.entries }),
      onRehydrateStorage: () => (state) => {
        // After hydration, seed demo data if empty
        if (!state) return;
        if (!state.habits?.length) {
          const seeded = seedHabits();
          const entries = seedEntries(seeded);
          state.habits = seeded;
          state.entries = entries;
        }
        state.initialized = true;
      },
    }
  )
);

// Convenience selectors
export const selectors = {
  activeHabits: (s: HabitsState) => s.habits.filter((h) => !h.isArchived),
  archivedHabits: (s: HabitsState) => s.habits.filter((h) => h.isArchived),
};
