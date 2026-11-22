"use client";

import Link from "next/link";
import { ArrowRight, Keyboard, RotateCcw, Settings2, Target, Timer, Trophy } from "lucide-react";
import type { TypingResult } from "@/lib/types";
import { useAppData } from "@/lib/storage/store";
import { durationLabel, formatTimer, personalBest } from "@/lib/typing/engine";
import { categoryLabel, levelLabel, type TypingCategoryId } from "@/data/typing";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/shared/StatCard";

interface TypingResultsProps {
  result: TypingResult;
  onTryAgain: () => void;
  onChangeSetup: () => void;
}

export function TypingResults({ result, onTryAgain, onChangeSetup }: TypingResultsProps) {
  const { typingResults } = useAppData();
  const others = typingResults.filter((item) => item.id !== result.id);
  const best = personalBest(others, result.level, result.durationSeconds);
  const isNewBest = !best || result.wpm > best.result.wpm;

  return (
    <Card className="mt-4 overflow-hidden">
      <div className="bg-gradient-to-br from-primary-soft via-surface to-secondary/10 p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="success">Test complete</Badge>
          <p className="text-xs text-muted">{formatDate(result.date)}</p>
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-x-8 gap-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Your speed</p>
            <p className="text-5xl font-extrabold leading-none tracking-tight text-primary md:text-6xl">
              {result.wpm} <span className="text-xl font-bold md:text-2xl">WPM</span>
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Accuracy</p>
            <p className="text-3xl font-extrabold leading-none tracking-tight">{result.accuracy}%</p>
          </div>
          {isNewBest && <Badge variant="success">New personal best</Badge>}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline">{levelLabel(result.level)}</Badge>
          <Badge variant="outline">{categoryLabel(result.category as TypingCategoryId)}</Badge>
          <Badge variant="outline">{durationLabel(result.durationSeconds)}</Badge>
          <Badge variant="outline">{formatTimer(result.durationSeconds)}</Badge>
        </div>
      </div>

      <div className="p-4 md:p-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Correct chars" value={result.correctChars} icon={Keyboard} tone="green" />
          <StatCard label="Incorrect chars" value={result.incorrectChars} icon={Target} tone="purple" />
          <StatCard label="Backspaces" value={result.backspaces} icon={RotateCcw} />
          <StatCard label="Total typed" value={result.totalChars} icon={Keyboard} />
          <StatCard label="Time" value={formatTimer(result.durationSeconds)} icon={Timer} />
          <StatCard label="Best WPM" value={best?.result.wpm ?? result.wpm} icon={Trophy} tone="green" />
        </div>

        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-border bg-surface-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Personal best</p>
            {best ? (
              <p className="mt-1 text-sm">
                <span className="font-extrabold text-foreground">{best.result.wpm} WPM</span>
                <span className="text-muted"> · {best.result.accuracy}% accuracy · </span>
                <span className="text-muted">
                  {best.scope === "duration" ? `${durationLabel(best.result.durationSeconds)}` : `${levelLabel(best.result.level)} level`}
                </span>
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted">This is your first result — everything from here is a personal best.</p>
            )}
          </div>
          {best && result.wpm > best.result.wpm && (
            <Badge variant="success">+{result.wpm - best.result.wpm} WPM improvement</Badge>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button onClick={onTryAgain} className="flex-1">
            <RotateCcw className="size-4" aria-hidden="true" />
            Try again
          </Button>
          <Button asChild variant="secondary" className="flex-1">
            <Link href="/progress">
              See progress <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button onClick={onChangeSetup} variant="outline">
            <Settings2 className="size-4" aria-hidden="true" />
            Change setup
          </Button>
        </div>
      </div>
    </Card>
  );
}
