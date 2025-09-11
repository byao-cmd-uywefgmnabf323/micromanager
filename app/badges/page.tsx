"use client";

import { useEarnedBadges } from "@/components/AchievementsWatcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BadgesPage() {
  const badges = useEarnedBadges();
  const earned = badges.filter((b) => !!b.earnedAt);
  const locked = badges.filter((b) => !b.earnedAt);

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Badges</h2>
        <p className="text-sm text-muted-foreground">Collect achievements as you build consistent habits.</p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">Earned</h3>
        {earned.length === 0 ? (
          <Card className="rounded-2xl"><CardContent className="p-4 text-sm text-muted-foreground">No badges earned yet. Keep going!</CardContent></Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {earned.map((b) => (
              <Card key={b.id} className="rounded-2xl border-green-500/30">
                <CardHeader className="pb-2 flex flex-row items-center gap-2">
                  <div className="text-2xl">{b.emoji}</div>
                  <CardTitle className="text-base">{b.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm">
                  <div className="text-muted-foreground">{b.description}</div>
                  <div className="mt-1 text-xs">Earned on {new Date(b.earnedAt!).toLocaleDateString()}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">Locked</h3>
        {locked.length === 0 ? (
          <Card className="rounded-2xl"><CardContent className="p-4 text-sm text-muted-foreground">All badges earned. Amazing!</CardContent></Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {locked.map((b) => (
              <Card key={b.id} className="rounded-2xl opacity-70">
                <CardHeader className="pb-2 flex flex-row items-center gap-2">
                  <div className="text-2xl">{b.emoji}</div>
                  <CardTitle className="text-base">{b.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm">
                  <div className="text-muted-foreground">{b.description}</div>
                  <div className="mt-1 text-xs">Locked</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
