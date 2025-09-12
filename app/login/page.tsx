"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.56 31.91 29.272 35 24 35c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.676 5.053 29.594 3 24 3 12.954 3 4 11.954 4 23s8.954 20 20 20 20-8.954 20-20c0-1.342-.138-2.651-.389-3.917z"/>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.367 16.943 18.79 15 24 15c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.676 5.053 29.594 3 24 3c-7.798 0-14.426 4.455-17.694 11.691z"/>
      <path fill="#4CAF50" d="M24 43c5.186 0 9.86-1.987 13.394-5.221l-6.183-5.236C29.219 34.488 26.77 35.5 24 35c-5.252 0-9.525-3.557-11.109-8.333l-6.556 5.05C9.57 38.441 16.213 43 24 43z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.041 3.108-3.254 5.556-6.089 6.96l.001.001 6.183 5.236C33.021 41.241 38 37 38 31c0-1.342-.138-2.651-.389-3.917z"/>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Logged in successfully");
      router.replace("/dashboard");
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : "Login failed";
      const message = /invalid login credentials/i.test(raw) ? "Invalid email or password." : raw;
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      // Redirect handled by Supabase
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed";
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
  }

  async function onForgotPassword() {
    setError(null);
    if (!email) {
      setError("Enter your email first to reset password.");
      return;
    }
    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      toast.success("Reset link sent. Check your email.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send reset email";
      setError(msg);
      toast.error(msg);
    }
  }

  return (
    <AuthCard
      heading="Welcome back!"
      subheading="Log in to continue"
      footer={
        <div>
          Don’t have an account? <a className="text-indigo-600 hover:underline" href="/signup">Sign up</a>
        </div>
      }
    >
      <div className="space-y-4">
        <Button type="button" variant="outline" className="w-full h-11 rounded-xl justify-between text-black" onClick={onGoogle} disabled={loading}>
          <span className="flex items-center gap-2">
            <GoogleIcon />
            Continue with Google
          </span>
          <span className="text-xs rounded-full border px-2 py-0.5">G</span>
        </Button>

        <div className="relative">
          <Separator className="my-4" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white px-2 text-xs text-muted-foreground">OR</span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input id="email" type="email" placeholder="Enter your work email" className="h-11 rounded-xl pl-10 text-black placeholder-gray-500" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <button type="button" onClick={onForgotPassword} className="text-sm text-indigo-600 hover:underline">Forgot Password?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input id="password" type="password" placeholder="Enter password" className="h-11 rounded-xl pl-10 text-black placeholder-gray-500" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <Button type="submit" className="h-11 w-full rounded-xl bg-indigo-100 hover:bg-indigo-200 text-black font-semibold" disabled={loading}>
            {loading ? "Signing in…" : "Log In"}
          </Button>
          <div className="text-center text-sm">
            or <a href="#" className="text-indigo-600 hover:underline">login with SSO</a>
          </div>
          <div aria-live="polite" className="text-sm text-red-600 min-h-5">{error}</div>
        </form>
      </div>
    </AuthCard>
  );
}
