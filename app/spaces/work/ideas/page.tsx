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

export default function IdeasPage() {
  const [search, setSearch] = useState("");
  const sample = [
    { id: "1", idea: "Onboarding drip", tag: "Growth", impact: "High", created: "2025-10-02" },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-9 min-w-0 space-y-3">
        <Breadcrumbs items={[{ label: "Work", href: "/spaces/work" }, { label: "Ideas" }]} />
        <CompactToolbar title={<div className="text-lg font-semibold">Ideas</div>} actions={<div className="flex items-center gap-2"><Button size="sm" className="h-9">Add Idea</Button></div>} />
        <FilterBar search={search} onSearch={setSearch}>
          <Select>
            <SelectTrigger className="h-9 text-sm w-40"><SelectValue placeholder="Tag" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="growth">Growth</SelectItem>
              <SelectItem value="ux">UX</SelectItem>
              <SelectItem value="tech">Tech</SelectItem>
            </SelectContent>
          </Select>
        </FilterBar>
        <DenseTable>
          <DenseRow className="grid-cols-[1fr_auto_auto_auto_auto] text-xs text-muted-foreground">
            <DenseCell>Idea</DenseCell>
            <DenseCell>Tag</DenseCell>
            <DenseCell>Impact</DenseCell>
            <DenseCell>Created</DenseCell>
            <DenseCell className="justify-self-end">Actions</DenseCell>
          </DenseRow>
          {sample.map((r) => (
            <DenseRow key={r.id} className="grid-cols-[1fr_auto_auto_auto_auto]">
              <DenseCell><div className="text-sm truncate min-w-0">{r.idea}</div></DenseCell>
              <DenseCell className="text-xs text-muted-foreground">{r.tag}</DenseCell>
              <DenseCell className="text-xs text-muted-foreground">{r.impact}</DenseCell>
              <DenseCell className="text-xs text-muted-foreground">{r.created}</DenseCell>
              <DenseCell className="justify-self-end"><Button size="sm" variant="ghost" className="h-8">Edit</Button></DenseCell>
            </DenseRow>
          ))}
        </DenseTable>
      </div>
    </div>
  );
}
