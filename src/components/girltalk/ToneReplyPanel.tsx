"use client";

import * as React from "react";
import { Send, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { CopyButton } from "@/components/shared/CopyButton";
import type { AIRequestPayload } from "@/lib/types";
import { ChipButton } from "./ChipButton";
import { ErrorNote, LoadingNote, ResultCard } from "./Feedback";
import { SourceBadge } from "./SourceBadge";
import { useAIRequest } from "./useAIRequest";
import { parseToneReplies } from "./utils";

export interface ToneFallback {
  text: string;
  why: string;
}

interface ToneReplyPanelProps {
  title: string;
  description: string;
  placeholder: string;
  aiContext: string;
  tones: readonly string[];
  fallback: Record<string, ToneFallback>;
  note?: ReactNode;
  generateLabel?: string;
  defaultExplanation?: string;
}

interface DisplayState {
  replies: Record<string, string>;
  explanation: string;
  source?: "ai" | "offline";
  raw?: string;
  parsed: boolean;
}

export function ToneReplyPanel({
  title,
  description,
  placeholder,
  aiContext,
  tones,
  fallback,
  note,
  generateLabel = "Generate replies",
  defaultExplanation = "Friendly replies invite sharing, caring replies notice feelings, casual replies keep things light, and confident replies show interest without pressure.",
}: ToneReplyPanelProps) {
  const [message, setMessage] = React.useState("");
  const [focusTone, setFocusTone] = React.useState<string>(tones[0] ?? "");
  const [display, setDisplay] = React.useState<DisplayState | null>(null);
  const lastPayload = React.useRef<AIRequestPayload | null>(null);
  const { loading, error, run } = useAIRequest();

  async function generate(payload?: AIRequestPayload) {
    const request: AIRequestPayload =
      payload ??
      {
        mode: "reply",
        userText: message.trim(),
        context: aiContext,
        tone: focusTone,
      };
    lastPayload.current = request;
    const response = await run(request);
    if (!response) return;

    const parsed = parseToneReplies(response.reply, tones);
    const baseReplies: Record<string, string> = {};
    tones.forEach((tone) => {
      baseReplies[tone] = fallback[tone]?.text ?? "";
    });
    const replies = { ...baseReplies, ...(parsed?.replies ?? {}) };
    setDisplay({
      replies,
      explanation: parsed?.explanation || defaultExplanation,
      source: response.source,
      raw: parsed ? undefined : response.reply,
      parsed: Boolean(parsed),
    });
  }

  return (
    <div className="space-y-4">
      <Card className="border-pink/30 bg-gradient-to-br from-pink-soft via-surface to-primary-soft">
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-pink text-white">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        {note && <CardContent className="text-sm leading-relaxed">{note}</CardContent>}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paste a message</CardTitle>
          <CardDescription>You can use English, Roman Telugu, or a mix of both.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-bold">Their message</span>
            <Textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={placeholder}
              maxLength={1200}
              rows={4}
            />
          </label>

          <div className="space-y-2">
            <p className="text-sm font-bold">Choose a tone to focus on</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Reply tone">
              {tones.map((tone) => (
                <ChipButton key={tone} active={focusTone === tone} onClick={() => setFocusTone(tone)}>
                  {tone}
                </ChipButton>
              ))}
            </div>
          </div>

          <Button
            type="button"
            variant="pink"
            onClick={() => void generate()}
            disabled={!message.trim() || loading}
            className="w-full sm:w-auto"
          >
            <Send className="size-4" aria-hidden="true" />
            {loading ? "Generating…" : generateLabel}
          </Button>

          {loading && <LoadingNote />}
          {error && (
            <ErrorNote
              message={error}
              onRetry={lastPayload.current ? () => void generate(lastPayload.current ?? undefined) : undefined}
            />
          )}
        </CardContent>
      </Card>

      {display && !loading && (
        <div className="space-y-3">
          <Card className="border-pink/20">
            <CardHeader className="flex-row flex-wrap items-center justify-between gap-2 pb-2">
              <CardTitle className="text-base">Tone guide</CardTitle>
              <SourceBadge source={display.source} />
            </CardHeader>
            <CardContent>
              <p className="break-words text-sm leading-relaxed text-muted">{display.explanation}</p>
            </CardContent>
          </Card>

          {tones.map((tone) => (
            <ResultCard
              key={tone}
              title={`${tone} reply`}
              eyebrow={fallback[tone]?.why}
              text={display.replies[tone] || fallback[tone]?.text || ""}
              source={display.source}
              className={focusTone === tone ? "ring-2 ring-pink/60" : undefined}
            />
          ))}

          {display.raw && (
            <ResultCard title="Full coach response" text={display.raw} source={display.source} eyebrow="Extra guidance" />
          )}

          <Card>
            <CardContent className="flex flex-wrap items-center gap-3 pt-5 [&_button]:min-h-11">
              <p className="min-w-0 flex-1 break-words text-sm font-semibold">
                Selected tone: <span className="text-pink">{focusTone}</span>
              </p>
              <CopyButton text={display.replies[focusTone] ?? ""} label={`Copy ${focusTone} reply`} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
