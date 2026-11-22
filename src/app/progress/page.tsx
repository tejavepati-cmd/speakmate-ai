"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Clock3,
  Keyboard,
  MessageCircle,
  Sparkles,
  Target,
  Trophy,
  VenusAndMars,
} from "lucide-react";
import type { ConversationKind } from "@/lib/types";
import {
  grammarPerformance,
  monthlyActivity,
  recentConversations,
  totalPracticeMinutes,
  typingStats,
  weeklyActivity,
} from "@/lib/storage/selectors";
import { useAppData } from "@/lib/storage/store";
import { cn, formatDate, formatDuration } from "@/lib/utils";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChartDataTable,
  MonthlyWpmChart,
  WeeklyMinutesChart,
} from "@/components/dashboard/charts";

const conversationKindLabels: Record<ConversationKind, string> = {
  chat: "Chat",
  professional: "Professional",
  girltalk: "GirlTalk",
  flirting: "Flirting",
  practice: "Roleplay",
  emotion: "Emotion",
};

function EmptySection({ title, description, href, linkLabel }: {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border p-5">
      <p className="font-bold">{title}</p>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <Button asChild variant="link" size="sm" className="mt-2 px-0">
        <Link href={href}>{linkLabel} <ArrowRight className="size-3.5" aria-hidden="true" /></Link>
      </Button>
    </div>
  );
}

