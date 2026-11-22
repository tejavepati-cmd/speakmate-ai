"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Flame,
  GraduationCap,
  ListFilter,
  Search,
  SearchX,
  Sparkles,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { useAppContext } from "@/components/providers/AppProviders";
import {
  buildVocabularyQuestions,
  dailyWords,
  findVocabularyWord,
  vocabularyCategories,
  vocabularyWords,
  type VocabularyCategory,
  type VocabularyWord,
} from "@/data/vocabulary";
import { addQuizResult, dateKey, uid, useAppData } from "@/lib/storage/store";
import type { PracticeQuestion } from "./quiz-types";
import { QuizRunner, type QuizResultSummary } from "./QuizRunner";
import { VocabularyWordCard } from "./VocabularyWordCard";

interface ActiveQuiz {
  id: number;
  title: string;
  questions: PracticeQuestion[];
  kind: "daily" | "revision";
}

const PAGE_SIZE = 12;

export function VocabularyBuilder() {
  const data = useAppData();
  const { toast } = useAppContext();
  const reduceMotion = useReducedMotion();
  const [todayKey, setTodayKey] = React.useState<string | null>(null);
  const [tab, setTab] = React.useState("today");
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<VocabularyCategory | "all">("all");
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);
  const [activeQuiz, setActiveQuiz] = React.useState<ActiveQuiz | null>(null);
  const quizIdRef = React.useRef(0);

  // Defer the local date to the client so server and browser render the same initial markup.
  React.useEffect(() => {
    setTodayKey(dateKey());
  }, []);

  const wordsToday = React.useMemo(() => dailyWords(8, todayKey ?? "2026-01-01"), [todayKey]);
  const learnedSet = React.useMemo(() => new Set(data.learnedWords), [data.learnedWords]);
  const savedSet = React.useMemo(() => new Set(data.savedWords), [data.savedWords]);
  const savedWords = React.useMemo(
    () => data.savedWords.map(findVocabularyWord).filter((word): word is VocabularyWord => Boolean(word)),
    [data.savedWords],
  );

  const filteredWords = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return vocabularyWords.filter((word) => {
      const matchesCategory = category === "all" || word.category === category;
      const matchesSearch =
        !query ||
        `${word.word} ${word.englishMeaning} ${word.teluguMeaning} ${word.example} ${word.synonyms.join(" ")}`
          .toLowerCase()
          .includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  const visibleWords = filteredWords.slice(0, visibleCount);
  const learnedToday = wordsToday.filter((word) => learnedSet.has(word.word)).length;

  function startQuiz(kind: ActiveQuiz["kind"], words: VocabularyWord[], title: string) {
    if (!words.length) return;
    quizIdRef.current += 1;
    setActiveQuiz({
      id: quizIdRef.current,
      title,
      kind,
      questions: buildVocabularyQuestions(words.slice(0, 12)),
    });
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function handleQuizComplete(result: QuizResultSummary) {
    if (!activeQuiz) return;
    addQuizResult({
      id: uid(),
      date: new Date().toISOString(),
      lessonId: activeQuiz.kind === "daily" ? `daily-words-${todayKey ?? dateKey()}` : "saved-words-revision",
      title: activeQuiz.title,
      score: result.score,
      total: result.total,
      kind: "vocabulary",
    });
    toast(`Quiz saved: ${result.score}/${result.total} correct.`, "success");
  }

  function exitQuiz() {
    setActiveQuiz(null);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function clearFilters() {
    setSearch("");
    setCategory("all");
    setVisibleCount(PAGE_SIZE);
  }

  const dateLabel = todayKey
    ? new Date(`${todayKey}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    : "Today";

  if (activeQuiz) {
    return (
      <div className="space-y-5">
        <Button variant="ghost" size="sm" onClick={exitQuiz} className="-ml-2">
          <ArrowLeft aria-hidden="true" /> Back to vocabulary
        </Button>
        <PageHeader
          eyebrow={activeQuiz.kind === "daily" ? "Daily practice" : "Revision mode"}
          title={activeQuiz.title}
          description={`${activeQuiz.questions.length} short questions. Every result is saved to your progress.`}
          icon={Sparkles}
          actions={<Badge variant="default">Pass mark 70%</Badge>}
        />
        <QuizRunner
          key={activeQuiz.id}
          questions={activeQuiz.questions}
          title={activeQuiz.title}
          passPercent={70}
          onComplete={handleQuizComplete}
          onExit={exitQuiz}
          exitLabel="Back to vocabulary"
          resultNote="This result has been added to your vocabulary quiz history."
          resultActions={
            <Button
              variant="secondary"
              onClick={() => {
                exitQuiz();
                setTab("browse");
              }}
            >
              Browse all words <ArrowRight aria-hidden="true" />
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Grow your word bank"
        title="Vocabulary Builder"
        description="A fresh set of genuinely useful words every day, with Telugu meanings, examples and quick practice."
        icon={Sparkles}
        actions={
          <Badge variant="default">
            {vocabularyWords.length} words · {vocabularyCategories.length} topics
          </Badge>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Words learned" value={data.learnedWords.length} hint={`${vocabularyWords.length} words available`} icon={GraduationCap} tone="purple" />
        <StatCard label="Saved for revision" value={data.savedWords.length} hint="Your personal word list" icon={Bookmark} tone="pink" />
        <StatCard label="Vocabulary streak" value={`${data.vocabularyStreak} d`} hint="Learn a word each day" icon={Flame} tone="green" />
        <StatCard label="Learned today" value={`${learnedToday}/${wordsToday.length}`} hint="From today's set" icon={CheckCircle2} tone="blue" />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="today">
            <Sparkles aria-hidden="true" /> Today&apos;s words
          </TabsTrigger>
          <TabsTrigger value="revision">
            <Bookmark aria-hidden="true" /> Revision
          </TabsTrigger>
          <TabsTrigger value="browse">
            <ListFilter aria-hidden="true" /> Browse all
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card className="overflow-hidden p-4 md:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-primary">{dateLabel}</p>
                <h2 className="mt-1 text-lg font-extrabold tracking-tight">Your {wordsToday.length} words for today</h2>
                <p className="mt-1 text-sm text-muted">Learn them, save the tricky ones, then test yourself.</p>
              </div>
              <Button className="shrink-0" onClick={() => startQuiz("daily", wordsToday, `Daily vocabulary · ${dateLabel}`)}>
                <Sparkles aria-hidden="true" /> Take daily quiz
              </Button>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 text-xs font-semibold text-muted">
              <span>{learnedToday} of {wordsToday.length} learned today</span>
              <span>{Math.round((learnedToday / wordsToday.length) * 100)}%</span>
            </div>
            <Progress value={Math.round((learnedToday / wordsToday.length) * 100)} className="mt-2" aria-label="Daily words learned" />
          </Card>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {wordsToday.map((word, index) => (
              <motion.div
                key={word.word}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : Math.min(index, 7) * 0.035 }}
              >
                <VocabularyWordCard
                  word={word}
                  saved={savedSet.has(word.word)}
                  learned={learnedSet.has(word.word)}
                  showQuiz
                />
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="revision" className="space-y-4">
          <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between md:p-5">
            <div className="min-w-0">
              <h2 className="text-lg font-extrabold tracking-tight">Revision mode</h2>
              <p className="mt-1 text-sm text-muted">
                {savedWords.length
                  ? `${savedWords.length} word${savedWords.length === 1 ? "" : "s"} saved · quiz uses up to 12 of them.`
                  : "Save words from today's set or the full list to revise them here."}
              </p>
            </div>
            <Button
              className="shrink-0"
              variant={savedWords.length ? "default" : "outline"}
              disabled={!savedWords.length}
              onClick={() => startQuiz("revision", savedWords, "Saved words revision")}
            >
              <Sparkles aria-hidden="true" /> Start revision quiz
            </Button>
          </Card>

          {savedWords.length === 0 ? (
            <Card className="p-8 text-center">
              <Bookmark className="mx-auto size-8 text-primary" aria-hidden="true" />
              <h3 className="mt-3 text-base font-bold">No saved words yet</h3>
              <p className="mt-1 text-sm text-muted">Tap “Save word” on any word you want to revisit.</p>
              <Button className="mt-4" variant="secondary" onClick={() => setTab("browse")}>
                Browse all words <ArrowRight aria-hidden="true" />
              </Button>
            </Card>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {savedWords.map((word) => (
                <VocabularyWordCard
                  key={word.word}
                  word={word}
                  saved
                  learned={learnedSet.has(word.word)}
                  showQuiz
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="browse" className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <label htmlFor="vocabulary-search" className="sr-only">Search words</label>
              <Input
                id="vocabulary-search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                placeholder="Search a word, meaning or example…"
                className="pl-10 pr-10"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setVisibleCount(PAGE_SIZE);
                  }}
                  aria-label="Clear word search"
                  className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:bg-surface-muted hover:text-foreground"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>
            <div className="w-full sm:w-52">
              <label htmlFor="vocabulary-category" className="sr-only">Filter words by category</label>
              <Select
                value={category}
                onValueChange={(value) => {
                  setCategory(value as VocabularyCategory | "all");
                  setVisibleCount(PAGE_SIZE);
                }}
              >
                <SelectTrigger id="vocabulary-category" aria-label="Filter words by category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {vocabularyCategories.map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="text-xs font-semibold text-muted" role="status">
            Showing {visibleWords.length} of {filteredWords.length} matching words
          </p>

          {visibleWords.length === 0 ? (
            <Card className="p-8 text-center">
              <SearchX className="mx-auto size-8 text-primary" aria-hidden="true" />
              <h3 className="mt-3 text-base font-bold">No words found</h3>
              <p className="mt-1 text-sm text-muted">Try another spelling, meaning or category.</p>
              <Button className="mt-4" variant="secondary" onClick={clearFilters}>
                Clear filters
              </Button>
            </Card>
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {visibleWords.map((word) => (
                  <VocabularyWordCard
                    key={word.word}
                    word={word}
                    saved={savedSet.has(word.word)}
                    learned={learnedSet.has(word.word)}
                  />
                ))}
              </div>
              <div className="flex flex-col items-center gap-2 pt-2 text-center">
                {visibleWords.length < filteredWords.length ? (
                  <Button variant="secondary" onClick={() => setVisibleCount((current) => current + PAGE_SIZE)}>
                    Load more words <ArrowRight aria-hidden="true" />
                  </Button>
                ) : (
                  <p className="text-sm font-semibold text-muted">
                    All {filteredWords.length} words loaded. Nice work!
                  </p>
                )}
                <p className="text-xs text-muted">
                  Save any word to add it to your revision list.
                </p>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
