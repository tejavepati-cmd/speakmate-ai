import { NextResponse } from "next/server";
import { z } from "zod";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import type { AIResponse, Correction } from "@/lib/types";

export const runtime = "nodejs";

const correctionSchema = z.object({
  original: z.string(),
  correct: z.string(),
  natural: z.string(),
  professional: z.string(),
  telugu: z.string(),
  explanation: z.string(),
  practice: z.string(),
});

const bodySchema = z.object({
  mode: z.enum(["chat", "translate", "correct", "emotion", "simulate", "reply", "feedback"]),
  userText: z.string().max(4000).optional(),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .max(40)
    .optional(),
  context: z.string().max(2000).optional(),
  tone: z.string().max(120).optional(),
  difficulty: z.enum(["easy", "medium", "advanced"]).optional(),
  explanationLanguage: z.enum(["en", "te"]).optional(),
  correctionMode: z.enum(["always", "request", "casual"]).optional(),
});

function extractJson(raw: string): AIResponse {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  try {
    const parsed = JSON.parse(cleaned) as Partial<AIResponse>;
    if (!parsed.reply || typeof parsed.reply !== "string") throw new Error("Missing reply");
    const correction = parsed.correction
      ? correctionSchema.safeParse(parsed.correction)
      : null;
    return {
      ok: true,
      source: "ai",
      reply: parsed.reply,
      teluguMeaning: typeof parsed.teluguMeaning === "string" ? parsed.teluguMeaning : undefined,
      followUp: typeof parsed.followUp === "string" ? parsed.followUp : undefined,
      correction: correction?.success ? (correction.data as Correction) : undefined,
    };
  } catch {
    return { ok: true, source: "ai", reply: cleaned || "I'm here — could you say that again?" };
  }
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, source: "offline", error: "INVALID_REQUEST", reply: "" } satisfies AIResponse, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, source: "offline", error: "INVALID_REQUEST", reply: "" } satisfies AIResponse,
      { status: 400 },
    );
  }

  const apiKey = process.env.AI_API_KEY;
  const baseUrl = process.env.AI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.AI_MODEL || "gpt-4o-mini";
  const timeout = Number(process.env.AI_TIMEOUT_MS || 20000);

  if (!apiKey) {
    return NextResponse.json(
      { ok: false, source: "offline", error: "AI_NOT_CONFIGURED", reply: "" } satisfies AIResponse,
      { status: 503 },
    );
  }

  const payload = parsed.data;
  const messages = payload.messages?.length
    ? payload.messages
    : payload.userText
      ? [{ role: "user" as const, content: payload.userText }]
      : [];

  if (!messages.length) {
    return NextResponse.json(
      { ok: false, source: "offline", error: "EMPTY_MESSAGE", reply: "" } satisfies AIResponse,
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        max_tokens: 900,
        messages: [
          { role: "system", content: buildSystemPrompt(payload) },
          ...messages,
        ],
      }),
      signal: AbortSignal.timeout(timeout),
      cache: "no-store",
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("AI provider error", response.status, detail.slice(0, 400));
      return NextResponse.json(
        { ok: false, source: "offline", error: "AI_PROVIDER_ERROR", reply: "" } satisfies AIResponse,
        { status: 502 },
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty AI response");
    return NextResponse.json(extractJson(content));
  } catch (error) {
    console.error("AI request failed", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { ok: false, source: "offline", error: "AI_UNAVAILABLE", reply: "" } satisfies AIResponse,
      { status: 502 },
    );
  }
}
