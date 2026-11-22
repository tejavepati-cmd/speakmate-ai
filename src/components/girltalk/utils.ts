import type { SimulationScenario } from "@/data/girltalk";
import { hasCommonMistake } from "@/lib/correction/engine";
import { clamp } from "@/lib/utils";

export const OFFLINE_LABEL = "Offline practice — not AI";

export function cleanText(value: string): string {
  return value
    .replace(/^\s*offline practice \(not ai\)\s*[:：]?\s*/i, "")
    .replace(/\*\*/g, "")
    .trim();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function cleanToneText(value: string): string {
  return cleanText(value)
    .replace(/^[“"'《]+|[”"'》]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extracts labelled replies such as "Friendly: ..." from an AI or local reply.
 * Returns null when the text does not contain at least two labelled sections.
 */
export function parseToneReplies(
  text: string,
  keys: readonly string[],
): { replies: Record<string, string>; explanation: string } | null {
  const cleaned = cleanText(text);
  const keyPattern = keys.map(escapeRegex).join("|");
  const stopPattern = `\\n\\s*\\*{0,2}(?:${keyPattern}|tone|why|note|explanation|reason)\\*{0,2}\\s*[:：\\-]`;
  const replies: Record<string, string> = {};
  let remainder = cleaned;

  for (const key of keys) {
    const pattern = new RegExp(
      `(?:^|\\n)\\s*\\*{0,2}${escapeRegex(key)}\\*{0,2}\\s*[:：\\-]\\s*([\\s\\S]*?)(?=${stopPattern}|$)`,
      "i",
    );
    const match = pattern.exec(cleaned);
    if (!match) continue;
    const value = cleanToneText(match[1]);
    if (!value) continue;
    replies[key] = value;
    remainder = remainder.replace(match[0], " ");
  }

  if (Object.keys(replies).length < Math.min(2, keys.length)) return null;

  const explanation = remainder
    .replace(/^\s*(?:tone|why|note|explanation|reason)\s*[:：\-]\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();

  return { replies, explanation };
}

export function friendlyAIError(error?: string): string {
  switch (error) {
    case "AI_NOT_CONFIGURED":
      return "AI is not configured on this device. Local practice is ready instead.";
    case "AI_UNAVAILABLE":
    case "AI_PROVIDER_ERROR":
      return "The AI service is unavailable right now. Please try again.";
    case "INVALID_REQUEST":
    case "EMPTY_MESSAGE":
      return "Please add a little more text and try again.";
    default:
      return "That response did not come through. Please try again.";
  }
}

export interface DimensionScore {
  name: string;
  score: number;
  note: string;
}

/** Deterministic, text-based self-check. No random or invented scores. */
export function evaluateResponse(text: string, variant: "social" | "flirting"): DimensionScore[] {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const sentences = trimmed.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean);
  const longestSentence = sentences.length
    ? Math.max(...sentences.map((sentence) => sentence.split(/\s+/).length))
    : 0;
  const lower = trimmed.toLowerCase();

  const hasQuestion = /\?/.test(trimmed) || /\b(what|how|why|when|tell me|do you|are you|could you|would you)\b/i.test(trimmed);
  const polite = /\b(please|thank|thanks|sorry|excuse me|would you|could you|appreciate)\b/i.test(lower);
  const empathy = /\b(sorry|hear you|understand|feel|feeling|care|sounds|tough|hard|happy for|congrat|glad|support|relief)\b/.test(lower);
  const respectful = /\b(no pressure|your choice|up to you|comfortable|respect|totally fine|no worries|don't worry|take care|whenever|only if|if you'd like)\b/.test(lower);
  const pushy = /\b(you must|you have to|why didn't|hurry up|come on|ignore them|don't take no|prove it)\b/.test(lower);
  const natural = /\b(i'm|i've|that's|don't|can't|let's|okay|haha|hey|nice|same here)\b/.test(lower) ||
    (words.length > 0 && words.length < 22);
  const clear = words.length >= 4 && words.length <= 70 && longestSentence <= 22;
  const grammarOk = !hasCommonMistake(trimmed);
  const confident =
    /\b(i |i'm|i'd|i'll|i think|i enjoy|i would|let's|could we)\b/.test(lower) &&
    !/\b(maybe maybe|just wondering if maybe)\b/.test(lower);
  const humour = /\b(haha|hehe|lol|😂|😄|joke|funny|silly|just kidding|takeaway)\b/.test(lower);

  const capped = (value: number) => clamp(value, 1, 10);

  if (variant === "flirting") {
    return [
      {
        name: "Confidence",
        score: capped(confident ? (pushy ? 6 : 9) : 6),
        note: confident ? "You speak from your own point of view." : "Try an 'I…' sentence to sound more sure of yourself.",
      },
      {
        name: "Naturalness",
        score: capped(natural ? (words.length > 45 ? 7 : 9) : 6),
        note: natural ? "It reads like a real message, not a script." : "Short, everyday words sound more natural.",
      },
      {
        name: "Humour",
        score: capped(humour ? 9 : words.length > 2 ? 6 : 4),
        note: humour ? "The playful tone is clear." : "A light joke or emoji can help, but only if it fits the moment.",
      },
      {
        name: "Respect",
        score: capped(pushy ? 3 : respectful ? 10 : 8),
        note: pushy ? "Pressure words lower this score. Keep the other person's choice central." : respectful ? "You leave room for a genuine yes or no." : "Add 'no pressure' or 'only if you'd like' when suggesting plans.",
      },
      {
        name: "Empathy",
        score: capped(empathy ? 9 : hasQuestion ? 7 : 5),
        note: empathy ? "You notice the other person's experience." : "Notice their day or feelings before sharing your own.",
      },
      {
        name: "Grammar",
        score: capped(grammarOk ? 9 : 5),
        note: grammarOk ? "No common grammar issues spotted." : "Check verb tenses and articles in the correction below.",
      },
    ];
  }

  return [
    {
      name: "Empathy",
      score: capped(empathy ? 9 : hasQuestion ? 7 : 5),
      note: empathy ? "You show awareness of how they might feel." : "A gentle 'that sounds…' or 'how are you…' adds care.",
    },
    {
      name: "Politeness",
      score: capped(polite ? 9 : respectful ? 8 : 6),
      note: polite ? "Your wording is considerate." : "A please, thank you or soft question helps.",
    },
    {
      name: "Naturalness",
      score: capped(natural ? (words.length > 45 ? 7 : 9) : 6),
      note: natural ? "It sounds like something a person would really say." : "Try shorter words and a contraction or two.",
    },
    {
      name: "Clarity",
      score: capped(clear ? 9 : words.length < 4 ? 4 : 6),
      note: clear ? "Your main point is easy to follow." : "Keep one idea per sentence and aim for 4–70 words.",
    },
    {
      name: "Grammar",
      score: capped(grammarOk ? 9 : 5),
      note: grammarOk ? "No common grammar issues spotted." : "See the gentle correction below.",
    },
    {
      name: "Confidence",
      score: capped(confident ? (pushy ? 6 : 8) : 6),
      note: confident ? "You express yourself without hiding." : "Start with 'I think…' or 'I'd like…' to sound steady.",
    },
    {
      name: "Respect",
      score: capped(pushy ? 3 : respectful ? 10 : 8),
      note: pushy ? "Remove pressure words and accept their answer." : respectful ? "You respect their choice and comfort." : "Make it easy for them to say no without explanation.",
    },
  ];
}

export function averageScore(scores: DimensionScore[]): number {
  if (!scores.length) return 0;
  return Math.round(scores.reduce((sum, item) => sum + item.score, 0) / scores.length);
}

export function scenarioTip(scenario: SimulationScenario): string {
  return `${scenario.emoji} ${scenario.title} · ${scenario.difficulty} practice. Focus: ${scenario.focus.join(", ")}.`;
}
