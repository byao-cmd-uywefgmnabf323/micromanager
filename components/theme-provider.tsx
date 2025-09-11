"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { applyAccent, loadAccent } from "@/lib/theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // apply saved accent once on mount
    try { applyAccent(loadAccent()); } catch {}
  }, []);
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
