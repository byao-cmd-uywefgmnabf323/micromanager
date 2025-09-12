"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Ensure session is picked up from the recovery URL hash
    // The supabase client was created with detectSessionInUrl: true
    // Give a tick so it can hydrate
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!password || !confirm) return setError("Please enter and confirm your new password.");
    if (password !== confirm) return setError("Passwords do not match.");
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated. You're now signed in.");
      router.replace("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update password";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard heading="Reset your password" subheading="Enter a new password for your account">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input id="password" type="password" placeholder="Enter new password" className="h-11 rounded-xl pl-10 text-black placeholder-gray-500" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        <div className="space-y-1">
          <label htmlFor="confirm" className="text-sm font-medium">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input id="confirm" type="password" placeholder="Confirm new password" className="h-11 rounded-xl pl-10 text-black placeholder-gray-500" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
        </div>
        <Button type="submit" className="h-11 w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold" disabled={loading || !ready}>
          {loading ? "Updating…" : "Update Password"}
        </Button>
        <div aria-live="polite" className="text-sm text-red-600 min-h-5">{error}</div>
      </form>
    </AuthCard>
  );
}
