"use client";

import type { AIRequestPayload, AIResponse } from "@/lib/types";
import { getSnapshot } from "@/lib/storage/store";
import { localResponse } from "./local";

export function canUseOnlineAI(): boolean {
  if (typeof window === "undefined") return false;
  const { settings } = getSnapshot();
  return (
    navigator.onLine &&
    !settings.forceOffline &&
    settings.privacy.allowOnlineProcessing
  );
}

export async function askAI(payload: AIRequestPayload): Promise<AIResponse> {
  if (!canUseOnlineAI()) return localResponse(payload);
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return localResponse(payload);
    const data = (await response.json()) as AIResponse;
    if (!data.ok || !data.reply) return localResponse(payload);
    return data;
  } catch {
    return localResponse(payload);
  }
}
