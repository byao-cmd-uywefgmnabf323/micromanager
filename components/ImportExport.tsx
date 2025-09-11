"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRef } from "react";
import { useHabits } from "@/store/useHabits";
import { toast } from "sonner";

export function ImportExport() {
  const fileRef = useRef<HTMLInputElement>(null);
  const exportData = useHabits((s) => s.exportData);
  const importData = useHabits((s) => s.importData);

  function onExport() {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `micromanager-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported data");
  }

  function onImportClick() {
    fileRef.current?.click();
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      if (!json || typeof json !== "object" || !Array.isArray(json.habits) || !Array.isArray(json.entries)) {
        throw new Error("Invalid backup file");
      }
      importData(json);
      toast.success("Imported data");
    } catch (err: any) {
      toast.error(err?.message || "Import failed");
    } finally {
      e.target.value = "";
    }
  }

  return (
    <div className="rounded-2xl border p-4">
      <h3 className="font-semibold mb-2">Backup</h3>
      <div className="flex flex-wrap gap-2">
        <Button onClick={onExport}>Export JSON</Button>
        <Button variant="outline" onClick={onImportClick}>Import JSON</Button>
        <input ref={fileRef} type="file" accept="application/json" onChange={onFile} className="hidden" />
      </div>
      <Separator className="my-4" />
      <p className="text-sm text-muted-foreground">Your data is stored locally in your browser. Use export/import to back up or move devices.</p>
    </div>
  );
}
