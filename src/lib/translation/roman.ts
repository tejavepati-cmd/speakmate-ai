export interface TranslationResult {
  natural: string;
  professional: string;
  telugu: string;
  meaning: string;
  explanation: string;
  exampleResponse: string;
  confidence: "high" | "medium" | "low";
  needsClarification?: string;
}

interface PhraseEntry {
  patterns: string[];
  result: Omit<TranslationResult, "confidence">;
}

const phraseBook: PhraseEntry[] = [
  {
    patterns: ["em chestunnav", "em chestunav", "em chestunnanu", "em chestunnavu", "em chestu unnav", "em cheyuthunnav"],
    result: {
      natural: "What are you doing?",
      professional: "What are you currently working on?",
      telugu: "నువ్వు ఏం చేస్తున్నావ్?",
      meaning: "Asking what someone is doing right now.",
      explanation: "‘Em’ means ‘what’ and ‘chestunnav’ is the present continuous form of ‘chey’ (to do). In English, use ‘What are you doing?’ for the same idea.",
      exampleResponse: "I'm studying right now. What about you?",
    },
  },
  {
    patterns: ["ela vunna", "ela unna", "ela unnanu", "ela vunnav", "yela unna", "ela vunna", "how ela unna"],
    result: {
      natural: "How are you?",
      professional: "How are you doing today?",
      telugu: "నువ్వు ఎలా ఉన్నావ్?",
      meaning: "A friendly way to ask about someone's well-being.",
      explanation: "‘Ela’ means ‘how’ and ‘unna’ means ‘are/is’. The natural English greeting is simply ‘How are you?’",
      exampleResponse: "I'm doing well, thank you! How are you?",
    },
  },
  {
    patterns: ["tinnava", "tinnavu", "tinnaava", "tinnanu", "bhojanam chesava", "tindhi", "tinnavaa"],
    result: {
      natural: "Did you eat?",
      professional: "Have you had a chance to eat?",
      telugu: "నువ్వు తిన్నావా?",
      meaning: "A caring question about whether someone has eaten.",
      explanation: "‘Tinnava’ is the past tense question form of ‘tin’ (to eat). English uses ‘Did you eat?’ or the warmer ‘Have you eaten?’",
      exampleResponse: "Not yet, I'm about to. What about you?",
    },
  },
  {
    patterns: ["ekkadiki velthunnav", "ekkadiki velthunav", "ekkadiki povthunnav", "ekkadi velthunnav", "ekkadiki velthunnanu", "ekkadiki veltunnav"],
    result: {
      natural: "Where are you going?",
      professional: "Where are you heading?",
      telugu: "నువ్వు ఎక్కడికి వెళ్తున్నావ్?",
      meaning: "Asking about someone's destination.",
      explanation: "‘Ekkadiki’ means ‘where to’ and ‘velthunnav’ means ‘are going’. English places the question word first: ‘Where are you going?’",
      exampleResponse: "I'm heading to college. I have a project presentation today.",
    },
  },
  {
    patterns: ["naku english nerchukovali", "naku english nerchukovali", "nenu english nerchukovali", "naaku english nerchukovali", "naku english nerchukuntu", "english nerchukovali"],
    result: {
      natural: "I want to learn English.",
      professional: "I would like to improve my English skills.",
      telugu: "నాకు ఇంగ్లీష్ నేర్చుకోవాలి.",
      meaning: "Expressing a goal to learn English.",
      explanation: "‘Naku … kovali’ expresses wanting or needing something. A natural English version is ‘I want to learn English’; ‘I'd like to improve my English’ sounds more professional.",
      exampleResponse: "That's a great goal! Let's start with one small sentence today.",
    },
  },
  {
    patterns: ["repu project present cheyali", "repu project present cheyalii", "repu project present cheyyali", "repu presentation cheyali", "repu project present chestha"],
    result: {
      natural: "I have to present a project tomorrow.",
      professional: "I'm scheduled to present a project tomorrow.",
      telugu: "రేపు ప్రాజెక్ట్ ప్రజెంట్ చేయాలి.",
      meaning: "Talking about a presentation due tomorrow.",
      explanation: "‘Cheyali’ means ‘have to / must do’. English uses ‘I have to present…’ for obligation and ‘I'm scheduled to present…’ in professional settings.",
      exampleResponse: "That's exciting! Would you like to practise your opening line?",
    },
  },
  {
    patterns: ["netho matladali anipistundi", "netho matladali anipisthundi", "natho matladali anipistundi", "nato matladali anipistundi", "netho matladali anipistundhi", "nuvvuto matladali anipistundi"],
    result: {
      natural: "I feel like talking to you.",
      professional: "I'd enjoy having a conversation with you.",
      telugu: "నీతో మాట్లాడాలని అనిపిస్తుంది.",
      meaning: "Expressing a desire to chat with someone.",
      explanation: "‘Anipistundi’ means ‘it feels like’. ‘I feel like talking to you’ is warm and natural; ‘I'd enjoy a conversation with you’ is a little more formal.",
      exampleResponse: "I'd love that! What's on your mind?",
    },
  },
  {
    patterns: ["naku english sarigga radu", "naku english sarigga ravadu", "naaku english sarigga radu", "naku english baga radu", "english sarigga radu", "naku english ravadam ledu"],
    result: {
      natural: "I'm not very good at English yet.",
      professional: "I'm still developing my English skills.",
      telugu: "నాకు ఇంగ్లీష్ బాగా రాదు.",
      meaning: "Admitting that English is still difficult.",
      explanation: "‘Radu’ means ‘doesn't come naturally’. The gentle English version adds ‘yet’ to show progress is possible. There is nothing to be embarrassed about.",
      exampleResponse: "That's completely okay. We can learn together, one sentence at a time.",
    },
  },
  {
    patterns: ["netho matladatam chala baguntundi", "netho matladadam chala baguntundi", "netho matladatam chala bagundi", "natho matladatam chala baguntundi", "nuvvuto matladatam chala baguntundi", "netho matladatam enta baguntundi"],
    result: {
      natural: "I really enjoy talking with you.",
      professional: "I appreciate our conversations.",
      telugu: "నీతో మాట్లాడటం చాలా బాగుంది.",
      meaning: "A warm compliment about the conversation.",
      explanation: "‘Chala baguntundi’ means ‘feels very good’. ‘I really enjoy talking with you’ is natural, sincere and respectful.",
      exampleResponse: "Thank you — I enjoy talking with you too!",
    },
  },
  {
    patterns: ["nuvvu chala cute ga unnav", "nuvu chala cute ga unna", "nuvvu chala cute ga vunna", "nuvvu chala cute", "nuvvu cute ga unnav"],
    result: {
      natural: "You look really cute.",
      professional: "You have a lovely presence.",
      telugu: "నువ్వు చాలా క్యూట్ గా ఉన్నావ్.",
      meaning: "A playful, affectionate compliment.",
      explanation: "‘Cute ga unnav’ means ‘you look cute’. Keep compliments kind and not too personal — ‘You look really cute’ works well between people who know each other.",
      exampleResponse: "Thank you, that's sweet of you to say!",
    },
  },
  {
    patterns: ["netho coffee ki ravacha", "natho coffee ki ravacha", "netho coffee ki ravachaa", "netho coffee ki rava", "nuvvu coffee ki ravacha", "coffee ki ravacha"],
    result: {
      natural: "Would you like to grab coffee with me?",
      professional: "Would you like to join me for a coffee?",
      telugu: "నీతో కాఫీ కి రావచ్చా?",
      meaning: "A polite invitation to have coffee together.",
      explanation: "‘Ravacha’ is a polite request meaning ‘may I come / will you come’. ‘Would you like to…’ is the natural, low-pressure English invitation.",
      exampleResponse: "That sounds nice! When were you thinking?",
    },
  },
  {
    patterns: ["dhanyavaadam", "dhanyavadam", "thankyou", "thanks", "thalupu", "dhanyavadu"],
    result: {
      natural: "Thank you!",
      professional: "I really appreciate it.",
      telugu: "ధన్యవాదాలు.",
      meaning: "Expressing gratitude.",
      explanation: "‘Dhanyavaadam’ is the Telugu word for thank you. Use ‘I appreciate it’ when you want to sound a little more professional.",
      exampleResponse: "You're welcome! Happy to help.",
    },
  },
];

