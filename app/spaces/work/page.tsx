"use client";

import Link from "next/link";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { CompactToolbar } from "@/components/common/CompactToolbar";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function WorkPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-9 min-w-0 space-y-3">
        <Breadcrumbs items={[{ label: "Work" }]} />
        <CompactToolbar title={<div className="text-lg font-semibold">Work Hub</div>} actions={null} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard value={2} label="Active projects" />
          <StatCard value={8} label="Tasks this week" />
          <StatCard value={12} label="Ideas captured" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="rounded-xl"><CardContent className="p-4 flex items-center justify-between"><div><div className="text-sm font-medium">Side Project</div><div className="text-xs text-muted-foreground">Tasks and milestones</div></div><Button asChild size="sm" className="h-8"><Link href="/spaces/work/side-project">Open</Link></Button></CardContent></Card>
          <Card className="rounded-xl"><CardContent className="p-4 flex items-center justify-between"><div><div className="text-sm font-medium">Ideas</div><div className="text-xs text-muted-foreground">Capture and triage</div></div><Button asChild size="sm" className="h-8"><Link href="/spaces/work/ideas">Open</Link></Button></CardContent></Card>
          <Card className="rounded-xl"><CardContent className="p-4 flex items-center justify-between"><div><div className="text-sm font-medium">Milestones</div><div className="text-xs text-muted-foreground">Track progress</div></div><Button asChild size="sm" className="h-8"><Link href="/spaces/work/milestones">Open</Link></Button></CardContent></Card>
        </div>
      </div>
    </div>
  );
}