export default function ProgressPage() {
  const data = useAppData();

  const stats = typingStats(data);
  const practiceMinutes = totalPracticeMinutes(data);
  const grammar = grammarPerformance(data);
  const conversations = recentConversations(data, 5);
  const weekly = weeklyActivity(data);
  const monthly = monthlyActivity(data);

  const hasAnyData =
    data.typingResults.length > 0 ||
    data.quizResults.length > 0 ||
    data.conversations.length > 0 ||
    data.practiceSessions.length > 0 ||
    data.learnedWords.length > 0 ||
    Object.keys(data.dailyActivity).length > 0;

  const professionalCount =
    data.quizResults.filter((item) => item.kind === "professional").length +
    data.conversations.filter((item) => item.kind === "professional").length;
  const girltalkCount =
    data.quizResults.filter((item) => item.kind === "girltalk" || item.kind === "flirting").length +
    data.conversations.filter((item) => item.kind === "girltalk" || item.kind === "flirting").length;
  const practiceCount =
    data.practiceSessions.length +
    data.quizResults.filter((item) => item.kind === "practice").length +
    data.conversations.filter((item) => item.kind === "practice").length;
  const trackTotal = professionalCount + girltalkCount + practiceCount;

  const tracks = [
    { label: "Professional English", count: professionalCount, icon: BriefcaseBusiness, pink: false },
    { label: "GirlTalk & flirting", count: girltalkCount, icon: VenusAndMars, pink: true },
    { label: "Roleplay practice", count: practiceCount, icon: Sparkles, pink: false },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Your journey"
        title="Progress"
        icon={BarChart3}
        description="Every figure below comes from activity saved on this device. No sample data, no guesses — just your own practice."
        actions={
          <Badge variant={hasAnyData ? "success" : "outline"}>
            {hasAnyData ? `${data.streak} day streak` : "No data yet"}
          </Badge>
        }
      />

      {!hasAnyData && (
        <Card className="mb-5 border-dashed bg-primary-soft/40 p-4 md:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold">Nothing tracked yet</p>
              <p className="mt-1 max-w-2xl text-sm text-muted">
                Finish a typing test, grammar quiz or conversation and your charts fill in automatically. Your data stays
                private on this device.
              </p>
            </div>
            <Button asChild size="sm" className="shrink-0">
              <Link href="/typing">Start a typing test</Link>
            </Button>
          </div>
        </Card>
      )}

      <section aria-labelledby="progress-stats-title">
        <h2 id="progress-stats-title" className="sr-only">Practice statistics</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Average WPM" value={stats.averageWpm} icon={Keyboard} hint={`${stats.sessions} typing tests`} />
          <StatCard label="Best WPM" value={stats.bestWpm} icon={Trophy} tone="green" hint="Your fastest test" />
          <StatCard label="Average accuracy" value={`${stats.averageAccuracy}%`} icon={Target} tone="blue" hint="Across all tests" />
          <StatCard label="Total practice" value={`${practiceMinutes} min`} icon={Clock3} hint={formatDuration(practiceMinutes * 60)} />
          <StatCard
            label="Vocabulary learned"
            value={data.learnedWords.length}
            icon={Sparkles}
            tone="green"
            hint={`${data.savedWords.length} words saved for later`}
          />
          <StatCard
            label="Grammar quiz scores"
            value={grammar.attempts ? `${grammar.averageScore}%` : "—"}
            icon={BookOpen}
            tone="blue"
            hint={`${grammar.attempts} quiz attempt${grammar.attempts === 1 ? "" : "s"}`}
          />
          <StatCard
            label="Conversation practice"
            value={data.conversations.length}
            icon={MessageCircle}
            hint="Sessions saved on this device"
          />
          <StatCard
            label="Characters typed"
            value={stats.totalCharacters}
            icon={Keyboard}
            hint={formatDuration(stats.totalTypedSeconds)}
          />
        </div>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-2" aria-label="Activity charts">
        <Card className="p-4 md:p-5">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-bold">Daily practice minutes</h3>
              <p className="text-xs text-muted">All activity recorded over the last 7 days.</p>
            </div>
            <Badge variant="outline">Last 7 days</Badge>
          </div>
          <WeeklyMinutesChart data={weekly} />
          <ChartDataTable
            caption="Practice minutes and sessions for each of the last seven days"
            columns={[
              { key: "label", label: "Day" },
              { key: "minutes", label: "Minutes" },
              { key: "sessions", label: "Sessions" },
              { key: "wpm", label: "Average WPM" },
            ]}
            rows={weekly.map((point) => ({
              label: point.label,
              minutes: point.minutes,
              sessions: point.sessions,
              wpm: point.wpm,
            }))}
          />
        </Card>

        <Card className="p-4 md:p-5">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-bold">Typing speed trend</h3>
              <p className="text-xs text-muted">Average WPM from typing tests in the last 30 days.</p>
            </div>
            <Badge variant="outline">Last 30 days</Badge>
          </div>
          <MonthlyWpmChart data={monthly} />
          <ChartDataTable
            caption="Average typing speed in WPM and practice minutes for each of the last thirty days"
            columns={[
              { key: "label", label: "Date" },
              { key: "wpm", label: "Average WPM" },
              { key: "minutes", label: "Minutes" },
            ]}
            rows={monthly.map((point) => ({
              label: point.label,
              wpm: point.wpm,
              minutes: point.minutes,
            }))}
          />
        </Card>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-3" aria-labelledby="tracks-title">
        <div className="lg:col-span-3">
          <h2 id="tracks-title" className="text-lg font-bold">Skill paths</h2>
          <p className="text-xs text-muted">
            Share of your saved professional, GirlTalk and roleplay activities. Percentages are relative to your own
            activity only.
          </p>
        </div>
        {trackTotal === 0 ? (
          <div className="lg:col-span-3">
            <EmptySection
              title="No skill-path activity yet"
              description="Quizzes, conversations and roleplays in these areas will appear here as you complete them."
              href="/professional"
              linkLabel="Try professional English"
            />
          </div>
        ) : (
          tracks.map((track) => {
            const Icon = track.icon;
            const share = Math.round((track.count / trackTotal) * 100);
            return (
              <Card key={track.label} className="p-4 md:p-5">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl",
                      track.pink ? "bg-pink-soft text-pink" : "bg-primary-soft text-primary dark:text-foreground",
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{track.label}</p>
                    <p className="text-xs text-muted">{track.count} of {trackTotal} activities</p>
                  </div>
                </div>
                <Progress
                  value={share}
                  className="mt-4"
                  indicatorClassName={track.pink ? "bg-pink" : "bg-primary"}
                />
                <p className="mt-2 text-xs font-semibold text-muted">{share}% of your tracked practice</p>
              </Card>
            );
          })
        )}
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-2" aria-label="Quiz and conversation history">
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="size-5 text-primary" aria-hidden="true" />
                Grammar quiz scores
              </CardTitle>
              <CardDescription>Your most recent grammar attempts, exactly as scored.</CardDescription>
            </div>
            {grammar.attempts > 0 && <Badge variant="outline">{grammar.attempts} attempts</Badge>}
          </CardHeader>
          <CardContent>
            {grammar.results.length === 0 ? (
              <EmptySection
                title="No grammar quizzes yet"
                description="Complete a grammar lesson quiz to see your scores here."
                href="/grammar"
                linkLabel="Go to grammar coach"
              />
            ) : (
              <ul className="divide-y divide-border">
                {grammar.results.map((item) => {
                  const percent = Math.round((item.score / item.total) * 100);
                  return (
                    <li key={item.id} className="flex items-center justify-between gap-3 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{item.title}</p>
                        <p className="text-xs text-muted">{formatDate(item.date)}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge variant={percent >= 80 ? "success" : "outline"}>{percent}%</Badge>
                        <span className="text-xs tabular-nums text-muted">{item.score}/{item.total}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="size-5 text-primary" aria-hidden="true" />
                Conversation practice
              </CardTitle>
              <CardDescription>Your five most recently updated conversations.</CardDescription>
            </div>
            {data.conversations.length > 0 && <Badge variant="outline">{data.conversations.length} saved</Badge>}
          </CardHeader>
          <CardContent>
            {conversations.length === 0 ? (
              <EmptySection
                title="No conversations yet"
                description="Chat with SpeakMate and your practice sessions will be listed here."
                href="/chat"
                linkLabel="Start a conversation"
              />
            ) : (
              <ul className="space-y-2">
                {conversations.map((item) => {
                  const isPink = item.kind === "girltalk" || item.kind === "flirting";
                  return (
                    <li key={item.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-xl",
                          isPink ? "bg-pink-soft text-pink" : "bg-primary-soft text-primary dark:text-foreground",
                        )}
                      >
                        <MessageCircle className="size-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{item.title}</p>
                        <p className="text-xs text-muted">
                          {item.messages.length} message{item.messages.length === 1 ? "" : "s"} · {formatDate(item.updatedAt)}
                        </p>
                      </div>
                      <Badge variant={isPink ? "pink" : "outline"}>{conversationKindLabels[item.kind]}</Badge>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
