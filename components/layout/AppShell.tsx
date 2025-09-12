"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { ProgressWidget } from "@/components/ProgressWidget";
import { AchievementsWatcher } from "@/components/AchievementsWatcher";
import { RecapModal } from "@/components/RecapModal";

function isAuthRoute(pathname: string) {
  return pathname === "/login" || pathname === "/signup" || pathname === "/reset-password";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";

  if (isAuthRoute(pathname)) {
    // Minimal shell for auth pages – no sidebar or topbar
    return (
      <div className="min-h-dvh">
        <main className="min-h-dvh">{children}</main>
      </div>
    );
  }

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
