"use client";

import { useEffect, useState } from "react";
import { AccentId, ACCENT_PRESETS, loadAccent, saveAccent, applyAccent } from "@/lib/theme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ORDER: AccentId[] = ["green", "purple", "blue", "rose", "orange", "teal"];

export function AccentPicker() {
  const [accent, setAccent] = useState<AccentId>("green");

  useEffect(() => {
    try {
      const a = loadAccent();
      setAccent(a);
    } catch {}
  }, []);

  function choose(id: AccentId) {
    setAccent(id);
    saveAccent(id);
    applyAccent(id);
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2"><CardTitle className="text-base">Accent Color</CardTitle></CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-wrap gap-2">
          {ORDER.map((id) => (
            <button
              key={id}
              onClick={() => choose(id)}
              className={`h-9 w-9 rounded-full ring-2 transition ${accent === id ? "ring-primary" : "ring-transparent"}`}
              aria-label={`Set accent ${id}`}
              style={{ background: ACCENT_PRESETS[id].primary }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
