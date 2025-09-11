"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function TopBar() {
  return (
    <div className="sticky top-0 z-40">
      <div className="w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto max-w-[1400px] px-4 py-3 flex items-center justify-center relative">
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="h-8 w-8 rounded-full overflow-hidden ring-2 ring-border">
              <Image src="/favicon.ico" alt="profile" width={32} height={32} />
            </div>
          </div>
          <div className="w-full sm:w-[520px] lg:w-[640px]">
            <Input placeholder="Search habits, notes, entries…" className="rounded-full" />
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="bg-purple-600/80 text-white text-sm py-1 text-center">
          Notifications: You’re on a 2-day streak for “Morning Walk”! 🎉
        </div>
      </div>
    </div>
  );
}
