import type { AppData, TypingResult } from "@/lib/types";
import { dateKey } from "./store";

export function average(values: number[]): number {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function typingStats(data: AppData) {
  const results = data.typingResults;
  return {
    averageWpm: average(results.map((result) => result.wpm)),
    bestWpm: results.length ? Math.max(...results.map((result) => result.wpm)) : 0,
    averageAccuracy: average(results.map((result) => result.accuracy)),
    totalTypedSeconds: results.reduce((sum, result) => sum + result.durationSeconds, 0),
    sessions: results.length,
    totalCharacters: results.reduce((sum, result) => sum + result.totalChars, 0),
  };
}

export function totalPracticeMinutes(data: AppData): number {
  const fromActivity = Object.values(data.dailyActivity).reduce((sum, day) => sum + day.minutes, 0);
  const typingMinutes = data.typingResults.reduce((sum, result) => sum + result.durationSeconds / 60, 0);
  return Math.max(Math.round(fromActivity), Math.round(typingMinutes));
}

export function dailyGoalMinutes(data: AppData): number {
  return data.dailyActivity[dateKey()]?.minutes ?? 0;
}

export function weeklyActivity(data: AppData, weeks = 1) {
  const today = new Date();
  const days: Array<{ date: string; label: string; minutes: number; wpm: number; sessions: number }> = [];
  for (let offset = weeks * 7 - 1; offset >= 0; offset -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - offset);
    const key = dateKey(day);
    const activity = data.dailyActivity[key];
    const wpmValues = data.typingResults.filter((result) => dateKey(new Date(result.date)) === key).map((result) => result.wpm);
    days.push({
      date: key,
      label: day.toLocaleDateString("en-US", { weekday: "short" }),
      minutes: Math.round((activity?.minutes ?? 0) * 10) / 10,
      wpm: average(wpmValues),
      sessions: activity?.sessions ?? 0,
    });
  }
  return days;
}

export function monthlyActivity(data: AppData) {
  const today = new Date();
  const days = [];
  for (let offset = 29; offset >= 0; offset -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - offset);
    const key = dateKey(day);
    const activity = data.dailyActivity[key];
    days.push({
      date: key,
      label: `${day.getDate()}/${day.getMonth() + 1}`,
      minutes: Math.round((activity?.minutes ?? 0) * 10) / 10,
      wpm: average(
        data.typingResults.filter((result) => dateKey(new Date(result.date)) === key).map((result) => result.wpm),
      ),
    });
  }
  return days;
}

export function grammarPerformance(data: AppData) {
  const results = data.quizResults.filter((result) => result.kind === "grammar");
  return {
    averageScore: average(results.map((result) => Math.round((result.score / result.total) * 100))),
    attempts: results.length,
    results: results.slice(0, 8),
  };
}

export function latestTypingResults(data: AppData, limit = 10): TypingResult[] {
  return data.typingResults.slice(0, limit);
}

export function recentConversations(data: AppData, limit = 5) {
  return [...data.conversations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, limit);
}

export function recommendedActivity(data: AppData): { title: string; description: string; href: string } {
  if (!data.typingResults.length) {
    return { title: "Start your first typing test", description: "Build speed and accuracy in 60 seconds.", href: "/typing" };
  }
  if (!data.conversations.length) {
    return { title: "Talk to SpeakMate", description: "Try a real conversation in English or Roman Telugu.", href: "/chat" };
  }
  if (!data.quizResults.some((result) => result.kind === "grammar")) {
    return { title: "Learn your first grammar rule", description: "Simple explanations with a short quiz.", href: "/grammar" };
  }
  if (data.learnedWords.length < 10) {
    return { title: "Grow your vocabulary", description: "Learn 5 useful words and save the tricky ones.", href: "/vocabulary" };
  }
  if (!data.quizResults.some((result) => result.kind === "professional")) {
    return { title: "Practise professional English", description: "Introduce yourself like a pro.", href: "/professional" };
  }
  return { title: "Try a roleplay scenario", description: "Put your skills to work in a realistic chat.", href: "/practice" };
}
