"use client";

import Link from "next/link";
import { ArrowRight, Heart, MessageCircleHeart, MessagesSquare, School, ShieldCheck, VenusAndMars } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConversationStarter } from "@/components/girltalk/ConversationStarter";
import { EmotionPanel } from "@/components/girltalk/EmotionPanel";
import { QuizLesson } from "@/components/girltalk/QuizLesson";
import { SimulatorPanel } from "@/components/girltalk/SimulatorPanel";
import { ToneReplyPanel, type ToneFallback } from "@/components/girltalk/ToneReplyPanel";
import { scenarios, practiceLessons } from "@/data/girltalk";

const girlTalkTones = ["Friendly", "Caring", "Casual", "Confident"] as const;

const girlTalkFallbacks: Record<string, ToneFallback> = {
  Friendly: {
    text: "That sounds interesting — tell me more!",
    why: "Invites them to share without any pressure.",
  },
  Caring: {
    text: "How are you feeling about it? I'm here to listen.",
    why: "Notices feelings and offers gentle support.",
  },
  Casual: {
    text: "Nice! What happened next?",
    why: "Keeps the chat light and moving naturally.",
  },
  Confident: {
    text: "I'd love to hear your take on this.",
    why: "Shows real interest while respecting their view.",
  },
};

const modules = [
  {
    href: "/girltalk",
    icon: MessagesSquare,
    title: "Conversation Coach",
    text: "Openers, smart replies, feelings and realistic practice.",
    current: true,
  },
  {
    href: "/girltalk/flirting",
    icon: Heart,
    title: "Flirting Coach ❤️",
    text: "Playful, respectful flirting with boundaries first.",
    current: false,
  },
];

export default function GirlTalkPage() {
  return (
    <div className="min-w-0">
      <PageHeader
        eyebrow="Social confidence"
        title="GirlTalk Coach"
        description="Start conversations, reply with warmth, understand possible feelings and practise real situations — without pretending to know what someone else feels."
        icon={VenusAndMars}
        accent="pink"
        actions={
          <Button asChild variant="pink">
            <Link href="/girltalk/flirting">
              Flirting Coach <Heart className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      <Card className="mb-5 overflow-hidden border-pink/30 bg-gradient-to-br from-pink-soft via-surface to-primary-soft">
        <CardHeader className="pb-3">
          <CardTitle>Your GirlTalk modules</CardTitle>
          <CardDescription>Two friendly spaces, one shared rule: respect first.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.href}
                href={module.href}
                aria-current={module.current ? "page" : undefined}
                className="flex min-h-16 items-center gap-3 rounded-2xl border border-border bg-surface/80 p-3 transition-colors hover:border-pink/50"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-pink-soft text-pink">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block break-words text-sm font-bold">{module.title}</span>
                  <span className="block break-words text-xs text-muted">{module.text}</span>
                </span>
                {module.current ? (
                  <ShieldCheck className="size-4 shrink-0 text-pink" aria-hidden="true" />
                ) : (
                  <ArrowRight className="size-4 shrink-0 text-muted" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </CardContent>
      </Card>

      <Tabs defaultValue="starters" className="w-full min-w-0">
        <TabsList className="min-h-11" aria-label="GirlTalk tools">
          <TabsTrigger value="starters" className="min-h-11 text-xs sm:text-sm data-[state=active]:bg-pink-soft data-[state=active]:text-pink">👋 Openers</TabsTrigger>
          <TabsTrigger value="replies" className="min-h-11 text-xs sm:text-sm data-[state=active]:bg-pink-soft data-[state=active]:text-pink">💬 Smart replies</TabsTrigger>
          <TabsTrigger value="emotion" className="min-h-11 text-xs sm:text-sm data-[state=active]:bg-pink-soft data-[state=active]:text-pink">🫶 Her feelings</TabsTrigger>
          <TabsTrigger value="simulator" className="min-h-11 text-xs sm:text-sm data-[state=active]:bg-pink-soft data-[state=active]:text-pink">🎭 Simulator</TabsTrigger>
          <TabsTrigger value="practice" className="min-h-11 text-xs sm:text-sm data-[state=active]:bg-pink-soft data-[state=active]:text-pink">📚 Practice</TabsTrigger>
        </TabsList>

        <TabsContent value="starters" className="min-w-0">
          <ConversationStarter />
        </TabsContent>

        <TabsContent value="replies" className="min-w-0">
          <ToneReplyPanel
            title="Smart Reply Assistant"
            description="Paste a message and compare four respectful ways to answer it."
            placeholder="e.g. ‘I don't know anyone at this event yet.’"
            aiContext="GirlTalk: respectful social conversation"
            tones={girlTalkTones}
            fallback={girlTalkFallbacks}
            generateLabel="Generate replies"
          />
        </TabsContent>

        <TabsContent value="emotion" className="min-w-0">
          <EmotionPanel />
        </TabsContent>

        <TabsContent value="simulator" className="min-w-0">
          <SimulatorPanel
            kind="girltalk"
            scenarios={scenarios}
            variant="social"
            aiContext="GirlTalk: respectful social conversation simulator"
            title="Conversation Simulator"
            description="Try a situation, send your reply and see a gentle evaluation across seven social skills."
          />
        </TabsContent>

        <TabsContent value="practice" className="min-w-0">
          <QuizLesson
            lessons={practiceLessons}
            kind="girltalk"
            title="Situational Practice"
            description="Ten short lessons with tips, example dialogue and a self-check that saves your real score."
          />
        </TabsContent>
      </Tabs>

      <Card className="mt-6 border-pink/30 bg-pink-soft/50">
        <CardContent className="flex flex-wrap items-center gap-2 pt-5 text-sm leading-relaxed">
          <MessageCircleHeart className="size-4 shrink-0 text-pink" aria-hidden="true" />
          <span className="min-w-0 flex-1 break-words">
            <span className="font-bold">A quiet reminder:</span> one line of text never tells the whole story.
            Ask, listen and give people room to be themselves.
          </span>
          <School className="size-4 shrink-0 text-pink" aria-hidden="true" />
        </CardContent>
      </Card>
    </div>
  );
}
