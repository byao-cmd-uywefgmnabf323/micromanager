"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { CompactToolbar } from "@/components/common/CompactToolbar";
import { FilterBar } from "@/components/common/FilterBar";
import { DenseTable, DenseRow, DenseCell } from "@/components/common/DenseTable";
import { RightRail } from "@/components/common/RightRail";
import { MiniChart } from "@/components/common/MiniChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export default function WorkoutsPage() {
  const [search, setSearch] = useState("");

  const sample = [
    { id: "1", name: "5k Run", duration: 30, intensity: "High", date: "2025-10-01" },
    { id: "2", name: "Yoga", duration: 45, intensity: "Low", date: "2025-10-02" },
  ];
  const weekly = Array.from({ length: 14 }).map((_, i) => ({ d: i + 1, s: Math.max(0, Math.round(1 + Math.sin(i) * 0.8)) }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-9 min-w-0 space-y-3">
        <Breadcrumbs items={[{ label: "Health", href: "/spaces/health" }, { label: "Workouts" }]} />
        <CompactToolbar title={<div className="text-lg font-semibold">Workouts</div>} actions={<div className="flex items-center gap-2"><Button size="sm" className="h-9">Log Workout</Button><Button size="sm" variant="outline" className="h-9">Templates</Button></div>} />

        <FilterBar search={search} onSearch={setSearch} />

        {/* QuickAdd */}
        <Card className="rounded-xl">
          <CardContent className="p-3 grid grid-cols-1 md:grid-cols-12 gap-2">
            <Input className="md:col-span-5 h-9 text-sm" placeholder="Workout name" />
            <Input type="number" className="md:col-span-2 h-9 text-sm" placeholder="Duration (min)" />
            <Select>
              <SelectTrigger className="md:col-span-2 h-9 text-sm"><SelectValue placeholder="Intensity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Input className="md:col-span-2 h-9 text-sm" placeholder="Notes (optional)" />
            <div className="md:col-span-1 flex items-center justify-end"><Button className="h-9">Add</Button></div>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="rounded-xl"><CardContent className="p-3 space-y-1"><div className="text-sm font-medium">Weekly Sessions</div><div className="h-24"><MiniChart type="line" data={weekly} x="d" y="s" color="#22c55e" /></div></CardContent></Card>

        {/* Table */}
        <DenseTable>
          <DenseRow className="grid-cols-[1fr_auto_auto_auto] text-xs text-muted-foreground">
            <DenseCell>Workout</DenseCell>
            <DenseCell>Duration</DenseCell>
            <DenseCell>Intensity</DenseCell>
            <DenseCell className="justify-self-end">Actions</DenseCell>
          </DenseRow>
          {sample.map((r) => (
            <DenseRow key={r.id} className="grid-cols-[1fr_auto_auto_auto]">
              <DenseCell><div className="text-sm truncate min-w-0">{r.name}</div></DenseCell>
              <DenseCell className="text-xs text-muted-foreground">{r.duration}m</DenseCell>
              <DenseCell className="text-xs text-muted-foreground">{r.intensity}</DenseCell>
              <DenseCell className="justify-self-end"><Button size="sm" variant="ghost" className="h-8">Edit</Button></DenseCell>
            </DenseRow>
          ))}
        </DenseTable>
      </div>

      <RightRail>
        <Card className="rounded-xl"><CardContent className="p-3 text-xs text-muted-foreground">Tip: Short, frequent workouts beat long inconsistent ones.</CardContent></Card>
      </RightRail>
    </div>
  );
}
