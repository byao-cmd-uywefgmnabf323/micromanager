"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { CompactToolbar } from "@/components/common/CompactToolbar";
import { FilterBar } from "@/components/common/FilterBar";
import { DenseTable, DenseRow, DenseCell } from "@/components/common/DenseTable";
import { RightRail } from "@/components/common/RightRail";
import { ProgressRing } from "@/components/ProgressRing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export default function NutritionPage() {
  const [search, setSearch] = useState("");
  const [mealType, setMealType] = useState<string>("");

  const sample = [
    { id: "1", food: "Chicken Salad", kcal: 420, c: 20, f: 18, p: 35, tag: "Lunch", date: "2025-10-01" },
    { id: "2", food: "Oatmeal", kcal: 300, c: 50, f: 5, p: 10, tag: "Breakfast", date: "2025-10-02" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-9 min-w-0 space-y-3">
        <Breadcrumbs items={[{ label: "Health", href: "/spaces/health" }, { label: "Nutrition" }]} />
        <CompactToolbar title={<div className="text-lg font-semibold">Nutrition</div>} actions={<div className="flex items-center gap-2"><Button size="sm" className="h-9">Quick Add Meal</Button><Button size="sm" variant="outline" className="h-9">View Analytics</Button></div>} />

        <FilterBar search={search} onSearch={setSearch}>
          <Select value={mealType} onValueChange={setMealType}>
            <SelectTrigger className="h-9 text-sm w-40"><SelectValue placeholder="Meal type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="snack">Snack</SelectItem>
            </SelectContent>
          </Select>
        </FilterBar>

        {/* QuickAdd inline form */}
        <Card className="rounded-xl">
          <CardContent className="p-3 grid grid-cols-1 md:grid-cols-12 gap-2">
            <Input className="md:col-span-5 h-9 text-sm" placeholder="Food name" />
            <Input type="number" className="md:col-span-2 h-9 text-sm" placeholder="Calories" />
            <Input type="number" className="md:col-span-1 h-9 text-sm" placeholder="Carbs" />
            <Input type="number" className="md:col-span-1 h-9 text-sm" placeholder="Fat" />
            <Input type="number" className="md:col-span-1 h-9 text-sm" placeholder="Protein" />
            <Select>
              <SelectTrigger className="md:col-span-1 h-9 text-sm"><SelectValue placeholder="Tag" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
            <div className="md:col-span-1 flex items-center justify-end"><Button className="h-9">Add</Button></div>
            <div className="md:col-span-12 text-[11px] text-muted-foreground">Press Enter to add.</div>
          </CardContent>
        </Card>

        {/* Table */}
        <DenseTable>
          <DenseRow className="grid-cols-[1fr_auto_auto_auto_auto_auto] text-xs text-muted-foreground">
            <DenseCell>Food</DenseCell>
            <DenseCell>Kcal</DenseCell>
            <DenseCell>Macros (C/F/P)</DenseCell>
            <DenseCell>Tag</DenseCell>
            <DenseCell>Date</DenseCell>
            <DenseCell className="justify-self-end">Actions</DenseCell>
          </DenseRow>
          {sample.map((r) => (
            <DenseRow key={r.id} className="grid-cols-[1fr_auto_auto_auto_auto_auto]">
              <DenseCell><div className="text-sm truncate min-w-0">{r.food}</div></DenseCell>
              <DenseCell className="text-xs text-muted-foreground">{r.kcal}</DenseCell>
              <DenseCell className="text-xs text-muted-foreground">{r.c}/{r.f}/{r.p}</DenseCell>
              <DenseCell className="text-xs text-muted-foreground">{r.tag}</DenseCell>
              <DenseCell className="text-xs text-muted-foreground">{r.date}</DenseCell>
              <DenseCell className="justify-self-end"><Button size="sm" variant="ghost" className="h-8">Edit</Button></DenseCell>
            </DenseRow>
          ))}
        </DenseTable>
      </div>

      <RightRail>
        <Card className="rounded-xl"><CardContent className="p-4"><ProgressRing /></CardContent></Card>
        <Card className="rounded-xl"><CardContent className="p-3 text-xs text-muted-foreground">Tips: Add common foods as templates for quicker logging.</CardContent></Card>
      </RightRail>
    </div>
  );
}
