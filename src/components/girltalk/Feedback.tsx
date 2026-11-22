"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/shared/CopyButton";
import { SourceBadge } from "./SourceBadge";
import { cleanText } from "./utils";

interface ResultCardProps {
  title: string;
  text: string;
  source?: "ai" | "offline";
  eyebrow?: string;
  className?: string;
}

export function ResultCard({ title, text, source, eyebrow, className }: ResultCardProps) {
  const shown = source === "offline" ? cleanText(text) : text;
  return (
    <Card className={`overflow-hidden border-pink/30 bg-gradient-to-br from-pink-soft/70 to-surface ${className ?? ""}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pb-2 pt-4">
        <div className="min-w-0">
          {eyebrow && <p className="text-[0.68rem] font-bold uppercase tracking-wider text-pink">{eyebrow}</p>}
          <p className="text-sm font-bold">{title}</p>
        </div>
        <SourceBadge source={source} />
      </div>
      <div className="flex items-start gap-2 px-4 pb-4 [&_button]:min-h-11">
        <p className="min-w-0 flex-1 whitespace-pre-wrap break-words text-sm leading-relaxed">{shown}</p>
        <CopyButton text={shown} label="Copy" />
      </div>
    </Card>
  );
}

export function LoadingNote({ label = "Thinking of a kind reply…" }: { label?: string }) {
  return (
    <div className="flex min-h-11 items-center gap-2 rounded-xl border border-dashed border-pink/40 bg-pink-soft/40 px-4 py-3 text-sm font-semibold text-pink" role="status" aria-live="polite">
      <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" />
      {label}
    </div>
  );
}

export function ErrorNote({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger" role="alert">
      <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
      <span className="min-w-0 flex-1 break-words">{message}</span>
      {onRetry && (
        <Button type="button" variant="danger" size="sm" className="min-h-11" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
