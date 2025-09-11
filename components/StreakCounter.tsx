"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useHabits } from "@/store/useHabits";
import { computeCurrentStreak } from "@/lib/streaks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { CelebrationOverlay } from "@/components/Celebration";

export function StreakCounter() {
  const habits = useHabits((s) => s.habits);
  const entries = useHabits((s) => s.entries);
  const active = useMemo(() => habits.filter((h) => !h.isArchived), [habits]);
  const currentMax = useMemo(() => {
    let m = 0;
    for (const h of active) {
      m = Math.max(m, computeCurrentStreak(h, entries));
    }
    return m;
  }, [active, entries]);

  const prev = useRef(0);
  const controls = useAnimation();
  const prevByHabit = useRef<Map<string, number>>(new Map());
  const [celebration, setCelebration] = useState<string | null>(null);

  useEffect(() => {
    if (currentMax > prev.current) {
      controls.start({ scale: [1, 1.1, 1], transition: { duration: 0.6 } });
    }
    prev.current = currentMax;
  }, [currentMax, controls]);

  useEffect(() => {
    // Milestone check across active habits
    const milestones = new Set([7, 30, 100]);
    let msg: string | null = null;
    for (const h of active) {
      const cur = computeCurrentStreak(h, entries);
      const prevVal = prevByHabit.current.get(h.id) || 0;
      if (cur > prevVal && milestones.has(cur)) {
        msg = `Congrats! You’ve hit ${cur} days on ${h.title} 🥳`;
      }
      prevByHabit.current.set(h.id, cur);
    }
    if (msg) {
      setCelebration(msg);
      const t = setTimeout(() => setCelebration(null), 5000);
      return () => clearTimeout(t);
    }
  }, [active, entries]);

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Streak</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <CelebrationOverlay visible={!!celebration} onDone={() => setCelebration(null)} />
        <motion.div animate={controls} className="flex items-center gap-3">
          <div className="relative">
            <Flame className="h-10 w-10 text-orange-500" />
            <span className="absolute inset-0 animate-pulse rounded-full opacity-20"></span>
          </div>
          <div>
            <div className="text-3xl font-semibold">{currentMax} days</div>
            <div className="text-xs text-muted-foreground">Longest current streak</div>
          </div>
        </motion.div>
        {celebration && (
          <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            className="mt-3 rounded-xl border bg-gradient-to-r from-purple-600/30 to-blue-600/30 p-3 text-sm"
          >
            {celebration}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
