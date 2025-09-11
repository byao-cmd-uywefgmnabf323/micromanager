"use client";

import { Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Habit } from "@/lib/storage";
import { useHabits } from "@/store/useHabits";
import { computeBestStreak, computeCurrentStreak } from "@/lib/streaks";
import { useEffect, useMemo, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

export function StreakBadge({ habit }: { habit: Habit }) {
  const entries = useHabits((s) => s.entries);
  const { cur, best } = useMemo(() => {
    return {
      cur: computeCurrentStreak(habit, entries),
      best: computeBestStreak(habit, entries),
    };
  }, [habit, entries]);
  const prevCur = useRef(0);
  const controls = useAnimation();

  useEffect(() => {
    if (cur > prevCur.current) {
      controls.start({ scale: [1, 1.12, 1], transition: { duration: 0.5 } });
    }
    prevCur.current = cur;
  }, [cur, controls]);

  return (
    <motion.div animate={controls}>
      <Badge variant="secondary" className="gap-1 rounded-full px-2 py-1 text-xs">
        <Flame className="h-3.5 w-3.5 text-orange-500" />
        {cur} / best {best}
      </Badge>
    </motion.div>
  );
}
