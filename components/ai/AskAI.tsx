"use client";

import { useState, useMemo } from "react";
import { useHabits } from "@/store/useHabits";
import { buildAIContext } from "@/components/ai/context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

function saveFeedback(kind: "up" | "down", message: string, response: string) {
  try {
    const raw = localStorage.getItem("mm_ai_feedback") || "[]";
    const arr = JSON.parse(raw) as Array<{ t: string; kind: string; msg: string; resp: string }>;
    arr.push({ t: new Date().toISOString(), kind, msg: message, resp: response });
    localStorage.setItem("mm_ai_feedback", JSON.stringify(arr).slice(0, 50000));
  } catch {}
}

export function AskAIButton({ preset }: { preset?: string }) {
  const habits = useHabits((s) => s.habits);
  const entries = useHabits((s) => s.entries);
  const ctx = useMemo(() => buildAIContext(habits, entries), [habits, entries]);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(preset || "Give me a personalized analysis of my recent consistency and concrete recommendations for the next 7 days.");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  async function ask() {
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, context: ctx }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Request failed");
      setResponse(json.content || "");
    } catch (e: any) {
      toast.error(e?.message || "AI request failed");
    } finally {
      setLoading(false);
    }
  }

  function useSuggestion(s: string) {
    setMessage(s);
  }

  const suggestions = [
    "Explain my 7/30/90-day completion trends and why they changed.",
    "Which 2 habits should I prioritize today and why?",
    "Suggest adjustments to reach 80%+ completion next week.",
  ];

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="secondary">Ask AI</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Ask AI about your habits</DialogTitle>
            <DialogDescription>AI sees a compact, anonymized snapshot of your habits and entries to tailor responses.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Ask for a report, recommendations, planning help..." />
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <Button key={i} size="sm" variant="outline" onClick={() => useSuggestion(s)}>{s}</Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={ask} disabled={loading}>{loading ? "Thinking…" : "Generate"}</Button>
              {response && (
                <>
                  <Button variant="outline" onClick={() => { navigator.clipboard.writeText(response); toast.success("Copied"); }}>Copy</Button>
                  <Button variant="ghost" onClick={() => { saveFeedback("up", message, response); toast.success("Thanks for the feedback!"); }}>👍</Button>
                  <Button variant="ghost" onClick={() => { saveFeedback("down", message, response); toast.success("Thanks for the feedback!"); }}>👎</Button>
                </>
              )}
            </div>
            {response && (
              <div className="rounded-xl border p-3 whitespace-pre-wrap text-sm leading-6">{response}</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
