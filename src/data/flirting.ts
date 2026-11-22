import type { PracticeLesson, SimulationScenario } from "./girltalk";

export type FlirtingTone =
  | "Shy"
  | "Funny"
  | "Confident"
  | "Sweet"
  | "Romantic"
  | "Playful";

export type FlirtingCategory =
  | "Cute"
  | "Funny"
  | "Playful"
  | "Sweet"
  | "Romantic"
  | "Subtle compliments";

export const flirtingTones: FlirtingTone[] = [
  "Shy",
  "Funny",
  "Confident",
  "Sweet",
  "Romantic",
  "Playful",
];

export const flirtingCategories: FlirtingCategory[] = [
  "Cute",
  "Funny",
  "Playful",
  "Sweet",
  "Romantic",
  "Subtle compliments",
];

export interface FlirtingMessage {
  id: string;
  category: FlirtingCategory;
  tone: FlirtingTone;
  text: string;
  note: string;
}

export const flirtingMessages: FlirtingMessage[] = [
  {
    id: "fm-cute-1",
    category: "Cute",
    tone: "Shy",
    text: "Hi! I just wanted to say your smile made my morning a little brighter.",
    note: "Warm, short and easy to brush off — a safe first compliment.",
  },
  {
    id: "fm-cute-2",
    category: "Cute",
    tone: "Sweet",
    text: "That was sweet of you to help me earlier. Thank you — it made me smile.",
    note: "Gratitude is a genuinely charming way to show interest.",
  },
  {
    id: "fm-cute-3",
    category: "Cute",
    tone: "Playful",
    text: "You have excellent taste in music. I'm taking full credit for introducing you to it. 😄",
    note: "A tiny joke keeps the mood light without any pressure.",
  },
  {
    id: "fm-funny-1",
    category: "Funny",
    tone: "Funny",
    text: "I tried to be mysterious today. Apparently my face told everyone I had coffee for breakfast.",
    note: "Self-deprecating humour is friendly and never puts anyone on the spot.",
  },
  {
    id: "fm-funny-2",
    category: "Funny",
    tone: "Playful",
    text: "Warning: if you keep recommending songs, I may start calling you my official DJ.",
    note: "Playful titles are harmless when the other person is already laughing.",
  },
  {
    id: "fm-funny-3",
    category: "Funny",
    tone: "Funny",
    text: "My brain has 3 tabs open and one of them is playing your song from yesterday.",
    note: "Relatable, silly and easy to answer with a joke of their own.",
  },
  {
    id: "fm-play-1",
    category: "Playful",
    tone: "Playful",
    text: "You made that look way too easy. Any chance you can teach me one trick?",
    note: "Asks for a small, specific thing and gives them a role.",
  },
  {
    id: "fm-play-2",
    category: "Playful",
    tone: "Funny",
    text: "I'm going to need a rematch. My dignity has requested one.",
    note: "A game reference keeps things fun and non-serious.",
  },
  {
    id: "fm-play-3",
    category: "Playful",
    tone: "Confident",
    text: "I like your energy today — it's the kind that makes a queue feel shorter.",
    note: "Confident, observational and not about appearance.",
  },
  {
    id: "fm-sweet-1",
    category: "Sweet",
    tone: "Sweet",
    text: "I hope your day has been kind to you. You deserve a good one.",
    note: "Caring without assuming romance or demanding a reply.",
  },
  {
    id: "fm-sweet-2",
    category: "Sweet",
    tone: "Shy",
    text: "I really liked talking with you earlier. I'm still smiling about it.",
    note: "Honest and gentle; a lovely low-pressure sign of interest.",
  },
  {
    id: "fm-sweet-3",
    category: "Sweet",
    tone: "Sweet",
    text: "Thanks for noticing I was quiet today. That was thoughtful of you.",
    note: "Appreciation for kindness is a subtle way to connect.",
  },
  {
    id: "fm-rom-1",
    category: "Romantic",
    tone: "Romantic",
    text: "I enjoy our conversations more than I expected to. I wanted you to know that.",
    note: "Expresses interest without a demand or an expectation.",
  },
  {
    id: "fm-rom-2",
    category: "Romantic",
    tone: "Sweet",
    text: "There's something calm about the way you listen. I feel comfortable around you.",
    note: "Focuses on a feeling you are responsible for, not a claim about them.",
  },
  {
    id: "fm-rom-3",
    category: "Romantic",
    tone: "Shy",
    text: "If it's okay to say this — I'd love to spend a little more time getting to know you.",
    note: "Asks permission first, which keeps consent visible.",
  },
  {
    id: "fm-sub-1",
    category: "Subtle compliments",
    tone: "Confident",
    text: "You explained that really patiently. Not everyone would have.",
    note: "Specific, character-based and safe in any setting.",
  },
  {
    id: "fm-sub-2",
    category: "Subtle compliments",
    tone: "Sweet",
    text: "You have a way of making people feel included. I noticed that today.",
    note: "A compliment about kindness is meaningful and non-creepy.",
  },
  {
    id: "fm-sub-3",
    category: "Subtle compliments",
    tone: "Playful",
    text: "Your ideas are dangerously good. I might have to steal one for my project. 😄",
    note: "Playful exaggeration about work or ideas, never about the body.",
  },
];

