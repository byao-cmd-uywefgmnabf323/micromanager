"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function AuthCard({
  children,
  className,
  footer,
  heading,
  subheading,
}: {
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  heading: string;
  subheading?: string;
}) {
  return (
    <div className="relative flex min-h-[calc(100dvh-0px)] items-center justify-center px-4">
      {/* Background swoosh + dotted pattern */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-fuchsia-500 to-indigo-600 opacity-30 blur-3xl" />
        <svg className="absolute -bottom-6 -right-6 h-64 w-64 opacity-25" viewBox="0 0 200 200">
          <defs>
            <pattern id="dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" className="text-indigo-400" />
        </svg>
      </div>

      <div className="mx-auto w-full max-w-md">
        <div className="mb-8">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Micromanager</div>
          <div className="text-sm text-muted-foreground">The everything app for habits.</div>
        </div>

        <Card className={cn("rounded-2xl shadow-xl border border-black/5 bg-white", className)}>
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{heading}</h1>
            {subheading ? (
              <p className="text-sm text-muted-foreground mb-6">{subheading}</p>
            ) : (
              <div className="h-4" />
            )}
            {children}
          </CardContent>
        </Card>

        {footer ? <div className="mt-4 text-center text-sm text-muted-foreground">{footer}</div> : null}

        <div className="mt-6 text-center text-[11px] text-muted-foreground">
          This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
        </div>
      </div>
    </div>
  );
}