const wordMap: Record<string, { en: string; te: string }> = {
  naku: { en: "to me", te: "నాకు" }, naaku: { en: "to me", te: "నాకు" },
  nenu: { en: "I", te: "నేను" }, neenu: { en: "I", te: "నేను" },
  nuvvu: { en: "you", te: "నువ్వు" }, nuvu: { en: "you", te: "నువ్వు" }, nii: { en: "your", te: "నీ" },
  em: { en: "what", te: "ఏం" }, en: { en: "what", te: "ఏం" },
  ela: { en: "how", te: " ఎలా" }, yela: { en: "how", te: "ఎలా" },
  ekkada: { en: "where", te: "ఎక్కడ" }, ekkadiki: { en: "where to", te: "ఎక్కడికి" },
  unna: { en: "are", te: "ఉన్నావ్" }, unnanu: { en: "am", te: "ఉన్నాను" }, vunna: { en: "are", te: "ఉన్నావ్" },
  unnadhi: { en: "is", te: "ఉంది" }, undi: { en: "is", te: "ఉంది" },
  chestunnav: { en: "are doing", te: "చేస్తున్నావ్" }, chestunav: { en: "are doing", te: "చేస్తున్నావ్" },
  chestha: { en: "will do", te: "చేస్తాను" }, cheyali: { en: "have to do", te: "చేయాలి" },
  cheyadam: { en: "doing", te: "చేయడం" }, matladatam: { en: "talking", te: "మాట్లాడటం" },
  matladali: { en: "want to talk", te: "మాట్లాడాలి" }, matladu: { en: "talk", te: "మాట్లాడు" },
  velthunnav: { en: "are going", te: "వెళ్తున్నావ్" }, velthunu: { en: "I am going", te: "వెళ్తున్నాను" },
  repu: { en: "tomorrow", te: "రేపు" }, netho: { en: "with you", te: "నీతో" }, natho: { en: "with you", te: "నీతో" },
  nethoo: { en: "with you", te: "నీతో" }, niitho: { en: "with you", te: "నీతో" },
  bagundhi: { en: "feels good", te: "బాగుంది" }, baguntundi: { en: "feels good", te: "బాగుంది" }, baga: { en: "well", te: "బాగా" },
  chala: { en: "very", te: "చాలా" }, chalu: { en: "enough", te: "చాలు" },
  anipistundi: { en: "it feels like", te: "అనిపిస్తుంది" }, anipistundhi: { en: "it feels like", te: "అనిపిస్తుంది" },
  nerchukovali: { en: "want to learn", te: "నేర్చుకోవాలి" }, nerchukuntanu: { en: "I am learning", te: "నేర్చుకుంటున్నాను" },
  english: { en: "English", te: "ఇంగ్లీష్" }, project: { en: "project", te: "ప్రాజెక్ట్" },
  present: { en: "present", te: "ప్రజెంట్" }, coffee: { en: "coffee", te: "కాఫీ" },
  tinnava: { en: "did you eat", te: "తిన్నావా" }, tin: { en: "eat", te: "తిను" },
  ravacha: { en: "may come", te: "రావచ్చా" }, rava: { en: "come", te: "రా" },
  cute: { en: "cute", te: "క్యూట్" }, sarigga: { en: "properly", te: "సరిగ్గా" },
  radu: { en: "doesn't come", te: "రాదు" }, ledu: { en: "isn't there", te: "లేదు" },
  chevava: { en: "did you say", te: "చెప్పావా" }, cheppu: { en: "say", te: "చెప్పు" },
  navvu: { en: "smile", te: "నవ్వు" }, navvutundhi: { en: "is smiling", te: "నవ్వుతుంది" },
  istam: { en: "like", te: "ఇష్టం" }, kavali: { en: "want", te: "కావాలి" },
  sari: { en: "okay", te: "సరి" }, bagaunnanu: { en: "I am fine", te: "బాగున్నాను" },
  dhanyavaadam: { en: "thank you", te: "ధన్యవాదాలు" }, dhanyavadam: { en: "thank you", te: "ధన్యవాదాలు" },
};

