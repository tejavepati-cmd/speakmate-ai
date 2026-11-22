"use client";

import * as React from "react";
import { Play, RotateCcw, Square } from "lucide-react";
import type { TypingResult } from "@/lib/types";
import {
  TYPING_CATEGORIES,
  TYPING_LEVELS,
  categoryLabel,
  getPassage,
  getPassages,
  levelLabel,
  type TypingCategoryId,
  type TypingLevel,
} from "@/data/typing";
import {
  buildTargetStream,
  computeStats,
  createTypingResult,
  durationLabel,
  formatTimer,
} from "@/lib/typing/engine";
import { playKeySound } from "@/lib/typing/sound";
import { addTypingResult, uid, updateSettings, useAppData } from "@/lib/storage/store";
import { useAppContext } from "@/components/providers/AppProviders";
import { clamp, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypingPassage } from "./TypingPassage";
import { TypingResults } from "./TypingResults";
import { TypingHistory } from "./TypingHistory";

type Phase = "idle" | "running" | "finished";
type DurationKey = "30" | "60" | "180" | "custom";

const DURATION_OPTIONS: Array<{ key: DurationKey; label: string }> = [
  { key: "30", label: "30 sec" },
  { key: "60", label: "1 min" },
  { key: "180", label: "3 min" },
  { key: "custom", label: "Custom" },
];

function LiveStat({ label, value, className }: { label: string; value: string | number; className?: string }) {
  return (
    <div className="rounded-xl bg-surface-muted/70 px-3 py-2">
      <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className={cn("mt-0.5 text-lg font-extrabold tabular-nums", className)}>{value}</p>
    </div>
  );
}

