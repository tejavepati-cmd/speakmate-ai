"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenCheck,
  Bot,
  Brain,
  CheckCircle2,
  Keyboard,
  Languages,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  VenusAndMars,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brand } from "@/components/layout/AppShell";
import { ThemeToggle } from "@/components/layout/AppShell";

const features = [
  {
    icon: Bot,
    title: "Talk to SpeakMate AI",
    text: "Chat naturally in English, Roman Telugu, or a mix of both. Get gentle corrections, not judgement.",
    href: "/chat",
  },
  {
    icon: Keyboard,
    title: "Typing Practice",
    text: "Timed drills with live WPM, accuracy, error highlighting and personal bests — built for mobile keyboards.",
    href: "/typing",
  },
  {
    icon: Languages,
    title: "Telugu → English",
    text: "Turn ‘em chestunnav’ into natural, professional English with meaning and examples.",
    href: "/telugu-english",
  },
  {
    icon: BookOpenCheck,
    title: "Grammar & Vocabulary",
    text: "Bite-sized lessons, Telugu explanations, quizzes and a daily word habit that actually sticks.",
    href: "/grammar",
  },
  {
    icon: Brain,
    title: "Professional English",
    text: "Introductions, emails, presentations and interviews with realistic AI follow-up questions.",
    href: "/professional",
  },
  {
    icon: VenusAndMars,
    title: "GirlTalk & Flirting Coach",
    text: "Friendly replies, empathy, confidence and respectful flirting — always with boundaries first.",
    href: "/girltalk",
  },
  {
    icon: MessageCircleHeart,
    title: "Emotion Understanding",
    text: "Read possible emotional cues in a message and respond with care. Context always matters.",
    href: "/emotion",
  },
  {
    icon: TrendingUp,
    title: "Real Progress Tracking",
    text: "Every session updates your dashboard, streak, charts and recommended next step.",
    href: "/progress",
  },
];

const steps = [
  { n: "01", title: "Start where you are", text: "Type in Telugu, Roman Telugu, broken English — whatever feels natural today." },
  { n: "02", title: "Learn in context", text: "See the natural version, the professional version and a simple grammar note." },
  { n: "03", title: "Practise, repeat, grow", text: "Short daily drills turn new words and patterns into real confidence." },
];

