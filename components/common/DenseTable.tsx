"use client";

import { ReactNode } from "react";

export function DenseTable({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border overflow-hidden">
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

export function DenseRow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`px-3 py-2.5 grid grid-cols-[20px_1fr_auto_auto_auto_auto] items-center gap-3 hover:bg-white/5 hover:border-white/10 transition ${className}`}>{children}</div>
  );
}

export function DenseCell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