const variantMap: Record<string, string> = {
  vunna: "unna", vunnav: "unna", unnanu: "unna", yela: "ela", nuvu: "nuvvu",
  natho: "netho", nato: "netho", nethoo: "netho", netho2: "netho",
  cheyyali: "cheyali", cheyalii: "cheyali", velthunav: "velthunnav",
  veltunnav: "velthunnav", povthunnav: "velthunnav", anipisthundi: "anipistundi",
  anipistundhi: "anipistundi", chala: "chala", bagundi: "baguntundi",
  baguntundhi: "baguntundi", dhanyavadam: "dhanyavaadam", thankyou: "dhanyavaadam",
  matladadam: "matladatam", chesava: "chesava", tinnavu: "tinnava",
};

export function normalizeRoman(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isLikelyRomanTelugu(text: string): boolean {
  const words = normalizeRoman(text).split(" ").filter(Boolean);
  if (!words.length) return false;
  const known = words.filter((word) => wordMap[word] || variantMap[word]).length;
  return known / words.length >= 0.35;
}

export function toTeluguScript(text: string): string {
  const normalized = normalizeRoman(text);
  return normalized
    .split(" ")
    .map((word) => {
      const key = variantMap[word] ?? word;
      return wordMap[key]?.te ?? wordMap[word]?.te ?? word;
    })
    .join(" ");
}

export function translateRoman(input: string): TranslationResult {
  const normalized = normalizeRoman(input);
  for (const entry of phraseBook) {
    if (entry.patterns.some((pattern) => normalizeRoman(pattern) === normalized)) {
      return { ...entry.result, confidence: "high" };
    }
  }

  const words = normalized.split(" ").filter(Boolean);
  const englishWords = words.map((word) => {
    const key = variantMap[word] ?? word;
    return wordMap[key]?.en ?? wordMap[word]?.en ?? word;
  });

  const knownCount = words.filter((word) => wordMap[variantMap[word] ?? word] || wordMap[word]).length;
  const ratio = words.length ? knownCount / words.length : 0;
  const natural = `${englishWords[0]?.charAt(0).toUpperCase() ?? ""}${englishWords[0]?.slice(1) ?? ""}${englishWords.slice(1).map((word) => ` ${word}`).join("")}${/[?]$/.test(input.trim()) ? "" : "."}`;

  if (ratio < 0.35) {
    return {
      natural: "",
      professional: "",
      telugu: toTeluguScript(input),
      meaning: "I could not confidently understand that sentence.",
      explanation: "This looks like Roman Telugu, but the wording is unfamiliar. Could you say it another way?",
      exampleResponse: "Try: ‘naku english nerchukovali’ or ‘em chestunnav’.",
      confidence: "low",
      needsClarification: "Did you mean something like ‘em chestunnav’ (What are you doing?) or ‘ela unna’ (How are you?)?",
    };
  }

  return {
    natural,
    professional: natural.replace(/\.$/, "") + ".",
    telugu: toTeluguScript(input),
    meaning: "A word-by-word understanding of your Roman Telugu sentence.",
    explanation:
      "This is a word-level translation because the full phrase is not in the local phrase library. Ask SpeakMate AI online for a more natural version.",
    exampleResponse: "Could you tell me a little more about what you mean?",
    confidence: ratio > 0.7 ? "medium" : "low",
    needsClarification: ratio <= 0.7 ? "A few words were unclear. Would you like to rephrase it?" : undefined,
  };
}
