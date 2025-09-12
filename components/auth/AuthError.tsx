"use client";

export function AuthError({ message }: { message: string | null }) {
  if (!message) return <div aria-live="polite" className="min-h-5" />;
  return (
    <div aria-live="polite" className="text-sm text-red-600">
      {message}
    </div>
  );
}
