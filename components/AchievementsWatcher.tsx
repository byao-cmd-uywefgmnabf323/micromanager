"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useHabits } from "@/store/useHabits";
import { computeCurrentStreak } from "@/lib/streaks";
import { toYYYYMMDD, addDays } from "@/lib/date";
import { toast } from "sonner";

export type BadgeId = "streak_master" | "early_bird" | "consistency_king";

export type Badge = {
  id: BadgeId;
  title: string;
  emoji: string;
  description: string;
  earnedAt?: string; // ISO
};

const BADGES: Badge[] = [
  { id: "streak_master", title: "Streak Master", emoji: "🔥", description: "Maintain a 30-day streak on any habit." },
  { id: "early_bird", title: "Early Bird", emoji: "🌅", description: "Complete a habit before 10:00 for 7 days in a row." },
  { id: "consistency_king", title: "Consistency King", emoji: "👑", description: "Reach 90%+ completion over the last 30 days." },
];

function loadBadges(): Record<BadgeId, string | undefined> {
  const defaults: Record<BadgeId, string | undefined> = {
    streak_master: undefined,
    early_bird: undefined,
    consistency_king: undefined,
  };
  try {
    const raw = localStorage.getItem("mm_badges");
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<Record<BadgeId, string>>;
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

function saveBadges(map: Record<BadgeId, string | undefined>) {
  try {
    localStorage.setItem("mm_badges", JSON.stringify(map));
  } catch {}
}

function lastNDates(n: number) {
  const dates: string[] = [];
  const base = new Date(toYYYYMMDD());
  for (let i = n - 1; i >= 0; i--) {
    dates.push(toYYYYMMDD(addDays(base, -i)));
  }
  return dates;
}

export function useEarnedBadges(): Badge[] {
  const [map, setMap] = useState<Record<BadgeId, string | undefined>>(loadBadges());
  useEffect(() => setMap(loadBadges()), []);
  return BADGES.map((b) => ({ ...b, earnedAt: map[b.id] }));
}

export function AchievementsWatcher() {
  const habits = useHabits((s) => s.habits);
  const entries = useHabits((s) => s.entries);
  const earnedRef = useRef<Record<BadgeId, string | undefined>>(loadBadges());

  const active = useMemo(() => habits.filter((h) => !h.isArchived), [habits]);
  const today = toYYYYMMDD();
  const last30 = useMemo(() => lastNDates(30), []);
  const last7 = useMemo(() => lastNDates(7), []);

  useEffect(() => {
    const newly: BadgeId[] = [];
    const now = new Date().toISOString();

    // Streak Master: 30-day current streak on any habit
    let hasStreakMaster = false;
    for (const h of active) {
      if (computeCurrentStreak(h, entries) >= 30) { hasStreakMaster = true; break; }
    }
    if (hasStreakMaster && !earnedRef.current["streak_master"]) {
      earnedRef.current["streak_master"] = now; newly.push("streak_master");
    }

    // Early Bird: at least one entry before 10:00 local for 7 consecutive days
    const dates7 = last7;
    let all7 = true;
    for (const d of dates7) {
      const hasEarly = entries.some((e) => e.date === d && new Date(e.createdAt).getHours() < 10 && e.status === "done");
      if (!hasEarly) { all7 = false; break; }
    }
    if (all7 && !earnedRef.current["early_bird"]) {
      earnedRef.current["early_bird"] = now; newly.push("early_bird");
    }

    // Consistency King: 90%+ completion over last 30 days
    const activeCount = active.length || 1;
    let sum = 0;
    for (const d of last30) {
      const doneSet = new Set(entries.filter((e) => e.date === d && e.status === "done").map((e) => e.habitId));
      sum += doneSet.size / activeCount;
    }
    const pct30 = (sum / last30.length) * 100;
    if (pct30 >= 90 && !earnedRef.current["consistency_king"]) {
      earnedRef.current["consistency_king"] = now; newly.push("consistency_king");
    }

    if (newly.length) {
      saveBadges(earnedRef.current);
      for (const id of newly) {
        const meta = BADGES.find((b) => b.id === id)!;
        toast.success(`${meta.emoji} Badge earned: ${meta.title}`);
      }
    }
  }, [active, entries, last7, last30]);

  return null;
}
