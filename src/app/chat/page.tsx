"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDown,
  Bot,
  Check,
  Copy,
  Info,
  Languages,
  MessageSquarePlus,
  Send,
  Settings2,
  Sparkles,
  Trash2,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAppContext } from "@/components/providers/AppProviders";
import {
  appendMessage,
  createConversation,
  deleteConversation,
  isHydrated,
  saveConversation,
  uid,
  updateSettings,
  useAppData,
} from "@/lib/storage/store";
import { askAI } from "@/lib/ai/client";
import type { ChatMessage, Correction, CorrectionMode, ExplanationLanguage } from "@/lib/types";
import { cn, formatTime } from "@/lib/utils";

const suggestions = [
  "naku english nerchukovali",
  "em chestunnav",
  "I am go to college",
  "How do I introduce myself at college?",
];

function CorrectionCard({ correction }: { correction: Correction }) {
  const fields: Array<[string, string]> = [
    ["Original sentence", correction.original],
    ["Correct English", correction.correct],
    ["Natural conversation", correction.natural],
    ["Professional version", correction.professional],
    ["Telugu meaning", correction.telugu],
    ["Grammar explanation", correction.explanation],
    ["Practice sentence", correction.practice],
  ];
  return (
    <div className="mt-3 rounded-2xl border border-primary/20 bg-surface p-3.5 text-sm">
      <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
        <Sparkles className="size-3.5" aria-hidden="true" /> Smart correction
      </p>
      <dl className="space-y-2.5">
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[0.7rem] font-bold text-muted">{label}</dt>
            <dd className="mt-0.5 leading-relaxed">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function ChatPage() {
  const data = useAppData();
  const { online, toast } = useAppContext();
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = React.useState<string | null>(null);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);
  const initialized = React.useRef(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (initialized.current || !isHydrated()) return;
    initialized.current = true;
    const last = data.conversations.find((conversation) => conversation.kind === "chat");
    if (last) {
      setConversationId(last.id);
      setMessages(last.messages);
    } else {
      const created = createConversation("chat", "SpeakMate conversation");
      saveConversation(created);
      setConversationId(created.id);
    }
  }, [data.conversations]);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  function newChat() {
    const created = createConversation("chat", "SpeakMate conversation");
    saveConversation(created);
    setConversationId(created.id);
    setMessages([]);
    setInput("");
    setShowHistory(false);
    toast("New conversation started", "success");
  }

  async function send(text: string, forceCorrection = false) {
    const value = text.trim();
    if (!value || loading) return;
    const wantsCorrection = forceCorrection || /\b(correct|fix|grammar|mistake|better sentence)\b/i.test(value);
    const userMessage: ChatMessage = {
      id: uid(),
      role: "user",
      content: value,
      createdAt: new Date().toISOString(),
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    if (conversationId) appendMessage(conversationId, userMessage);

    try {
      const response = await askAI({
        mode: wantsCorrection ? "correct" : "chat",
        userText: value,
        messages: nextMessages.slice(-12).map((message) => ({ role: message.role, content: message.content })),
        correctionMode: data.settings.correctionMode,
        explanationLanguage: data.settings.explanationLanguage,
      });
      const assistant: ChatMessage = {
        id: uid(),
        role: "assistant",
        content: response.reply,
        createdAt: new Date().toISOString(),
        source: response.source,
        teluguMeaning: response.teluguMeaning,
        correction: response.correction,
        followUp: response.followUp,
      };
      setMessages((current) => [...current, assistant]);
      if (conversationId) appendMessage(conversationId, assistant);
    } catch {
      toast("Something went wrong. Please try again.", "warning");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    void send(input);
  }

  const history = data.conversations.filter((conversation) => conversation.kind === "chat");

  return (
    <div>
      <PageHeader
        eyebrow="AI conversation"
        title="Talk to SpeakMate"
        description="Type in English, Roman Telugu or a mix. Mistakes are welcome here — we learn from them together."
        actions={
          <>
            <Dialog open={showHistory} onOpenChange={setShowHistory}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm"><MessageSquarePlus className="size-4" aria-hidden="true" /> History</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Your conversations</DialogTitle>
                  <DialogDescription>Stored on this device only.</DialogDescription>
                </DialogHeader>
                <ul className="max-h-80 space-y-2 overflow-y-auto">
                  {history.length === 0 && <li className="text-sm text-muted">No conversations saved yet.</li>}
                  {history.map((conversation) => (
                    <li key={conversation.id} className="flex items-center gap-2 rounded-xl border border-border p-2.5">
                      <button
                        type="button"
                        className="min-w-0 flex-1 text-left"
                        onClick={() => {
                          setConversationId(conversation.id);
                          setMessages(conversation.messages);
                          setShowHistory(false);
                        }}
                      >
                        <span className="block truncate text-sm font-semibold">{conversation.title}</span>
                        <span className="block text-xs text-muted">{conversation.messages.length} messages</span>
                      </button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${conversation.title}`}
                        onClick={() => {
                          deleteConversation(conversation.id);
                          if (conversation.id === conversationId) newChat();
                          toast("Conversation deleted", "success");
                        }}
                      >
                        <Trash2 className="size-4 text-danger" aria-hidden="true" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </DialogContent>
            </Dialog>
            <Button variant="secondary" size="sm" onClick={newChat}><MessageSquarePlus className="size-4" aria-hidden="true" /> New chat</Button>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_18rem]">
        <Card className="flex h-[max(20rem,calc(100dvh-21rem))] max-h-[46rem] flex-col overflow-hidden lg:h-[min(72dvh,46rem)] lg:min-h-[30rem]">
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-pink text-white">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">SpeakMate AI</p>
                <p className="truncate text-[0.68rem] text-muted">Patient, friendly, always learning with you</p>
              </div>
            </div>
            <Badge variant={online ? "success" : "outline"}>
              {online ? "AI ready" : "Offline practice"}
            </Badge>
          </div>

          <div ref={scrollRef} className="chat-scroll flex-1 space-y-3 overflow-y-auto px-3.5 py-4 sm:px-5" aria-live="polite">
            {messages.length === 0 && (
              <div className="mx-auto max-w-lg py-6 text-center">
                <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <Bot className="size-7" aria-hidden="true" />
                </span>
                <p className="mt-4 text-lg font-bold">Say anything. Really.</p>
                <p className="mt-1 text-sm text-muted">Roman Telugu, simple English, or a little of both — I&apos;ll understand and help you say it better.</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => void send(suggestion)}
                      className="rounded-full border border-border bg-surface px-3 py-2 text-xs font-semibold hover:border-primary/50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
              >
                <div className={cn("max-w-[88%] sm:max-w-[78%]", message.role === "user" ? "text-right" : "")}>
                  <div
                    className={cn(
                      "inline-block rounded-2xl px-4 py-2.5 text-left text-sm leading-relaxed",
                      message.role === "user"
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md bg-surface-muted",
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.teluguMeaning && (
                      <p className="mt-2 border-t border-border/60 pt-2 text-xs opacity-80" lang="te">{message.teluguMeaning}</p>
                    )}
                  </div>
                  <div className={cn("mt-1 flex flex-wrap items-center gap-2 px-1 text-[0.65rem] text-muted", message.role === "user" ? "justify-end" : "")}>
                    <span>{formatTime(message.createdAt)}</span>
                    {message.source === "offline" && (
                      <span className="rounded-full bg-surface-muted px-1.5 py-0.5 font-bold">Offline practice</span>
                    )}
                    {message.source === "ai" && (
                      <span className="inline-flex items-center gap-0.5 font-bold text-success"><Check className="size-2.5" aria-hidden="true" /> AI</span>
                    )}
                    <button
                      type="button"
                      onClick={() => void navigator.clipboard.writeText(message.content).then(() => toast("Copied", "success")).catch(() => undefined)}
                      className="inline-flex items-center gap-1 hover:text-foreground"
                      aria-label="Copy message"
                    >
                      <Copy className="size-2.5" aria-hidden="true" /> Copy
                    </button>
                    {message.role === "user" && (
                      <button type="button" onClick={() => void send(message.content, true)} className="hover:text-foreground" aria-label="Correct this message">
                        Correct this
                      </button>
                    )}
                  </div>
                  {message.correction && <CorrectionCard correction={message.correction} />}
                  {message.followUp && (
                    <button
                      type="button"
                      onClick={() => void send(message.followUp!)}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary hover:brightness-95 dark:text-foreground"
                    >
                      <Sparkles className="size-3" aria-hidden="true" /> {message.followUp}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-surface-muted px-4 py-3" role="status" aria-label="SpeakMate is replying">
                  <span className="flex gap-1">
                    <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                    <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                    <span className="size-2 animate-bounce rounded-full bg-primary" />
                  </span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-border bg-surface p-3">
            <div className="flex items-end gap-2">
              <label htmlFor="chat-input" className="sr-only">Your message</label>
              <Textarea
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    void send(input);
                  }
                }}
                placeholder="Type in English or Roman Telugu…"
                rows={1}
                maxLength={2000}
                className="max-h-32 min-h-12 flex-1 resize-none py-3"
                enterKeyHint="send"
              />
              <Button type="submit" size="icon" disabled={!input.trim() || loading} aria-label="Send message">
                <Send className="size-5" aria-hidden="true" />
              </Button>
            </div>
            <p className="mt-2 px-1 text-[0.65rem] text-muted">
              Enter to send · Shift+Enter for a new line · Mistakes help you learn
            </p>
          </form>
        </Card>

        <aside className="space-y-4">
          <Card className="p-4">
            <p className="flex items-center gap-2 text-sm font-bold"><Settings2 className="size-4 text-primary" aria-hidden="true" /> Chat preferences</p>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="correction-mode" className="text-xs font-semibold text-muted">Correction style</label>
                <Select
                  value={data.settings.correctionMode}
                  onValueChange={(value) => updateSettings({ correctionMode: value as CorrectionMode })}
                >
                  <SelectTrigger id="correction-mode" className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="always">Correct every message</SelectItem>
                    <SelectItem value="request">Only when I ask</SelectItem>
                    <SelectItem value="casual">Casual — no interruptions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="explain-language" className="text-xs font-semibold text-muted">Explanation language</label>
                <Select
                  value={data.settings.explanationLanguage}
                  onValueChange={(value) => updateSettings({ explanationLanguage: value as ExplanationLanguage })}
                >
                  <SelectTrigger id="explain-language" className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">Simple English</SelectItem>
                    <SelectItem value="te">Telugu explanations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <p className="flex items-center gap-2 text-sm font-bold">
              {online ? <Sparkles className="size-4 text-success" aria-hidden="true" /> : <WifiOff className="size-4 text-muted" aria-hidden="true" />}
              {online ? "Online AI mode" : "Offline practice mode"}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              {online
                ? "When online, your message is sent to the configured AI provider so it can understand context and reply naturally. You can turn this off in Settings."
                : "No internet or AI provider right now. Replies come from a small local rule engine and are clearly labelled — they are not genuine AI responses. Typing, grammar and vocabulary still work offline."}
            </p>
            <Button asChild variant="link" size="sm" className="mt-2 px-0"><Link href="/settings">Manage privacy <ArrowDown className="size-3 rotate-[-90deg]" aria-hidden="true" /></Link></Button>
          </Card>

          <Card className="p-4">
            <p className="flex items-center gap-2 text-sm font-bold"><Languages className="size-4 text-primary" aria-hidden="true" /> Try these</p>
            <ul className="mt-3 space-y-2 text-xs text-muted">
              <li>“naku english nerchukovali” → I want to learn English.</li>
              <li>“ela vunna” → How are you?</li>
              <li>“I am go to college” → I am going to college.</li>
            </ul>
            <Button asChild variant="ghost" size="sm" className="mt-3 px-0"><Link href="/telugu-english">Open Telugu → English <Info className="size-3.5" aria-hidden="true" /></Link></Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}
