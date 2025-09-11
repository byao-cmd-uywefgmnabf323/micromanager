import Link from "next/link";
import { QuoteCard } from "@/components/QuoteCard";
import { StreakCounter } from "@/components/StreakCounter";
import { ProgressRing } from "@/components/ProgressRing";
import { Heatmap } from "@/components/Heatmap";
import { TodayList } from "@/components/TodayList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RecapCard } from "@/components/RecapCard";
import { MonthlyCompletions } from "@/components/MonthlyCompletions";
import { MiniTimeline } from "@/components/MiniTimeline";
import { AskAIButton } from "@/components/ai/AskAI";

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Top: Quote */}
      <QuoteCard />

      {/* Ask AI quick access */}
      <div className="flex items-center justify-end">
        <AskAIButton />
      </div>

      {/* Widgets Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StreakCounter />
        <Card className="rounded-2xl">
          <CardHeader className="pb-2"><CardTitle className="text-base">Progress</CardTitle></CardHeader>
          <CardContent className="pt-2"><ProgressRing /></CardContent>
        </Card>
        <Card className="rounded-2xl md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2"><CardTitle className="text-base">Consistency</CardTitle></CardHeader>
          <CardContent className="pt-2"><Heatmap days={90} /></CardContent>
        </Card>
      </div>

      {/* Weekly Recap */}
      <RecapCard days={7} />

      {/* 7-day Mini Timeline */}
      <MiniTimeline days={7} />

      {/* Monthly trendline */}
      <MonthlyCompletions days={30} />

      {/* Today’s Habits */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Today's Habits</h2>
          <Button asChild><Link href="/habits"><Plus className="mr-2 h-4 w-4" /> Add Habit</Link></Button>
        </div>
        <Card className="rounded-2xl"><CardContent className="p-4"><TodayList /></CardContent></Card>
      </section>

      {/* Floating Quick Add */}
      <Button asChild className="fixed bottom-24 right-4 rounded-full shadow-lg" size="lg">
        <Link href="/habits"><Plus className="mr-2 h-5 w-5" /> Add Habit</Link>
      </Button>
    </div>
  );
}
