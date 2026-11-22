"use client";

import { useSyncExternalStore } from "react";
import type {
  AppData,
  ChatMessage,
  Conversation,
  ConversationKind,
  PracticeSession,
  QuizResult,
  Settings,
  TypingResult,
} from "@/lib/types";
import { loadConversations, loadMirror, persistConversations, persistMirror } from "./db";

const STORAGE_KEY = "speakmate.app.v1";

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function dateKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function defaultSettings(): Settings {
  return {
    theme: "system",
    explanationLanguage: "en",
    correctionMode: "request",
    difficulty: "easy",
    dailyGoalMinutes: 15,
    soundEnabled: true,
    forceOffline: false,
    aiProvider: "none",
    aiModel: "gpt-4o-mini",
    aiBaseUrl: "https://api.openai.com/v1",
    privacy: {
      saveConversations: true,
      allowOnlineProcessing: true,
      personalizedTips: true,
    },
  };
}

export function createDefaultData(): AppData {
  return {
    settings: defaultSettings(),
    typingResults: [],
    quizResults: [],
    conversations: [],
    practiceSessions: [],
    learnedWords: [],
    savedWords: [],
    completedLessons: [],
    dailyActivity: {},
    streak: 0,
    lastActiveDate: null,
    vocabularyStreak: 0,
    lastVocabularyDate: null,
  };
}

// Stable server snapshot prevents hydration mismatches.
const serverSnapshot: AppData = createDefaultData();
let state: AppData = serverSnapshot;
const listeners = new Set<() => void>();
let hydrated = false;

function emit(): void {
  listeners.forEach((listener) => listener());
}

function persist(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage quota or disabled storage: keep in-memory state usable.
  }
  void persistConversations(state.settings.privacy.saveConversations ? state.conversations : []);
  void persistMirror({
    typingResults: state.typingResults,
    quizResults: state.quizResults,
    practiceSessions: state.practiceSessions,
    learnedWords: state.learnedWords,
    savedWords: state.savedWords,
    completedLessons: state.completedLessons,
    dailyActivity: state.dailyActivity,
    streak: state.streak,
    lastActiveDate: state.lastActiveDate,
  });
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): AppData {
  return state;
}

export function getServerSnapshot(): AppData {
  return serverSnapshot;
}

export function useAppData(): AppData {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function isHydrated(): boolean {
  return hydrated;
}

export async function hydrate(): Promise<void> {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  let next = createDefaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppData>;
      next = {
        ...next,
        ...parsed,
        settings: { ...next.settings, ...(parsed.settings ?? {}), privacy: { ...next.settings.privacy, ...(parsed.settings?.privacy ?? {}) } },
      };
    }
  } catch {
    // Corrupt local data: start fresh rather than crashing the app.
  }
  const [idbConversations, idbMirror] = await Promise.all([
    loadConversations<Conversation[]>(),
    loadMirror<Partial<AppData>>(),
  ]);
  if (idbMirror && !localStorage.getItem(STORAGE_KEY)) {
    next = { ...next, ...idbMirror };
  }
  if (idbConversations?.length && !next.conversations.length) {
    next.conversations = idbConversations;
  }
  state = next;
  persist();
  emit();
}

export function updateData(updater: (previous: AppData) => AppData): void {
  state = updater(state);
  persist();
  emit();
}

export function resetData(): void {
  state = createDefaultData();
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
  persist();
  emit();
}

/* ------------------------------- actions ------------------------------- */

