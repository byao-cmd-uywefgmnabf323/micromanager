"use client";

import { ImportExport } from "@/components/ImportExport";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHabits } from "@/store/useHabits";
import { AccentPicker } from "@/components/AccentPicker";

export default function SettingsPage() {
  const clearAll = useHabits((s) => s.clearAll);
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Theme</h2>
        <Card className="rounded-2xl"><CardContent className="p-4"><ThemeToggle /></CardContent></Card>
        <AccentPicker />
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Data</h2>
        <ImportExport />
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Danger Zone</h2>
        <Card className="rounded-2xl"><CardContent className="p-4">
          <Button variant="destructive" onClick={() => { if (confirm("Clear all local data? This cannot be undone.")) clearAll(); }}>Clear Data</Button>
        </CardContent></Card>
      </section>
    </div>
  );
}