export type SmartFlirtingTone = "Playful" | "Sweet" | "Casual" | "Confident";

export interface FallbackReply {
  text: string;
  why: string;
}

export const flirtingReplyFallbacks: Record<SmartFlirtingTone, FallbackReply> = {
  Playful: {
    text: "Haha, I like that! You make it hard to keep a straight face. 😄",
    why: "Matches a light message with humour, so the mood stays fun and pressure-free.",
  },
  Sweet: {
    text: "That's really kind of you to say — it made my day a little brighter.",
    why: "Warm gratitude acknowledges the message without promising anything romantic.",
  },
  Casual: {
    text: "Haha nice! How was the rest of your day?",
    why: "A relaxed reply plus a simple question keeps the conversation moving naturally.",
  },
  Confident: {
    text: "I appreciate you saying that. I'd like to hear more about what you think.",
    why: "Accepts the compliment calmly and hands the conversation back with interest.",
  },
};

export type ComplimentCategory =
  | "Personality"
  | "Humour"
  | "Achievements"
  | "Style"
  | "Creativity"
  | "Smile";

export const complimentCategories: ComplimentCategory[] = [
  "Personality",
  "Humour",
  "Achievements",
  "Style",
  "Creativity",
  "Smile",
];

export interface ComplimentExample {
  id: string;
  category: ComplimentCategory;
  text: string;
  why: string;
}

export const compliments: ComplimentExample[] = [
  {
    id: "cp-person-1",
    category: "Personality",
    text: "You make people feel welcome without even trying. I noticed that today.",
    why: "It praises a chosen behaviour, so it feels earned rather than intrusive.",
  },
  {
    id: "cp-person-2",
    category: "Personality",
    text: "You're a really patient listener. It made this conversation easy.",
    why: "Specific and sincere, with a clear link to something they did.",
  },
  {
    id: "cp-humour-1",
    category: "Humour",
    text: "Your jokes are genuinely good — I laughed at that one for a solid minute.",
    why: "Enthusiasm about their humour is playful and easy to receive.",
  },
  {
    id: "cp-humour-2",
    category: "Humour",
    text: "You have the best timing. That comment landed perfectly.",
    why: "Praising timing shows you noticed a real skill instead of giving vague praise.",
  },
  {
    id: "cp-ach-1",
    category: "Achievements",
    text: "Finishing that project in one week was impressive. You should be proud.",
    why: "Recognises effort and lets them feel proud without comparing them to others.",
  },
  {
    id: "cp-ach-2",
    category: "Achievements",
    text: "The way you handled that presentation was calm and clear. How did you prepare?",
    why: "A compliment plus a curious question keeps the conversation balanced.",
  },
  {
    id: "cp-style-1",
    category: "Style",
    text: "That colour really works on you — you clearly put thought into it.",
    why: "Focuses on a choice they made, which is safer than commenting on their body.",
  },
  {
    id: "cp-style-2",
    category: "Style",
    text: "Your study setup is so neat. I want to borrow your organisation skills.",
    why: "A light, non-personal observation that invites a smile or a tip.",
  },
  {
    id: "cp-creative-1",
    category: "Creativity",
    text: "The way you connected those two ideas was really original.",
    why: "Noticing creativity shows you are paying attention to their thinking.",
  },
  {
    id: "cp-creative-2",
    category: "Creativity",
    text: "Your sketch has so much personality in just a few lines. I love it.",
    why: "Specific detail proves the compliment is genuine, not generic.",
  },
  {
    id: "cp-smile-1",
    category: "Smile",
    text: "Your smile made the whole room feel warmer today.",
    why: "A gentle, non-explicit comment about expression — keep it brief and move on.",
  },
  {
    id: "cp-smile-2",
    category: "Smile",
    text: "You looked genuinely happy when you got that news. It was nice to see.",
    why: "Reflects a moment of shared joy rather than making a demand.",
  },
];

