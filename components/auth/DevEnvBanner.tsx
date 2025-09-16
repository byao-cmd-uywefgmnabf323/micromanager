"use client";

export function DevEnvBanner() {
  if (process.env.NODE_ENV === "production") return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !anon) return null;
  const urlShort = url.slice(0, 24);
  const anonTail = anon.slice(-6);
  return (
    <div className="mb-3 rounded-md border bg-yellow-50 text-yellow-900 text-xs px-3 py-2">
      Env check: URL={urlShort}… | ANON=…{anonTail}
    </div>
  );
}
