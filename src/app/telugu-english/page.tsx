"use client";

import * as React from "react";
import { AlertCircle, ArrowRight, Languages, Sparkles, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/PageHeader";
import { CopyButton } from "@/components/shared/CopyButton";
import { useAppContext } from "@/components/providers/AppProviders";
import { translateRoman, type TranslationResult } from "@/lib/translation/roman";
import { askAI } from "@/lib/ai/client";
import { useAppData } from "@/lib/storage/store";
import { cn } from "@/lib/utils";

const examples = [
  "em chestunnav",
  "ela unnav",
  "tinnava",
  "ekkadiki velthunnav",
  "naku english nerchukovali",
  "repu project present cheyali",
  "netho matladali anipistundi",
];

interface DisplayResult extends TranslationResult {
  source: "ai" | "offline" | "local";
  extra?: string;
}

export default function TeluguEnglishPage() {
  const { online } = useAppContext();
  const { settings } = useAppData();
  const [input, setInput] = React.useState("");
  const [result, setResult] = React.useState<DisplayResult | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function translate(text: string) {
    const value = text.trim();
    if (!value) return;
    setInput(value);
    const local = translateRoman(value);
    setResult({ ...local, source: "local" });
    if (!online || local.confidence === "low") return;

    setLoading(true);
    const response = await askAI({
      mode: "translate",
      userText: value,
      explanationLanguage: settings.explanationLanguage,
    });
    if (response.ok && response.source === "ai") {
      const content = response.reply;
      const professional = /Professional:\s*(.+)/i.exec(content)?.[1]?.trim();
      const meaning = /Meaning:\s*(.+)/i.exec(content)?.[1]?.trim();
      setResult({
        natural: content.split("\n")[0].replace(/^(Natural English:|Translation:)\s*/i, "").trim(),
        professional: professional || local.professional,
        telugu: response.teluguMeaning || local.telugu,
        meaning: meaning || local.meaning,
        explanation: local.explanation,
        exampleResponse: response.followUp || local.exampleResponse,
        confidence: "high",
        needsClarification: response.followUp && /clarif|mean|unsure|several/i.test(response.followUp) ? response.followUp : undefined,
        source: "ai",
      });
    }
    setLoading(false);
  }

  const fields: Array<[string, string, string]> = result
    ? [
        ["Natural English", result.natural, "The way a friend would say it."],
        ["Professional English", result.professional, "Polished for college or work."],
        ["Telugu script", result.telugu, "As it would be written in Telugu."],
        ["Meaning", result.meaning, "What the sentence is about."],
        ["Explanation", result.explanation, "Why this English works."],
        ["Example response", result.exampleResponse, "A natural reply you can use."],
      ]
    : [];

  const allText = result
    ? fields.map(([label, value]) => `${label}: ${value}`).join("\n")
    : "";

  return (
    <div>
      <PageHeader
        eyebrow="Roman Telugu assistant"
        title="Telugu thinking, English expression."
        description="Type Telugu the way you already type it — with English letters. Get natural English, a professional version and a clear explanation."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Languages className="size-5 text-primary" aria-hidden="true" /> Your sentence</CardTitle>
            <CardDescription>Spelling variations are fine: “ela vunna”, “yela unna” and “ela unna” all work.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(event) => { event.preventDefault(); void translate(input); }}>
              <label htmlFor="roman-input" className="text-xs font-bold text-muted">Roman Telugu or English</label>
              <Textarea
                id="roman-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="e.g. netho matladatam chala baguntundi"
                rows={4}
                maxLength={500}
                className="mt-1.5"
                enterKeyHint="done"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="submit" disabled={!input.trim() || loading}>
                  <WandSparkles className="size-4" aria-hidden="true" /> {loading ? "Refining with AI…" : "Translate"}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setInput(""); setResult(null); }}>Clear</Button>
              </div>
            </form>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Try an example</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {examples.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => void translate(example)}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium hover:border-primary/50"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><Sparkles className="size-5 text-primary" aria-hidden="true" /> Translation</CardTitle>
              <CardDescription>Everything you need to understand and use the sentence.</CardDescription>
            </div>
            {result && (
              <Badge variant={result.source === "ai" ? "success" : "outline"}>
                {result.source === "ai" ? "AI enhanced" : result.source === "offline" ? "Offline practice" : "Local phrase library"}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="rounded-2xl border border-dashed border-border-strong p-8 text-center">
                <Languages className="mx-auto size-8 text-muted" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold">Your translation will appear here</p>
                <p className="mt-1 text-xs text-muted">Start with an example above, or type your own sentence.</p>
              </div>
            ) : (
              <>
                {result.needsClarification && (
                  <div className="mb-4 flex gap-2 rounded-xl border border-warning/30 bg-[var(--surface-muted)] p-3 text-sm">
                    <AlertCircle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
                    <p>{result.needsClarification}</p>
                  </div>
                )}
                <div className="space-y-3">
                  {fields.map(([label, value, hint], index) => (
                    <div
                      key={label}
                      className={cn(
                        "rounded-2xl border p-3.5",
                        index === 0 ? "border-primary/35 bg-primary-soft/60" : "border-border bg-surface",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[0.7rem] font-bold uppercase tracking-wide text-primary">{label}</p>
                        <CopyButton text={value} label="Copy" />
                      </div>
                      <p className="mt-1 text-sm leading-relaxed" lang={label === "Telugu script" ? "te" : undefined}>{value || "—"}</p>
                      <p className="mt-1 text-[0.68rem] text-muted">{hint}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-surface-muted p-3">
                  <p className="text-xs text-muted">
                    {result.confidence === "high"
                      ? "Matched in the local phrase library."
                      : result.confidence === "medium"
                        ? "Word-level translation — online AI can make it more natural."
                        : "Low confidence. Try rephrasing your sentence."}
                  </p>
                  {allText && <CopyButton text={allText} label="Copy all" />}
                </div>
                {!online && (
                  <p className="mt-3 flex items-start gap-2 text-xs text-muted">
                    <ArrowRight className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                    Offline results come from a local phrase library. Turn on internet access for context-aware AI translation.
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
