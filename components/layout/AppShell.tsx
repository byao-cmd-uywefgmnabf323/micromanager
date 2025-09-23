"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { ProgressWidget } from "@/components/ProgressWidget";
import { AchievementsWatcher } from "@/components/AchievementsWatcher";
import { RecapModal } from "@/components/RecapModal";

export function AppShell({ children }: { children: React.ReactNode }) {

  return (
    <>
      <div className="flex min-h-dvh w-full">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <TopBar />
          <main className="mx-auto w-full max-w-[1400px] px-4 py-6">{children}</main>
        </div>
      </div>
      <AchievementsWatcher />
      <RecapModal />
      <ProgressWidget />
    </>
  );
}