export const romanticLessons: PracticeLesson[] = [
  {
    id: "fl-interest",
    title: "Expressing interest",
    emoji: "💗",
    summary: "Say that you would like to know someone better without assuming they feel the same.",
    tips: [
      "Use 'I' statements: 'I enjoy talking with you.'",
      "Add an exit: 'No pressure — I just wanted to say it.'",
      "Do not label the relationship or ask for a decision immediately.",
      "Watch their comfort and change the topic if they seem uneasy.",
    ],
    dialogue: [
      { speaker: "You", text: "I've really enjoyed our conversations this week. I'd like to get to know you a little better.", },
      { speaker: "Them", text: "That's nice to hear. I enjoy talking to you too." },
      { speaker: "You", text: "I'm glad. Maybe we could continue over coffee sometime — only if you'd like that." },
    ],
    quiz: [
      {
        id: "fl-interest-q1",
        question: "Which line expresses interest respectfully?",
        options: [
          "You must feel the same way about me.",
          "I enjoy talking with you — no pressure at all.",
          "Everyone says we're perfect together.",
        ],
        answerIndex: 1,
        explanation: "Stating your own feeling plus 'no pressure' leaves the other person free to respond honestly.",
      },
      {
        id: "fl-interest-q2",
        question: "What should you do if they seem uncomfortable?",
        options: [
          "Change the topic gently and give them space.",
          "Repeat the compliment until they smile.",
          "Ask their friends to confirm.",
        ],
        answerIndex: 0,
        explanation: "Discomfort is a signal to slow down, not to push harder.",
      },
    ],
  },
  {
    id: "fl-respectful-compliments",
    title: "Respectful compliments",
    emoji: "🌷",
    summary: "Compliment choices, effort and character. Keep it short, specific and non-explicit.",
    tips: [
      "Praise something they chose or worked for.",
      "Avoid comments about private body parts or suggestive language.",
      "One good compliment is stronger than five vague ones.",
      "Do not expect a compliment in return.",
    ],
    dialogue: [
      { speaker: "You", text: "You handled that disagreement so calmly. I really respect that.", },
      { speaker: "Them", text: "Thank you — I was trying not to make it worse." },
      { speaker: "You", text: "It showed. Anyway, how was the rest of your afternoon?" },
    ],
    quiz: [
      {
        id: "fl-comp-q1",
        question: "Which compliment is safest and most genuine?",
        options: [
          "You're the hottest person in the room.",
          "The way you explained your idea was clear and thoughtful.",
          "I can't stop looking at you.",
        ],
        answerIndex: 1,
        explanation: "Skill and effort are respectful topics; explicit or body-focused remarks are not.",
      },
      {
        id: "fl-comp-q2",
        question: "What comes after a good compliment?",
        options: [
          "Demand their opinion of you.",
          "Repeat it several times.",
          "Move to a comfortable new topic.",
        ],
        answerIndex: 2,
        explanation: "Moving on keeps the moment light and unpressured.",
      },
    ],
  },
  {
    id: "fl-ask-out",
    title: "Asking someone out politely",
    emoji: "☕",
    summary: "Make a clear, low-pressure invitation and accept the answer with grace.",
    tips: [
      "Suggest a simple, time-bound plan like coffee after class.",
      "Use 'would you like to…' so a no is easy.",
      "Do not call it a 'date' unless they have shown the same interest.",
      "If they say no, thank them and stop asking.",
    ],
    dialogue: [
      { speaker: "You", text: "Would you like to grab a coffee after class on Friday? Totally okay if you're busy.", },
      { speaker: "Them", text: "I am busy on Friday, but thanks for asking." },
      { speaker: "You", text: "No worries at all. Thanks for letting me know — enjoy your weekend!" },
    ],
    quiz: [
      {
        id: "fl-ask-q1",
        question: "Which invitation respects consent best?",
        options: [
          "I've booked a table. You're coming.",
          "Would you like to grab coffee on Friday? No pressure if you're busy.",
          "If you don't come, I'll know you don't like me.",
        ],
        answerIndex: 1,
        explanation: "A question with a genuine 'no' option is the foundation of a respectful invitation.",
      },
      {
        id: "fl-ask-q2",
        question: "They say they are busy. What now?",
        options: [
          "Ask again every day.",
          "Say 'no problem' and leave it there.",
          "Ask why they are busy.",
        ],
        answerIndex: 1,
        explanation: "Accept the answer once; do not turn a no into a negotiation.",
      },
    ],
  },
  {
    id: "fl-affection",
    title: "Expressing affection",
    emoji: "🫶",
    summary: "Warm words that share a feeling without creating obligation.",
    tips: [
      "Name a specific moment: 'I liked how you listened earlier.'",
      "Keep it age-appropriate and non-explicit.",
      "Say 'I feel…' rather than 'You make me…' to avoid pressure.",
      "Respect a quiet or neutral response.",
    ],
    dialogue: [
      { speaker: "You", text: "I felt really happy when we talked after class today. I wanted to tell you that.", },
      { speaker: "Them", text: "That's sweet. Thank you." },
      { speaker: "You", text: "You're welcome. I'll let you get back to your evening — talk soon!" },
    ],
    quiz: [
      {
        id: "fl-aff-q1",
        question: "Which phrase is warm but low-pressure?",
        options: [
          "You have to tell me you feel the same.",
          "I felt happy when we talked today — I wanted to share that.",
          "If you don't reply, I'll stop being nice.",
        ],
        answerIndex: 1,
        explanation: "'I felt…' shares your experience without asking for anything in return.",
      },
      {
        id: "fl-aff-q2",
        question: "A neutral 'thank you' probably means…",
        options: [
          "They secretly love it.",
          "You should send more messages immediately.",
          "You should slow down and read their comfort.",
        ],
        answerIndex: 2,
        explanation: "A neutral response is a cue to pace yourself, not a hidden yes.",
      },
    ],
  },
  {
    id: "fl-misunderstandings",
    title: "Handling misunderstandings",
    emoji: "🔎",
    summary: "Clarify with curiosity instead of jealousy, blame or assumptions.",
    tips: [
      "Say what you noticed without accusing: 'I may have misread your message.'",
      "Ask one clear question and really listen to the answer.",
      "Avoid testing or possessive language.",
      "Apologise briefly if you got it wrong.",
    ],
    dialogue: [
      { speaker: "You", text: "I may have misread your message earlier — were you upset with me?", },
      { speaker: "Them", text: "No, I was just tired and rushing." },
      { speaker: "You", text: "Thanks for telling me. I should have asked instead of assuming." },
    ],
    quiz: [
      {
        id: "fl-mis-q1",
        question: "What is the best clarification opener?",
        options: [
          "Where were you and who were you with?",
          "I may have misread this — could you tell me what you meant?",
          "You're always so weird.",
        ],
        answerIndex: 1,
        explanation: "Tentative language plus one question invites clarity without accusation.",
      },
      {
        id: "fl-mis-q2",
        question: "What should you avoid in this moment?",
        options: [
          "Listening calmly.",
          "Asking one clear question.",
          "Testing them or acting possessive.",
        ],
        answerIndex: 2,
        explanation: "Testing and possessiveness damage trust; honesty builds it.",
      },
    ],
  },
  {
    id: "fl-rejection",
    title: "Respectfully handling rejection",
    emoji: "🤍",
    summary: "A no is complete on its own. Respond with dignity, then step back.",
    tips: [
      "Thank them for being honest.",
      "Do not ask for a reason or try to change their mind.",
      "Stop repeated messaging after disinterest.",
      "Be kind in person afterwards; gossip and retaliation are never okay.",
    ],
    dialogue: [
      { speaker: "You", text: "Would you like to go for a walk together this weekend? Only if you'd enjoy it.", },
      { speaker: "Them", text: "Thank you, but I'd rather not. I hope you understand." },
      { speaker: "You", text: "I understand completely. Thanks for telling me — I'll give you space. Take care!" },
    ],
    quiz: [
      {
        id: "fl-rej-q1",
        question: "What is a dignified reply to a clear no?",
        options: [
          "Please give me one more chance, I'll prove myself.",
          "Thanks for being honest. I understand — take care.",
          "Fine. You'll regret this.",
        ],
        answerIndex: 1,
        explanation: "Gratitude and acceptance respect the answer without guilt or pressure.",
      },
      {
        id: "fl-rej-q2",
        question: "After disinterest, what should happen next?",
        options: [
          "Keep messaging occasionally until they change their mind.",
          "Ask their friends to talk to them.",
          "Stop initiating contact and give genuine space.",
        ],
        answerIndex: 2,
        explanation: "Space is the clearest way to honour consent and privacy.",
      },
    ],
  },
];

