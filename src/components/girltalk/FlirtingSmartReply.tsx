"use client";

import { AlertCircle, Heart } from "lucide-react";
import { flirtingReplyFallbacks, type SmartFlirtingTone } from "@/data/flirting";
import { ToneReplyPanel, type ToneFallback } from "./ToneReplyPanel";

const tones: readonly SmartFlirtingTone[] = ["Playful", "Sweet", "Casual", "Confident"];

const fallback: Record<string, ToneFallback> = Object.fromEntries(
  Object.entries(flirtingReplyFallbacks).map(([key, value]) => [key, value as ToneFallback]),
);

export function FlirtingSmartReply() {
  return (
    <ToneReplyPanel
      title="Reply without guessing their feelings"
      description="Paste a message and compare playful, sweet, casual and confident replies."
      placeholder="e.g. ‘That joke you told today was actually funny 😄’"
      aiContext="Flirting Coach: respectful, age-appropriate, non-explicit replies. Do not assume the other person is romantically interested."
      tones={tones}
      fallback={fallback}
      generateLabel="Generate flirting replies"
      defaultExplanation="Playful keeps it light, sweet shows warmth, casual stays relaxed, and confident is clear without pressure. None of them proves romantic interest."
      note={
        <div className="rounded-2xl border border-pink/30 bg-surface p-3 text-sm leading-relaxed" role="note">
          <p className="flex items-start gap-2 font-bold">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-pink" aria-hidden="true" />
            Do not assume the other person is romantically interested.
          </p>
          <p className="mt-1.5 flex gap-2 text-muted">
            <Heart className="mt-0.5 size-3.5 shrink-0 text-pink" aria-hidden="true" />
            A friendly message can simply be friendly. Read their comfort, match their energy and avoid pressure.
          </p>
        </div>
      }
    />
  );
}
