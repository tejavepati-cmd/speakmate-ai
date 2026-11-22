"use client";

import { Check, CircleDot, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SCORE_KEYS, SCORE_LABELS, type ScoreBreakdown } from "./scoring";

/** Six-dimension checklist shown with professional and roleplay feedback. */
export function ScoreChecklist({
  breakdown,
  title = "Feedback checklist",
  className,
}: {
  breakdown: ScoreBreakdown;
  title?: string;
  className?: string;
}) {
  return (
    <Card className={cn("min-w-0 p-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold">{title}</h4>
        <Badge variant={breakdown.fromAI ? "success" : "outline"}>
          {breakdown.fromAI ? "AI scores" : "Local rubric"}
        </Badge>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {SCORE_KEYS.map((key: (typeof SCORE_KEYS)[number]) => {
          const value = breakdown.scores[key];
          const good = value >= 7;
          return (
            <div key={key} className="min-w-0">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="flex min-w-0 items-center gap-1.5 font-semibold">
                  {good ? (
                    <Check className="size-3.5 shrink-0 text-success" aria-hidden="true" />
                  ) : (
                    <CircleDot className="size-3.5 shrink-0 text-warning" aria-hidden="true" />
                  )}
                  <span className="truncate">{SCORE_LABELS[key]}</span>
                </span>
                <span className="shrink-0 font-bold tabular-nums">{value}/10</span>
              </div>
              <Progress
                value={value * 10}
                className="mt-1.5 h-2"
                indicatorClassName={good ? "bg-success" : "bg-warning"}
                aria-label={`${SCORE_LABELS[key]}: ${value} out of 10`}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-primary-soft/70 px-3.5 py-2.5">
        <span className="flex items-center gap-2 text-xs font-bold text-primary">
          <Sparkles className="size-4" aria-hidden="true" />
          Overall
        </span>
        <span className="text-lg font-extrabold text-primary">
          {breakdown.overall}<span className="text-xs font-semibold text-muted">/10</span>
        </span>
      </div>
    </Card>
  );
}
