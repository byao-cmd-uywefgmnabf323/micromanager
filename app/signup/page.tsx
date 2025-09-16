"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { AuthError } from "@/components/auth/AuthError";
import { normalizeEmail, normalizePassword } from "@/lib/authUtils";
import { DevEnvBanner } from "@/components/auth/DevEnvBanner";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    const emailN = normalizeEmail(email);
    const passwordN = normalizePassword(password);
    const confirmN = normalizePassword(confirm);
    if (passwordN !== confirmN) {
      setError("Passwords do not match.");
      return;
    }
    if (passwordN.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      // Assumption: Confirm email is OFF in Supabase Dashboard.
      const { error: signUpError } = await supabase.auth.signUp({ email: emailN, password: passwordN });
      if (signUpError) throw signUpError;

      const { error: signInError } = await supabase.auth.signInWithPassword({ email: emailN, password: passwordN });
      if (signInError) throw signInError;

      toast.success("Account created — you're in!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Signup failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <DevEnvBanner />
    <AuthCard
      heading="Create your account"
      subheading="Start building habits with Micromanager"
      footer={
        <div>
          Already have an account? <a className="text-indigo-600 hover:underline" href="/login">Log in</a>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">Work Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input id="email" type="email" placeholder="Enter your work email" className="h-11 rounded-xl pl-10 text-black placeholder-gray-500" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={(e) => setEmail(normalizeEmail(e.target.value))} />
          </div>
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input id="password" type="password" placeholder="Enter password" className="h-11 rounded-xl pl-10 text-black placeholder-gray-500" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={(e) => setPassword(normalizePassword(e.target.value))} />
          </div>
        </div>
        <div className="space-y-1">
          <label htmlFor="confirm" className="text-sm font-medium">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input id="confirm" type="password" placeholder="Confirm password" className="h-11 rounded-xl pl-10 text-black placeholder-gray-500" value={confirm} onChange={(e) => setConfirm(e.target.value)} onBlur={(e) => setConfirm(normalizePassword(e.target.value))} />
          </div>
        </div>
        <Button type="submit" className="h-11 w-full rounded-xl bg-indigo-100 hover:bg-indigo-200 text-black font-semibold" disabled={loading}>
          {loading ? "Creating account…" : "Sign Up"}
        </Button>
        <AuthError message={error} />
      </form>
    </AuthCard>
    </>
  );
}
