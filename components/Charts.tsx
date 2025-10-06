"use client";

import { ResponsiveContainer, LineChart as RLineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart as RBarChart, Bar } from "recharts";

export function LineChart<T extends Record<string, unknown>>({ data, dataKeyX, dataKeyY, color = "#22c55e" }: { data: T[]; dataKeyX: keyof T & string; dataKeyY: keyof T & string; color?: string }) {
  if (!data?.length) return <div className="text-sm text-muted-foreground">No data</div>;
  return (
    <div className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <RLineChart data={data as unknown as object[]} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey={dataKeyX as string} tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip />
          <Line type="monotone" dataKey={dataKeyY as string} stroke={color} strokeWidth={2} dot={false} />
        </RLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarChart<T extends Record<string, unknown>>({ data, dataKeyX, dataKeyY, color = "#6366f1" }: { data: T[]; dataKeyX: keyof T & string; dataKeyY: keyof T & string; color?: string }) {
  if (!data?.length) return <div className="text-sm text-muted-foreground">No data</div>;
  return (
    <div className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <RBarChart data={data as unknown as object[]} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey={dataKeyX as string} tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip />
          <Bar dataKey={dataKeyY as string} fill={color} radius={6} />
        </RBarChart>
      </ResponsiveContainer>
    </div>
  );
}
