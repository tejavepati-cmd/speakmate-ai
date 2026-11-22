"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, MessageSquareText, Sparkles, Trash2 } from "lucide-react";
import type { Difficulty } from "@/lib/types";
import { deleteConversation, useAppData } from "@/lib/storage/store";
import { cn, formatDate } from "@/lib/utils";
import { useAppContext } from "@/components/providers/AppProviders";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  difficultyOptions,
  findScenario,
  findScenarioMode,
  roleplayScenarios,
  scenarioModes,
  scenariosForMode,
  type ScenarioModeId,
} from "@/data/scenarios";
import { RoleplayChat } from "@/components/practice/RoleplayChat";

const savedKinds = ["practice", "girltalk", "flirting"];

export default function PracticePage() {
  const { conversations, practiceSessions } = useAppData();
  const { toast } = useAppContext();
  const [modeId, setModeId] = React.useState<ScenarioModeId>("daily");
  const [difficulty, setDifficulty] = React.useState<Difficulty>("easy");
  const [scenarioId, setScenarioId] = React.useState<string | null>(null);

  const mode = findScenarioMode(modeId) ?? scenarioModes[0];
  const scenarios = scenariosForMode(modeId);
  const selected = scenarioId ? findScenario(scenarioId) : undefined;
  const allSavedChats = conversations.filter((conversation) => savedKinds.includes(conversation.kind));
  const savedChats = [...allSavedChats].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6);

  function removeSaved(id: string, title: string) {
    deleteConversation(id);
    toast(`Deleted “${title}”`, "info");
  }

  return (
    <div className="mx-auto min-w-0 max-w-6xl px-4 py-6 md:px-6 md:py-10">
      <PageHeader
        eyebrow="Roleplay Lab"
        title="Practice Simulator"
        description="Choose a situation, reply as yourself, and get a realistic response with correction, tone notes and a better alternative."
        icon={Sparkles}
        actions={
          <Button asChild variant="outline">
            <Link href="/professional/presentation">
              <ArrowRight className="size-4" aria-hidden="true" />
              Presentation simulator
            </Link>
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Scenarios" value={roleplayScenarios.length} hint="Across eight conversation modes" icon={MessageSquareText} />
        <StatCard label="Sessions saved" value={practiceSessions.length} hint="Roleplay and professional" icon={Sparkles} tone="green" />
        <StatCard label="Saved chats" value={allSavedChats.length} hint="Stored on this device" icon={MessageSquareText} tone="blue" />
      </div>

      {!selected ? (
        <div className="mt-8 min-w-0 space-y-7">
          <section aria-labelledby="mode-picker" className="min-w-0">
            <h3 id="mode-picker" className="text-lg font-bold">
              1. Choose a mode
            </h3>
            <p className="mb-3 text-xs text-muted">Pink modes link to the specialised GirlTalk coaches.</p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {scenarioModes.map((item) => {
                const active = item.id === modeId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setModeId(item.id);
                      setScenarioId(null);
                    }}
                    aria-pressed={active}
                    className={cn(
                      "flex min-h-11 min-w-0 flex-col items-start gap-1 rounded-card border p-3.5 text-left transition-all",
                      item.accent === "pink"
                        ? active
                          ? "border-pink/60 bg-pink-soft shadow-card"
                          : "border-border bg-surface hover:border-pink/50 hover:bg-pink-soft/40"
                        : active
                          ? "border-primary/60 bg-primary-soft/70 shadow-card"
                          : "border-border bg-surface hover:border-primary/40 hover:bg-primary-soft/30",
                    )}
                  >
                    <span className={cn("text-sm font-bold", item.accent === "pink" && active && "text-pink")}>{item.label}</span>
                    <span className="break-words text-[0.7rem] leading-relaxed text-muted">{item.description}</span>
                  </button>
                );
              })}
            </div>
            {mode.href && (
              <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-pink-soft p-3 text-xs">
                <span className="min-w-0 flex-1 break-words text-muted">
                  Want a guided experience instead? Try the dedicated coach.
                </span>
                <Button asChild variant="pink" size="sm" className="min-h-11">
                  <Link href={mode.href}>{mode.hrefLabel}</Link>
                </Button>
              </div>
            )}
          </section>

          <section aria-labelledby="difficulty-picker" className="min-w-0">
            <h3 id="difficulty-picker" className="text-lg font-bold">
              2. Pick a difficulty
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {difficultyOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDifficulty(option.value)}
                  aria-pressed={difficulty === option.value}
                  className={cn(
                    "flex min-h-11 min-w-0 flex-col items-start rounded-xl border px-4 py-2 text-left transition-colors",
                    difficulty === option.value
                      ? "border-primary/60 bg-primary-soft/70"
                      : "border-border bg-surface hover:border-primary/40",
                  )}
                >
                  <span className="text-sm font-bold">{option.label}</span>
                  <span className="text-[0.68rem] text-muted">{option.hint}</span>
                </button>
              ))}
            </div>
          </section>

          <section aria-labelledby="scenario-picker" className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 id="scenario-picker" className="text-lg font-bold">
                3. Start a scenario
              </h3>
              <Badge variant={mode.accent === "pink" ? "pink" : "default"}>{scenarios.length} available</Badge>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => setScenarioId(scenario.id)}
                  className="flex min-h-11 min-w-0 flex-col items-start gap-2 rounded-card border border-border bg-surface p-4 text-left transition-all hover:border-primary/50 hover:shadow-card"
                >
                  <span className="text-sm font-bold">{scenario.title}</span>
                  <span className="break-words text-xs leading-relaxed text-muted">{scenario.situation}</span>
                  <span className="mt-auto flex flex-wrap gap-1.5">
                    {scenario.goals.slice(0, 2).map((goal) => (
                      <span key={goal} className="rounded-lg bg-surface-muted px-2 py-1 text-[0.68rem] text-muted">
                        {goal}
                      </span>
                    ))}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                    Start roleplay
                    <ArrowRight className="size-3" aria-hidden="true" />
                  </span>
                </button>
              ))}
            </div>
          </section>

          {savedChats.length > 0 && (
            <section aria-labelledby="saved-chats" className="min-w-0">
              <h3 id="saved-chats" className="text-lg font-bold">
                Saved conversations
              </h3>
              <div className="mt-3 space-y-2">
                {savedChats.map((conversation) => (
                  <div key={conversation.id} className="flex min-w-0 flex-wrap items-center gap-2 rounded-xl border border-border bg-surface p-3">
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm font-bold">{conversation.title}</p>
                      <p className="text-[0.7rem] text-muted">
                        {conversation.messages.length} messages · {formatDate(conversation.updatedAt)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      className="min-h-11"
                      onClick={() => removeSaved(conversation.id, conversation.title)}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="mt-8 min-w-0">
          <RoleplayChat
            key={`${selected?.id ?? scenarioId}-${difficulty}`}
            scenario={selected ?? scenarios[0]}
            mode={mode}
            difficulty={difficulty}
            onExit={() => setScenarioId(null)}
          />
        </div>
      )}
    </div>
  );
}
