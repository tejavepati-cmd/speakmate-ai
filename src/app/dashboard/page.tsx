"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenCheck,
  Bot,
  BriefcaseBusiness,
  Clock3,
  Flame,
  Keyboard,
  MessageSquare,
  Play,
  Sparkles,
  Target,
  TrendingUp,
  VenusAndMars,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { useAppData } from "@/lib/storage/store";
import {
  dailyGoalMinutes,
  grammarPerformance,
  recentConversations,
  recommendedActivity,
  totalPracticeMinutes,
  typingStats,
  weeklyActivity,
} from "@/lib/storage/selectors";
import { cn } from "@/lib/utils";

const quickActions = [
  { href: "/chat", label: "Talk to SpeakMate", icon: Bot, tone: "purple" as const },
  { href: "/typing", label: "Start Typing", icon: Keyboard, tone: "purple" as const },
  { href: "/professional", label: "Practise Professional English", icon: BriefcaseBusiness, tone: "purple" as const },
  { href: "/girltalk", label: "Open GirlTalk Coach", icon: VenusAndMars, tone: "pink" as const },
];

export default function DashboardPage() {
  const data = useAppData();
  const typing = typingStats(data);
  const grammar = grammarPerformance(data);
  const goal = data.settings.dailyGoalMinutes;
  const todayMinutes = dailyGoalMinutes(data);
  const goalPercent = Math.min(100, Math.round((todayMinutes / Math.max(1, goal)) * 100));
  const recommendation = recommendedActivity(data);
  const recent = recentConversations(data, 4);
  const week = weeklyActivity(data, 1);
  const totalMinutes = totalPracticeMinutes(data);

  return (
    <div>
      <PageHeader
        eyebrow="Your learning home"
        title="Good to see you again!"
        description="Every small session adds up. Here is what your practice has built so far."
        actions={
          <Button asChild>
            <Link href={recommendation.href}>
              Continue Learning <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Daily learning goal" value={`${Math.round(todayMinutes)}/${goal} min`} hint={`${goalPercent}% of today's goal`} icon={Target} />
        <StatCard label="Total practice time" value={`${totalMinutes} min`} hint="From recorded sessions" icon={Clock3} tone="blue" />
        <StatCard label="Typing speed" value={`${typing.averageWpm} WPM`} hint={typing.bestWpm ? `Personal best ${typing.bestWpm} WPM` : "No tests yet"} icon={TrendingUp} />
        <StatCard label="Typing accuracy" value={`${typing.averageAccuracy}%`} hint={`${typing.sessions} completed tests`} icon={Keyboard} tone="green" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Learning streak" value={`${data.streak} ${data.streak === 1 ? "day" : "days"}`} hint="Practise daily to keep it alive" icon={Flame} tone="pink" />
        <StatCard label="Vocabulary learned" value={data.learnedWords.length} hint={`${data.savedWords.length} saved for revision`} icon={Sparkles} tone="green" />
        <StatCard label="Grammar performance" value={grammar.attempts ? `${grammar.averageScore}%` : "—"} hint={grammar.attempts ? `${grammar.attempts} quiz attempts` : "Take your first quiz"} icon={BookOpenCheck} />
        <StatCard label="Completed lessons" value={data.completedLessons.length} hint="Across grammar and skills" icon={Target} tone="blue" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>This week&apos;s practice</CardTitle>
              <CardDescription>Minutes logged per day from real activity</CardDescription>
            </div>
            <Badge variant="outline">7 days</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full sm:h-64" role="img" aria-label="Bar chart of practice minutes this week">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={week} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashboardMinutes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--surface-raised)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      color: "var(--foreground)",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value} min`, "Practice"]}
                  />
                  <Area type="monotone" dataKey="minutes" stroke="var(--primary)" strokeWidth={2.5} fill="url(#dashboardMinutes)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="sr-only">
              <table>
                <caption>Practice minutes this week</caption>
                <thead><tr><th scope="col">Day</th><th scope="col">Minutes</th></tr></thead>
                <tbody>
                  {week.map((day) => <tr key={day.date}><th scope="row">{day.label}</th><td>{day.minutes}</td></tr>)}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-primary-soft to-pink-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-primary" aria-hidden="true" />
                <CardTitle>Recommended next</CardTitle>
              </div>
              <CardDescription>Picked from what you have practised least</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold">{recommendation.title}</p>
              <p className="mt-1 text-sm text-muted">{recommendation.description}</p>
              <Button asChild className="mt-4" size="sm">
                <Link href={recommendation.href}>Start now <Play className="size-3.5" aria-hidden="true" /></Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily goal</CardTitle>
              <CardDescription>Your target: {goal} minutes a day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-3">
                <p className="text-3xl font-extrabold">{goalPercent}%</p>
                <p className="text-sm text-muted">{Math.round(todayMinutes)} of {goal} min</p>
              </div>
              <Progress value={goalPercent} className="mt-3" />
              <p className="mt-3 text-xs text-muted">
                {goalPercent >= 100 ? "Goal complete — brilliant consistency! 🎉" : "Typing tests, lessons and conversations all count."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Jump straight into practice</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2.5 sm:grid-cols-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div key={action.href} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <Link
                    href={action.href}
                    className={cn(
                      "flex min-h-16 items-center gap-3 rounded-2xl border border-border p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-md",
                      action.tone === "pink" ? "hover:border-pink/50" : "hover:border-primary/50",
                    )}
                  >
                    <span className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl",
                      action.tone === "pink" ? "bg-pink-soft text-pink" : "bg-primary-soft text-primary dark:text-foreground",
                    )}>
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-bold leading-tight">{action.label}</span>
                    <ArrowRight className="size-4 shrink-0 text-muted" aria-hidden="true" />
                  </Link>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Recent conversations</CardTitle>
              <CardDescription>Your last practice chats</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm"><Link href="/chat">Open chat</Link></Button>
          </CardHeader>
          <CardContent>
            {recent.length ? (
              <ul className="space-y-2">
                {recent.map((conversation) => (
                  <li key={conversation.id} className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5">
                    <MessageSquare className="size-4 shrink-0 text-primary" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{conversation.title}</p>
                      <p className="text-xs text-muted">{conversation.messages.length} messages · {conversation.kind}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0">{conversation.kind}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl border border-dashed border-border-strong p-6 text-center">
                <Bot className="mx-auto size-7 text-muted" aria-hidden="true" />
                <p className="mt-2 text-sm font-semibold">No conversations yet</p>
                <p className="mt-1 text-xs text-muted">Say “naku english nerchukovali” to start.</p>
                <Button asChild size="sm" className="mt-4"><Link href="/chat">Talk to SpeakMate</Link></Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
