"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Award, BriefcaseBusiness, Presentation } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAppData } from "@/lib/storage/store";
import { findProfessionalModule, professionalCategories, professionalModules } from "@/data/professional";
import { ProfessionalWorkspace } from "@/components/practice/ProfessionalWorkspace";

export default function ProfessionalPage() {
  const { quizResults } = useAppData();
  const [selectedId, setSelectedId] = React.useState(professionalModules[0].id);
  const selected = findProfessionalModule(selectedId) ?? professionalModules[0];
  const professionalResults = quizResults.filter((result) => result.kind === "professional");
  const best = professionalResults.length
    ? Math.max(...professionalResults.map((result) => Math.round((result.score / result.total) * 100)))
    : 0;

  function choose(id: string) {
    setSelectedId(id);
    window.setTimeout(() => {
      document.getElementById("professional-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }

  return (
    <div className="mx-auto min-w-0 max-w-6xl px-4 py-6 md:px-6 md:py-10">
      <PageHeader
        eyebrow="Communication Lab"
        title="Professional English Coach"
        description="Ten focused modules for college, technical discussions, interviews and the workplace. Write a response, get feedback, and keep the conversation going."
        icon={BriefcaseBusiness}
        actions={
          <Button asChild variant="outline">
            <Link href="/professional/presentation">
              <Presentation className="size-4" aria-hidden="true" />
              Presentation simulator
            </Link>
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Practice modules" value={professionalModules.length} hint="Self-introduction to workplace" icon={BriefcaseBusiness} />
        <StatCard label="Sessions saved" value={professionalResults.length} hint="Across all modules" icon={Award} tone="green" />
        <StatCard label="Best score" value={best ? `${best}%` : "—"} hint="Your highest saved result" icon={Award} tone="blue" />
      </div>

      <section aria-labelledby="module-picker" className="mt-8 min-w-0">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 id="module-picker" className="text-lg font-bold">
              Choose a module
            </h3>
            <p className="text-xs text-muted">Pick any module — order does not matter.</p>
          </div>
          <Badge variant="outline">A – J</Badge>
        </div>

        <div className="space-y-6">
          {professionalCategories.map((category) => (
            <div key={category} className="min-w-0">
              <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted">{category}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {professionalModules
                  .filter((module) => module.category === category)
                  .map((module) => {
                    const active = module.id === selected.id;
                    return (
                      <button
                        key={module.id}
                        type="button"
                        onClick={() => choose(module.id)}
                        aria-pressed={active}
                        className={cn(
                          "flex min-h-11 min-w-0 flex-col items-start gap-2 rounded-card border p-4 text-left transition-all",
                          active
                            ? "border-primary/60 bg-primary-soft/70 shadow-card"
                            : "border-border bg-surface hover:border-primary/40 hover:bg-primary-soft/30",
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              "flex size-8 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold",
                              active ? "bg-primary text-primary-foreground" : "bg-surface-muted text-primary",
                            )}
                          >
                            {module.letter}
                          </span>
                          <span className="font-bold leading-tight">{module.title}</span>
                        </span>
                        <span className="break-words text-xs leading-relaxed text-muted">{module.description}</span>
                        <span className="mt-auto inline-flex items-center gap-1 text-[0.7rem] font-bold text-primary">
                          {active ? "Practising now" : "Practise"}
                          <ArrowRight className="size-3" aria-hidden="true" />
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="professional-workspace" className="mt-9 scroll-mt-24 min-w-0" aria-label="Practice workspace">
        <ProfessionalWorkspace key={selected.id} module={selected} />
      </section>

      <Card className="mt-8 min-w-0 bg-primary-soft/50 p-4 md:p-5">
        <p className="text-sm font-bold">How scoring works</p>
        <p className="mt-1 break-words text-xs leading-relaxed text-muted">
          When online AI is available, its six scores (grammar, clarity, sentence formation, confidence, vocabulary and professional tone)
          are used when present. Otherwise a transparent local rubric scores your response. The badge above each result always tells you which
          one you received.
        </p>
      </Card>
    </div>
  );
}
