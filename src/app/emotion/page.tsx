"use client";

import * as React from "react";
import { HeartHandshake, Info, MessageCircleHeart, ScanSearch, Sparkles } from "lucide-react";
import type { EmotionInsight } from "@/lib/emotion/analyze";
import { analyzeEmotion } from "@/lib/emotion/analyze";
import { askAI } from "@/lib/ai/client";
import { useAppData } from "@/lib/storage/store";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/input";
import { CopyLineButton } from "@/components/practice/CopyLineButton";
import { SourceNotice } from "@/components/practice/SourceNotice";

const examples = [
  "I guess I'll just handle the group project alone. Again.",
  "Yay!! I got the internship 😊 Can't wait to tell everyone!",
  "Are you free tonight? I need to talk about something…",
  "I'm nervous about the presentation tomorrow. What if I forget everything?",
];

const neutralAlternatives = [
  "a straightforward request for information",
  "a quick comment with no emotional weight",
  "playful or sarcastic phrasing",
];

export default function EmotionPage() {
  const { settings } = useAppData();
  const [text, setText] = React.useState("");
  const [insight, setInsight] = React.useState<EmotionInsight | null>(null);
  const [aiReply, setAiReply] = React.useState("");
  const [aiFollowUp, setAiFollowUp] = React.useState("");
  const [source, setSource] = React.useState<"ai" | "offline" | undefined>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function analyzeLocal(value = text) {
    if (!value.trim()) return;
    setInsight(analyzeEmotion(value));
    setAiReply("");
    setAiFollowUp("");
    setSource(undefined);
    setError(null);
  }

  async function analyzeOnline() {
    const value = text.trim();
    if (!value || loading) return;
    if (!insight) analyzeLocal(value);
    setLoading(true);
    setError(null);
    setAiReply("");
    setAiFollowUp("");
    setSource(undefined);
    try {
      const result = await askAI({
        mode: "emotion",
        userText: value,
        explanationLanguage: settings.explanationLanguage,
      });
      setSource(result.source);
      if (!result.ok || !result.reply) {
        setError("The deeper explanation is unavailable right now. Local cue detection is still shown below.");
        return;
      }
      setAiReply(result.reply);
      setAiFollowUp(result.followUp ?? "");
    } catch {
      setError("Something went wrong. Please try again — local cue detection still works.");
    } finally {
      setLoading(false);
    }
  }

  const alternatives = React.useMemo(() => {
    if (!insight) return [];
    if (insight.cues.length === 0) return neutralAlternatives;
    const others = insight.cues.slice(1).map((cue) => `the message could also carry ${cue.name.toLowerCase()}`);
    return others.length ? others : neutralAlternatives;
  }, [insight]);

  return (
    <div className="mx-auto min-w-0 max-w-5xl px-4 py-6 md:px-6 md:py-10">
      <PageHeader
        eyebrow="Empathy Lab"
        title="Emotion & Empathy Coach"
        description="Notice possible emotional cues in a message and practise a caring reply. Text alone never tells the whole story."
        icon={MessageCircleHeart}
      />

      <Card className="min-w-0 border-warning/25 bg-warning/5 p-4">
        <p className="flex items-start gap-2 break-words text-sm font-semibold leading-relaxed">
          <Info className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
          Context matters — I cannot know someone&apos;s actual feelings from text alone.
        </p>
      </Card>

      <Card className="mt-5 min-w-0 p-4 md:p-5">
        <label htmlFor="emotion-text" className="text-sm font-bold">
          Paste a message
        </label>
        <p className="mt-0.5 text-xs text-muted">Local detection runs instantly on your device. AI explanation is optional.</p>
        <Textarea
          id="emotion-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Type or paste the message you want to understand…"
          className="mt-2 min-h-32"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" onClick={() => analyzeLocal()} disabled={!text.trim()}>
            <ScanSearch className="size-4" aria-hidden="true" />
            Detect cues locally
          </Button>
          <Button type="button" variant="secondary" onClick={() => void analyzeOnline()} disabled={!text.trim() || loading}>
            <Sparkles className="size-4" aria-hidden="true" />
            {loading ? "Asking AI…" : "Ask AI for a deeper explanation"}
          </Button>
        </div>

        <div className="mt-4">
          <p className="text-[0.68rem] font-bold uppercase tracking-wide text-muted">Try an example</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  setText(example);
                  analyzeLocal(example);
                }}
                className="max-w-full min-h-11 rounded-xl border border-border bg-surface-muted px-3 py-2 text-left text-xs leading-snug transition-colors hover:border-primary/50"
              >
                <span className="block break-words">{example.length > 52 ? `${example.slice(0, 52)}…` : example}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      <SourceNotice source={source} error={error} loading={loading} className="mt-4" />

      {insight && (
        <div className="mt-5 min-w-0 space-y-4">
          <Card className="min-w-0 p-4 md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold">Possible emotional cues</h3>
              <Badge variant="outline">Not conclusions</Badge>
            </div>
            <p className="mt-2 break-words text-sm leading-relaxed text-muted">{insight.summary}</p>

            <div className="mt-3 space-y-2">
              {insight.cues.length === 0 && (
                <p className="rounded-xl bg-surface-muted p-3 text-sm text-muted">
                  No clear wording cues were found. A neutral or caring reply is the safest choice.
                </p>
              )}
              {insight.cues.map((cue) => (
                <div key={cue.name} className="min-w-0 rounded-xl border border-border p-3.5">
                  <p className="text-sm font-bold">{cue.name} <span className="font-normal text-muted">— may be present</span></p>
                  <p className="mt-1 break-words text-xs leading-relaxed text-muted">{cue.interpretation}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[0.68rem] font-bold uppercase tracking-wide text-muted">Evidence</span>
                    {cue.evidence.map((item) => (
                      <span key={item} className="rounded-lg bg-primary-soft px-2 py-1 text-xs font-semibold text-primary dark:text-foreground">
                        “{item}”
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="min-w-0 p-4 md:p-5">
            <h3 className="text-base font-bold">Alternative interpretations</h3>
            <p className="mt-1 text-xs text-muted">Other possibilities — not a reading of the person&apos;s mind.</p>
            <ul className="mt-3 space-y-1.5">
              {alternatives.map((item) => (
                <li key={item} className="flex gap-2 break-words text-sm text-muted">
                  <span className="text-primary" aria-hidden="true">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="min-w-0 p-4 md:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <HeartHandshake className="size-4 text-primary" aria-hidden="true" />
              <h3 className="text-base font-bold">Suggested empathetic replies</h3>
            </div>
            <div className="mt-3 space-y-2">
              {insight.suggestedReplies.map((reply) => (
                <div key={reply} className="flex min-w-0 flex-wrap items-center justify-between gap-1 rounded-xl bg-surface-muted p-3">
                  <p className="min-w-0 flex-1 break-words text-sm leading-relaxed">{reply}</p>
                  <CopyLineButton text={reply} label="Copy reply" />
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-xl border border-primary/20 bg-primary-soft/50 p-3">
              <p className="text-[0.68rem] font-bold uppercase tracking-wide text-primary">Clarifying question</p>
              <div className="flex flex-wrap items-center justify-between gap-1">
                <p className="min-w-0 flex-1 break-words text-sm">{insight.clarifyingQuestion}</p>
                <CopyLineButton text={insight.clarifyingQuestion} label="Copy question" />
              </div>
            </div>
          </Card>

          {aiReply && (
            <Card className="min-w-0 p-4 md:p-5">
              <h3 className="text-base font-bold">Deeper explanation</h3>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">{aiReply}</p>
              {aiFollowUp && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-1 rounded-xl bg-surface-muted p-3">
                  <p className="min-w-0 flex-1 break-words text-sm font-semibold">{aiFollowUp}</p>
                  <CopyLineButton text={aiFollowUp} label="Copy" />
                </div>
              )}
              <SourceNotice source={source} className="mt-3" />
            </Card>
          )}

          <p className="rounded-xl bg-surface-muted p-3 text-xs leading-relaxed text-muted">
            {insight.caution} These suggestions are practice material — decide what fits the real relationship and situation.
          </p>
        </div>
      )}
    </div>
  );
}