export function updateSettings(patch: Partial<Settings>): void {
  updateData((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
}

export function updatePrivacy(patch: Partial<Settings["privacy"]>): void {
  updateData((prev) => ({
    ...prev,
    settings: { ...prev.settings, privacy: { ...prev.settings.privacy, ...patch } },
  }));
}

function touchStreak(prev: AppData): Partial<AppData> {
  const today = dateKey();
  if (prev.lastActiveDate === today) return {};
  if (!prev.lastActiveDate) return { lastActiveDate: today, streak: 1 };
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const wasYesterday = prev.lastActiveDate === dateKey(yesterday);
  return { lastActiveDate: today, streak: wasYesterday ? prev.streak + 1 : 1 };
}

function addMinutes(map: AppData["dailyActivity"], minutes: number, field?: "typingSeconds" | "sessions" | "words", amount = 0) {
  const key = dateKey();
  const current = map[key] ?? { minutes: 0, typingSeconds: 0, sessions: 0, words: 0 };
  return {
    ...map,
    [key]: {
      minutes: current.minutes + minutes,
      typingSeconds: current.typingSeconds + (field === "typingSeconds" ? amount : 0),
      sessions: current.sessions + (field === "sessions" ? amount : 0),
      words: current.words + (field === "words" ? amount : 0),
    },
  };
}

export function recordActivity(minutes: number, field?: "typingSeconds" | "sessions" | "words", amount = 0): void {
  updateData((prev) => ({
    ...prev,
    ...touchStreak(prev),
    dailyActivity: addMinutes(prev.dailyActivity, minutes, field, amount),
  }));
}

export function addTypingResult(result: TypingResult): void {
  updateData((prev) => ({
    ...prev,
    ...touchStreak(prev),
    typingResults: [result, ...prev.typingResults].slice(0, 300),
    dailyActivity: addMinutes(prev.dailyActivity, result.durationSeconds / 60, "typingSeconds", result.durationSeconds),
  }));
}

export function addQuizResult(result: QuizResult): void {
  updateData((prev) => ({
    ...prev,
    ...touchStreak(prev),
    quizResults: [result, ...prev.quizResults].slice(0, 300),
    dailyActivity: addMinutes(prev.dailyActivity, 2, "sessions", 1),
  }));
}

export function addPracticeSession(session: PracticeSession): void {
  updateData((prev) => ({
    ...prev,
    ...touchStreak(prev),
    practiceSessions: [session, ...prev.practiceSessions].slice(0, 300),
    dailyActivity: addMinutes(prev.dailyActivity, 3, "sessions", 1),
  }));
}

export function createConversation(kind: ConversationKind, title: string): Conversation {
  const now = new Date().toISOString();
  return { id: uid(), title, kind, messages: [], createdAt: now, updatedAt: now };
}

export function saveConversation(conversation: Conversation): void {
  updateData((prev) => {
    const exists = prev.conversations.some((item) => item.id === conversation.id);
    const conversations = exists
      ? prev.conversations.map((item) => (item.id === conversation.id ? conversation : item))
      : [conversation, ...prev.conversations];
    return {
      ...prev,
      ...touchStreak(prev),
      conversations: conversations.slice(0, 60),
      dailyActivity: addMinutes(prev.dailyActivity, 1, "sessions", 1),
    };
  });
}

export function appendMessage(conversationId: string, message: ChatMessage): void {
  updateData((prev) => ({
    ...prev,
    ...touchStreak(prev),
    conversations: prev.conversations.map((item) =>
      item.id === conversationId
        ? { ...item, messages: [...item.messages, message], updatedAt: new Date().toISOString() }
        : item,
    ),
  }));
}

export function deleteConversation(id: string): void {
  updateData((prev) => ({ ...prev, conversations: prev.conversations.filter((item) => item.id !== id) }));
}

export function clearConversations(): void {
  updateData((prev) => ({ ...prev, conversations: [] }));
}

export function toggleSavedWord(word: string): void {
  updateData((prev) => ({
    ...prev,
    savedWords: prev.savedWords.includes(word)
      ? prev.savedWords.filter((item) => item !== word)
      : [...prev.savedWords, word],
  }));
}

export function markWordLearned(word: string): void {
  updateData((prev) => {
    const today = dateKey();
    const learned = prev.learnedWords.includes(word) ? prev.learnedWords : [...prev.learnedWords, word];
    const isNewDay = prev.lastVocabularyDate !== today;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const vocabStreak = isNewDay
      ? prev.lastVocabularyDate === dateKey(yesterday)
        ? prev.vocabularyStreak + 1
        : 1
      : prev.vocabularyStreak;
    return {
      ...prev,
      learnedWords: learned,
      lastVocabularyDate: today,
      vocabStreak,
      dailyActivity: addMinutes(prev.dailyActivity, 1, "words", 1),
    };
  });
}

export function completeLesson(lessonId: string): void {
  updateData((prev) => ({
    ...prev,
    completedLessons: prev.completedLessons.includes(lessonId)
      ? prev.completedLessons
      : [...prev.completedLessons, lessonId],
  }));
}
