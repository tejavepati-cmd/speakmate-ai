export type ThemePreference = "light" | "dark" | "system";
export type ExplanationLanguage = "en" | "te";
export type CorrectionMode = "always" | "request" | "casual";
export type Difficulty = "easy" | "medium" | "advanced";
export type AIProvider = "openai-compatible" | "none";

export interface Settings {
  theme: ThemePreference;
  explanationLanguage: ExplanationLanguage;
  correctionMode: CorrectionMode;
  difficulty: Difficulty;
  dailyGoalMinutes: number;
  soundEnabled: boolean;
  forceOffline: boolean;
  aiProvider: AIProvider;
  aiModel: string;
  aiBaseUrl: string;
  privacy: {
    saveConversations: boolean;
    allowOnlineProcessing: boolean;
    personalizedTips: boolean;
  };
}

export interface TypingResult {
  id: string;
  date: string;
  durationSeconds: number;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  backspaces: number;
  totalChars: number;
}

export interface QuizResult {
  id: string;
  date: string;
  lessonId: string;
  title: string;
  score: number;
  total: number;
  kind: "grammar" | "vocabulary" | "professional" | "girltalk" | "flirting" | "practice";
}

export interface Correction {
  original: string;
  correct: string;
  natural: string;
  professional: string;
  telugu: string;
  explanation: string;
  practice: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  source?: "ai" | "offline";
  teluguMeaning?: string;
  correction?: Correction;
  followUp?: string;
}

export type ConversationKind =
  | "chat"
  | "professional"
  | "girltalk"
  | "flirting"
  | "practice"
  | "emotion";

export interface Conversation {
  id: string;
  title: string;
  kind: ConversationKind;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface PracticeSession {
  id: string;
  date: string;
  mode: string;
  difficulty: Difficulty;
  score: number;
  total: number;
  notes: string;
}

export interface DailyActivity {
  [date: string]: {
    minutes: number;
    typingSeconds: number;
    sessions: number;
    words: number;
  };
}

export interface AppData {
  settings: Settings;
  typingResults: TypingResult[];
  quizResults: QuizResult[];
  conversations: Conversation[];
  practiceSessions: PracticeSession[];
  learnedWords: string[];
  savedWords: string[];
  completedLessons: string[];
  dailyActivity: DailyActivity;
  streak: number;
  lastActiveDate: string | null;
  vocabularyStreak: number;
  lastVocabularyDate: string | null;
}

export interface AIRequestPayload {
  mode:
    | "chat"
    | "translate"
    | "correct"
    | "emotion"
    | "simulate"
    | "reply"
    | "feedback";
  userText?: string;
  messages?: Array<{ role: "user" | "assistant"; content: string }>;
  context?: string;
  tone?: string;
  difficulty?: Difficulty;
  explanationLanguage?: ExplanationLanguage;
  correctionMode?: CorrectionMode;
}

export interface AIResponse {
  ok: boolean;
  source: "ai" | "offline";
  reply: string;
  correction?: Correction;
  teluguMeaning?: string;
  followUp?: string;
  error?: string;
}
