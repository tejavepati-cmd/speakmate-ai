import type { TypingResult } from "@/lib/types";

export type CharState = "pending" | "correct" | "incorrect";

export interface LiveStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  backspaces: number;
  totalTypedCharacters: number;
  elapsedSeconds: number;
}

// Generous upper bound (144 WPM) so a long custom test never runs out of text.
const CHARS_PER_SECOND = 12;
const MIN_STREAM_LENGTH = 600;

/**
 * Repeat a passage into a continuous stream so even a 600-second test always
 * has text to type. Repeats are separated by a single space.
 */
export function buildTargetStream(passage: string, durationSeconds: number): string {
  const clean = passage.trim().replace(/\s+/g, " ");
  if (!clean) return "The quick brown fox jumps over the lazy dog. ";
  const minimum = Math.max(MIN_STREAM_LENGTH, Math.ceil(Math.max(1, durationSeconds) * CHARS_PER_SECOND));
  let stream = "";
  while (stream.length < minimum) {
    stream += stream ? ` ${clean}` : clean;
  }
  return stream;
}

export function charStateAt(target: string, typed: string, index: number): CharState {
  if (index < 0 || index >= typed.length) return "pending";
  return target[index] === typed[index] ? "correct" : "incorrect";
}

/**
 * Standard five-character-word WPM from correct characters only.
 * Accuracy counts every attempted character (correct + incorrect); backspaces
 * are reported separately and are never added to totalTypedCharacters.
 */
export function computeStats(
  target: string,
  typed: string,
  backspaces: number,
  elapsedSeconds: number,
): LiveStats {
  let correctChars = 0;
  let incorrectChars = 0;

  for (let index = 0; index < typed.length; index += 1) {
    if (index < target.length && target[index] === typed[index]) correctChars += 1;
    else incorrectChars += 1;
  }

  const totalTypedCharacters = correctChars + incorrectChars;
  const minutes = Math.max(0, elapsedSeconds) / 60;
  const wpm = minutes > 0 ? Math.round(correctChars / 5 / minutes) : 0;
  const accuracy = totalTypedCharacters > 0
    ? Math.round((correctChars / totalTypedCharacters) * 1000) / 10
    : 100;

  return {
    wpm,
    accuracy,
    correctChars,
    incorrectChars,
    backspaces,
    totalTypedCharacters,
    elapsedSeconds,
  };
}

export interface CreateResultInput {
  id: string;
  date: string;
  level: TypingResult["level"];
  category: string;
  durationSeconds: number;
  target: string;
  typed: string;
  backspaces: number;
  elapsedSeconds: number;
}

export function createTypingResult(input: CreateResultInput): TypingResult {
  const stats = computeStats(input.target, input.typed, input.backspaces, input.elapsedSeconds);
  return {
    id: input.id,
    date: input.date,
    durationSeconds: input.durationSeconds,
    level: input.level,
    category: input.category,
    wpm: stats.wpm,
    accuracy: stats.accuracy,
    correctChars: stats.correctChars,
    incorrectChars: stats.incorrectChars,
    backspaces: stats.backspaces,
    totalChars: stats.totalTypedCharacters,
  };
}

export interface PersonalBest {
  result: TypingResult;
  scope: "duration" | "level";
}

/** Best WPM for the given level, preferring results at the same test duration. */
export function personalBest(
  results: TypingResult[],
  level: TypingResult["level"],
  durationSeconds: number,
): PersonalBest | null {
  const sameLevel = results.filter((result) => result.level === level);
  const best = (list: TypingResult[]): TypingResult | null =>
    list.reduce<TypingResult | null>(
      (top, result) => (!top || result.wpm > top.wpm ? result : top),
      null,
    );

  const sameDuration = sameLevel.filter(
    (result) => Math.abs(result.durationSeconds - durationSeconds) <= 2,
  );
  const durationBest = best(sameDuration);
  if (durationBest) return { result: durationBest, scope: "duration" };

  const levelBest = best(sameLevel);
  return levelBest ? { result: levelBest, scope: "level" } : null;
}

/** mm:ss display for a live countdown, rounding up so 0:01 shows until the end. */
export function formatTimer(seconds: number): string {
  const total = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(total / 60);
  return `${minutes}:${String(total % 60).padStart(2, "0")}`;
}

export function durationLabel(seconds: number): string {
  if (seconds < 60) return `${seconds}s test`;
  if (seconds % 60 === 0) return `${seconds / 60}m test`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s test`;
}
