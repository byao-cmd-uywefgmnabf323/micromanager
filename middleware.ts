import { NextResponse, NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Protect routes under /(protected) and redirect authed users away from /login and /signup
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = new URL(req.url);
  const isProtected = url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/(protected)");
  const isAuthPage = url.pathname === "/login" || url.pathname === "/signup";

  if (isProtected && !user) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirect", url.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/login", "/signup", "/dashboard", "/(protected)/(.*)"],
};
