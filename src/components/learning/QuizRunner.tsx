"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, CheckCircle2, RotateCcw, Sparkles, X, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { PracticeQuestion } from "./quiz-types";

export interface QuizResultSummary {
  score: number;
  total: number;
}

interface QuizRunnerProps {
  questions: PracticeQuestion[];
  onComplete: (result: QuizResultSummary) => void;
  passPercent?: number;
  title?: string;
  description?: string;
  resultNote?: React.ReactNode;
  resultActions?: React.ReactNode;
  onExit?: () => void;
  exitLabel?: string;
}

export function QuizRunner({
  questions,
  onComplete,
  passPercent = 70,
  title = "Quick quiz",
  description = "Choose the best answer. You will see the explanation right away.",
  resultNote,
  resultActions,
  onExit,
  exitLabel = "Back",
}: QuizRunnerProps) {
  const [index, setIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [score, setScore] = React.useState(0);
  const [missed, setMissed] = React.useState<string[]>([]);
  const [finished, setFinished] = React.useState(false);
  const completedRef = React.useRef(false);
  const nextButtonRef = React.useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  const total = questions.length;
  const question = questions[index];
  const percent = total ? Math.round((score / total) * 100) : 0;
  const passed = percent >= passPercent;

  React.useEffect(() => {
    if (selected !== null) nextButtonRef.current?.focus();
  }, [selected]);

  function selectAnswer(optionIndex: number) {
    if (selected !== null || !question) return;
    setSelected(optionIndex);
    if (optionIndex === question.answerIndex) {
      setScore((current) => current + 1);
    } else {
      setMissed((current) => [...current, question.explanation]);
    }
  }

  function goNext() {
    if (selected === null) return;
    if (index + 1 < total) {
      setIndex((current) => current + 1);
      setSelected(null);
      return;
    }
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete({ score, total });
    }
    setFinished(true);
  }

  function restart() {
    completedRef.current = false;
    setIndex(0);
    setSelected(null);
    setScore(0);
    setMissed([]);
    setFinished(false);
  }

  if (!total || !question) {
    return (
      <Card className="p-6 text-center">
        <p className="text-sm text-muted">There are no questions to show right now.</p>
        {onExit && (
          <Button className="mt-4" variant="secondary" onClick={onExit}>
            {exitLabel}
          </Button>
        )}
      </Card>
    );
  }

  const progressValue = finished
    ? 100
    : Math.round(((index + (selected !== null ? 1 : 0)) / total) * 100);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-2 border-b border-border bg-surface-muted/50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant={finished ? (passed ? "success" : "outline") : "default"}>
            {finished ? (passed ? "Passed" : "Keep going") : `Question ${index + 1} of ${total}`}
          </Badge>
        </div>
        <p className="text-sm text-muted">{description}</p>
        <Progress value={progressValue} aria-label="Quiz progress" className="mt-1" />
      </CardHeader>

      <CardContent className="pt-5">
        {finished ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            className="space-y-5"
          >
            <div className="flex flex-col items-center rounded-2xl bg-gradient-to-br from-primary-soft to-pink-soft px-5 py-7 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-surface text-primary shadow-sm">
                {passed ? <Sparkles className="size-7" aria-hidden="true" /> : <CheckCircle2 className="size-7" aria-hidden="true" />}
              </span>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-muted">Your score</p>
              <p className="mt-1 text-4xl font-extrabold tracking-tight">
                {score}<span className="text-2xl text-muted">/{total}</span>
              </p>
              <p className="mt-1 text-sm font-semibold text-primary">{percent}% · Pass mark {passPercent}%</p>
              <Progress value={percent} className="mt-4 max-w-xs" aria-label={`Score ${percent} percent`} />
            </div>

            {resultNote && <div className="text-sm text-muted">{resultNote}</div>}

            {missed.length > 0 && (
              <div className="rounded-2xl border border-border bg-surface-muted/50 p-4">
                <p className="text-sm font-bold">Worth another look</p>
                <ul className="mt-2 space-y-2">
                  {missed.map((note, noteIndex) => (
                    <li key={`${note}-${noteIndex}`} className="flex gap-2 text-sm text-muted">
                      <XCircle className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden="true" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button onClick={restart}>
                <RotateCcw aria-hidden="true" /> Practice again
              </Button>
              {resultActions}
              {onExit && (
                <Button variant="outline" onClick={onExit}>
                  <ArrowRight className="rotate-180" aria-hidden="true" /> {exitLabel}
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={question.id ?? index}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
          >
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-primary">Question {index + 1}</p>
            <h3 id={`quiz-prompt-${question.id}`} className="mt-1.5 text-lg font-bold leading-snug">
              {question.prompt}
            </h3>

            <div
              role="radiogroup"
              aria-labelledby={`quiz-prompt-${question.id}`}
              className="mt-4 grid gap-2.5"
            >
              {question.options.map((option, optionIndex) => {
                const isAnswer = optionIndex === question.answerIndex;
                const isChosen = optionIndex === selected;
                const showCorrect = selected !== null && isAnswer;
                const showWrong = selected !== null && isChosen && !isAnswer;
                return (
                  <button
                    key={`${question.id}-option-${optionIndex}`}
                    type="button"
                    role="radio"
                    aria-checked={isChosen}
                    disabled={selected !== null}
                    onClick={() => selectAnswer(optionIndex)}
                    className={cn(
                      "flex min-h-12 w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left text-sm font-medium transition-all duration-200",
                      "border-border-strong bg-surface hover:border-primary/60 hover:bg-primary-soft/40",
                      "disabled:cursor-default disabled:opacity-100",
                      showCorrect && "border-success bg-success-soft text-success",
                      showWrong && "border-danger bg-danger-soft text-danger",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border-strong text-[0.65rem] font-bold text-muted",
                        showCorrect && "border-success bg-success text-white",
                        showWrong && "border-danger bg-danger text-white",
                      )}
                      aria-hidden="true"
                    >
                      {showCorrect ? <Check className="size-3" /> : showWrong ? <X className="size-3" /> : String.fromCharCode(65 + optionIndex)}
                    </span>
                    <span className="min-w-0 flex-1 break-words">{option}</span>
                  </button>
                );
              })}
            </div>

            {selected !== null && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
                role="status"
                className={cn(
                  "mt-4 rounded-xl border p-3.5 text-sm",
                  selected === question.answerIndex
                    ? "border-success/40 bg-success-soft"
                    : "border-danger/40 bg-danger-soft",
                )}
              >
                <p className={cn("flex items-center gap-1.5 font-bold", selected === question.answerIndex ? "text-success" : "text-danger")}>
                  {selected === question.answerIndex ? <CheckCircle2 className="size-4" aria-hidden="true" /> : <XCircle className="size-4" aria-hidden="true" />}
                  {selected === question.answerIndex ? "Correct!" : "Not quite"}
                </p>
                <p className="mt-1 text-muted">{question.explanation}</p>
              </motion.div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Button ref={nextButtonRef} onClick={goNext} disabled={selected === null}>
                {index + 1 < total ? "Next question" : "See results"}
                <ArrowRight aria-hidden="true" />
              </Button>
              <span className="text-xs text-muted">{selected === null ? "Pick an answer to continue" : "Explanation shown above"}</span>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
