"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { CompactToolbar } from "@/components/common/CompactToolbar";
import { FilterBar } from "@/components/common/FilterBar";
import { DenseTable, DenseRow, DenseCell } from "@/components/common/DenseTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const sample = [
    { id: "1", course: "Linear for Teams", provider: "Linear", status: "Active", hours: 3, last: "2025-10-01" },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-9 min-w-0 space-y-3">
        <Breadcrumbs items={[{ label: "Learning", href: "/spaces/learning" }, { label: "Courses" }]} />
        <CompactToolbar title={<div className="text-lg font-semibold">Courses</div>} actions={<div className="flex items-center gap-2"><Button size="sm" className="h-9">Add Course</Button><Button size="sm" variant="outline" className="h-9">Track Session</Button></div>} />

        <FilterBar search={search} onSearch={setSearch}>
          <Select>
            <SelectTrigger className="h-9 text-sm w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="enrolled">Enrolled</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </FilterBar>

        {/* QuickAdd */}
        <Card className="rounded-xl">
          <CardContent className="p-3 grid grid-cols-1 md:grid-cols-12 gap-2">
            <Input className="md:col-span-4 h-9 text-sm" placeholder="Course name" />
            <Input className="md:col-span-3 h-9 text-sm" placeholder="Provider" />
            <Select>
              <SelectTrigger className="md:col-span-2 h-9 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="enrolled">Enrolled</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Input type="number" className="md:col-span-2 h-9 text-sm" placeholder="Hours (optional)" />
            <div className="md:col-span-1 flex items-center justify-end"><Button className="h-9">Add</Button></div>
          </CardContent>
        </Card>

        {/* Table */}
        <DenseTable>
          <DenseRow className="grid-cols-[1fr_auto_auto_auto_auto] text-xs text-muted-foreground">
            <DenseCell>Course</DenseCell>
            <DenseCell>Provider</DenseCell>
            <DenseCell>Status</DenseCell>
            <DenseCell>Hours</DenseCell>
            <DenseCell className="justify-self-end">Actions</DenseCell>
          </DenseRow>
          {sample.map((r) => (
            <DenseRow key={r.id} className="grid-cols-[1fr_auto_auto_auto_auto]">
              <DenseCell><div className="text-sm truncate min-w-0">{r.course}</div></DenseCell>
              <DenseCell className="text-xs text-muted-foreground">{r.provider}</DenseCell>
              <DenseCell className="text-xs text-muted-foreground">{r.status}</DenseCell>
              <DenseCell className="text-xs text-muted-foreground">{r.hours}</DenseCell>
              <DenseCell className="justify-self-end"><Button size="sm" variant="ghost" className="h-8">Edit</Button></DenseCell>
            </DenseRow>
          ))}
        </DenseTable>
      </div>
    </div>
  );
}
