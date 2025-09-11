"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StreakBadge } from "@/components/StreakBadge";
import { Habit } from "@/lib/storage";
import { useHabits } from "@/store/useHabits";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { getWeekStart, addDays, toYYYYMMDD } from "@/lib/date";
import { Badge } from "@/components/ui/badge";

export function HabitCard({ habit, onRegisterFocus }: { habit: Habit; onRegisterFocus?: (habitId: string, handlers: { focusMinutes: () => void; focusNote: () => void }) => void }) {
  const checkIn = useHabits((s) => s.checkIn);
  const entries = useHabits((s) => s.entries);
  const [minutes, setMinutes] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const minutesRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLInputElement>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [bounceKey, setBounceKey] = useState(0);
  const longPressTimer = useRef<number | null>(null);
  // Register focus handlers with parent, if provided
  useRegisterFocus(habit.id, onRegisterFocus, minutesRef, noteRef);

  function submit(status: "done" | "skipped" | "partial") {
    const m = minutes ? Number.parseInt(minutes) : undefined;
    checkIn(habit.id, { status, minutes: Number.isFinite(m as number) ? (m as number) : undefined, note: note || undefined });
    toast.success(`${habit.title}: ${status}`);
    setMinutes("");
    setNote("");
    if (status === "done") {
      // Trigger bounce animation
      setBounceKey((k) => k + 1);
    }
  }

  let weekProgress: { done: number; target?: number } | null = null;
  if (habit.frequency === "x_per_week" && habit.timesPerWeek) {
    const start = new Date(getWeekStart());
    const weekDates = new Set<string>();
    for (let i = 0; i < 7; i++) weekDates.add(toYYYYMMDD(addDays(start, i)));
    const done = entries.filter((e) => e.habitId === habit.id && e.status === "done" && weekDates.has(e.date)).length;
    weekProgress = { done, target: habit.timesPerWeek };
  }

  function startLongPress() {
    if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
    longPressTimer.current = window.setTimeout(() => setShowDetails(true), 600) as unknown as number;
  }
  function cancelLongPress() {
    if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base flex items-center gap-2">
            {habit.icon && <span className="text-lg leading-none">{habit.icon}</span>}
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: habit.color || "var(--primary)" }} />
            {habit.title}
            {weekProgress && (
              <Badge variant="outline" className="ml-2 rounded-full text-xs">{weekProgress.done}/{weekProgress.target} this week</Badge>
            )}
          </CardTitle>
          <StreakBadge habit={habit} />
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {habit.description && (
            <p className="text-sm text-muted-foreground">{habit.description}</p>
          )}
          {habit.category && (
            <div>
              <Badge variant="secondary" className="rounded-full text-xs">{habit.category}</Badge>
            </div>
          )}
          <motion.div
            key={bounceKey}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap items-center gap-2"
          >
            {showDetails && (
              <>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder={habit.targetMinutes ? `${habit.targetMinutes}` : "min"}
                  className="w-24"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  ref={minutesRef}
                />
                <Input
                  type="text"
                  placeholder="+ note"
                  className="min-w-[160px] flex-1"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  ref={noteRef}
                />
              </>
            )}
            <Button
              className="rounded-full px-5"
              onMouseDown={startLongPress}
              onMouseUp={cancelLongPress}
              onMouseLeave={cancelLongPress}
              onTouchStart={startLongPress}
              onTouchEnd={cancelLongPress}
              onClick={() => submit("done")}
            >
              ✅ Done
            </Button>
            <Button className="rounded-full px-5" variant="secondary" onClick={() => submit("partial")}>
              ⏳ Partial
            </Button>
            <Button className="rounded-full px-5" variant="outline" onClick={() => submit("skipped")}>
              ❌ Skipped
            </Button>
            <Button className="rounded-full px-4" variant="ghost" onClick={() => setShowDetails((v) => !v)}>
              {showDetails ? "Hide details" : "Details"}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function useRegisterFocus(
  habitId: string,
  onRegister?: (habitId: string, handlers: { focusMinutes: () => void; focusNote: () => void }) => void,
  minutesRef?: React.RefObject<HTMLInputElement | null>,
  noteRef?: React.RefObject<HTMLInputElement | null>
) {
  useEffect(() => {
    if (!onRegister) return;
    const focusMinutes = () => minutesRef?.current?.focus();
    const focusNote = () => noteRef?.current?.focus();
    onRegister(habitId, { focusMinutes, focusNote });
  }, [habitId, onRegister, minutesRef, noteRef]);
}
