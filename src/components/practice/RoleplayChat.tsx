"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  MessageCircleQuestion,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { ChatMessage, Conversation, Difficulty } from "@/lib/types";
import { askAI } from "@/lib/ai/client";
import {
  addPracticeSession,
  addQuizResult,
  createConversation,
  deleteConversation,
  saveConversation,
  uid,
} from "@/lib/storage/store";
import { useAppData } from "@/lib/storage/store";
import { useAppContext } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/input";
import type { RoleplayScenario, ScenarioMode } from "@/data/scenarios";
import { SourceBadge, SourceNotice } from "./SourceNotice";
import { ScoreChecklist } from "./ScoreChecklist";
import { CorrectionCard } from "./CorrectionCard";
import { CopyLineButton } from "./CopyLineButton";
import { scoreResponse, type ScoreBreakdown } from "./scoring";

const ERROR_TEXT: Record<string, string> = {
  AI_NOT_CONFIGURED: "Online AI is not configured here, so local practice feedback will be used.",
  AI_PROVIDER_ERROR: "The AI provider could not answer. Please try again shortly.",
  AI_UNAVAILABLE: "The AI service is unreachable right now. Local practice keeps working.",
};

interface Insight {
  breakdown: ScoreBreakdown;
  toneNote: string;
  toneFromAI: boolean;
  betterAlternative: string;
}

