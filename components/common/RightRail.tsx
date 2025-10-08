"use client";

import { ReactNode } from "react";

export function RightRail({ children }: { children: ReactNode }) {
  return <aside className="lg:col-span-3 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] overflow-auto space-y-3">{children}</aside>;
}
