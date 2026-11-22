"use client";

import * as React from "react";
import {
  Bot,
  Database,
  Eye,
  Keyboard,
  Moon,
  ShieldCheck,
  Sun,
  Trash2,
  Volume2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAppContext } from "@/components/providers/AppProviders";
import {
  clearConversations,
  deleteConversation,
  resetData,
  updatePrivacy,
  updateSettings,
  useAppData,
} from "@/lib/storage/store";
import type { AIProvider, CorrectionMode, Difficulty, ExplanationLanguage, ThemePreference } from "@/lib/types";

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">{description}</p>
      </div>
      <div className="shrink-0 sm:w-56">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const data = useAppData();
  const { online, toast } = useAppContext();
  const { settings } = data;

  return (
    <div>
      <PageHeader
        eyebrow="Make it yours"
        title="Settings"
        description="Choose how SpeakMate explains things, when it uses AI, and what stays on your device."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sun className="size-5 text-primary" aria-hidden="true" /> Appearance & learning</CardTitle>
            <CardDescription>The basics that shape your daily practice.</CardDescription>
          </CardHeader>
          <CardContent>
            <SettingRow title="Theme" description="Follow your system or pick light / dark.">
              <Select value={settings.theme} onValueChange={(value) => updateSettings({ theme: value as ThemePreference })}>
                <SelectTrigger aria-label="Theme"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="system"><span className="inline-flex items-center gap-2"><Moon className="size-3.5" aria-hidden="true" /> System</span></SelectItem>
                  <SelectItem value="light"><span className="inline-flex items-center gap-2"><Sun className="size-3.5" aria-hidden="true" /> Light</span></SelectItem>
                  <SelectItem value="dark"><span className="inline-flex items-center gap-2"><Moon className="size-3.5" aria-hidden="true" /> Dark</span></SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <SettingRow title="Explanation language" description="How grammar notes and meanings are explained.">
              <Select value={settings.explanationLanguage} onValueChange={(value) => updateSettings({ explanationLanguage: value as ExplanationLanguage })}>
                <SelectTrigger aria-label="Explanation language"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">Simple English</SelectItem>
                  <SelectItem value="te">Telugu explanations</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <SettingRow title="AI correction style" description="Correct everything, only on request, or keep chatting freely.">
              <Select value={settings.correctionMode} onValueChange={(value) => updateSettings({ correctionMode: value as CorrectionMode })}>
                <SelectTrigger aria-label="AI correction style"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="always">Correct every message</SelectItem>
                  <SelectItem value="request">Only when requested</SelectItem>
                  <SelectItem value="casual">Casual conversation</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <SettingRow title="Learning difficulty" description="Used by roleplay scenarios and recommended activities.">
              <Select value={settings.difficulty} onValueChange={(value) => updateSettings({ difficulty: value as Difficulty })}>
                <SelectTrigger aria-label="Learning difficulty"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <SettingRow title="Daily learning goal" description="Minutes of practice you aim for each day (5–180).">
              <div className="flex items-center gap-2">
                <label htmlFor="daily-goal" className="sr-only">Daily learning goal in minutes</label>
                <Input
                  id="daily-goal"
                  type="number"
                  min={5}
                  max={180}
                  value={settings.dailyGoalMinutes}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    if (Number.isFinite(value)) updateSettings({ dailyGoalMinutes: Math.min(180, Math.max(5, value)) });
                  }}
                  inputMode="numeric"
                />
                <span className="text-xs text-muted">min</span>
              </div>
            </SettingRow>
            <SettingRow title="Sound feedback" description="Soft tones for typing hits and quiz answers.">
              <Switch checked={settings.soundEnabled} onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })} aria-label="Sound feedback" />
            </SettingRow>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot className="size-5 text-primary" aria-hidden="true" /> AI & connectivity</CardTitle>
            <CardDescription>Online features are optional. Core learning always works offline.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center justify-between rounded-xl bg-surface-muted p-3">
              <div className="flex items-center gap-2 text-sm font-bold">
                {online ? <Wifi className="size-4 text-success" aria-hidden="true" /> : <WifiOff className="size-4 text-muted" aria-hidden="true" />}
                {online ? "Online AI available" : "Offline mode"}
              </div>
              <Badge variant={online ? "success" : "outline"}>{online ? "Connected" : "Local only"}</Badge>
            </div>
            <SettingRow title="Force offline mode" description="Never send messages to an AI provider, even with internet.">
              <Switch checked={settings.forceOffline} onCheckedChange={(checked) => updateSettings({ forceOffline: checked })} aria-label="Force offline mode" />
            </SettingRow>
            <SettingRow title="Allow online AI processing" description="When enabled, messages you send to AI features are sent to your configured provider.">
              <Switch
                checked={settings.privacy.allowOnlineProcessing}
                onCheckedChange={(checked) => updatePrivacy({ allowOnlineProcessing: checked })}
                aria-label="Allow online AI processing"
              />
            </SettingRow>
            <SettingRow title="AI provider" description="Server-side provider configured by your administrator.">
              <Select value={settings.aiProvider} onValueChange={(value) => updateSettings({ aiProvider: value as AIProvider })}>
                <SelectTrigger aria-label="AI provider"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Server default</SelectItem>
                  <SelectItem value="openai-compatible">OpenAI-compatible API</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <SettingRow title="AI model" description="Model name sent to the provider (keys stay on the server).">
              <Input value={settings.aiModel} onChange={(event) => updateSettings({ aiModel: event.target.value })} aria-label="AI model" maxLength={100} />
            </SettingRow>
            <SettingRow title="API base URL" description="OpenAI-compatible endpoint. No key is stored here.">
              <Input value={settings.aiBaseUrl} onChange={(event) => updateSettings({ aiBaseUrl: event.target.value })} aria-label="API base URL" inputMode="url" maxLength={200} />
            </SettingRow>
            <p className="mt-2 rounded-xl border border-border bg-surface-muted p-3 text-xs leading-relaxed text-muted">
              <ShieldCheck className="mr-1.5 inline size-3.5 align-[-2px] text-primary" aria-hidden="true" />
              API keys are read only from server environment variables (<code>AI_API_KEY</code>) and are never exposed to the browser.
              When AI is unreachable, SpeakMate uses a local rule engine and labels it as offline practice.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Database className="size-5 text-primary" aria-hidden="true" /> Conversation history</CardTitle>
            <CardDescription>Everything is stored locally on this device.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{data.conversations.length} saved conversations</p>
            <ul className="mt-3 max-h-56 space-y-2 overflow-y-auto">
              {data.conversations.length === 0 && <li className="text-xs text-muted">Nothing saved yet.</li>}
              {data.conversations.map((conversation) => (
                <li key={conversation.id} className="flex items-center gap-2 rounded-xl border border-border px-3 py-2">
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold">{conversation.title}</span>
                  <Badge variant="outline">{conversation.kind}</Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${conversation.title}`}
                    onClick={() => {
                      deleteConversation(conversation.id);
                      toast("Conversation deleted", "success");
                    }}
                  >
                    <Trash2 className="size-3.5 text-danger" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="danger" size="sm" className="mt-4" disabled={!data.conversations.length}>
                  <Trash2 className="size-4" aria-hidden="true" /> Delete all conversations
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete all conversations?</DialogTitle>
                  <DialogDescription>This removes every saved chat on this device. Your typing, quizzes and vocabulary progress are kept.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => undefined}>Cancel</Button>
                  <DialogTrigger asChild>
                    <Button variant="danger" onClick={() => { clearConversations(); toast("All conversations deleted", "success"); }}>Delete conversations</Button>
                  </DialogTrigger>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" aria-hidden="true" /> Privacy & data</CardTitle>
            <CardDescription>No account, no mandatory database, no unnecessary personal data.</CardDescription>
          </CardHeader>
          <CardContent>
            <SettingRow title="Save conversations locally" description="If off, chats are not written to device storage.">
              <Switch
                checked={settings.privacy.saveConversations}
                onCheckedChange={(checked) => updatePrivacy({ saveConversations: checked })}
                aria-label="Save conversations locally"
              />
            </SettingRow>
            <SettingRow title="Personalised recommendations" description="Use your practice history to suggest the next activity.">
              <Switch
                checked={settings.privacy.personalizedTips}
                onCheckedChange={(checked) => updatePrivacy({ personalizedTips: checked })}
                aria-label="Personalised recommendations"
              />
            </SettingRow>
            <div className="mt-4 rounded-xl bg-surface-muted p-3 text-xs leading-relaxed text-muted">
              <Eye className="mr-1.5 inline size-3.5 align-[-2px] text-primary" aria-hidden="true" />
              Typing results, quiz scores, saved words and conversations live in your browser&apos;s localStorage and IndexedDB.
              Clearing site data removes them. Online AI messages are sent only when online processing is enabled.
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="danger" className="mt-4"><Trash2 className="size-4" aria-hidden="true" /> Reset all app data</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset everything?</DialogTitle>
                  <DialogDescription>This permanently deletes all progress, conversations, saved words and settings from this device. This cannot be undone.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => undefined}>Cancel</Button>
                  <DialogTrigger asChild>
                    <Button variant="danger" onClick={() => { resetData(); toast("App data reset", "success"); }}>Yes, reset everything</Button>
                  </DialogTrigger>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Keyboard className="size-5 text-primary" aria-hidden="true" /> Offline learning</CardTitle>
            <CardDescription>These features keep working without internet.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 text-sm sm:grid-cols-2">
              {["Typing practice", "Saved grammar lessons", "Vocabulary & quizzes", "Local phrase library", "Basic rule-based corrections", "Local progress analytics"].map((item) => (
                <li key={item} className="rounded-xl bg-surface-muted px-3 py-2 text-xs font-semibold">{item}</li>
              ))}
            </ul>
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-border p-3 text-xs text-muted">
              <Volume2 className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              Install SpeakMate from your browser menu to use it like an app. Pages are cached by the service worker.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
