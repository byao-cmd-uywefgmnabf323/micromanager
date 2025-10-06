"use client";

import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, ListTodo, BarChart3 } from "lucide-react";

export function TopBar() {
  return (
    <div className="sticky top-0 z-40">
      <div className="w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto max-w-[1500px] px-3 py-2 flex items-center gap-3">
          {/* Quick Actions (compact) */}
          <div className="hidden md:flex items-center gap-1.5">
            <Button asChild size="sm" variant="ghost" className="h-8">
              <Link href="/today"><Calendar className="h-4 w-4" /><span className="hidden lg:inline">Track Today</span></Link>
            </Button>
            <Button asChild size="sm" variant="ghost" className="h-8">
              <Link href="/habits"><ListTodo className="h-4 w-4" /><span className="hidden lg:inline">Manage Habits</span></Link>
            </Button>
            <Button asChild size="sm" variant="ghost" className="h-8">
              <Link href="/analytics"><BarChart3 className="h-4 w-4" /><span className="hidden lg:inline">Analytics</span></Link>
            </Button>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-[680px]">
            <Input placeholder="Search habits, notes, entries…" className="rounded-full h-9" />
          </div>

          {/* Profile */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full overflow-hidden ring-2 ring-border">
              <Image src="/favicon.ico" alt="profile" width={32} height={32} />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="bg-purple-600/80 text-white text-sm py-0.5 text-center">
          Notifications: You’re on a 2-day streak for “Morning Walk”! 🎉
        </div>
      </div>
    </div>
  );
}
