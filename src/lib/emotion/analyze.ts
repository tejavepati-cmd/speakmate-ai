export interface EmotionCue {
  name: string;
  evidence: string[];
  interpretation: string;
}

export interface EmotionInsight {
  cues: EmotionCue[];
  summary: string;
  suggestedReplies: string[];
  clarifyingQuestion: string;
  caution: string;
}

interface EmotionPattern {
  name: string;
  signals: string[];
  interpretation: string;
  reply: string;
}

const patterns: EmotionPattern[] = [
  {
    name: "Happiness",
    signals: ["happy", "great", "yay", "excited", "wonderful", "best day", "haha", "😂", "😊", "santhosh", "bagundi", "super"],
    interpretation: "Positive words or playful emojis can suggest the person is in a good mood.",
    reply: "That's wonderful to hear! What made your day so good?",
  },
  {
    name: "Sadness",
    signals: ["sad", "miss you", "alone", "cry", "down", "bad day", "depressed", "miss", "😢", "dukh", "badha"],
    interpretation: "Words about missing someone or feeling low may point to sadness.",
    reply: "I'm sorry you're feeling this way. Do you want to talk about it? I'm here to listen.",
  },
  {
    name: "Frustration",
    signals: ["again", "still not", "frustrated", "annoying", "hate", "why does", "fed up", "irritating", "chala frustrating"],
    interpretation: "Repeated complaints or strong words could suggest frustration.",
    reply: "That sounds really frustrating. Would it help to talk through what happened?",
  },
  {
    name: "Confusion",
    signals: ["confused", "don't understand", "what do you mean", "how", "why", "not clear", "?", "ardham", "teliyadu"],
    interpretation: "Questions and phrases about clarity may suggest confusion.",
    reply: "No worries — let me explain that more simply. Which part feels unclear?",
  },
  {
    name: "Nervousness",
    signals: ["nervous", "scared", "worried", "afraid", "anxious", "what if", "might fail", "bayam", "tension"],
    interpretation: "Words about fear or 'what if' thinking may suggest nervousness.",
    reply: "It's completely normal to feel nervous. What's the part you're most worried about?",
  },
  {
    name: "Excitement",
    signals: ["wow", "can't wait", "awesome", "let's go", "!!!", "literally", "amazing", "excited", "great news"],
    interpretation: "Energetic words and exclamation marks can suggest excitement.",
    reply: "You sound excited! Tell me more — what's happening?",
  },
  {
    name: "Disappointment",
    signals: ["disappointed", "expected more", "didn't work out", "too bad", "never mind", "sadly", "nirasha"],
    interpretation: "Phrases about unmet expectations could suggest disappointment.",
    reply: "I can see this may not have gone the way you hoped. Do you want to share what happened?",
  },
  {
    name: "Stress",
    signals: ["busy", "tired", "deadline", "no time", "pressure", "exams", "work", "stress", "tension", "eem", "problems"],
    interpretation: "Mentions of deadlines, workload or tiredness may suggest stress.",
    reply: "That sounds like a lot to handle. Would you like to talk it through or take a short break?",
  },
];

export function analyzeEmotion(text: string): EmotionInsight {
  const lower = text.toLowerCase();
  const cues: EmotionCue[] = [];

  for (const pattern of patterns) {
    const evidence = pattern.signals.filter((signal) => lower.includes(signal));
    if (evidence.length) {
      cues.push({
        name: pattern.name,
        evidence,
        interpretation: pattern.interpretation,
      });
    }
  }

  if (!cues.length) {
    return {
      cues: [],
      summary: "This message is brief, so it is hard to read any emotional tone from the wording alone.",
      suggestedReplies: [
        "Thanks for telling me. How are you feeling about it?",
        "I want to make sure I understand — could you tell me a little more?",
      ],
      clarifyingQuestion: "Was there something specific you wanted me to understand about this message?",
      caution: "Context matters. One line of text is never enough to know how someone truly feels.",
    };
  }

  const top = cues[0];
  return {
    cues,
    summary: `This message ${top.name === "Happiness" || top.name === "Excitement" ? "may communicate" : "could suggest"} ${top.name.toLowerCase()}. Look at the wording, punctuation and context together.`,
    suggestedReplies: patterns.filter((pattern) => pattern.name === top.name).map((pattern) => pattern.reply),
    clarifyingQuestion: "Does that sound right to you, or am I missing some context?",
    caution: "I can only notice possible cues in the words — I cannot know someone's actual feelings. Context matters, and it is always okay to ask.",
  };
}
