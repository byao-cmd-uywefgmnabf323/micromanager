"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

export function StatCard({ icon, value, label }: { icon?: ReactNode; value: ReactNode; label: string }) {
  return (
    <Card className="rounded-xl">
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          {icon && <div className="text-muted-foreground">{icon}</div>}
          <div className="text-2xl font-semibold leading-tight">{value}</div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </CardContent>
    </Card>
  );
}
