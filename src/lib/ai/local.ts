import type { AIRequestPayload, AIResponse } from "@/lib/types";
import { translateRoman, isLikelyRomanTelugu, toTeluguScript } from "@/lib/translation/roman";
import { correctSentence } from "@/lib/correction/engine";
import { analyzeEmotion } from "@/lib/emotion/analyze";

const OFFLINE = "Offline practice (not AI): ";

function lastUserText(payload: AIRequestPayload): string {
  const fromMessages = [...(payload.messages ?? [])].reverse().find((message) => message.role === "user")?.content;
  return (payload.userText ?? fromMessages ?? "").trim();
}

function chatReply(text: string): { reply: string; teluguMeaning?: string; followUp?: string } {
  const lower = text.toLowerCase();
  const normalized = lower.replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
  if (isLikelyRomanTelugu(text)) {
    const translated = translateRoman(text);
    const meaning = translated.telugu || toTeluguScript(text);
    return {
      reply: `Nice — you said: "${translated.natural || text}". That is a good start! 🌱`,
      teluguMeaning: meaning,
      followUp: "Now try saying it in English in your own words.",
    };
  }
  if (/^(hi|hello|hey|namaste|vanakkam)\b/.test(normalized)) {
    return { reply: "Hello! It's good to talk to you. 😊", followUp: "How was your day so far?" };
  }
  if (/how are you|how r u|ela unna|how do you do/.test(normalized)) {
    return { reply: "I'm doing well, thank you! How are you?", followUp: "What made today interesting for you?" };
  }
  if (/what are you doing|em chestunnav|what r u doing/.test(normalized)) {
    return { reply: "I'm chatting with you! What are you doing today?", followUp: "Tell me one thing you did today." };
  }
  if (/can't speak english|dont know english|not good at english|english sarigga radu|learning english/.test(normalized)) {
    return {
      reply: "That's completely okay. We can learn together! One small sentence at a time.",
      teluguMeaning: "చింతించకండి. మెల్లగా కలిసి నేర్చుకుందాం.",
      followUp: "Try this: ‘I want to learn English.’ Now you try one sentence.",
    };
  }
  if (/thank/.test(normalized) || /dhanyavad/.test(normalized)) {
    return { reply: "You're very welcome! 😊", followUp: "What would you like to practise next?" };
  }
  if (/bye|goodbye|see you/.test(normalized)) {
    return { reply: "Goodbye! Keep practising — even two minutes a day helps.", followUp: undefined };
  }
  return {
    reply: `Thanks for sharing that. "${text}" is a good sentence to build on.`,
    followUp: "Can you tell me a little more about it?",
  };
}

export function localResponse(payload: AIRequestPayload): AIResponse {
  const text = lastUserText(payload);

  if (payload.mode === "translate") {
    const translated = translateRoman(text);
    if (translated.needsClarification) {
      return {
        ok: true,
        source: "offline",
        reply: `${OFFLINE}${translated.needsClarification}`,
        teluguMeaning: translated.telugu,
        followUp: translated.exampleResponse,
      };
    }
    return {
      ok: true,
      source: "offline",
      reply: `${OFFLINE}${translated.natural || text}\n\nProfessional: ${translated.professional}\n\nMeaning: ${translated.meaning}`,
      teluguMeaning: translated.telugu,
      followUp: translated.exampleResponse,
    };
  }

  if (payload.mode === "correct") {
    const correction = correctSentence(text);
    return {
      ok: true,
      source: "offline",
      reply: `${OFFLINE}Here's a gentle correction for your sentence.`,
      correction,
      followUp: correction.practice,
    };
  }

  if (payload.mode === "emotion") {
    const insight = analyzeEmotion(text);
    return {
      ok: true,
      source: "offline",
      reply: `${OFFLINE}${insight.summary}\n\n${insight.cues.map((cue) => `• ${cue.name}: ${cue.interpretation} Evidence: ${cue.evidence.join(", ")}`).join("\n") || "No clear cues."}\n\nSuggested reply: ${insight.suggestedReplies[0]}\n\n${insight.caution}`,
      followUp: insight.clarifyingQuestion,
    };
  }

  if (payload.mode === "reply") {
    return {
      ok: true,
      source: "offline",
      reply: `${OFFLINE}Friendly: “That sounds interesting — tell me more!”\nCaring: “How are you feeling about it?”\nCasual: “Nice! What happened next?”\nConfident: “I'd love to hear your take on this.”\n\nTone: friendly replies invite sharing, caring replies notice feelings, casual replies keep things light, and confident replies show interest without pressure.`,
      followUp: "Which tone feels most like you?",
    };
  }

  if (payload.mode === "simulate") {
    const correction = correctSentence(text);
    return {
      ok: true,
      source: "offline",
      reply: `${OFFLINE}Thanks — I followed your response. Your grammar is understandable, and your message is polite and clear. ${correction.explanation}`,
      correction,
      followUp: payload.context ? "Let's continue the scenario. What would you say next?" : "Could you add one more detail to keep the conversation going?",
    };
  }

  if (payload.mode === "feedback") {
    return {
      ok: true,
      source: "offline",
      reply: `${OFFLINE}Presentation feedback (self-check):\n• Grammar: check verb tenses and articles.\n• Clarity: lead with your main point.\n• Sentence formation: keep one idea per sentence.\n• Confidence: start with “I'm working on…” instead of “Maybe…”.\n• Vocabulary: use specific project words.\n• Professional tone: end with an invitation for questions.`,
      correction: correctSentence(text),
      followUp: "What question would you like the audience to ask you?",
    };
  }

  const chat = chatReply(text);
  const correction = payload.correctionMode === "always" ? correctSentence(text) : undefined;
  return {
    ok: true,
    source: "offline",
    reply: `${OFFLINE}${chat.reply}`,
    teluguMeaning: chat.teluguMeaning,
    followUp: chat.followUp,
    correction,
  };
}
