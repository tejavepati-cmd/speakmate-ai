"use client";

import * as React from "react";
import { CheckCircle2, MessageCircle, RotateCcw, Send, Sparkles, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { CopyButton } from "@/components/shared/CopyButton";
import { useAppContext } from "@/components/providers/AppProviders";
import { formatDate } from "@/lib/utils";
import type { SimulationScenario } from "@/data/girltalk";
import {
  addPracticeSession,
  createConversation,
  deleteConversation,
  getSnapshot,
  saveConversation,
  uid,
  useAppData,
} from "@/lib/storage/store";
import type { AIRequestPayload, ChatMessage, Conversation, Correction } from "@/lib/types";
import { ChipButton } from "./ChipButton";
import { ErrorNote, LoadingNote, ResultCard } from "./Feedback";
import { SourceBadge } from "./SourceBadge";
import { useAIRequest } from "./useAIRequest";
import { evaluateResponse, OFFLINE_LABEL, scenarioTip, type DimensionScore } from "./utils";

interface ChatItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: "ai" | "offline";
  createdAt: string;
}

interface EvaluationRecord {
  id: string;
  userText: string;
  scores: DimensionScore[];
  coach: string;
  source?: "ai" | "offline";
  correction?: Correction;
  better: string;
  followUp: string;
}

interface SimulatorPanelProps {
  kind: "girltalk" | "flirting";
  scenarios: SimulationScenario[];
  variant: "social" | "flirting";
  aiContext: string;
  title: string;
  description: string;
}

