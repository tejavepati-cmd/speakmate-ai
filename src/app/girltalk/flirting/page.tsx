"use client";

import Link from "next/link";
import { ArrowLeft, Heart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/PageHeader";
import { ComplimentCoach } from "@/components/girltalk/ComplimentCoach";
import { FlirtingGenerator } from "@/components/girltalk/FlirtingGenerator";
import { FlirtingSmartReply } from "@/components/girltalk/FlirtingSmartReply";
import { QuizLesson } from "@/components/girltalk/QuizLesson";
import { RespectPanel } from "@/components/girltalk/RespectPanel";
import { SimulatorPanel } from "@/components/girltalk/SimulatorPanel";
import { TeluguFlirting } from "@/components/girltalk/TeluguFlirting";
import { flirtingScenarios, romanticLessons } from "@/data/flirting";

export default function FlirtingPage() {
  return (
    <div className="min-w-0">
      <PageHeader
        eyebrow="GirlTalk submodule"
        title="Flirting Coach ❤️"
        description="Warm, playful and respectful flirting practice. Boundaries are not optional, romantic interest is never assumed, and every example stays age-appropriate."
        icon={Heart}
        accent="pink"
        actions={
          <Button asChild variant="outline">
            <Link href="/girltalk">
              <ArrowLeft className="size-4" aria-hidden="true" /> Back to GirlTalk
            </Link>
          </Button>
        }
      />

      <div className="mb-5">
        <RespectPanel />
      </div>

      <Tabs defaultValue="generator" className="w-full min-w-0">
        <TabsList className="min-h-11" aria-label="Flirting Coach tools">
          <TabsTrigger value="generator" className="min-h-11 text-xs sm:text-sm data-[state=active]:bg-pink-soft data-[state=active]:text-pink">💌 Generator</TabsTrigger>
          <TabsTrigger value="replies" className="min-h-11 text-xs sm:text-sm data-[state=active]:bg-pink-soft data-[state=active]:text-pink">💬 Smart replies</TabsTrigger>
          <TabsTrigger value="compliments" className="min-h-11 text-xs sm:text-sm data-[state=active]:bg-pink-soft data-[state=active]:text-pink">🌷 Compliments</TabsTrigger>
          <TabsTrigger value="romance" className="min-h-11 text-xs sm:text-sm data-[state=active]:bg-pink-soft data-[state=active]:text-pink">📖 Practice</TabsTrigger>
          <TabsTrigger value="simulator" className="min-h-11 text-xs sm:text-sm data-[state=active]:bg-pink-soft data-[state=active]:text-pink">🎭 Simulator</TabsTrigger>
          <TabsTrigger value="telugu" className="min-h-11 text-xs sm:text-sm data-[state=active]:bg-pink-soft data-[state=active]:text-pink">🇮🇳 Telugu</TabsTrigger>
          <TabsTrigger value="respect" className="min-h-11 text-xs sm:text-sm data-[state=active]:bg-pink-soft data-[state=active]:text-pink">🛡️ Respect</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="min-w-0">
          <FlirtingGenerator />
        </TabsContent>

        <TabsContent value="replies" className="min-w-0">
          <FlirtingSmartReply />
        </TabsContent>

        <TabsContent value="compliments" className="min-w-0">
          <ComplimentCoach />
        </TabsContent>

        <TabsContent value="romance" className="min-w-0">
          <QuizLesson
            lessons={romanticLessons}
            kind="flirting"
            title="Romantic Conversation Practice"
            description="Scripts and short quizzes for interest, compliments, invitations, affection, misunderstandings and rejection."
          />
        </TabsContent>

        <TabsContent value="simulator" className="min-w-0">
          <SimulatorPanel
            kind="flirting"
            scenarios={flirtingScenarios}
            variant="flirting"
            aiContext="Flirting Coach: respectful, age-appropriate, non-explicit simulator. Never pressure or assume romantic interest."
            title="Flirting Simulator"
            description="Practise six situations and get feedback on confidence, naturalness, humour, respect, empathy and grammar."
          />
        </TabsContent>

        <TabsContent value="telugu" className="min-w-0">
          <TeluguFlirting />
        </TabsContent>

        <TabsContent value="respect" className="min-w-0">
          <RespectPanel />
          <Card className="mt-4 border-pink/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="size-4 text-pink" aria-hidden="true" /> Respect in one sentence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="break-words text-sm leading-relaxed">
                Be kind, be clear, and stop the moment the other person is not comfortable. This panel also stays visible above the tabs, so it can never be missed.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
