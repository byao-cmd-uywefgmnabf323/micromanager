"use client";

import { ReactNode } from "react";

export function CompactToolbar({ title, actions }: { title?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-2 py-2">
      <div className="text-sm font-medium truncate">{title}</div>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  );
}
