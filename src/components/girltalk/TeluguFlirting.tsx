"use client";

import * as React from "react";
import { Languages, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { useAppContext } from "@/components/providers/AppProviders";
import { teluguExamples } from "@/data/flirting";
import type { AIRequestPayload } from "@/lib/types";
import { translateRoman, type TranslationResult } from "@/lib/translation/roman";
import { ChipButton } from "./ChipButton";
import { ErrorNote, LoadingNote, ResultCard } from "./Feedback";
import { SourceBadge } from "./SourceBadge";
import { useAIRequest } from "./useAIRequest";

interface LocalVersions {
  Friendly: string;
  Playful: string;
  Romantic: string;
}

function buildVersions(translation: TranslationResult): LocalVersions {
  const base = (translation.natural || translation.professional || "").trim();
  if (!base || translation.needsClarification) {
    return { Friendly: "", Playful: "", Romantic: "" };
  }
  const clean = base.replace(/[.!?]+$/, "");
  const isQuestion = /\?$/.test(base);
  return {
    Friendly: base,
    Playful: isQuestion
      ? `${clean} 😄 I'm curious what you'll say!`
      : `${clean} 😄 That made me smile.`,
    Romantic: isQuestion
      ? `I'd really like that — ${clean.charAt(0).toLowerCase()}${clean.slice(1)}?`
      : `${clean}. I really enjoy talking with you.`,
  };
}

export function TeluguFlirting() {
  const { online } = useAppContext();
  const [input, setInput] = React.useState("");
  const [translation, setTranslation] = React.useState<TranslationResult | null>(null);
  const [versions, setVersions] = React.useState<LocalVersions | null>(null);
  const [aiReply, setAiReply] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<"ai" | "offline" | undefined>(undefined);
  const [inputError, setInputError] = React.useState<string | null>(null);
  const lastPayload = React.useRef<AIRequestPayload | null>(null);
  const { loading, error, run } = useAIRequest();

  async function translate(payloadOverride?: AIRequestPayload) {
    if (!input.trim() && !payloadOverride?.userText) {
      setTranslation(null);
      setVersions(null);
      setAiReply(null);
      setSource(undefined);
      setInputError("Type or choose a Roman Telugu phrase first.");
      return;
    }
    const text = (payloadOverride?.userText ?? input).trim();
    setInputError(null);
    const local = translateRoman(text);
    setTranslation(local);
    setVersions(buildVersions(local));

    if (!online) {
      setAiReply(null);
      setSource("offline");
      return;
    }

    const request: AIRequestPayload =
      payloadOverride ?? {
        mode: "translate",
        userText: text,
        context:
          "Telugu-English flirting support: respectful, age-appropriate, non-explicit. Do not assume romantic interest.",
      };
    lastPayload.current = request;
    const response = await run(request);
    if (response) {
      setAiReply(response.reply);
      setSource(response.source);
    }
  }

  const versionEntries: Array<[keyof LocalVersions, string, string]> = [
    ["Friendly", versions?.Friendly ?? "", "Warm and easy to say in a normal chat."],
    ["Playful", versions?.Playful ?? "", "Light humour — only when the mood is already playful."],
    ["Romantic", versions?.Romantic ?? "", "Shows interest without pressure or explicit language."],
  ];

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-pink/30 bg-gradient-to-br from-pink-soft via-surface to-primary-soft">
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-pink text-white">
              <Languages className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <CardTitle>Roman Telugu → respectful English</CardTitle>
              <CardDescription>
                Type a phrase the way you would text it. You get an English translation, the Telugu meaning and three tone options.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="pink">Local translation always works</Badge>
          <Badge variant="outline">{online ? "AI check available" : "Offline — AI check skipped"}</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Try an example</CardTitle>
          <CardDescription>Tap a phrase to load it, then translate.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Roman Telugu examples">
            {teluguExamples.map((item) => (
              <ChipButton key={item.id} active={input === item.roman} onClick={() => { setInput(item.roman); setInputError(null); }} title={item.hint}>
                {item.roman}
              </ChipButton>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your phrase</CardTitle>
          <CardDescription>English, Telugu script or Roman Telugu all work.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="block space-y-2">
            <span className="text-sm font-bold">Roman Telugu text</span>
            <Textarea
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                if (inputError) setInputError(null);
              }}
              placeholder="e.g. netho coffee ki ravacha?"
              rows={3}
              maxLength={1000}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="pink" onClick={() => void translate()} disabled={loading}>
              <Sparkles className="size-4" aria-hidden="true" />
              {loading ? "Translating…" : "Translate & explain"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setInput("");
                setTranslation(null);
                setVersions(null);
                setAiReply(null);
                setSource(undefined);
                setInputError(null);
              }}
            >
              Clear
            </Button>
          </div>
          {inputError && <ErrorNote message={inputError} />}
          {loading && <LoadingNote label="Checking the wording and tone…" />}
          {error && (
            <ErrorNote
              message={error}
              onRetry={lastPayload.current ? () => void translate(lastPayload.current ?? undefined) : undefined}
            />
          )}
        </CardContent>
      </Card>

      {translation && (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="border-pink/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">English translation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="break-words text-sm font-semibold">{translation.natural || "Meaning unclear — see the note below."}</p>
                {translation.professional && translation.professional !== translation.natural && (
                  <p className="break-words text-xs text-muted">Politer version: {translation.professional}</p>
                )}
                <Badge variant="outline">Confidence: {translation.confidence}</Badge>
              </CardContent>
            </Card>
            <Card className="border-pink/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Telugu meaning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="break-words text-lg font-semibold text-pink">{translation.telugu || "—"}</p>
                <p className="break-words text-xs leading-relaxed text-muted">{translation.meaning}</p>
              </CardContent>
            </Card>
          </div>

          {translation.needsClarification && (
            <div className="rounded-2xl border border-pink/30 bg-pink-soft/60 p-4 text-sm leading-relaxed" role="note">
              <p className="font-bold">Could you check that phrase?</p>
              <p className="mt-1 text-muted">{translation.needsClarification}</p>
              <p className="mt-1 text-muted">{translation.explanation}</p>
            </div>
          )}

          {versions && versionEntries.every(([, value]) => Boolean(value)) && (
            <div className="grid gap-3 sm:grid-cols-3">
              {versionEntries.map(([tone, value, why]) => (
                <ResultCard
                  key={tone}
                  title={`${tone} version`}
                  eyebrow={why}
                  text={value}
                  source="offline"
                  className="[&_button]:min-h-11"
                />
              ))}
            </div>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">How the local translator read it</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="break-words text-sm leading-relaxed">{translation.explanation}</p>
              {translation.exampleResponse && (
                <p className="break-words rounded-xl bg-surface-muted p-3 text-sm">
                  <span className="font-bold">You could reply:</span> {translation.exampleResponse}
                </p>
              )}
            </CardContent>
          </Card>

          {aiReply && !loading && (
            <ResultCard title="AI translation check" text={aiReply} source={source} eyebrow="Optional online insight" />
          )}
          {!online && source === "offline" && (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-surface p-3 text-sm text-muted">
              <SourceBadge source="offline" />
              <span>Online AI check is skipped while you are offline or have AI disabled.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
