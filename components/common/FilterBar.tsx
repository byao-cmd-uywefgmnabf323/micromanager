"use client";

import { Input } from "@/components/ui/input";
import { ReactNode } from "react";

export function FilterBar({ search, onSearch, children }: { search: string; onSearch: (v: string) => void; children?: ReactNode }) {
  return (
    <div className="rounded-xl border">
      <div className="p-3 flex items-center gap-2">
        <Input className="h-9 text-sm" placeholder="Search..." value={search} onChange={(e) => onSearch(e.target.value)} />
        {search && (
          <button className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border hover:bg-accent" onClick={() => onSearch("")}>Clear</button>
        )}
        <div className="ml-auto flex items-center gap-2">{children}</div>
      </div>
    </div>
  );
}
