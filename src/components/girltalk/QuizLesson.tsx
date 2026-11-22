"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, ListChecks, RotateCcw, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CopyButton } from "@/components/shared/CopyButton";
import { useAppContext } from "@/components/providers/AppProviders";
import type { PracticeLesson } from "@/data/girltalk";
import { addQuizResult, uid } from "@/lib/storage/store";
import type { QuizResult } from "@/lib/types";
import { ChipButton } from "./ChipButton";

interface QuizLessonProps {
  lessons: PracticeLesson[];
  kind: Extract<QuizResult["kind"], "girltalk" | "flirting">;
  title: string;
  description: string;
}

export function QuizLesson({ lessons, kind, title, description }: QuizLessonProps) {
  const [lessonId, setLessonId] = React.useState(lessons[0]?.id ?? "");
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useAppContext();

  const lesson = lessons.find((item) => item.id === lessonId) ?? lessons[0];
  const total = lesson?.quiz.length ?? 0;

  function selectLesson(id: string) {
    setLessonId(id);
    setAnswers({});
    setSubmitted(false);
    setError(null);
  }

  function submit() {
    if (!lesson) return;
    const unanswered = lesson.quiz.filter((question) => answers[question.id] === undefined);
    if (unanswered.length) {
      setError(`Please answer all ${total} questions before checking your score.`);
      return;
    }
    setError(null);
    const correct = lesson.quiz.filter((question) => answers[question.id] === question.answerIndex).length;
    setScore(correct);
    setSubmitted(true);
    addQuizResult({
      id: uid(),
      date: new Date().toISOString(),
      lessonId: lesson.id,
      title: lesson.title,
      score: correct,
      total,
      kind,
    });
    toast(`${correct}/${total} correct — result saved.`, correct === total ? "success" : "info");
  }

  function retry() {
    setAnswers({});
    setSubmitted(false);
    setError(null);
  }

  function next() {
    const index = lessons.findIndex((item) => item.id === lessonId);
    selectLesson(lessons[(index + 1) % lessons.length]?.id ?? lessonId);
  }

  if (!lesson) return null;

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-pink/30 bg-gradient-to-br from-pink-soft via-surface to-primary-soft">
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-pink text-white">
              <ListChecks className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Choose a lesson</CardTitle>
          <CardDescription>Read the tips and dialogue, then take the short self-check.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a practice lesson">
            {lessons.map((item) => (
              <ChipButton key={item.id} active={item.id === lesson.id} onClick={() => selectLesson(item.id)}>
                <span aria-hidden="true">{item.emoji}</span> {item.title}
              </ChipButton>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="pink">{lesson.emoji} Lesson</Badge>
            <CardTitle>{lesson.title}</CardTitle>
          </div>
          <CardDescription>{lesson.summary}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <h4 className="mb-2 text-sm font-bold">Quick tips</h4>
            <ul className="space-y-2">
              {lesson.tips.map((tip) => (
                <li key={tip} className="flex gap-2 rounded-xl bg-surface-muted p-3 text-sm leading-relaxed">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-pink" aria-hidden="true" />
                  <span className="min-w-0 break-words">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-bold">Example dialogue</h4>
            <div className="space-y-2 rounded-2xl border border-border p-3">
              {lesson.dialogue.map((line, index) => (
                <div
                  key={`${line.speaker}-${index}`}
                  className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    line.speaker === "You"
                      ? "ml-auto bg-pink text-white [&_button]:text-white"
                      : "bg-surface-muted"
                  }`}
                >
                  <p className="mb-0.5 text-[0.68rem] font-bold uppercase tracking-wide opacity-80">{line.speaker}</p>
                  <p className="break-words">{line.text}</p>
                  {line.speaker === "You" && (
                    <div className="mt-1 flex justify-end [&_button]:min-h-11">
                      <CopyButton text={line.text} label="Copy line" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-bold">Self-check · {total} questions</h4>
              {submitted && <Badge variant={score === total ? "success" : "pink"}>{score}/{total} correct</Badge>}
            </div>
            <Progress
              value={submitted ? Math.round((score / Math.max(1, total)) * 100) : 0}
              indicatorClassName="bg-pink"
              className="mt-2"
              aria-label={`Quiz score ${score} out of ${total}`}
            />

            <div className="mt-4 space-y-5">
              {lesson.quiz.map((question, questionIndex) => {
                const selected = answers[question.id];
                return (
                  <fieldset key={question.id} className="space-y-2 rounded-2xl border border-border p-3">
                    <legend className="px-1 text-sm font-bold">
                      {questionIndex + 1}. {question.question}
                    </legend>
                    {question.options.map((option, optionIndex) => {
                      const isSelected = selected === optionIndex;
                      const isCorrect = optionIndex === question.answerIndex;
                      const showState = submitted;
                      return (
                        <label
                          key={option}
                          className={`flex min-h-11 cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-sm leading-relaxed transition-colors ${
                            showState && isCorrect
                              ? "border-success bg-success-soft"
                              : showState && isSelected
                                ? "border-danger bg-danger-soft"
                                : isSelected
                                  ? "border-pink bg-pink-soft"
                                  : "border-border-strong hover:border-pink/40"
                          }`}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            className="sr-only"
                            checked={isSelected}
                            onChange={() => {
                              setAnswers((previous) => ({ ...previous, [question.id]: optionIndex }));
                              if (submitted) setSubmitted(false);
                            }}
                          />
                          <span className="mt-0.5 shrink-0 font-bold">{String.fromCharCode(65 + optionIndex)}</span>
                          <span className="min-w-0 break-words">{option}</span>
                        </label>
                      );
                    })}
                    {submitted && (
                      <p className="flex gap-2 rounded-xl bg-surface-muted p-3 text-xs leading-relaxed text-muted">
                        <Sparkles className="mt-0.5 size-3.5 shrink-0 text-pink" aria-hidden="true" />
                        <span className="min-w-0 break-words">{question.explanation}</span>
                      </p>
                    )}
                  </fieldset>
                );
              })}
            </div>

            {error && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-danger-soft px-3 py-2 text-sm text-danger" role="alert">
                <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
                {error}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {!submitted ? (
                <Button type="button" variant="pink" onClick={submit}>
                  Check my answers
                </Button>
              ) : (
                <>
                  <Button type="button" variant="secondary" onClick={retry}>
                    <RotateCcw className="size-4" aria-hidden="true" /> Try again
                  </Button>
                  <Button type="button" variant="outline" onClick={next}>
                    Next lesson
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
