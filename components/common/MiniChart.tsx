"use client";

import { LineChart as LChart, BarChart as BChart } from "@/components/Charts";

export function MiniChart<T extends Record<string, unknown>>({ type = "line", data, x, y, color = "#22c55e" }: { type?: "line" | "bar"; data: T[]; x: keyof T & string; y: keyof T & string; color?: string }) {
  return (
    <div className="h-24">
      {type === "line" ? (
        <LChart data={data} dataKeyX={x} dataKeyY={y} color={color} />
      ) : (
        <BChart data={data} dataKeyX={x} dataKeyY={y} color={color} />
      )}
    </div>
  );
}