function toneNote(text: string, scenario: RoleplayScenario, reply: string): { text: string; fromAI: boolean } {
  const aiLine = reply.match(/Tone\s*:\s*([^\n]+)/i)?.[1]?.trim();
  if (aiLine) return { text: aiLine, fromAI: true };

  const lower = text.toLowerCase();
  const polite = /\b(please|thank you|thanks|could you|would you|i'd love|sorry)\b/.test(lower);
  const casual = /\b(gonna|wanna|lol|dude|yeah|whatever)\b/.test(lower);
  const observation = polite
    ? "Your wording included polite language, which suits this situation."
    : casual
      ? "Some wording was quite casual — a slightly softer phrase may land better."
      : "Your reply was clear and direct; adding a small friendly cue can help.";

  return {
    text: `This scenario calls for a ${scenario.tone} tone. ${observation}`,
    fromAI: false,
  };
}

export function RoleplayChat({
  scenario,
  mode,
  difficulty,
  onExit,
}: {
  scenario: RoleplayScenario;
  mode: ScenarioMode;
  difficulty: Difficulty;
  onExit: () => void;
}) {
  const { settings } = useAppData();
  const { toast } = useAppContext();
  const opening: ChatMessage = React.useMemo(
    () => ({
      id: `opening-${scenario.id}`,
      role: "assistant",
      content: scenario.openingLine,
      createdAt: new Date().toISOString(),
    }),
    [scenario.id, scenario.openingLine],
  );

  const [messages, setMessages] = React.useState<ChatMessage[]>([opening]);
  const [input, setInput] = React.useState("");
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<"ai" | "offline" | undefined>();
  const [insight, setInsight] = React.useState<Insight | null>(null);
  const [finished, setFinished] = React.useState(false);
  const conversationRef = React.useRef<Conversation | null>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, insight]);

  const lastCorrection = [...messages].reverse().find((message) => message.role === "assistant")?.correction;

  function persist(nextMessages: ChatMessage[]) {
    if (!settings.privacy.saveConversations) return;
    const title = `${mode.label}: ${scenario.title}`;
    if (!conversationRef.current) {
      const created = createConversation(mode.accent === "pink" && mode.id === "flirting" ? "flirting" : mode.id === "girltalk" ? "girltalk" : "practice", title);
      conversationRef.current = created;
    }
    saveConversation({ ...conversationRef.current, title, messages: nextMessages });
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: uid(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    const withUser = [...messages, userMessage];
    setMessages(withUser);
    setInput("");
    setReplyingTo(null);
    setLoading(true);
    setError(null);
    setSource(undefined);
    setInsight(null);
    setFinished(false);

    try {
      const result = await askAI({
        mode: "simulate",
        userText: text,
        messages: withUser.map((message) => ({ role: message.role, content: message.content })),
        context: scenario.situation,
        tone: scenario.tone,
        difficulty,
        correctionMode: "always",
        explanationLanguage: settings.explanationLanguage,
      });

      setSource(result.source);
      if (!result.ok || !result.reply) {
        setError(ERROR_TEXT[result.error ?? ""] ?? "The simulator could not reply. Please try again.");
        persist(withUser);
        return;
      }

      const assistantMessage: ChatMessage = {
        id: uid(),
        role: "assistant",
        content: result.reply,
        createdAt: new Date().toISOString(),
        source: result.source,
        correction: result.correction,
        followUp: result.followUp,
      };
      const nextMessages = [...withUser, assistantMessage];
      setMessages(nextMessages);
      persist(nextMessages);

      const note = toneNote(text, scenario, result.reply);
      setInsight({
        breakdown: scoreResponse(text, result.reply, result.source),
        toneNote: note.text,
        toneFromAI: note.fromAI,
        betterAlternative:
          result.correction?.natural || result.correction?.professional || result.correction?.correct || "Your reply worked — try varying the sentence opening next time.",
      });
    } catch {
      setError("Something went wrong while running the scenario. Your message is still on screen — please try again.");
      persist(withUser);
    } finally {
      setLoading(false);
      window.setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function answerFollowUp(question: string) {
    setInput("");
    setReplyingTo(question);
    inputRef.current?.focus();
  }

  function finish() {
    const lastUser = [...messages].reverse().find((message) => message.role === "user");
    if (!lastUser) return;
    const breakdown = insight?.breakdown ?? scoreResponse(lastUser.content, "", "offline");
    const date = new Date().toISOString();
    addPracticeSession({
      id: uid(),
      date,
      mode: `practice:${mode.id}:${scenario.id}`,
      difficulty,
      score: breakdown.overall,
      total: 10,
      notes: `${scenario.title} — ${breakdown.fromAI ? "AI feedback" : "local rubric"}, ${messages.filter((message) => message.role === "user").length} replies`,
    });
    addQuizResult({
      id: uid(),
      date,
      lessonId: `practice-${scenario.id}`,
      title: `Roleplay · ${scenario.title}`,
      score: breakdown.overall,
      total: 10,
      kind: "practice",
    });
    setFinished(true);
    toast("Roleplay session saved to your progress", "success");
  }

  function deleteChat() {
    if (conversationRef.current && settings.privacy.saveConversations) {
      deleteConversation(conversationRef.current.id);
      toast("Saved chat deleted", "info");
    } else {
      toast("This chat was not saved", "info");
    }
    conversationRef.current = null;
    setMessages([opening]);
    setInput("");
    setReplyingTo(null);
    setError(null);
    setSource(undefined);
    setInsight(null);
    setFinished(false);
  }

  return (
    <div className="min-w-0 space-y-4">
      <Card className="min-w-0 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={mode.accent === "pink" ? "pink" : "default"}>{mode.label}</Badge>
              <Badge variant="outline">{difficulty}</Badge>
            </div>
            <h3 className="mt-2 text-lg font-bold">{scenario.title}</h3>
            <p className="mt-1 break-words text-sm leading-relaxed text-muted">{scenario.situation}</p>
          </div>
          <Button type="button" variant="ghost" size="sm" className="min-h-11" onClick={onExit}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Change scenario
          </Button>
        </div>

        {mode.href && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-pink-soft p-3 text-xs">
            <p className="min-w-0 flex-1 break-words text-muted">
              For a deeper guided experience, use the specialised coach. This simulator is for quick, realistic practice.
            </p>
            <Button asChild variant="pink" size="sm" className="min-h-11">
              <Link href={mode.href ?? "/girltalk"}>{mode.hrefLabel}</Link>
            </Button>
          </div>
        )}

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="min-w-0">
            <p className="text-[0.68rem] font-bold uppercase tracking-wide text-muted">Goals</p>
            <ul className="mt-1 space-y-1">
              {scenario.goals.map((goal) => (
                <li key={goal} className="flex gap-1.5 text-xs text-muted">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
                  <span className="min-w-0 break-words">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <p className="text-[0.68rem] font-bold uppercase tracking-wide text-muted">Coach tips</p>
            <ul className="mt-1 space-y-1">
              {scenario.tips.map((tip) => (
                <li key={tip} className="flex gap-1.5 text-xs text-muted">
                  <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-warning" aria-hidden="true" />
                  <span className="min-w-0 break-words">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card className="min-w-0 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-bold">Conversation</h4>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="ghost" size="sm" className="min-h-11" onClick={deleteChat}>
              <Trash2 className="size-4" aria-hidden="true" />
              Delete chat
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="min-h-11"
              onClick={finish}
              disabled={messages.filter((message) => message.role === "user").length === 0 || finished}
            >
              {finished ? <CheckCircle2 className="size-4" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
              {finished ? "Session saved" : "Finish & save"}
            </Button>
          </div>
        </div>

        <div ref={scrollRef} className="chat-scroll mt-3 max-h-[24rem] space-y-3 overflow-y-auto rounded-2xl bg-surface-muted/70 p-3" aria-live="polite">
          {messages.map((message) => (
            <div key={message.id} className={`flex min-w-0 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`min-w-0 max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${message.role === "user" ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-surface"}`}
              >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                {message.source && (
                  <div className="mt-2 flex flex-wrap">
                    <SourceBadge source={message.source} />
                  </div>
                )}
                {message.followUp && (
                  <div className="mt-2 rounded-xl bg-primary-soft/70 p-2.5">
                    <p className="flex items-start gap-1.5 break-words text-xs font-semibold">
                      <MessageCircleQuestion className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
                      {message.followUp}
                    </p>
                    <button
                      type="button"
                      onClick={() => answerFollowUp(message.followUp as string)}
                      className="mt-1 min-h-11 rounded-lg px-2 text-xs font-bold text-primary dark:text-foreground"
                    >
                      Answer this
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <p className="flex items-center gap-2 text-xs text-muted" role="status">
              <Sparkles className="size-4 animate-pulse text-primary" aria-hidden="true" />
              Your partner is replying…
            </p>
          )}
        </div>

        <div className="mt-3 min-w-0">
          {replyingTo && (
            <div className="mb-2 flex flex-wrap items-start gap-2 rounded-xl bg-primary-soft/70 p-3 text-xs">
              <MessageCircleQuestion className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <p className="min-w-0 flex-1 break-words font-semibold">{replyingTo}</p>
              <button type="button" onClick={() => setReplyingTo(null)} className="min-h-11 px-2 font-bold text-muted">
                Dismiss
              </button>
            </div>
          )}
          <label htmlFor="roleplay-input" className="text-xs font-bold text-muted">
            Your reply
          </label>
          <Textarea
            id="roleplay-input"
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={`Respond in a ${scenario.tone} way…`}
            className="mt-1.5 min-h-24"
            disabled={loading}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
                event.preventDefault();
                void send();
              }
            }}
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Button type="button" onClick={() => void send()} disabled={loading || !input.trim()}>
              <Send className="size-4" aria-hidden="true" />
              {loading ? "Sending…" : "Send reply"}
            </Button>
            <span className="text-[0.7rem] text-muted">Ctrl/⌘ + Enter to send</span>
          </div>
        </div>

        <SourceNotice source={source} error={error} className="mt-3" />
      </Card>

      {insight && !error && (
        <div className="min-w-0 space-y-4">
          <Card className="min-w-0 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-bold">Tone & better alternative</h4>
              <Badge variant={insight.toneFromAI ? "success" : "outline"}>
                {insight.toneFromAI ? "From AI" : "Local note"}
              </Badge>
            </div>
            <p className="mt-2 break-words text-sm leading-relaxed">{insight.toneNote}</p>
            <div className="mt-3 rounded-xl bg-primary-soft/60 p-3">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <p className="text-[0.68rem] font-bold uppercase tracking-wide text-primary">
                  {source === "ai" ? "AI better alternative" : "Local better alternative"}
                </p>
                <CopyLineButton text={insight.betterAlternative} label="Copy" />
              </div>
              <p className="mt-1 break-words text-sm">{insight.betterAlternative}</p>
            </div>
            <SourceNotice source={source} className="mt-3" />
          </Card>

          <ScoreChecklist breakdown={insight.breakdown} title="Your last reply" />
          {lastCorrection && <CorrectionCard correction={lastCorrection} title="Language correction" />}
        </div>
      )}
    </div>
  );
}