export const flirtingScenarios: SimulationScenario[] = [
  {
    id: "fs-coffee",
    title: "Coffee after class",
    emoji: "☕",
    context:
      "Flirting Coach simulator. You would like to invite a classmate for coffee. Keep it respectful, age-appropriate, non-explicit and low-pressure. Do not assume romantic interest. Evaluate confidence, naturalness, humour, respect, empathy and grammar.",
    difficulty: "easy",
    opening: "That lecture went on forever. I think I need coffee to recover. ☕",
    followUps: [
      "That sounds nice. Are you free this week?",
      "Thanks for asking — let me check and get back to you.",
    ],
    betterAlternative: "Same here! Would you like to grab a coffee after class on Friday? No pressure if you're busy.",
    focus: ["confidence", "respect", "naturalness"],
  },
  {
    id: "fs-compliment-reply",
    title: "They compliment you",
    emoji: "🌷",
    context:
      "Flirting Coach simulator. Someone gives you a sincere compliment. Accept it warmly without bragging or assuming romantic intent. Keep it non-explicit.",
    difficulty: "easy",
    opening: "You explained that project really well today. You're good at this.",
    followUps: [
      "I meant it! How did you get so calm at presenting?",
      "That's sweet. Anyway, how was your day?",
    ],
    betterAlternative: "Thank you, that's kind of you to say. I practised a lot — what part did you find most useful?",
    focus: ["humour", "confidence", "respect"],
  },
  {
    id: "fs-playful-text",
    title: "A playful text",
    emoji: "💬",
    context:
      "Flirting Coach simulator. A light, funny text arrives. Reply with charm that matches their energy without being explicit or possessive.",
    difficulty: "medium",
    opening: "I just tried to cook dinner and set the smoke alarm off. Please tell me I'm not the only one. 😅",
    followUps: [
      "Haha okay, you're not alone. Did the dinner survive?",
      "That's exactly why I stick to snacks.",
    ],
    betterAlternative: "You're definitely not alone — I once burnt toast. Did the dinner survive, or is this a takeaway night? 😄",
    focus: ["humour", "naturalness", "empathy"],
  },
  {
    id: "fs-discomfort",
    title: "Reading discomfort",
    emoji: "🛡️",
    context:
      "Flirting Coach simulator. The other person gives short replies and seems uneasy. Recognise the signal, slow down and give them an easy exit. Never pressure.",
    difficulty: "advanced",
    opening: "Uh, I'm not sure. Maybe. I should go soon.",
    followUps: [
      "Thank you for understanding.",
      "I just need a quiet evening, honestly.",
    ],
    betterAlternative: "Of course — no pressure at all. Let's leave it there and I'll see you around. Take care!",
    focus: ["respect", "empathy", "confidence"],
  },
  {
    id: "fs-no",
    title: "Handling a no",
    emoji: "🤍",
    context:
      "Flirting Coach simulator. Your invitation is declined. Respond with grace and stop pursuing the topic. No guilt, no repeated messages.",
    difficulty: "medium",
    opening: "Thanks for asking, but I'd rather not. I hope you understand.",
    followUps: [
      "Thank you for being understanding.",
      "I appreciate you not making it awkward.",
    ],
    betterAlternative: "I understand completely. Thanks for being honest — I'll give you space. Take care!",
    focus: ["respect", "empathy", "grammar"],
  },
  {
    id: "fs-affection",
    title: "Sharing a feeling",
    emoji: "💗",
    context:
      "Flirting Coach simulator. You want to share that you enjoy talking with someone. Keep it honest, age-appropriate and free of expectation.",
    difficulty: "advanced",
    opening: "We've talked a lot this week. I've noticed you always make time for me.",
    followUps: [
      "That's kind of you to say. I enjoy our chats too.",
      "Thank you — I'm not sure what to say to that.",
    ],
    betterAlternative: "I really enjoy our conversations, and I wanted to say so. No pressure — I'm glad we're friends either way.",
    focus: ["confidence", "respect", "naturalness"],
  },
];

