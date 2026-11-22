"use client";

import * as React from "react";
import { Brain, HelpCircle, Lightbulb, MessageCircleHeart, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { CopyButton } from "@/components/shared/CopyButton";
import { analyzeEmotion, type EmotionInsight } from "@/lib/emotion/analyze";
import type { AIRequestPayload } from "@/lib/types";
import { ErrorNote, LoadingNote, ResultCard } from "./Feedback";
import { useAIRequest } from "./useAIRequest";

const SAMPLE = "I don't know… everyone seemed to have fun without me today 😢";

export function EmotionPanel() {
  const [text, setText] = React.useState("");
  const [insight, setInsight] = React.useState<EmotionInsight | null>(null);
  const [inputError, setInputError] = React.useState<string | null>(null);
  const { loading, error, result, run } = useAIRequest();
  const lastPayload = React.useRef<AIRequestPayload | null>(null);

  function analyzeLocal() {
    if (!text.trim()) {
      setInputError("Paste a message first so there is something to understand.");
      setInsight(null);
      return;
    }
    setInputError(null);
    setInsight(analyzeEmotion(text.trim()));
  }

  async function deepen(payload?: AIRequestPayload) {
    if (!text.trim()) {
      setInputError("Paste a message first so there is something to understand.");
      return;
    }
    const request: AIRequestPayload =
      payload ?? {
        mode: "emotion",
        userText: text.trim(),
        context: "GirlTalk: respectful social conversation. Use tentative language and never claim certainty.",
      };
    lastPayload.current = request;
    await run(request);
  }

  const alternatives = insight?.cues.length
    ? insight.cues.map(
        (cue) =>
          `This could suggest ${cue.name.toLowerCase()} — ${cue.interpretation} The wording may point that way, but it is only one possibility.`,
      )
    : [
        "This could suggest a neutral, rushed or mixed mood. A short message may be feeling perfectly fine — context matters more than punctuation.",
      ];

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-pink/30 bg-gradient-to-br from-pink-soft via-surface to-primary-soft">
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-pink text-white">
              <MessageCircleHeart className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <CardTitle>Read the message gently</CardTitle>
              <CardDescription>
                Notice possible cues, then ask. She may be feeling something different from any guess here — context matters.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="rounded-xl border border-pink/30 bg-surface/80 p-3 text-sm leading-relaxed text-muted" role="note">
            She <span className="font-bold text-foreground">may be feeling</span> something different from any guess here.
            The wording <span className="font-bold text-foreground">could suggest</span> a mood, but{" "}
            <span className="font-bold text-foreground">context matters</span> more than punctuation.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paste the message</CardTitle>
          <CardDescription>Local insight runs on your device. AI insight is optional and clearly labelled.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-bold">Message you received</span>
            <Textarea
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                if (inputError) setInputError(null);
              }}
              placeholder="e.g. ‘I guess I'll just stay home tonight.’"
              maxLength={1200}
              rows={4}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="pink" onClick={analyzeLocal}>
              <Brain className="size-4" aria-hidden="true" />
              Understand message
            </Button>
            <Button type="button" variant="outline" onClick={() => { setText(SAMPLE); setInputError(null); setInsight(null); }}>
              Try an example
            </Button>
          </div>
          {inputError && <ErrorNote message={inputError} />}
        </CardContent>
      </Card>

      {insight && (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="border-pink/30">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lightbulb className="size-4 text-pink" aria-hidden="true" /> Possible meaning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="break-words text-sm leading-relaxed">{insight.summary}</p>
              </CardContent>
            </Card>

            <Card className="border-pink/30">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="size-4 text-pink" aria-hidden="true" /> Possible emotional tone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {insight.cues.length ? (
                  insight.cues.map((cue) => (
                    <div key={cue.name} className="rounded-xl bg-surface-muted p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="pink">{cue.name}</Badge>
                        <span className="text-[0.7rem] text-muted">may be feeling · evidence: {cue.evidence.join(", ")}</span>
                      </div>
                      <p className="mt-1.5 break-words text-xs leading-relaxed text-muted">{cue.interpretation}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted">No clear emotional cue in the words alone. Could suggest a neutral or mixed tone — context matters.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <HelpCircle className="size-4 text-pink" aria-hidden="true" /> Alternative interpretations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {alternatives.map((item) => (
                  <li key={item} className="flex gap-2 break-words rounded-xl bg-surface-muted p-3 text-sm leading-relaxed">
                    <span aria-hidden="true">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-pink/40 bg-pink-soft/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">An empathetic reply you could send</CardTitle>
              <CardDescription>Copy one, then make it sound like you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 [&_button]:min-h-11">
              {insight.suggestedReplies.map((reply) => (
                <div key={reply} className="flex items-start gap-2 rounded-xl border border-border bg-surface p-3">
                  <p className="min-w-0 flex-1 break-words text-sm leading-relaxed">“{reply}”</p>
                  <CopyButton text={reply} label="Copy reply" />
                </div>
              ))}
              <div className="flex items-start gap-2 rounded-xl border border-border bg-surface p-3">
                <p className="min-w-0 flex-1 break-words text-sm leading-relaxed">
                  <span className="font-bold">Clarifying question:</span> {insight.clarifyingQuestion}
                </p>
                <CopyButton text={insight.clarifyingQuestion} label="Copy question" />
              </div>
            </CardContent>
          </Card>

          <div className="rounded-2xl border border-pink/30 bg-surface p-4 text-sm leading-relaxed text-muted" role="note">
            <span className="font-bold text-foreground">Gentle reminder:</span> {insight.caution} She may be feeling something else entirely;
            these cues could suggest a mood, but context matters.
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Optional: deeper AI insight</CardTitle>
          <CardDescription>Only sent when you choose it. Offline results are labelled clearly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            type="button"
            variant="pink"
            onClick={() => void deepen()}
            disabled={!text.trim() || loading}
          >
            <Sparkles className="size-4" aria-hidden="true" />
            {loading ? "Looking deeper…" : "Get deeper insight"}
          </Button>
          {loading && <LoadingNote label="Reading the wording carefully…" />}
          {error && (
            <ErrorNote
              message={error}
              onRetry={lastPayload.current ? () => void deepen(lastPayload.current ?? undefined) : undefined}
            />
          )}
          {result && !loading && (
            <ResultCard title="Deeper insight" text={result.reply} source={result.source} eyebrow="Possibilities, not certainties" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