const rise = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5 },
};

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      <header className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 pt-3 md:px-6">
        <Brand />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/dashboard">Open App</Link>
          </Button>
        </div>
      </header>

      <main id="main-content">
        <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 md:px-6 md:pb-24 md:pt-20">
          <div className="pointer-events-none absolute -left-40 top-10 size-96 rounded-full bg-primary/12 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-40 top-32 size-96 rounded-full bg-pink/12 blur-3xl" aria-hidden="true" />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary dark:text-foreground">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Built for Telugu speakers who think in their own language
              </span>
              <h1 className="mt-6 text-[clamp(2.5rem,1.6rem+5vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight">
                Your English Journey <span className="bg-gradient-to-r from-primary via-secondary to-pink bg-clip-text text-transparent">Starts Here.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
                Learn English, improve typing, communicate naturally, and build confidence with your personal AI coach.
              </p>
              <p className="mt-2 text-sm font-semibold text-primary">Think in Your Language. Communicate with Confidence.</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/dashboard">Start Learning <ArrowRight className="size-4" aria-hidden="true" /></Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/chat">Talk to AI</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#features">Explore Features</Link>
                </Button>
              </div>

              <ul className="mt-8 grid gap-2.5 text-sm text-muted sm:grid-cols-2">
                {["Works offline for core practice", "No judgement, no embarrassment", "Progress saved on your device"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-primary/15 via-transparent to-pink/20 blur-2xl" aria-hidden="true" />
              <Card className="relative overflow-hidden p-4 md:p-6">
                <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-pink text-white">
                      <Sparkles className="size-4.5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-bold leading-tight">SpeakMate AI</p>
                      <p className="text-[0.68rem] text-muted">Always patient. Always learning with you.</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-success-soft px-2 py-1 text-[0.65rem] font-bold text-success">ONLINE</span>
                </div>

                <div className="space-y-3">
                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                    naku english sarigga radu
                  </div>
                  <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-surface-muted px-4 py-3 text-sm">
                    <p>That&apos;s completely okay. We can learn together! 🌱</p>
                    <div className="mt-3 rounded-xl border border-border bg-surface p-3 text-xs">
                      <p className="font-bold text-primary">Correct English</p>
                      <p className="mt-0.5">I&apos;m not very good at English yet.</p>
                      <p className="mt-2 font-bold text-primary">Telugu meaning</p>
                      <p className="mt-0.5 text-muted">నాకు ఇంగ్లీష్ బాగా రాదు.</p>
                    </div>
                    <p className="mt-3 text-xs font-semibold">Let&apos;s practise one sentence at a time. What did you do today?</p>
                  </div>
                  <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                    I go college yesterday
                  </div>
                  <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-surface-muted px-4 py-3 text-sm">
                    <p>Nice try! Small fix 👇</p>
                    <p className="mt-1 font-bold text-success">“I went to college yesterday.”</p>
                    <p className="mt-1 text-xs text-muted">Use “went” for the past, and “to” before a place.</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-muted">
                  <span className="flex-1 truncate">Type in English or Telugu…</span>
                  <span className="rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">Send</span>
                </div>
              </Card>
              <div className="absolute -bottom-5 -left-3 hidden animate-float rounded-2xl border border-border bg-surface px-4 py-2.5 shadow-lg sm:block">
                <p className="text-[0.68rem] font-semibold text-muted">Typing speed</p>
                <p className="text-lg font-extrabold text-primary">42 WPM <span className="text-xs text-success">↑ 18%</span></p>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14 md:px-6 md:py-20">
          <motion.div {...rise} className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Everything you need</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">One coach for every kind of confidence.</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted md:text-base">
              Typing, grammar, real conversation, interviews, friendships and feelings — all in one friendly space.
            </p>
          </motion.div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.href} {...rise} transition={{ duration: 0.45, delay: index * 0.04 }}>
                  <Link href={feature.href} className="group block h-full">
                    <Card className="h-full p-5 transition-all duration-200 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-xl">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary dark:text-foreground">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <h3 className="mt-4 font-bold">{feature.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{feature.text}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary">
                        Explore <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="bg-surface-muted/70 py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <motion.div {...rise} className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">How it works</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">No perfect English required.</h2>
            </motion.div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <motion.div key={step.n} {...rise} transition={{ duration: 0.45, delay: index * 0.08 }}>
                  <Card className="h-full p-6">
                    <span className="text-3xl font-extrabold text-primary/25">{step.n}</span>
                    <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
                    <p className="mt-1.5 text-sm text-muted">{step.text}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6 md:p-8">
              <WifiOff className="size-7 text-primary" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-extrabold">Learn even without internet.</h2>
              <p className="mt-2 text-sm text-muted">
                Typing, grammar, vocabulary, saved lessons and local corrections keep working offline. When online AI is unavailable,
                SpeakMate clearly labels local practice — it never pretends to be a real AI reply.
              </p>
            </Card>
            <Card className="p-6 md:p-8">
              <ShieldCheck className="size-7 text-primary" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-extrabold">Your words stay yours.</h2>
              <p className="mt-2 text-sm text-muted">
                Progress and conversations are stored on your device. You can delete any conversation or reset everything at any time.
                Online AI messages are only sent when you choose to use them.
              </p>
            </Card>
          </div>

          <motion.div {...rise} className="mt-12 overflow-hidden rounded-card bg-gradient-to-br from-primary via-secondary to-pink p-8 text-center text-white md:p-12">
            <Sparkles className="mx-auto size-8" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-extrabold md:text-4xl">Ready to say it with confidence?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/85 md:text-base">
              Start with one sentence. SpeakMate will help you shape it, understand it and say it better.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Link href="/dashboard">Start Learning — it&apos;s free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/60 bg-white/10 text-white hover:bg-white/20">
                <Link href="/chat">Talk to AI now</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center text-xs text-muted md:flex-row md:px-6 md:text-left">
          <p>© {new Date().getFullYear()} SpeakMate AI · Think in Your Language. Communicate with Confidence.</p>
          <div className="flex gap-4">
            <Link href="/progress" className="hover:text-foreground">Progress</Link>
            <Link href="/settings" className="hover:text-foreground">Privacy & Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
