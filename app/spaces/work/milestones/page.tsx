"use client";

import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { CompactToolbar } from "@/components/common/CompactToolbar";
import { DenseTable, DenseRow, DenseCell } from "@/components/common/DenseTable";
import { Button } from "@/components/ui/button";

export default function MilestonesPage() {
  const sample = [
    { id: "1", milestone: "MVP Launch", project: "Side Project", due: "2025-10-20", status: "On Track", owner: "You" },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-9 min-w-0 space-y-3">
        <Breadcrumbs items={[{ label: "Work", href: "/spaces/work" }, { label: "Milestones" }]} />
        <CompactToolbar title={<div className="text-lg font-semibold">Milestones</div>} actions={<div className="flex items-center gap-2"><Button size="sm" className="h-9">Add Milestone</Button></div>} />
        <DenseTable>
          <DenseRow className="grid-cols-[1fr_auto_auto_auto_auto_auto] text-xs text-muted-foreground">
            <DenseCell>Milestone</DenseCell>
            <DenseCell>Project</DenseCell>
            <DenseCell>Due</DenseCell>
            <DenseCell>Status</DenseCell>
            <DenseCell>Owner</DenseCell>
            <DenseCell className="justify-self-end">Actions</DenseCell>
          </DenseRow>
          {sample.map((r) => (
            <DenseRow key={r.id} className="grid-cols-[1fr_auto_auto_auto_auto_auto]">
              <DenseCell><div className="text-sm truncate min-w-0">{r.milestone}</div></DenseCell>
              <DenseCell className="text-xs text-muted-foreground">{r.project}</DenseCell>
              <DenseCell className="text-xs text-muted-foreground">{r.due}</DenseCell>
              <DenseCell className="text-xs text-muted-foreground">{r.status}</DenseCell>
              <DenseCell className="text-xs text-muted-foreground">{r.owner}</DenseCell>
              <DenseCell className="justify-self-end"><Button size="sm" variant="ghost" className="h-8">Edit</Button></DenseCell>
            </DenseRow>
          ))}
        </DenseTable>
      </div>
    </div>
  );
}