export function TypingTrainer() {
  const { settings } = useAppData();
  const { toast } = useAppContext();

  const [level, setLevel] = React.useState<TypingLevel>("beginner");
  const [category, setCategory] = React.useState<TypingCategoryId>("daily");
  const [durationKey, setDurationKey] = React.useState<DurationKey>("60");
  const [customSeconds, setCustomSeconds] = React.useState("60");
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [passageIndex, setPassageIndex] = React.useState(0);
  const [typed, setTyped] = React.useState("");
  const [backspaces, setBackspaces] = React.useState(0);
  const [elapsed, setElapsed] = React.useState(0);
  const [result, setResult] = React.useState<TypingResult | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const typedRef = React.useRef("");
  const backspacesRef = React.useRef(0);
  const startedAtRef = React.useRef(0);
  const finishedRef = React.useRef(false);
  const finishRef = React.useRef<(override?: number) => void>(() => undefined);

  const parsedCustom = Number.parseInt(customSeconds, 10);
  const durationSeconds = durationKey === "custom"
    ? clamp(Number.isFinite(parsedCustom) ? parsedCustom : 60, 15, 600)
    : Number(durationKey);

  const passage = React.useMemo(
    () => getPassage(level, category, passageIndex),
    [level, category, passageIndex],
  );
  const target = React.useMemo(
    () => buildTargetStream(passage.text, durationSeconds),
    [passage, durationSeconds],
  );
  const live = React.useMemo(
    () => computeStats(target, typed, backspaces, elapsed),
    [target, typed, backspaces, elapsed],
  );

  const resetToIdle = React.useCallback(() => {
    finishedRef.current = true;
    typedRef.current = "";
    backspacesRef.current = 0;
    setTyped("");
    setBackspaces(0);
    setElapsed(0);
    setResult(null);
    setPhase("idle");
  }, []);

  const startTest = React.useCallback((nextIndex: number) => {
    setPassageIndex(nextIndex);
    typedRef.current = "";
    backspacesRef.current = 0;
    finishedRef.current = false;
    setTyped("");
    setBackspaces(0);
    setElapsed(0);
    setResult(null);
    setPhase("running");
    startedAtRef.current = performance.now();
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const finish = React.useCallback((override?: number) => {
    if (finishedRef.current) return;
    const raw = override ?? (performance.now() - startedAtRef.current) / 1000;
    const seconds = Math.max(1, Math.min(raw, durationSeconds));
    finishedRef.current = true;

    const completed = createTypingResult({
      id: uid(),
      date: new Date().toISOString(),
      level,
      category,
      durationSeconds: Math.round(seconds),
      target,
      typed: typedRef.current,
      backspaces: backspacesRef.current,
      elapsedSeconds: seconds,
    });

    setElapsed(seconds);
    setResult(completed);
    setPhase("finished");
    addTypingResult(completed);
    inputRef.current?.blur();
  }, [category, durationSeconds, level, target]);

  finishRef.current = finish;

  React.useEffect(() => {
    if (phase !== "running") return;
    const id = window.setInterval(() => {
      const seconds = (performance.now() - startedAtRef.current) / 1000;
      setElapsed(seconds);
      if (seconds >= durationSeconds) finishRef.current(seconds);
    }, 100);
    return () => window.clearInterval(id);
  }, [phase, durationSeconds]);

  function changeLevel(next: TypingLevel) {
    if (next === level) return;
    setLevel(next);
    setPassageIndex(0);
    resetToIdle();
  }

  function changeCategory(next: TypingCategoryId) {
    if (next === category) return;
    setCategory(next);
    setPassageIndex(0);
    resetToIdle();
  }

  function changeDuration(next: DurationKey) {
    if (next === durationKey) return;
    setDurationKey(next);
    resetToIdle();
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (phase !== "running") return;
    const next = event.target.value.slice(0, target.length);
    const previous = typedRef.current;

    if (next.length < previous.length) {
      backspacesRef.current += previous.length - next.length;
      setBackspaces(backspacesRef.current);
    } else if (next.length > previous.length && settings.soundEnabled) {
      playKeySound(next[previous.length] === target[previous.length]);
    }

    typedRef.current = next;
    setTyped(next);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") event.preventDefault();
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    toast("Pasting is disabled during a typing test — type it yourself to build speed.", "info");
  }

  const remaining = Math.max(0, durationSeconds - elapsed);
  const timeProgress = Math.min(100, (elapsed / durationSeconds) * 100);
  const locked = phase === "running";

  return (
    <div>
      <Card className="p-4 md:p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-bold">Test setup</h3>
            <p className="mt-0.5 text-xs text-muted">
              Pick a level, topic and time. Every finished test is saved automatically.
            </p>
          </div>
          {locked && <Badge variant="success">Test in progress</Badge>}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Level</p>
            <Tabs value={level} onValueChange={(value) => changeLevel(value as TypingLevel)}>
              <TabsList className="grid grid-cols-3">
                {TYPING_LEVELS.map((item) => (
                  <TabsTrigger key={item.id} value={item.id} disabled={locked}>
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <p className="mt-2 text-xs text-muted">
              {TYPING_LEVELS.find((item) => item.id === level)?.description}
            </p>
          </div>

          <div>
            <label htmlFor="typing-category" className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted">
              Category
            </label>
            <Select value={category} onValueChange={(value) => changeCategory(value as TypingCategoryId)} disabled={locked}>
              <SelectTrigger id="typing-category">
                <SelectValue placeholder="Choose a topic" />
              </SelectTrigger>
              <SelectContent>
                {TYPING_CATEGORIES.map((item) => (
                  <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-2 text-xs text-muted">
              {TYPING_CATEGORIES.find((item) => item.id === category)?.description}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Duration</p>
          <Tabs value={durationKey} onValueChange={(value) => changeDuration(value as DurationKey)}>
            <TabsList className="grid grid-cols-4">
              {DURATION_OPTIONS.map((option) => (
                <TabsTrigger key={option.key} value={option.key} disabled={locked}>
                  {option.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          {durationKey === "custom" && (
            <div className="mt-3">
              <label htmlFor="custom-duration" className="mb-1.5 block text-xs font-semibold text-muted">
                Custom duration in seconds (15–600)
              </label>
              <Input
                id="custom-duration"
                type="number"
                inputMode="numeric"
                min={15}
                max={600}
                step={5}
                value={customSeconds}
                disabled={locked}
                onChange={(event) => {
                  setCustomSeconds(event.target.value);
                  if (phase !== "idle") resetToIdle();
                }}
                className="max-w-48"
              />
              <p className="mt-1 text-xs text-muted">Test length: {durationLabel(durationSeconds)}</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <Switch
            id="typing-sound"
            checked={settings.soundEnabled}
            onCheckedChange={(value) => updateSettings({ soundEnabled: value })}
            disabled={locked}
          />
          <label htmlFor="typing-sound" className="text-sm font-medium">Subtle key sounds</label>
          <span className="ml-auto text-xs text-muted">
            Passage {(passageIndex % getPassages(level, category).length) + 1} of {getPassages(level, category).length}
          </span>
        </div>
      </Card>

      {phase === "finished" && result ? (
        <TypingResults
          result={result}
          onTryAgain={() => startTest(passageIndex + 1)}
          onChangeSetup={resetToIdle}
        />
      ) : (
        <Card className="mt-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-4">
            <div className="flex flex-wrap gap-2">
              <Badge>{levelLabel(level)}</Badge>
              <Badge variant="outline">{categoryLabel(category)}</Badge>
              <Badge variant={locked ? "success" : "outline"}>{durationLabel(durationSeconds)}</Badge>
            </div>
            <p className="font-mono text-lg font-extrabold tabular-nums" aria-label={`${formatTimer(remaining)} remaining`}>
              {formatTimer(remaining)}
            </p>
          </div>

          <Progress
            value={timeProgress}
            className="h-1.5 rounded-none"
            indicatorClassName="bg-gradient-to-r from-primary to-secondary"
          />

          <div className="grid grid-cols-3 gap-2 p-4 md:grid-cols-6">
            <LiveStat label="WPM" value={live.wpm} className="text-primary" />
            <LiveStat label="Accuracy" value={`${live.accuracy}%`} />
            <LiveStat label="Correct" value={live.correctChars} className="text-success" />
            <LiveStat label="Wrong" value={live.incorrectChars} className="text-danger" />
            <LiveStat label="Backspaces" value={live.backspaces} />
            <LiveStat label="Typed" value={live.totalTypedCharacters} />
          </div>

          <div className="px-4 pb-4">
            <p id="typing-help" className="mb-2 text-xs leading-relaxed text-muted">
              Type exactly what you see. Green means correct, red means a mistake. Tapping the passage focuses your
              keyboard. Backspaces are tracked but never counted against accuracy.
            </p>
            <TypingPassage
              target={target}
              typed={typed}
              active={locked}
              inputRef={inputRef}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border p-4">
            {locked ? (
              <>
                <Button variant="danger" onClick={() => finish()}>
                  <Square className="size-4" aria-hidden="true" />
                  Finish early
                </Button>
                <Button variant="secondary" onClick={() => startTest(passageIndex)}>
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Restart
                </Button>
                <span className="text-xs text-muted">Setup unlocks when the test ends.</span>
              </>
            ) : (
              <>
                <Button onClick={() => startTest(passageIndex)}>
                  <Play className="size-4" aria-hidden="true" />
                  Start test
                </Button>
                <Button variant="secondary" onClick={() => startTest(passageIndex + 1)}>
                  <RotateCcw className="size-4" aria-hidden="true" />
                  New passage
                </Button>
                <span className="text-xs text-muted">Press Start, then tap the passage to focus your keyboard.</span>
              </>
            )}
          </div>
        </Card>
      )}

      <TypingHistory level={level} durationSeconds={durationSeconds} />
    </div>
  );
}