export function SimulatorPanel({ kind, scenarios, variant, aiContext, title, description }: SimulatorPanelProps) {
  const { toast } = useAppContext();
  const data = useAppData();
  const [scenarioId, setScenarioId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<ChatItem[]>([]);
  const [draft, setDraft] = React.useState("");
  const [evaluations, setEvaluations] = React.useState<EvaluationRecord[]>([]);
  const [conversationId, setConversationId] = React.useState<string | null>(null);
  const [viewingSaved, setViewingSaved] = React.useState(false);
  const [sessionSaved, setSessionSaved] = React.useState(false);
  const lastPayload = React.useRef<AIRequestPayload | null>(null);
  const { loading, error, run } = useAIRequest();

  const scenario = scenarios.find((item) => item.id === scenarioId) ?? null;
  const saved = React.useMemo(
    () =>
      [...data.conversations]
        .filter((conversation) => conversation.kind === kind)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [data.conversations, kind],
  );

  React.useEffect(() => {
    if (messages.length) {
      const area = document.getElementById(`sim-chat-${kind}`);
      if (area) area.scrollTop = area.scrollHeight;
    }
  }, [messages, kind]);

  function startScenario(next: SimulationScenario) {
    setScenarioId(next.id);
    setMessages([
      { id: uid(), role: "assistant", content: next.opening, createdAt: new Date().toISOString() },
    ]);
    setEvaluations([]);
    setConversationId(null);
    setViewingSaved(false);
    setSessionSaved(false);
    setDraft("");
  }

  function leaveScenario() {
    setScenarioId(null);
    setMessages([]);
    setEvaluations([]);
    setConversationId(null);
    setViewingSaved(false);
    setDraft("");
  }

  function viewSaved(conversation: Conversation) {
    setScenarioId(null);
    setMessages(
      conversation.messages.map((message: ChatMessage) => ({
        id: message.id,
        role: message.role,
        content: message.content,
        source: message.source,
        createdAt: message.createdAt,
      })),
    );
    setConversationId(conversation.id);
    setViewingSaved(true);
    setEvaluations([]);
    setDraft("");
  }

  function removeSaved(id: string) {
    deleteConversation(id);
    if (conversationId === id) leaveScenario();
    toast("Conversation deleted.", "info");
  }

  async function send(payloadOverride?: AIRequestPayload) {
    if (!scenario || loading) return;
    const userText = draft.trim() || (payloadOverride?.userText ?? "");
    if (!userText) return;

    const userItem: ChatItem = {
      id: uid(),
      role: "user",
      content: userText,
      createdAt: new Date().toISOString(),
    };
    // A retry reuses the message that is already in the chat; a new send adds it once.
    const nextMessages = payloadOverride ? messages : [...messages, userItem];
    setMessages(nextMessages);
    setDraft("");

    const payload: AIRequestPayload =
      payloadOverride ?? {
        mode: "simulate",
        userText,
        context: `${aiContext}\n\n${scenario.context}`,
        difficulty: scenario.difficulty,
        messages: nextMessages.map((item) => ({ role: item.role, content: item.content })),
      };
    lastPayload.current = payload;
    const response = await run(payload);
    if (!response) return;

    const scores = evaluateResponse(userText, variant);
    const correction = response.correction;
    const better =
      correction?.natural && correction.natural.trim().toLowerCase() !== userText.toLowerCase()
        ? correction.natural
        : scenario.betterAlternative;
    const fallbackFollowUp = scenario.followUps[evaluations.length % Math.max(1, scenario.followUps.length)];
    const followUp =
      response.followUp?.trim() || fallbackFollowUp || "Thanks — let's keep the conversation going.";

    const assistantItem: ChatItem = {
      id: uid(),
      role: "assistant",
      content: followUp,
      source: response.source,
      createdAt: new Date().toISOString(),
    };
    const finalMessages = [...nextMessages, assistantItem];
    setMessages(finalMessages);
    setEvaluations((previous) => [
      ...previous,
      {
        id: uid(),
        userText,
        scores,
        coach: response.reply,
        source: response.source,
        correction,
        better,
        followUp,
      },
    ]);

    const existing = conversationId
      ? getSnapshot().conversations.find((conversation) => conversation.id === conversationId)
      : undefined;
    const conversation: Conversation = existing
      ? { ...existing }
      : createConversation(kind, `${scenario.title} · ${kind} practice`);
    conversation.title = `${scenario.title} · ${kind} practice`;
    conversation.updatedAt = new Date().toISOString();
    conversation.messages = finalMessages.map((item) => ({
      id: item.id,
      role: item.role,
      content: item.content,
      createdAt: item.createdAt,
      source: item.source,
    }));
    saveConversation(conversation);
    setConversationId(conversation.id);
  }

  function finishSession() {
    const latest = evaluations[evaluations.length - 1];
    if (!scenario || !latest || sessionSaved) return;
    const score = latest.scores.reduce((sum, item) => sum + item.score, 0);
    const total = latest.scores.length * 10;
    addPracticeSession({
      id: uid(),
      date: new Date().toISOString(),
      mode: "flirting-simulator",
      difficulty: scenario.difficulty,
      score,
      total,
      notes: `${scenario.title} · ${latest.source === "offline" ? OFFLINE_LABEL : "AI assisted"}`,
    });
    setSessionSaved(true);
    toast(`Practice saved: ${score}/${total}.`, "success");
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-pink/30 bg-gradient-to-br from-pink-soft via-surface to-primary-soft">
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-pink text-white">
              <MessageCircle className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="pink">{scenarios.length} realistic situations</Badge>
          <Badge variant="outline">🛡️ Boundaries respected</Badge>
          <Badge variant="outline">💬 Keep practising</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pick a scenario</CardTitle>
          <CardDescription>Each one keeps the conversation going after your reply.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Conversation scenarios">
            {scenarios.map((item) => (
              <ChipButton
                key={item.id}
                active={item.id === scenarioId}
                onClick={() => startScenario(item)}
                title={item.context}
              >
                <span aria-hidden="true">{item.emoji}</span> {item.title}
              </ChipButton>
            ))}
          </div>
        </CardContent>
      </Card>

      {(scenario || viewingSaved) && (
        <Card>
          <CardHeader className="flex-row flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <CardTitle className="break-words">
                {scenario ? `${scenario.emoji} ${scenario.title}` : "Saved conversation"}
              </CardTitle>
              <CardDescription>
                {scenario
                  ? scenarioTip(scenario)
                  : "You are viewing a saved practice chat. Choose a scenario above to keep going."}
              </CardDescription>
            </div>
            <Button type="button" variant="ghost" size="sm" className="min-h-11" onClick={leaveScenario}>
              <RotateCcw className="size-4" aria-hidden="true" /> Leave
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              id={`sim-chat-${kind}`}
              className="chat-scroll max-h-[26rem] min-h-24 space-y-3 overflow-y-auto rounded-2xl border border-border bg-surface-muted/60 p-3"
              aria-label="Practice conversation"
              aria-live="polite"
            >
              {messages.map((item) => (
                <div key={item.id} className={item.role === "user" ? "ml-auto max-w-[92%]" : "mr-auto max-w-[92%]"}>
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      item.role === "user"
                        ? "rounded-br-md bg-pink text-white"
                        : "rounded-bl-md border border-border bg-surface"
                    }`}
                  >
                    <p className="break-words">{item.content}</p>
                  </div>
                  {item.role === "assistant" && item.source && (
                    <div className="mt-1"><SourceBadge source={item.source} /></div>
                  )}
                </div>
              ))}
            </div>

            {scenario ? (
              <div className="space-y-3">
                <label className="block space-y-2">
                  <span className="text-sm font-bold">Your reply</span>
                  <Textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void send();
                      }
                    }}
                    placeholder="Type how you would really reply…"
                    rows={2}
                    maxLength={1200}
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="pink"
                    onClick={() => void send()}
                    disabled={!draft.trim() || loading}
                  >
                    <Send className="size-4" aria-hidden="true" />
                    {loading ? "Thinking…" : "Send reply"}
                  </Button>
                  {variant === "flirting" && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={finishSession}
                      disabled={!evaluations.length || sessionSaved || loading}
                    >
                      <CheckCircle2 className="size-4" aria-hidden="true" />
                      {sessionSaved ? "Score saved" : "Finish & save score"}
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted">Enter sends your reply · Shift + Enter makes a new line.</p>
                {loading && <LoadingNote label="Evaluating your reply and continuing the scene…" />}
                {error && (
                  <ErrorNote
                    message={error}
                    onRetry={lastPayload.current ? () => void send(lastPayload.current ?? undefined) : undefined}
                  />
                )}
              </div>
            ) : (
              <p className="rounded-xl bg-surface-muted p-3 text-sm text-muted">
                This chat is saved on your device. Pick a scenario above to start a new one.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {evaluations.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Sparkles className="size-4 text-pink" aria-hidden="true" />
            <h3 className="text-base font-bold">Coach feedback</h3>
            <Badge variant="outline">{evaluations.length} {evaluations.length === 1 ? "reply" : "replies"}</Badge>
          </div>

          {[...evaluations].reverse().map((record, reverseIndex) => (
            <Card key={record.id} className="border-pink/30">
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="text-base">Reply {evaluations.length - reverseIndex}</CardTitle>
                  <SourceBadge source={record.source} />
                </div>
                <CardDescription className="break-words">“{record.userText}”</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Quick self-check (local, text-based)</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {record.scores.map((item) => (
                      <div key={item.name} className="rounded-xl border border-border p-3">
                        <div className="flex items-center justify-between gap-2 text-xs font-bold">
                          <span>{item.name}</span>
                          <span className="text-pink">{item.score}/10</span>
                        </div>
                        <Progress value={item.score * 10} indicatorClassName="bg-pink" className="mt-2" aria-label={`${item.name}: ${item.score} out of 10`} />
                        <p className="mt-1.5 text-[0.7rem] leading-relaxed text-muted">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <ResultCard title="Coach feedback" text={record.coach} source={record.source} eyebrow="From your reply to the next step" />

                {record.correction && (
                  <Card className="border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Gentle correction</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 [&_button]:min-h-11">
                      <div className="flex items-start gap-2 rounded-xl bg-surface-muted p-3">
                        <p className="min-w-0 flex-1 break-words text-sm">{record.correction.natural}</p>
                        <CopyButton text={record.correction.natural} label="Copy" />
                      </div>
                      <p className="break-words text-xs leading-relaxed text-muted">{record.correction.explanation}</p>
                    </CardContent>
                  </Card>
                )}

                <ResultCard title="A stronger alternative" text={record.better} source="offline" eyebrow="Try saying" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Past {kind} conversations</CardTitle>
          <CardDescription>Saved on this device. Delete any chat whenever you like.</CardDescription>
        </CardHeader>
        <CardContent>
          {saved.length ? (
            <ul className="space-y-2">
              {saved.map((conversation) => (
                <li
                  key={conversation.id}
                  className="flex flex-wrap items-center gap-2 rounded-xl border border-border px-3 py-2.5"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block break-words text-sm font-semibold">{conversation.title}</span>
                    <span className="block text-xs text-muted">
                      {conversation.messages.length} messages · {formatDate(conversation.updatedAt)}
                    </span>
                  </span>
                  <Button type="button" variant="secondary" size="sm" className="min-h-11" onClick={() => viewSaved(conversation)}>
                    View
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    className="min-h-11"
                    onClick={() => removeSaved(conversation.id)}
                    aria-label={`Delete ${conversation.title}`}
                  >
                    <Trash2 className="size-4" aria-hidden="true" /> Delete
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-border-strong p-5 text-center text-sm text-muted">
              No saved {kind} conversations yet. Start a scenario above and your chats will appear here.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
