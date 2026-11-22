"use client";

import { CheckCircle2, Lightbulb, Languages, Sparkles } from "lucide-react";
import type { Correction } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { CopyLineButton } from "./CopyLineButton";

function Line({ label, value, copy = false, accent = false }: { label: string; value: string; copy?: boolean; accent?: boolean }) {
  if (!value) return null;
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-1">
        <p className={`text-[0.68rem] font-bold uppercase tracking-wide ${accent ? "text-success" : "text-muted"}`}>{label}</p>
        {copy && <CopyLineButton text={value} label="Copy" />}
      </div>
      <p className="mt-0.5 break-words text-sm leading-relaxed">{value}</p>
    </div>
  );
}

/** Reusable display for the shared Correction object returned by askAI. */
export function CorrectionCard({ correction, title = "Correction & better versions" }: { correction: Correction; title?: string }) {
  return (
    <Card className="min-w-0 border-success/25 bg-success-soft/40 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden="true" />
        <h4 className="text-sm font-bold">{title}</h4>
      </div>
      <div className="mt-3 space-y-3.5">
        {correction.original && <Line label="You wrote" value={correction.original} />}
        {correction.correct && <Line label="Corrected" value={correction.correct} copy accent />}
        {correction.natural && correction.natural !== correction.correct && (
          <Line label="Sounds natural" value={correction.natural} copy />
        )}
        {correction.professional && correction.professional !== correction.correct && (
          <Line label="More professional" value={correction.professional} copy />
        )}
        {correction.telugu && (
          <div className="min-w-0 border-t border-border/70 pt-3">
            <p className="flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-wide text-muted">
              <Languages className="size-3" aria-hidden="true" />
              Telugu meaning
            </p>
            <p className="mt-0.5 break-words text-sm">{correction.telugu}</p>
          </div>
        )}
        {correction.explanation && (
          <div className="flex gap-2 rounded-xl bg-surface/70 p-3">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-[0.68rem] font-bold uppercase tracking-wide text-muted">Why</p>
              <p className="mt-0.5 break-words text-xs leading-relaxed">{correction.explanation}</p>
            </div>
          </div>
        )}
        {correction.practice && (
          <div className="flex gap-2 rounded-xl bg-primary-soft/70 p-3">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-[0.68rem] font-bold uppercase tracking-wide text-primary">Try this next</p>
              <p className="mt-0.5 break-words text-xs leading-relaxed">{correction.practice}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
