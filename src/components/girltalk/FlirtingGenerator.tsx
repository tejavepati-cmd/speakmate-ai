"use client";

import * as React from "react";
import { Heart, Sparkles, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { CopyButton } from "@/components/shared/CopyButton";
import {
  flirtingCategories,
  flirtingMessages,
  flirtingTones,
  type FlirtingCategory,
  type FlirtingTone,
} from "@/data/flirting";
import type { AIRequestPayload } from "@/lib/types";
import { ChipButton } from "./ChipButton";
import { ErrorNote, LoadingNote, ResultCard } from "./Feedback";
import { useAIRequest } from "./useAIRequest";

const AI_CONTEXT =
  "Flirting Coach: respectful, age-appropriate, non-explicit messages. Never manipulate, pressure or assume romantic interest.";

export function FlirtingGenerator() {
  const [category, setCategory] = React.useState<FlirtingCategory | "All">("All");
  const [tone, setTone] = React.useState<FlirtingTone | "Any">("Any");
  const [details, setDetails] = React.useState("");
  const lastPayload = React.useRef<AIRequestPayload | null>(null);
  const { loading, error, result, run } = useAIRequest();

  const visible = React.useMemo(
    () =>
      flirtingMessages.filter(
        (item) => (category === "All" || item.category === category) && (tone === "Any" || item.tone === tone),
      ),
    [category, tone],
  );

  async function personalise(payloadOverride?: AIRequestPayload) {
    const basis =
      details.trim() ||
      visible[0]?.text ||
      flirtingMessages[0]?.text ||
      "I enjoy talking with you.";
    const request: AIRequestPayload =
      payloadOverride ?? {
        mode: "reply",
        userText: basis,
        context: AI_CONTEXT,
        tone: tone === "Any" ? undefined : tone,
      };
    lastPayload.current = request;
    await run(request);
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-pink/30 bg-gradient-to-br from-pink-soft via-surface to-primary-soft">
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-pink text-white">
              <Heart className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <CardTitle>Choose a style, then make it yours</CardTitle>
              <CardDescription>
                Start with a kind example below. Add a detail about your situation for a personalised version — always respectful and non-explicit.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Browse examples</CardTitle>
          <CardDescription>{visible.length} {visible.length === 1 ? "example" : "examples"} for this combination.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-bold">Message style</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Flirting message style">
              <ChipButton active={category === "All"} onClick={() => setCategory("All")}>All</ChipButton>
              {flirtingCategories.map((item) => (
                <ChipButton key={item} active={category === item} onClick={() => setCategory(item)}>
                  {item}
                </ChipButton>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-bold">Tone</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Flirting tone">
              <ChipButton active={tone === "Any"} onClick={() => setTone("Any")}>Any tone</ChipButton>
              {flirtingTones.map((item) => (
                <ChipButton key={item} active={tone === item} onClick={() => setTone(item)}>
                  {item}
                </ChipButton>
              ))}
            </div>
          </div>

          {visible.length ? (
            <ul className="space-y-3">
              {visible.map((item) => (
                <li key={item.id} className="rounded-2xl border border-border p-4 transition-colors hover:border-pink/40">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="pink">{item.category}</Badge>
                    <Badge variant="outline">{item.tone}</Badge>
                  </div>
                  <p className="mt-2 break-words text-sm font-semibold leading-relaxed">“{item.text}”</p>
                  <p className="mt-1.5 break-words text-xs leading-relaxed text-muted">{item.note}</p>
                  <div className="mt-2 flex flex-wrap justify-end gap-1 [&_button]:min-h-11">
                    <CopyButton text={item.text} label="Copy" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="min-h-11"
                      onClick={() => setDetails(item.text)}
                    >
                      Personalise this
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-border-strong p-5 text-center text-sm text-muted">
              No examples for that combination yet. Choose another tone or style.
              <div className="mt-2">
                <Button type="button" variant="secondary" size="sm" className="min-h-11" onClick={() => { setCategory("All"); setTone("Any"); }}>
                  Show all examples
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personalise with AI</CardTitle>
          <CardDescription>Optional. Describe the situation in one or two lines.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="block space-y-2">
            <span className="text-sm font-bold">A little context</span>
            <Textarea
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              placeholder="e.g. We study in the same class and she recommended a song yesterday."
              rows={3}
              maxLength={1000}
            />
          </label>
          <Button type="button" variant="pink" onClick={() => void personalise()} disabled={loading}>
            <Wand2 className="size-4" aria-hidden="true" />
            {loading ? "Personalising…" : "Generate a personalised version"}
          </Button>
          {loading && <LoadingNote label="Writing a respectful, friendly version…" />}
          {error && (
            <ErrorNote
              message={error}
              onRetry={lastPayload.current ? () => void personalise(lastPayload.current ?? undefined) : undefined}
            />
          )}
          {result && !loading && (
            <ResultCard
              title="Personalised ideas"
              text={result.reply}
              source={result.source}
              eyebrow="Read their comfort before sending"
              className="[&_button]:min-h-11"
            />
          )}
          <p className="flex items-start gap-2 text-xs leading-relaxed text-muted">
            <Sparkles className="mt-0.5 size-3.5 shrink-0 text-pink" aria-hidden="true" />
            If a message would feel wrong to receive, do not send it. One kind line beats a dozen try-hard ones.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
