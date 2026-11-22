"use client";

import * as React from "react";
import {
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  MessageCircleQuestion,
  RotateCcw,
  Save,
  Send,
  Sparkles,
} from "lucide-react";
import type { Correction } from "@/lib/types";
import { askAI } from "@/lib/ai/client";
import { addPracticeSession, addQuizResult, uid, useAppData } from "@/lib/storage/store";
import { useAppContext } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/input";
import type { ProfessionalModule } from "@/data/professional";
import { ScoreChecklist } from "./ScoreChecklist";
import { CorrectionCard } from "./CorrectionCard";
import { CopyLineButton } from "./CopyLineButton";
import { SourceBadge, SourceNotice } from "./SourceNotice";
import { scoreResponse, type ScoreBreakdown } from "./scoring";

interface Turn {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: "ai" | "offline";
  followUp?: string;
}

const ERROR_TEXT: Record<string, string> = {
  AI_NOT_CONFIGURED: "Online AI is not configured on this device. You can keep practising with local feedback.",
  AI_PROVIDER_ERROR: "The AI provider rejected the request. Please try again in a moment.",
  AI_UNAVAILABLE: "The AI service is unreachable right now. Local practice feedback is still available.",
  INVALID_REQUEST: "That request could not be sent. Try shortening your answer.",
};

