"use client";

import Link from "next/link";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { CompactToolbar } from "@/components/common/CompactToolbar";
import { StatCard } from "@/components/common/StatCard";
import { RightRail } from "@/components/common/RightRail";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LearningPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-9 min-w-0 space-y-3">
        <Breadcrumbs items={[{ label: "Learning" }]} />
        <CompactToolbar title={<div className="text-lg font-semibold">Learning Hub</div>} actions={null} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard value={2} label="Books in progress" />
          <StatCard value={1} label="Courses in progress" />
          <StatCard value={240} label="Study minutes (7d)" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className="rounded-xl"><CardContent className="p-4 flex items-center justify-between"><div><div className="text-sm font-medium">Books</div><div className="text-xs text-muted-foreground">Track reading progress</div></div><Button asChild size="sm" className="h-8"><Link href="/spaces/learning/books">Open</Link></Button></CardContent></Card>
          <Card className="rounded-xl"><CardContent className="p-4 flex items-center justify-between"><div><div className="text-sm font-medium">Courses</div><div className="text-xs text-muted-foreground">Track course progress</div></div><Button asChild size="sm" className="h-8"><Link href="/spaces/learning/courses">Open</Link></Button></CardContent></Card>
        </div>
      </div>
      <RightRail>
        <Card className="rounded-xl"><CardContent className="p-3 text-xs text-muted-foreground">Tip: Keep sessions to 25–45 min for focus.</CardContent></Card>
      </RightRail>
    </div>
  );
}
