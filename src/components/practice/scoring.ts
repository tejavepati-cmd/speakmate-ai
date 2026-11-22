import { hasCommonMistake } from "@/lib/correction/engine";
import { clamp } from "@/lib/utils";

export const SCORE_KEYS = [
  "grammar",
  "clarity",
  "sentenceFormation",
  "confidence",
  "vocabulary",
  "professionalTone",
] as const;

export type ScoreKey = (typeof SCORE_KEYS)[number];

export const SCORE_LABELS: Record<ScoreKey, string> = {
  grammar: "Grammar",
  clarity: "Clarity",
  sentenceFormation: "Sentence formation",
  confidence: "Confidence",
  vocabulary: "Vocabulary",
  professionalTone: "Professional tone",
};

export type ScoreMap = Record<ScoreKey, number>;

export interface ScoreBreakdown {
  scores: ScoreMap;
  overall: number;
  /** True when at least one score was read from an actual AI response. */
  fromAI: boolean;
}

const NUMBER_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
};

const AI_LABELS: Record<ScoreKey, string[]> = {
  grammar: ["grammar", "accuracy"],
  clarity: ["clarity", "clear"],
  sentenceFormation: ["sentence formation", "structure", "sentence structure"],
  confidence: ["confidence", "confident"],
  vocabulary: ["vocabulary", "word choice", "lexis"],
  professionalTone: ["professional tone", "professionalism", "tone"],
};

/** Pull "Grammar: 8/10" (or "Grammar — 8") style scores out of an AI reply. */
function readAiScore(reply: string, key: ScoreKey): number | undefined {
  for (const label of AI_LABELS[key]) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const ratio = new RegExp(`(?:^|[\\n\\r•\\-*])\\s*${escaped}\\s*[:\\-–—]?\\s*(\\d{1,2})\\s*(?:/|out of)\\s*10`, "im");
    const ratioMatch = reply.match(ratio);
    if (ratioMatch) return clamp(Number(ratioMatch[1]), 1, 10);

    const plain = new RegExp(`(?:^|[\\n\\r•\\-*])\\s*${escaped}\\s*[:\\-–—]\\s*(\\d{1,2})(?:\\s*\\/\\s*10)?\\b`, "im");
    const plainMatch = reply.match(plain);
    if (plainMatch) return clamp(Number(plainMatch[1]), 1, 10);

    const words = new RegExp(`(?:^|[\\n\\r•\\-*])\\s*${escaped}\\s*[:\\-–—]\\s*(${Object.keys(NUMBER_WORDS).join("|")})\\b`, "im");
    const wordMatch = reply.match(words);
    if (wordMatch) return NUMBER_WORDS[wordMatch[1].toLowerCase()] || undefined;
  }
  return undefined;
}

/** Deterministic, explainable scoring used when no online AI is available. */
export function localRubric(text: string): ScoreMap {
  const trimmed = text.trim();
  const words = trimmed.match(/[A-Za-z][A-Za-z'’-]*/g) ?? [];
  const sentences = trimmed.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean);
  const unique = new Set(words.map((word) => word.toLowerCase()));
  const lower = trimmed.toLowerCase();

  const mistakes = hasCommonMistake(trimmed) ? 1 : 0;
  const grammar = clamp(
    9 - mistakes * 3 - (words.length > 6 && !/[.!?]$/.test(trimmed) ? 1 : 0) - (words.length > 0 && !/^[A-Z]/.test(trimmed) ? 1 : 0),
    3,
    10,
  );

  let clarity = 8;
  if (words.length < 8) clarity -= 3;
  else if (words.length < 15) clarity -= 1;
  else if (words.length > 110) clarity -= 3;
  else if (words.length > 75) clarity -= 1;
  if (/\b(maybe|kind of|sort of|i don't know|not sure)\b/.test(lower)) clarity -= 1;
  clarity = clamp(clarity, 3, 10);

  const avgSentenceWords = sentences.length ? words.length / sentences.length : words.length;
  let sentenceFormation = 8;
  if (sentences.length === 0) sentenceFormation = 3;
  else if (avgSentenceWords > 28) sentenceFormation -= 3;
  else if (avgSentenceWords > 20) sentenceFormation -= 1;
  else if (avgSentenceWords < 4) sentenceFormation -= 2;
  if (words.length > 12 && sentences.length === 1) sentenceFormation -= 1;
  sentenceFormation = clamp(sentenceFormation, 3, 10);

  const hedges = (lower.match(/\b(maybe|probably|perhaps|i think|i guess|kind of|sort of|just|hopefully)\b/g) ?? []).length;
  const confidentStart = /^(i |we |my |our |i'm |i am )/.test(lower);
  let confidence = 8 - Math.min(hedges, 3) + (confidentStart ? 1 : 0);
  if (words.length < 6) confidence -= 2;
  confidence = clamp(confidence, 3, 10);

  const avgWordLength = words.length ? words.reduce((sum, word) => sum + word.length, 0) / words.length : 0;
  const variety = words.length ? unique.size / words.length : 0;
  let vocabulary = 6 + (avgWordLength > 5 ? 1 : 0) + (avgWordLength > 6 ? 1 : 0) + (variety > 0.75 ? 1 : 0);
  if (words.length < 8) vocabulary -= 2;
  vocabulary = clamp(vocabulary, 3, 10);

  const polite = /\b(please|thank you|thanks|could you|would you|i'd appreciate|happy to|glad to|welcome)\b/.test(lower);
  const slang = /\b(gonna|wanna|yeah|lol|dude|whatever|nah|bro)\b/.test(lower);
  let professionalTone = 7 + (polite ? 2 : 0) - (slang ? 3 : 0);
  if (words.length < 8) professionalTone -= 2;
  professionalTone = clamp(professionalTone, 3, 10);

  return { grammar, clarity, sentenceFormation, confidence, vocabulary, professionalTone };
}

/** Combine real AI scores (when present) with the local rubric for missing ones. */
export function scoreResponse(text: string, reply: string, source?: "ai" | "offline"): ScoreBreakdown {
  const local = localRubric(text);
  const scores: ScoreMap = { ...local };
  let fromAI = false;

  if (source === "ai" && reply) {
    for (const key of SCORE_KEYS) {
      const value = readAiScore(reply, key);
      if (value !== undefined) {
        scores[key] = value;
        fromAI = true;
      }
    }
  }

  const overall = Math.round(SCORE_KEYS.reduce((sum, key) => sum + scores[key], 0) / SCORE_KEYS.length);
  return { scores, overall, fromAI };
}
