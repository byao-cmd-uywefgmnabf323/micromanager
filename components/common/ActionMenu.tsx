"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ActionMenu({ children, ariaLabel = "Actions" }: { children: React.ReactNode; ariaLabel?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <Button size="icon" variant="ghost" className="h-8 w-8" aria-label={ariaLabel} onClick={() => setOpen((v) => !v)}>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] z-20 rounded-md border bg-background shadow-sm min-w-36" role="menu">
          {children}
        </div>
      )}
    </div>
  );
}

export function ActionItem({ onClick, children, destructive = false }: { onClick?: () => void; children: React.ReactNode; destructive?: boolean }) {
  return (
    <button role="menuitem" className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-accent ${destructive ? "text-destructive" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}
