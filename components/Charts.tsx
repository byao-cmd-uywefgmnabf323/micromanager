"use client";

import { ResponsiveContainer, LineChart as RLineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart as RBarChart, Bar } from "recharts";

export function LineChart({ data, dataKeyX, dataKeyY, color = "#22c55e" }: { data: any[]; dataKeyX: string; dataKeyY: string; color?: string }) {
  if (!data?.length) return <div className="text-sm text-muted-foreground">No data</div>;
  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <RLineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey={dataKeyX} tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip />
          <Line type="monotone" dataKey={dataKeyY} stroke={color} strokeWidth={2} dot={false} />
        </RLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarChart({ data, dataKeyX, dataKeyY, color = "#6366f1" }: { data: any[]; dataKeyX: string; dataKeyY: string; color?: string }) {
  if (!data?.length) return <div className="text-sm text-muted-foreground">No data</div>;
  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <RBarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey={dataKeyX} tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip />
          <Bar dataKey={dataKeyY} fill={color} radius={6} />
        </RBarChart>
      </ResponsiveContainer>
    </div>
  );
}
