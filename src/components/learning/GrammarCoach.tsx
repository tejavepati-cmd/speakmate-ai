"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BookOpenCheck,
  Check,
  CheckCircle2,
  Clock3,
  History,
  Search,
  SearchX,
  Target,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { useAppContext } from "@/components/providers/AppProviders";
import { grammarLessons, type GrammarLesson } from "@/data/grammar";
import { grammarPerformance } from "@/lib/storage/selectors";
import { addQuizResult, completeLesson, uid, useAppData } from "@/lib/storage/store";
import { formatDate } from "@/lib/utils";
import { QuizRunner, type QuizResultSummary } from "./QuizRunner";

type StatusFilter = "all" | "completed" | "not-started";

export function GrammarCoach() {
  const data = useAppData();
  const { toast } = useAppContext();
  const reduceMotion = useReducedMotion();
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const [tab, setTab] = React.useState("lessons");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const performance = React.useMemo(() => grammarPerformance(data), [data]);
  const completed = data.completedLessons;
  const selectedLesson = selectedId ? grammarLessons.find((lesson) => lesson.id === selectedId) ?? null : null;

  const filteredLessons = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return grammarLessons.filter((lesson) => {
      const matchesStatus =
        status === "all" ||
        (status === "completed" && completed.includes(lesson.id)) ||
        (status === "not-started" && !completed.includes(lesson.id));
      const matchesSearch =
        !query ||
        `${lesson.title} ${lesson.simpleExplanation} ${lesson.teluguExplanation}`.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [search, status, completed]);

  function openLesson(id: string) {
    setSelectedId(id);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function closeLesson() {
    setSelectedId(null);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function handleQuizComplete(lesson: GrammarLesson, result: QuizResultSummary) {
    const percent = result.total ? Math.round((result.score / result.total) * 100) : 0;
    addQuizResult({
      id: uid(),
      date: new Date().toISOString(),
      lessonId: lesson.id,
      title: `Grammar · ${lesson.title}`,
      score: result.score,
      total: result.total,
      kind: "grammar",
    });
    if (percent >= 70) {
      completeLesson(lesson.id);
      toast(`${lesson.title} completed. Well done!`, "success");
    } else {
      toast(`You scored ${percent}%. Review the examples and try again.`, "warning");
    }
  }

  if (selectedLesson) {
    const lessonIndex = grammarLessons.findIndex((item) => item.id === selectedLesson.id);
    const nextLesson = grammarLessons[(lessonIndex + 1) % grammarLessons.length];
    const isLastLesson = lessonIndex === grammarLessons.length - 1;
    const isCompleted = completed.includes(selectedLesson.id);

    return (
      <div className="space-y-5">
        <Button variant="ghost" size="sm" onClick={closeLesson} className="-ml-2">
          <ArrowLeft aria-hidden="true" /> All lessons
        </Button>

        <PageHeader
          eyebrow={`Lesson ${lessonIndex + 1} of ${grammarLessons.length}`}
          title={selectedLesson.title}
          description="Read the rule, see real examples, then test yourself."
          icon={BookOpen}
          actions={
            <>
              <Badge variant="outline">
                <Clock3 aria-hidden="true" /> {selectedLesson.estimatedMinutes} min
              </Badge>
              {isCompleted && (
                <Badge variant="success">
                  <CheckCircle2 aria-hidden="true" /> Completed
                </Badge>
              )}
            </>
          }
        />

        <div className="grid gap-4 lg:grid-cols-[1fr_1.05fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">The rule, simply</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed text-muted">{selectedLesson.simpleExplanation}</p>
              <div className="rounded-2xl border border-primary/20 bg-primary-soft/60 p-4">
                <p className="text-sm font-bold text-primary">తెలుగులో అర్థం</p>
                <p lang="te" className="mt-1.5 text-sm leading-relaxed text-foreground">
                  {selectedLesson.teluguExplanation}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">See it in action</CardTitle>
              <CardDescription>Common mistakes and the natural fix.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedLesson.examples.map((example, index) => (
                <div key={`${selectedLesson.id}-example-${index}`} className="rounded-2xl border border-border bg-surface-muted/40 p-3.5">
                  {example.wrong && (
                    <p className="flex items-start gap-2 text-sm text-danger">
                      <X className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      <span className="line-through decoration-danger/60">{example.wrong}</span>
                    </p>
                  )}
                  <p className="mt-1 flex items-start gap-2 text-sm font-semibold text-success">
                    <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span className="min-w-0 break-words">{example.correct}</span>
                  </p>
                  <p className="mt-1.5 pl-6 text-xs leading-relaxed text-muted">{example.note}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <section aria-labelledby="grammar-quiz-heading" className="space-y-3">
          <div id="grammar-quiz-heading" className="flex flex-wrap items-center gap-2">
            <Target className="size-5 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-extrabold tracking-tight">Test yourself</h2>
            <Badge variant="outline">Pass mark 70%</Badge>
          </div>
          <QuizRunner
            key={selectedLesson.id}
            questions={selectedLesson.quiz}
            title={`Practice: ${selectedLesson.title}`}
            passPercent={70}
            onExit={closeLesson}
            exitLabel="All lessons"
            onComplete={(result) => handleQuizComplete(selectedLesson, result)}
            resultNote={
              isCompleted ? (
                <span className="inline-flex items-center gap-1.5 font-semibold text-success">
                  <CheckCircle2 className="size-4" aria-hidden="true" /> This lesson is in your completed list.
                </span>
              ) : (
                <span>Score 70% or more to mark this lesson complete.</span>
              )
            }
            resultActions={
              <Button
                variant="secondary"
                className="max-w-full whitespace-normal text-left"
                onClick={() => openLesson(nextLesson.id)}
              >
                {isLastLesson ? "Back to lesson 1" : `Next: ${nextLesson.title}`}
                <ArrowRight aria-hidden="true" />
              </Button>
            }
          />
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Learn the rules"
        title="Grammar Coach"
        description="Twelve short lessons with simple English, Telugu explanations, real examples and a quick quiz."
        icon={BookOpen}
        actions={
          <Badge variant="default">
            {grammarLessons.length} lessons · {grammarLessons.reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0)} min
          </Badge>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Lessons completed"
          value={`${completed.length}/${grammarLessons.length}`}
          hint="Finish a quiz at 70%+"
          icon={BookOpenCheck}
          tone="purple"
        />
        <StatCard label="Average score" value={`${performance.averageScore}%`} hint="Across all grammar quizzes" icon={Target} tone="green" />
        <StatCard label="Quiz attempts" value={performance.attempts} hint="Every attempt is saved" icon={History} tone="blue" />
        <StatCard
          label="Lessons to go"
          value={Math.max(0, grammarLessons.length - completed.length)}
          hint="Small steps add up"
          icon={CheckCircle2}
          tone="pink"
        />
      </div>

      <Card className="p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <p className="font-bold">Your grammar journey</p>
          <p className="text-muted">{Math.round((completed.length / grammarLessons.length) * 100)}% complete</p>
        </div>
        <Progress
          value={Math.round((completed.length / grammarLessons.length) * 100)}
          className="mt-3"
          aria-label="Grammar lessons completed"
        />
      </Card>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="lessons">
            <BookOpen aria-hidden="true" /> Lessons
          </TabsTrigger>
          <TabsTrigger value="history">
            <History aria-hidden="true" /> Score history
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <label htmlFor="grammar-search" className="sr-only">Search grammar lessons</label>
              <Input
                id="grammar-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search lessons or topics…"
                className="pl-10 pr-10"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear lesson search"
                  className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:bg-surface-muted hover:text-foreground"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>
            <div className="w-full sm:w-52">
              <label htmlFor="grammar-status" className="sr-only">Filter lessons by status</label>
              <Select value={status} onValueChange={(value) => setStatus(value as StatusFilter)}>
                <SelectTrigger id="grammar-status" aria-label="Filter lessons by status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All lessons</SelectItem>
                  <SelectItem value="not-started">Not started</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="text-xs font-semibold text-muted" role="status">
            Showing {filteredLessons.length} of {grammarLessons.length} lessons
          </p>

          {filteredLessons.length === 0 ? (
            <Card className="p-8 text-center">
              <SearchX className="mx-auto size-8 text-primary" aria-hidden="true" />
              <h3 className="mt-3 text-base font-bold">No lessons found</h3>
              <p className="mt-1 text-sm text-muted">Try a different word or clear your filters.</p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setStatus("all");
                }}
              >
                Clear filters
              </Button>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredLessons.map((lesson, index) => {
                const done = completed.includes(lesson.id);
                return (
                  <motion.div
                    key={lesson.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : Math.min(index, 6) * 0.03 }}
                  >
                    <Card className="flex h-full flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={done ? "success" : "outline"}>
                          {done ? <CheckCircle2 aria-hidden="true" /> : <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />}
                          {done ? "Completed" : "Not started"}
                        </Badge>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted">
                          <Clock3 className="size-3.5" aria-hidden="true" /> {lesson.estimatedMinutes} min
                        </span>
                      </div>
                      <h3 className="mt-3 text-base font-extrabold leading-snug">{lesson.title}</h3>
                      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">
                        {lesson.simpleExplanation.split(". ")[0]}.
                      </p>
                      <Button className="mt-4 w-full" variant={done ? "secondary" : "default"} onClick={() => openLesson(lesson.id)}>
                        {done ? "Review lesson" : "Start lesson"}
                        <ArrowRight aria-hidden="true" />
                      </Button>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          {performance.results.length === 0 ? (
            <Card className="p-8 text-center">
              <History className="mx-auto size-8 text-primary" aria-hidden="true" />
              <h3 className="mt-3 text-base font-bold">No quiz results yet</h3>
              <p className="mt-1 text-sm text-muted">Finish any lesson quiz and your scores will appear here.</p>
              <Button className="mt-4" onClick={() => setTab("lessons")}>
                Browse lessons
              </Button>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your recent grammar scores</CardTitle>
                <CardDescription>Real results saved on this device.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {performance.results.map((result) => {
                  const percent = result.total ? Math.round((result.score / result.total) * 100) : 0;
                  return (
                    <div key={result.id} className="rounded-2xl border border-border bg-surface-muted/40 p-3.5">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-bold break-words">{result.title}</p>
                          <p className="mt-0.5 text-xs text-muted">{formatDate(result.date)}</p>
                        </div>
                        <Badge variant={percent >= 70 ? "success" : "danger"}>
                          {result.score}/{result.total} · {percent}%
                        </Badge>
                      </div>
                      <Progress value={percent} className="mt-3" aria-label={`${result.title} score ${percent} percent`} />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