function extractQuestions(reply: string): string[] {
  const matches = reply.match(/[^.\n]*\?/g) ?? [];
  const seen = new Set<string>();
  return matches
    .map((question) => question.trim().replace(/^[-•\d.\s]+/, ""))
    .filter((question) => question.length > 12 && question.length < 180)
    .filter((question) => {
      const key = question.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function ProfessionalWorkspace({
  module,
  presentation = false,
}: {
  module: ProfessionalModule;
  presentation?: boolean;
}) {
  const { settings } = useAppData();
  const { toast } = useAppContext();
  const [answer, setAnswer] = React.useState("");
  const [turns, setTurns] = React.useState<Turn[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<"ai" | "offline" | undefined>();
  const [reply, setReply] = React.useState("");
  const [correction, setCorrection] = React.useState<Correction | undefined>();
  const [breakdown, setBreakdown] = React.useState<ScoreBreakdown | null>(null);
  const [activeQuestion, setActiveQuestion] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const composerRef = React.useRef<HTMLDivElement>(null);

  const audienceQuestions = React.useMemo(() => {
    const fromReply = extractQuestions(reply);
    const all = [...fromReply, ...module.followUpQuestions];
    const seen = new Set<string>();
    return all
      .filter((question) => {
        const key = question.toLowerCase().replace(/\s+/g, " ");
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 3);
  }, [reply, module.followUpQuestions]);

  const followUp = turns.filter((turn) => turn.role === "assistant").at(-1)?.followUp;

  function focusComposer(question: string) {
    setActiveQuestion(question);
    setAnswer("");
    composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => inputRef.current?.focus(), 120);
  }

  async function submit() {
    const text = answer.trim();
    if (!text || loading) return;

    const userTurn: Turn = { id: uid(), role: "user", content: text };
    const nextTurns = [...turns, userTurn];
    setTurns(nextTurns);
    setAnswer("");
    setActiveQuestion(null);
    setSaved(false);
    setLoading(true);
    setError(null);
    setSource(undefined);
    setReply("");
    setCorrection(undefined);
    setBreakdown(null);

    const context = presentation
      ? `Presentation simulator — ${module.title}. ${module.prompt} Give structured feedback and ask realistic audience questions.`
      : `${module.title}. Task: ${module.prompt}`;

    try {
      const result = await askAI({
        mode: "feedback",
        userText: text,
        messages: nextTurns.map((turn) => ({ role: turn.role, content: turn.content })),
        context,
        correctionMode: "always",
        difficulty: settings.difficulty,
        explanationLanguage: settings.explanationLanguage,
      });

      setSource(result.source);
      if (!result.ok || !result.reply) {
        setError(ERROR_TEXT[result.error ?? ""] ?? "Feedback is unavailable right now. Please try again.");
        return;
      }

      setReply(result.reply);
      setCorrection(result.correction);
      setBreakdown(scoreResponse(text, result.reply, result.source));
      setTurns((current) => [
        ...current,
        {
          id: uid(),
          role: "assistant",
          content: result.reply,
          source: result.source,
          followUp: result.followUp ?? module.followUpQuestions[0],
        },
      ]);
    } catch {
      setError("Something went wrong while getting feedback. Your answer is still saved on this page — please try again.");
    } finally {
      setLoading(false);
    }
  }

  function saveSession() {
    if (!breakdown || saved) return;
    const date = new Date().toISOString();
    addPracticeSession({
      id: uid(),
      date,
      mode: `professional:${module.id}${presentation ? ":presentation" : ""}`,
      difficulty: settings.difficulty,
      score: breakdown.overall,
      total: 10,
      notes: `${module.title} — overall ${breakdown.overall}/10 (${breakdown.fromAI ? "AI scores" : "local rubric"})`,
    });
    addQuizResult({
      id: uid(),
      date,
      lessonId: `professional-${module.id}`,
      title: `Professional · ${module.title}`,
      score: breakdown.overall,
      total: 10,
      kind: "professional",
    });
    setSaved(true);
    toast("Professional practice saved to your progress", "success");
  }

  function reset() {
    setAnswer("");
    setTurns([]);
    setLoading(false);
    setError(null);
    setSource(undefined);
    setReply("");
    setCorrection(undefined);
    setBreakdown(null);
    setActiveQuestion(null);
    setSaved(false);
  }

  return (
    <div className="min-w-0 space-y-5">
      <Card className="min-w-0 p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{module.category}</Badge>
          {presentation && <Badge>Presentation simulator</Badge>}
        </div>
        <h3 className="mt-3 text-lg font-bold">{presentation ? "Present your project" : module.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{module.description}</p>
        <div className="mt-3 rounded-2xl border border-primary/15 bg-primary-soft/60 p-3.5">
          <p className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-wide text-primary">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Your task
          </p>
          <p className="mt-1 break-words text-sm leading-relaxed">{module.prompt}</p>
        </div>

        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Useful phrases</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {module.samplePhrases.map((phrase) => (
              <div key={phrase} className="flex min-w-0 items-center gap-1 rounded-xl bg-surface-muted px-2 py-1">
                <span className="max-w-[15rem] break-words text-xs sm:max-w-none">{phrase}</span>
                <CopyLineButton text={phrase} label="Copy phrase" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
            <Lightbulb className="size-3.5" aria-hidden="true" />
            Coach tips
          </p>
          <ul className="mt-2 space-y-1.5">
            {module.tips.map((tip) => (
              <li key={tip} className="flex gap-2 text-xs leading-relaxed text-muted">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
                <span className="min-w-0 break-words">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card className="min-w-0 p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-bold">Your practice conversation</h4>
          <Button type="button" variant="ghost" size="sm" className="min-h-11" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Start over
          </Button>
        </div>

        {turns.length > 0 && (
          <div className="chat-scroll mt-3 max-h-80 space-y-3 overflow-y-auto rounded-2xl bg-surface-muted/70 p-3" aria-live="polite">
            {turns.map((turn) => (
              <div key={turn.id} className={`flex min-w-0 ${turn.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`min-w-0 max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${turn.role === "user" ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-surface"}`}
                >
                  <p className="whitespace-pre-wrap break-words">{turn.content}</p>
                  {turn.source && (
                    <div className="mt-2 flex flex-wrap">
                      <SourceBadge source={turn.source} />
                    </div>
                  )}
                  {turn.followUp && (
                    <button
                      type="button"
                      onClick={() => focusComposer(turn.followUp as string)}
                      className="mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-primary-soft px-3 py-2 text-xs font-bold text-primary dark:text-foreground"
                    >
                      <MessageCircleQuestion className="size-3.5" aria-hidden="true" />
                      Answer this follow-up
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <p className="flex items-center gap-2 text-xs text-muted" role="status">
                <Sparkles className="size-4 animate-pulse text-primary" aria-hidden="true" />
                Coach is preparing feedback…
              </p>
            )}
          </div>
        )}

        <div ref={composerRef} className="mt-3 min-w-0">
          {activeQuestion && (
            <div className="mb-2 flex flex-wrap items-start gap-2 rounded-xl bg-primary-soft/70 p-3 text-xs">
              <MessageCircleQuestion className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <p className="min-w-0 flex-1 break-words font-semibold">{activeQuestion}</p>
              <button type="button" onClick={() => setActiveQuestion(null)} className="min-h-11 px-2 text-xs font-bold text-muted">
                Dismiss
              </button>
            </div>
          )}
          <label htmlFor="professional-answer" className="text-xs font-bold text-muted">
            {activeQuestion ? "Your answer to the question" : "Write your response"}
          </label>
          <Textarea
            id="professional-answer"
            ref={inputRef}
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder={activeQuestion ? "Type your answer here…" : "Write 4–6 sentences. Broken English is fine — we will improve it together."}
            className="mt-1.5 min-h-32"
            disabled={loading}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
                event.preventDefault();
                void submit();
              }
            }}
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Button type="button" onClick={() => void submit()} disabled={loading || !answer.trim()}>
              <Send className="size-4" aria-hidden="true" />
              {loading ? "Getting feedback…" : turns.length ? "Send & get feedback" : "Get feedback"}
            </Button>
            <span className="text-[0.7rem] text-muted">Tip: Ctrl/⌘ + Enter to send</span>
          </div>
        </div>

        <SourceNotice source={source} error={error} loading={false} className="mt-3" />
      </Card>

      {reply && !error && (
        <div className="min-w-0 space-y-4">
          <Card className="min-w-0 p-4 md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-bold">Coach feedback</h4>
              <SourceBadge source={source} />
            </div>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">{reply}</p>
            <SourceNotice source={source} className="mt-3" />
          </Card>

          {breakdown && <ScoreChecklist breakdown={breakdown} />}
          {correction && <CorrectionCard correction={correction} />}

          <Card className="min-w-0 p-4 md:p-5">
            <h4 className="text-sm font-bold">{presentation ? "Audience follow-up questions" : "Keep the conversation going"}</h4>
            <p className="mt-1 text-xs text-muted">
              {presentation
                ? "Pick a realistic question and answer it in the box above. Each answer gets fresh feedback."
                : "Choose a question and answer it above — the coach will continue from your previous turns."}
            </p>
            <div className="mt-3 space-y-2">
              {(presentation ? audienceQuestions : [followUp ?? module.followUpQuestions[0]]).map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => focusComposer(question)}
                  className="flex min-h-11 w-full items-start gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-left text-sm transition-colors hover:border-primary/50 hover:bg-primary-soft/40"
                >
                  <MessageCircleQuestion className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="min-w-0 flex-1 break-words">{question}</span>
                  <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden="true" />
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" onClick={saveSession} disabled={saved}>
                {saved ? <CheckCircle2 className="size-4" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
                {saved ? "Saved to progress" : "Save this session"}
              </Button>
              {breakdown && (
                <Badge variant={breakdown.fromAI ? "success" : "outline"}>
                  Score {breakdown.overall}/10 · {breakdown.fromAI ? "AI" : "local rubric"}
                </Badge>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
