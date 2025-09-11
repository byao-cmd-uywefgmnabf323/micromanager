import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { RegisterSW } from "@/components/RegisterSW";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { ProgressWidget } from "@/components/ProgressWidget";
import { AchievementsWatcher } from "@/components/AchievementsWatcher";
import { RecapModal } from "@/components/RecapModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MicroManager",
  description: "A simple, no-sign-in habit builder with streaks and analytics",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh bg-background text-foreground`}>
        {/* Theme Provider wraps the entire app */}
        {/* Imports at top of file */}
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

// AppShell separated to keep imports at top and body clean
function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <RegisterSW />
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
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
