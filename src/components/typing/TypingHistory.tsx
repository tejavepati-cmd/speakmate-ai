"use client";

import Link from "next/link";
import { Clock3, History, Trophy } from "lucide-react";
import type { TypingCategoryId, TypingLevel } from "@/data/typing";
import { categoryLabel, levelLabel } from "@/data/typing";
import { useAppData } from "@/lib/storage/store";
import { durationLabel, formatTimer, personalBest } from "@/lib/typing/engine";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TypingHistoryProps {
  level: TypingLevel;
  durationSeconds: number;
}

export function TypingHistory({ level, durationSeconds }: TypingHistoryProps) {
  const { typingResults } = useAppData();
  const recent = typingResults.slice(0, 8);
  const best = personalBest(typingResults, level, durationSeconds);

  return (
    <section className="mt-5 grid gap-4 lg:grid-cols-3" aria-labelledby="typing-history-title">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="size-5 text-primary" aria-hidden="true" />
            Your best
          </CardTitle>
          <CardDescription>For {levelLabel(level)} · {durationLabel(durationSeconds)}</CardDescription>
        </CardHeader>
        <CardContent>
          {best ? (
            <>
              <p className="text-4xl font-extrabold leading-none tracking-tight text-primary">
                {best.result.wpm} <span className="text-base font-bold">WPM</span>
              </p>
              <p className="mt-2 text-sm text-muted">
                {best.result.accuracy}% accuracy · {best.result.correctChars} correct characters
              </p>
              <p className="mt-1 text-xs text-muted">
                {best.scope === "duration" ? "Best at this duration" : "Best at this level"} · {formatDate(best.result.date)}
              </p>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted">
              No personal best yet. Finish a test at this level and duration to set one.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="flex-row items-start justify-between gap-3">
          <div>
            <CardTitle id="typing-history-title" className="flex items-center gap-2">
              <History className="size-5 text-primary" aria-hidden="true" />
              Recent tests
            </CardTitle>
            <CardDescription>Your last {recent.length} completed typing tests, saved on this device.</CardDescription>
          </div>
          <Badge variant="outline">{typingResults.length} total</Badge>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-border p-5">
              <Clock3 className="size-6 text-muted" aria-hidden="true" />
              <div>
                <p className="font-bold">No tests yet</p>
                <p className="mt-1 text-sm text-muted">
                  Complete a timed test above and it will appear here with its speed and accuracy.
                </p>
              </div>
              <Button asChild variant="link" size="sm" className="px-0">
                <Link href="/progress">View progress instead</Link>
              </Button>
            </div>
          ) : (
            <>
              <ul className="space-y-2 sm:hidden">
                {recent.map((item) => (
                  <li key={item.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-bold">{item.wpm} WPM</p>
                      <Badge variant={item.accuracy >= 95 ? "success" : "outline"}>{item.accuracy}%</Badge>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted">
                      {levelLabel(item.level)} · {categoryLabel(item.category as TypingCategoryId)} · {formatTimer(item.durationSeconds)}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{formatDate(item.date)}</p>
                  </li>
                ))}
              </ul>

              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Your eight most recent typing test results</caption>
                  <thead>
                    <tr className="border-b border-border text-xs font-bold uppercase tracking-wide text-muted">
                      <th scope="col" className="py-2 pr-3">Date</th>
                      <th scope="col" className="py-2 pr-3">Level</th>
                      <th scope="col" className="py-2 pr-3">Category</th>
                      <th scope="col" className="py-2 pr-3">Time</th>
                      <th scope="col" className="py-2 pr-3 text-right">WPM</th>
                      <th scope="col" className="py-2 text-right">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((item) => (
                      <tr key={item.id} className="border-b border-border/70 last:border-0">
                        <td className="py-2.5 pr-3 whitespace-nowrap text-muted">{formatDate(item.date)}</td>
                        <td className="py-2.5 pr-3 whitespace-nowrap">{levelLabel(item.level)}</td>
                        <td className="py-2.5 pr-3 whitespace-nowrap">{categoryLabel(item.category as TypingCategoryId)}</td>
                        <td className="py-2.5 pr-3 whitespace-nowrap text-muted">{formatTimer(item.durationSeconds)}</td>
                        <td className="py-2.5 pr-3 text-right font-bold tabular-nums">{item.wpm}</td>
                        <td className="py-2.5 text-right tabular-nums">{item.accuracy}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
