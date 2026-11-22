"use client";

import * as React from "react";
import { Bookmark, Check, CheckCircle2, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/shared/CopyButton";
import { useAppContext } from "@/components/providers/AppProviders";
import { buildVocabularyQuestions, type VocabularyWord } from "@/data/vocabulary";
import { markWordLearned, toggleSavedWord } from "@/lib/storage/store";
import { cn } from "@/lib/utils";

interface VocabularyWordCardProps {
  word: VocabularyWord;
  saved: boolean;
  learned: boolean;
  showQuiz?: boolean;
  className?: string;
}

export function VocabularyWordCard({ word, saved, learned, showQuiz = false, className }: VocabularyWordCardProps) {
  const { toast } = useAppContext();
  const [chosen, setChosen] = React.useState<number | null>(null);
  const question = React.useMemo(() => buildVocabularyQuestions([word])[0], [word]);

  React.useEffect(() => {
    setChosen(null);
  }, [word.word]);

  function handleSave() {
    toggleSavedWord(word.word);
    toast(saved ? `Removed ${word.word} from saved words` : `Saved ${word.word} for revision`, "success");
  }

  function handleLearned() {
    if (learned) return;
    markWordLearned(word.word);
    toast(`Nice! ${word.word} marked as learned.`, "success");
  }

  return (
    <Card className={cn("flex h-full flex-col p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-lg", className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-xl font-extrabold tracking-tight break-words">{word.word}</h3>
          <p className="mt-0.5 text-xs font-semibold text-primary">{word.pronunciation}</p>
        </div>
        <Badge variant="outline" className="shrink-0">{word.category}</Badge>
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-wide text-muted">English</p>
          <p className="mt-0.5 leading-relaxed">{word.englishMeaning}</p>
        </div>
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-wide text-muted">Telugu</p>
          <p lang="te" className="mt-0.5 leading-relaxed">{word.teluguMeaning}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface-muted/50 p-3">
          <p className="text-[0.68rem] font-bold uppercase tracking-wide text-muted">Example</p>
          <p className="mt-1 break-words leading-relaxed">{word.example}</p>
          <div className="-ml-2 mt-1">
            <CopyButton text={word.example} label="Copy sentence" />
          </div>
        </div>
        {word.synonyms.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-muted">Similar:</span>
            {word.synonyms.map((synonym) => (
              <Badge key={synonym} variant="default" className="normal-case tracking-normal">
                {synonym}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
        <Button variant={saved ? "secondary" : "outline"} size="sm" onClick={handleSave} aria-pressed={saved}>
          <Bookmark className={saved ? "fill-current" : ""} aria-hidden="true" />
          {saved ? "Saved" : "Save word"}
        </Button>
        <Button variant={learned ? "secondary" : "default"} size="sm" onClick={handleLearned} disabled={learned} aria-pressed={learned}>
          {learned ? <CheckCircle2 aria-hidden="true" /> : <Check aria-hidden="true" />}
          {learned ? "Learned" : "Mark learned"}
        </Button>
      </div>

      {showQuiz && (
        <div className="mt-4 rounded-xl border border-primary/15 bg-primary-soft/35 p-3.5">
          <p className="flex items-center gap-1.5 text-xs font-bold text-primary">
            <Lightbulb className="size-3.5" aria-hidden="true" /> Quick check
          </p>
          <p className="mt-1.5 text-sm font-semibold break-words">{question.prompt}</p>
          <div className="mt-2.5 grid gap-1.5" role="radiogroup" aria-label={`Choose the meaning of ${word.word}`}>
            {question.options.map((option, index) => {
              const isAnswer = index === question.answerIndex;
              const isChosen = index === chosen;
              return (
                <button
                  key={`${word.word}-check-${index}`}
                  type="button"
                  role="radio"
                  aria-checked={isChosen}
                  disabled={chosen !== null}
                  onClick={() => setChosen(index)}
                  className={cn(
                    "min-h-10 rounded-lg border border-border-strong bg-surface px-3 py-2 text-left text-xs font-medium leading-snug transition-colors hover:border-primary/60 disabled:cursor-default",
                    chosen !== null && isAnswer && "border-success bg-success-soft text-success",
                    chosen !== null && isChosen && !isAnswer && "border-danger bg-danger-soft text-danger",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {chosen !== null && (
            <p role="status" className="mt-2 text-xs leading-relaxed text-muted">
              {chosen === question.answerIndex ? "Correct! " : `The answer is: ${question.options[question.answerIndex]}. `}
              {question.explanation}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
