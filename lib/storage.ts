"use client";

import { set, get } from "idb-keyval";

const LS_KEYS = {
  habits: "mm_habits",
  entries: "mm_entries",
  version: "mm_version",
};

export type Habit = {
  id: string;
  title: string;
  description?: string;
  frequency: "daily" | "weekly" | "x_per_week";
  timesPerWeek?: number;
  targetMinutes?: number;
  category?: string;
  icon?: string; // emoji or lucide icon key
  color?: string;
  isArchived: boolean;
  createdAt: string; // ISO
};

export type HabitEntry = {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  status: "done" | "skipped" | "partial";
  minutes?: number;
  note?: string;
  createdAt: string; // ISO
};

export function saveLocal<T>(key: keyof typeof LS_KEYS, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_KEYS[key], JSON.stringify(value));
  } catch {}
}

export function loadLocal<T>(key: keyof typeof LS_KEYS, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(LS_KEYS[key]);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function saveLogsIDB(key: string, value: unknown) {
  try {
    await set(key, value);
  } catch {}
}

export async function loadLogsIDB<T>(key: string): Promise<T | undefined> {
  try {
    const v = await get(key);
    return v as T | undefined;
  } catch {
    return undefined;
  }
}

export const StorageKeys = LS_KEYS;
