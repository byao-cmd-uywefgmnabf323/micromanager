"use client";

export type AccentId = "green" | "purple" | "blue" | "rose" | "orange" | "teal";

export const ACCENT_PRESETS: Record<AccentId, { primary: string }> = {
  green: { primary: "oklch(0.646 0.222 41.116)" },
  purple: { primary: "oklch(0.488 0.243 264.376)" },
  blue: { primary: "oklch(0.398 0.07 227.392)" },
  rose: { primary: "oklch(0.645 0.246 16.439)" },
  orange: { primary: "oklch(0.769 0.188 70.08)" },
  teal: { primary: "oklch(0.6 0.118 184.704)" },
};

const STORAGE_KEY = "mm_accent";

export function loadAccent(): AccentId {
  try {
    const v = localStorage.getItem(STORAGE_KEY) as AccentId | null;
    if (v && ACCENT_PRESETS[v]) return v;
  } catch {}
  return "green";
}

export function saveAccent(id: AccentId) {
  try { localStorage.setItem(STORAGE_KEY, id); } catch {}
}

export function applyAccent(id: AccentId) {
  const preset = ACCENT_PRESETS[id] || ACCENT_PRESETS.green;
  const root = document.documentElement;
  root.style.setProperty("--primary", preset.primary);
}