export interface TeluguFlirtingExample {
  id: string;
  roman: string;
  hint: string;
}

export const teluguExamples: TeluguFlirtingExample[] = [
  {
    id: "te-1",
    roman: "netho matladatam chala baguntundi",
    hint: "A warm compliment about the conversation",
  },
  {
    id: "te-2",
    roman: "nuvvu chala cute ga unnav",
    hint: "A playful, affectionate compliment",
  },
  {
    id: "te-3",
    roman: "netho coffee ki ravacha?",
    hint: "A polite, low-pressure invitation",
  },
  {
    id: "te-4",
    roman: "netho matladali anipistundi",
    hint: "Saying you feel like talking to someone",
  },
  {
    id: "te-5",
    roman: "ela unna?",
    hint: "A simple, caring greeting",
  },
];

export interface BoundaryRule {
  id: string;
  title: string;
  text: string;
  icon: "shield" | "ban" | "lock" | "message" | "eye" | "smile" | "check";
}

export const boundaryRules: BoundaryRule[] = [
  {
    id: "br-manipulate",
    title: "Never manipulate",
    text: "No guilt-tripping, jealousy games, fake urgency or testing someone to prove they care.",
    icon: "ban",
  },
  {
    id: "br-harass",
    title: "Never harass or pressure",
    text: "Do not spam messages, follow someone after a no, or keep asking until they give in.",
    icon: "shield",
  },
  {
    id: "br-consent",
    title: "Respect consent and privacy",
    text: "Ask before sharing photos, numbers or private details. Silence is not permission.",
    icon: "lock",
  },
  {
    id: "br-stop",
    title: "Stop after disinterest",
    text: "A no, a short reply or visible discomfort means stop initiating. Give real space.",
    icon: "message",
  },
  {
    id: "br-discomfort",
    title: "Recognise discomfort",
    text: "If they seem uneasy, slow down, change the subject or let the conversation end kindly.",
    icon: "eye",
  },
  {
    id: "br-no",
    title: "Handle 'no' respectfully",
    text: "Say thank you, accept it the first time and do not ask for a reason or a second chance.",
    icon: "check",
  },
  {
    id: "br-age",
    title: "Keep it age-appropriate",
    text: "All examples here are non-explicit and meant for respectful, age-appropriate conversation only.",
    icon: "smile",
  },
];
