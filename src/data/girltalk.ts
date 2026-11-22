import type { Difficulty } from "@/lib/types";

export type OpenerCategory =
  | "Say hello"
  | "Introduce yourself"
  | "Start naturally"
  | "Ask about her day"
  | "Keep it going";

export interface OpenerExample {
  id: string;
  category: OpenerCategory;
  text: string;
  when: string;
  note?: string;
}

export const openerCategories: OpenerCategory[] = [
  "Say hello",
  "Introduce yourself",
  "Start naturally",
  "Ask about her day",
  "Keep it going",
];

export const openers: OpenerExample[] = [
  {
    id: "op-hello-1",
    category: "Say hello",
    text: "Hi! I don't think we've met yet — I'm Riya. What's your name?",
    when: "At a college event, club meeting or a friend's get-together.",
    note: "A smile and your own name make the introduction feel safe and reciprocal.",
  },
  {
    id: "op-hello-2",
    category: "Say hello",
    text: "Hey, hi! Is this seat taken?",
    when: "In a classroom, library or canteen when you want a low-pressure start.",
    note: "Practical, polite and easy for the other person to answer with a simple yes or no.",
  },
  {
    id: "op-hello-3",
    category: "Say hello",
    text: "Hello! I've seen you in this class a few times — how is the course going for you?",
    when: "When you share a class but have never properly talked.",
    note: "Noticing a shared setting is a natural, non-creepy reason to say hello.",
  },
  {
    id: "op-intro-1",
    category: "Introduce yourself",
    text: "I'm new here, so I'm still learning everyone's names. I'm Ananya — nice to meet you!",
    when: "Your first day at college, a new job or a new club.",
    note: "Being honest about being new takes the pressure off both of you.",
  },
  {
    id: "op-intro-2",
    category: "Introduce yourself",
    text: "Hi, I'm Kavya, a friend of Neha's. How do you know her?",
    when: "You are in a group where you only know one person.",
    note: "A shared connection gives the other person an easy thread to follow.",
  },
  {
    id: "op-start-1",
    category: "Start naturally",
    text: "That book you're reading looks interesting — what's it about?",
    when: "When you notice something they are actively enjoying.",
    note: "Ask about an interest, not about appearance, to keep it respectful.",
  },
  {
    id: "op-start-2",
    category: "Start naturally",
    text: "The music here is great. Do you know who this song is by?",
    when: "At a casual event, café or shared playlist session.",
    note: "A comment about the setting is easy to leave at any time.",
  },
  {
    id: "op-start-3",
    category: "Start naturally",
    text: "I'm trying to decide what to order. Anything you'd recommend?",
    when: "In a canteen, café or food court.",
    note: "Asking for a small recommendation invites help without demanding a deep conversation.",
  },
  {
    id: "op-day-1",
    category: "Ask about her day",
    text: "How has your day been so far — busy or calm?",
    when: "When she looks relaxed and you have a few minutes to talk.",
    note: "Giving two easy options makes the question simple to answer.",
  },
  {
    id: "op-day-2",
    category: "Ask about her day",
    text: "You looked really focused in class today. How did it go?",
    when: "Right after a test, presentation or a difficult lecture.",
    note: "A specific observation shows you were paying attention in a kind way.",
  },
  {
    id: "op-day-3",
    category: "Ask about her day",
    text: "Did you get a chance to rest after the exam? That week was a lot.",
    when: "When someone has been under visible pressure.",
    note: "Notice effort before asking for details; it can feel caring rather than nosy.",
  },
  {
    id: "op-keep-1",
    category: "Keep it going",
    text: "That's interesting! What made you choose that?",
    when: "Right after she shares an opinion, a subject or a decision.",
    note: "'What made you…' invites a story instead of a one-word answer.",
  },
  {
    id: "op-keep-2",
    category: "Keep it going",
    text: "Wait, tell me more about that — what happened next?",
    when: "When a story pauses or ends too quickly.",
    note: "A genuine 'tell me more' is one of the simplest ways to keep a conversation alive.",
  },
  {
    id: "op-keep-3",
    category: "Keep it going",
    text: "I'd love to hear your take on this — what do you think?",
    when: "In a group discussion when a quieter person has not spoken yet.",
    note: "Inviting an opinion shows respect for her point of view.",
  },
];

export interface SimulationScenario {
  id: string;
  title: string;
  emoji: string;
  context: string;
  difficulty: Difficulty;
  opening: string;
  followUps: string[];
  betterAlternative: string;
  focus: string[];
}

export const scenarios: SimulationScenario[] = [
  {
    id: "sc-orientation",
    title: "College orientation",
    emoji: "🎓",
    context:
      "GirlTalk conversation simulator. You have just met someone at college orientation. Keep it respectful, age-appropriate and friendly. Do not assume romantic interest. Evaluate empathy, politeness, naturalness, clarity, grammar, confidence and respect.",
    difficulty: "easy",
    opening: "Hi! I think this is my first time at one of these. Everyone seems to know each other already.",
    followUps: [
      "That's reassuring. Which course are you in?",
      "Nice, I'm still deciding on a few clubs. Any suggestions?",
    ],
    betterAlternative: "Hi! I felt the same way at first. I'm in first-year commerce — what about you?",
    focus: ["politeness", "confidence", "clarity"],
  },
  {
    id: "sc-quiet-classmate",
    title: "A quiet classmate",
    emoji: "📚",
    context:
      "GirlTalk conversation simulator. A classmate has been quiet during a group activity. Practise kind, low-pressure conversation. Do not pry into personal matters or assume romantic interest.",
    difficulty: "medium",
    opening: "I get a bit nervous when we have to speak in front of everyone. Does that happen to you too?",
    followUps: [
      "Yeah, I usually wait for someone else to start.",
      "Thanks, that actually helps a little.",
    ],
    betterAlternative: "Me too. No rush — we can share our idea together when you're ready.",
    focus: ["empathy", "respect", "naturalness"],
  },
  {
    id: "sc-bad-day",
    title: "She had a bad day",
    emoji: "🌧️",
    context:
      "GirlTalk conversation simulator. A friend says she had a difficult day. Respond with care, without trying to fix everything or claim to know exactly how she feels.",
    difficulty: "medium",
    opening: "Today was honestly exhausting. I don't really want to talk about it, but I needed to say it out loud.",
    followUps: [
      "Thanks. I think I just need a quiet break.",
      "Maybe later. I don't want to overthink it right now.",
    ],
    betterAlternative: "I'm sorry it's been so heavy. We don't have to talk about it — I'm here if you want a quiet break or a distraction.",
    focus: ["empathy", "respect", "politeness"],
  },
  {
    id: "sc-group-project",
    title: "Group project disagreement",
    emoji: "🧩",
    context:
      "GirlTalk conversation simulator. A teammate disagrees with your idea in a group project. Stay calm, respectful and collaborative. Avoid blame.",
    difficulty: "advanced",
    opening: "I don't think that plan will work. We should just do it my way to save time.",
    followUps: [
      "Fine, but I still think my idea has merit.",
      "Okay, maybe we can compare both quickly.",
    ],
    betterAlternative: "I see why speed matters to you. Could we try your idea for the first draft and keep my suggestion as a backup?",
    focus: ["respect", "clarity", "confidence"],
  },
  {
    id: "sc-new-neighbour",
    title: "New neighbour",
    emoji: "🏠",
    context:
      "GirlTalk conversation simulator. You meet someone new in your hostel or neighbourhood. Friendly and respectful only. No personal or invasive questions.",
    difficulty: "easy",
    opening: "Hi, I think we're in the same building. I'm Sri — nice to meet you.",
    followUps: [
      "Thanks! I'm still finding my way around.",
      "Yes, the library is about ten minutes that way.",
    ],
    betterAlternative: "Nice to meet you too! If you need help finding anything around here, just let me know.",
    focus: ["politeness", "naturalness", "respect"],
  },
  {
    id: "sc-hobby",
    title: "Talking about a hobby",
    emoji: "🎨",
    context:
      "GirlTalk conversation simulator. Someone mentions a hobby they love. Show genuine curiosity and ask an open question without steering it toward yourself.",
    difficulty: "easy",
    opening: "I've been learning classical dance for a few months. It's harder than it looks!",
    followUps: [
      "I started because my cousin recommended it.",
      "The practice is tiring, but the music makes it worth it.",
    ],
    betterAlternative: "That sounds lovely! What kind of music do you practise with, and what made you start?",
    focus: ["empathy", "naturalness", "clarity"],
  },
  {
    id: "sc-message-mixup",
    title: "A message misunderstanding",
    emoji: "💬",
    context:
      "GirlTalk conversation simulator. A short reply to a text may have sounded rude, and the other person is upset. Clarify calmly and take responsibility without over-apologising.",
    difficulty: "advanced",
    opening: "Your reply yesterday felt a bit cold. Did I do something wrong?",
    followUps: [
      "Okay, that makes sense. I just wasn't sure.",
      "Thanks for explaining. I'd rather ask than assume.",
    ],
    betterAlternative: "I'm sorry it came across that way — that wasn't my intention. I was rushing between classes. Let me explain properly when you have a moment.",
    focus: ["empathy", "clarity", "respect"],
  },
  {
    id: "sc-saying-no",
    title: "She says no to plans",
    emoji: "🤝",
    context:
      "GirlTalk conversation simulator. Someone declines an invitation. Accept the answer gracefully; do not guilt, persuade or repeatedly message.",
    difficulty: "medium",
    opening: "Thanks for asking, but I can't make it this weekend.",
    followUps: [
      "I'll be busy, but maybe another time.",
      "Thank you for understanding.",
    ],
    betterAlternative: "No problem at all — thanks for letting me know. Let's catch up another time when it suits you.",
    focus: ["respect", "politeness", "confidence"],
  },
  {
    id: "sc-compliment",
    title: "A thoughtful compliment",
    emoji: "🌸",
    context:
      "GirlTalk conversation simulator. Give a sincere, non-explicit compliment about something a person chose or achieved, then move the conversation on naturally.",
    difficulty: "easy",
    opening: "I finally finished my poster for the science exhibition. It took three whole evenings.",
    followUps: [
      "Thank you! I was worried it looked messy.",
      "I'm relieved it's done. What have you been working on?",
    ],
    betterAlternative: "That's a real achievement — the colours and layout look thought-through. What was the hardest part to get right?",
    focus: ["respect", "naturalness", "empathy"],
  },
  {
    id: "sc-exam-stress",
    title: "Exam stress",
    emoji: "📝",
    context:
      "GirlTalk conversation simulator. A classmate is worried about exams. Offer support and a practical, optional suggestion without dismissing the feeling.",
    difficulty: "medium",
    opening: "I have three exams next week and I feel like I've forgotten everything.",
    followUps: [
      "Maybe. I just need to start somewhere.",
      "That sounds doable, actually. Thanks.",
    ],
    betterAlternative: "That sounds really stressful. It's normal to feel that way — would it help to make a short revision plan together for one subject?",
    focus: ["empathy", "clarity", "confidence"],
  },
];

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface PracticeLesson {
  id: string;
  title: string;
  emoji: string;
  summary: string;
  tips: string[];
  dialogue: Array<{ speaker: "You" | "Them"; text: string }>;
  quiz: QuizQuestion[];
}

export const practiceLessons: PracticeLesson[] = [
  {
    id: "gl-first-conversation",
    title: "Your first conversation",
    emoji: "👋",
    summary: "Start small, be honest about nerves and give the other person an easy way in.",
    tips: [
      "Begin with a simple hello and your own name.",
      "Use the setting as a reason to talk: the class, the event, the book.",
      "Ask one short question, then leave a comfortable pause for the answer.",
      "It is fine to end politely after a few minutes.",
    ],
    dialogue: [
      { speaker: "You", text: "Hi, I'm Diya. I don't think we've met — how is your first week going?" },
      { speaker: "Them", text: "Pretty busy, but good! I'm Kabir, by the way." },
      { speaker: "You", text: "Nice to meet you, Kabir. I'm still finding my way around campus." },
    ],
    quiz: [
      {
        id: "gl-first-q1",
        question: "Which opener is the most low-pressure and respectful?",
        options: [
          "You look serious. Why are you alone?",
          "Hi, I'm Diya. Is this your first year too?",
          "Tell me your whole life story.",
        ],
        answerIndex: 1,
        explanation: "A name plus a simple, optional question gives the other person an easy choice to respond or not.",
      },
      {
        id: "gl-first-q2",
        question: "What is a good way to close a short first chat?",
        options: [
          "Walk away without saying anything.",
          "Keep asking questions even if they look busy.",
          "It was nice meeting you — I'll let you get back to your day.",
        ],
        answerIndex: 2,
        explanation: "A warm, brief close respects the other person's time and leaves the door open.",
      },
    ],
  },
  {
    id: "gl-getting-to-know",
    title: "Getting to know someone",
    emoji: "🌱",
    summary: "Trade small, comfortable details and build curiosity one question at a time.",
    tips: [
      "Share something about yourself before asking something personal.",
      "Prefer open questions: 'What do you like about…?' instead of 'Do you like…?'",
      "Remember one detail and refer to it later — it shows you listened.",
      "Avoid questions about money, relationships or appearance early on.",
    ],
    dialogue: [
      { speaker: "You", text: "I'm trying a new café near the library this week. Do you have a favourite study spot?" },
      { speaker: "Them", text: "The quiet corner upstairs. It's peaceful before noon." },
      { speaker: "You", text: "That's useful — I'll try it tomorrow. What subject are you revising?" },
    ],
    quiz: [
      {
        id: "gl-known-q1",
        question: "Which question invites a fuller answer?",
        options: [
          "Do you like your course?",
          "What do you enjoy most about your course?",
          "Is your course good, yes or no?",
        ],
        answerIndex: 1,
        explanation: "'What do you enjoy most' is open and gives the person room to share a real detail.",
      },
      {
        id: "gl-known-q2",
        question: "Which topic is best avoided early on?",
        options: ["Weekend plans", "Hobbies", "How much someone earns"],
        answerIndex: 2,
        explanation: "Money is personal. Hobbies and light plans are safer, friendlier topics.",
      },
    ],
  },
  {
    id: "gl-hobbies",
    title: "Asking about hobbies",
    emoji: "🎨",
    summary: "Show genuine interest in what someone chooses to spend time on.",
    tips: [
      "Ask what they enjoy about the hobby, not just how long they have done it.",
      "Mirror their energy: if they sound excited, let your reply sound excited too.",
      "One follow-up question is enough; do not turn it into an interview.",
      "Offer a small connection of your own if you have one.",
    ],
    dialogue: [
      { speaker: "You", text: "You mentioned you love sketching — what do you like drawing most?" },
      { speaker: "Them", text: "Mostly tiny street scenes. It helps me slow down." },
      { speaker: "You", text: "That's a lovely reason. I take photos for the same reason — do you ever draw from photos?" },
    ],
    quiz: [
      {
        id: "gl-hobby-q1",
        question: "Which reply shows the most genuine curiosity?",
        options: [
          "Cool.",
          "What do you enjoy most about sketching?",
          "I can draw better than that.",
        ],
        answerIndex: 1,
        explanation: "A specific question about enjoyment continues the conversation without competing.",
      },
      {
        id: "gl-hobby-q2",
        question: "What should you do after they answer?",
        options: [
          "Change the topic immediately.",
          "Ask one related follow-up or share a short connection.",
          "Repeat the same question.",
        ],
        answerIndex: 1,
        explanation: "One follow-up or a small shared connection keeps the exchange balanced.",
      },
    ],
  },
  {
    id: "gl-college",
    title: "Talking about college",
    emoji: "🏫",
    summary: "Keep campus talk positive and open — courses, clubs, routines and small wins.",
    tips: [
      "Ask about a subject, club or routine rather than grades or rank.",
      "Relate it to your own experience briefly, then hand the conversation back.",
      "Celebrate effort: projects, presentations and practice all count.",
      "Be careful with gossip; it can damage trust quickly.",
    ],
    dialogue: [
      { speaker: "You", text: "How is the second-year project going? I heard the deadline moved." },
      { speaker: "Them", text: "It did! We have one more week, which is a relief." },
      { speaker: "You", text: "Glad to hear it. Our group is still figuring out the topic — any tips?" },
    ],
    quiz: [
      {
        id: "gl-college-q1",
        question: "Which college question feels kindest?",
        options: [
          "What's your rank?",
          "Which club have you enjoyed most this term?",
          "Why did you get such a low score?",
        ],
        answerIndex: 1,
        explanation: "Clubs and experiences invite stories; ranks and scores can feel judgmental.",
      },
      {
        id: "gl-college-q2",
        question: "How can you support someone with a deadline?",
        options: [
          "Tell them not to worry at all.",
          "Say the deadline sounds manageable and offer to help with one small step.",
          "Ask why they left it so late.",
        ],
        answerIndex: 1,
        explanation: "A practical, optional offer respects their effort and their independence.",
      },
    ],
  },
  {
    id: "gl-compliments",
    title: "Giving compliments",
    emoji: "🌸",
    summary: "Notice choices and effort. Keep it specific, non-explicit and easy to receive.",
    tips: [
      "Compliment something a person chose: work, style, ideas, kindness.",
      "Be specific: 'Your explanation was clear' lands better than a vague 'nice'.",
      "Avoid comments about body parts or anything suggestive.",
      "Move on after the compliment; do not wait for praise in return.",
    ],
    dialogue: [
      { speaker: "You", text: "Your presentation was really clear — the examples made the topic easy to follow." },
      { speaker: "Them", text: "Thank you! I practised it twice last night." },
      { speaker: "You", text: "It showed. Which part was hardest to explain?" },
    ],
    quiz: [
      {
        id: "gl-comp-q1",
        question: "Which compliment is the most respectful?",
        options: [
          "Your outfit is perfect, don't change anything.",
          "The way you explained that example was really clear.",
          "You're the prettiest person here.",
        ],
        answerIndex: 1,
        explanation: "A specific comment about effort or skill is sincere and comfortable to receive.",
      },
      {
        id: "gl-comp-q2",
        question: "What should follow a compliment?",
        options: [
          "Silence until they compliment you back.",
          "A related, easy question or a natural topic change.",
          "Repeat the compliment three times.",
        ],
        answerIndex: 1,
        explanation: "Moving on keeps the moment light and avoids pressure.",
      },
    ],
  },
  {
    id: "gl-concern",
    title: "Showing concern",
    emoji: "🫶",
    summary: "Notice a change, name it gently and offer support without taking over.",
    tips: [
      "Use tentative language: 'You seem a bit tired' rather than 'You are sad'.",
      "Offer a choice: talk, a break, or simply company.",
      "Do not demand details or promise you know exactly how they feel.",
      "Follow up later if they seemed genuinely low.",
    ],
    dialogue: [
      { speaker: "You", text: "You've seemed a little quiet today. No pressure — is everything okay?" },
      { speaker: "Them", text: "Just a lot on my mind, but I don't want to bore you." },
      { speaker: "You", text: "You're not boring me. We can sit quietly, or you can tell me later — whatever you prefer." },
    ],
    quiz: [
      {
        id: "gl-concern-q1",
        question: "Which phrase is the most caring and least certain?",
        options: [
          "I know exactly how you feel.",
          "You seem a little quiet — is everything okay?",
          "Why are you acting strange?",
        ],
        answerIndex: 1,
        explanation: "'Seem' and a gentle question leave room for the other person's actual experience.",
      },
      {
        id: "gl-concern-q2",
        question: "What is a supportive offer?",
        options: [
          "You must tell me right now.",
          "Forget about it, it's probably nothing.",
          "We can talk, take a break, or just sit together — your choice.",
        ],
        answerIndex: 2,
        explanation: "Giving choices respects their boundaries while showing you care.",
      },
    ],
  },
  {
    id: "gl-apologising",
    title: "Apologising",
    emoji: "🙏",
    summary: "Own the specific action, acknowledge the impact and leave room for the other person.",
    tips: [
      "Name what you did instead of a vague 'sorry for everything'.",
      "Avoid 'if I upset you' — that shifts responsibility.",
      "Offer a concrete fix, then accept their response.",
      "Do not send repeated apologies if they ask for space.",
    ],
    dialogue: [
      { speaker: "You", text: "I'm sorry I interrupted you in the meeting. You were still making your point." },
      { speaker: "Them", text: "Thanks for saying that. It did feel rushed." },
      { speaker: "You", text: "That's fair. Next time I'll wait. If you want, I can share your point with the group." },
    ],
    quiz: [
      {
        id: "gl-apology-q1",
        question: "Which apology takes real responsibility?",
        options: [
          "Sorry if anyone was offended.",
          "I'm sorry I interrupted you earlier; I should have waited.",
          "Mistakes happen, right?",
        ],
        answerIndex: 1,
        explanation: "Naming the exact action shows accountability without blaming the other person.",
      },
      {
        id: "gl-apology-q2",
        question: "What should you do after apologising?",
        options: [
          "Demand immediate forgiveness.",
          "Send five more messages until they reply.",
          "Give them time and respect their response.",
        ],
        answerIndex: 2,
        explanation: "An apology is an offer, not a request with a deadline.",
      },
    ],
  },
  {
    id: "gl-misunderstandings",
    title: "Handling misunderstandings",
    emoji: "🔍",
    summary: "Pause, check what you think you heard and clarify without blame.",
    tips: [
      "Start with your understanding: 'I may have read this wrong…'",
      "Ask one clear question instead of guessing the worst.",
      "Use 'I' statements: 'I felt confused' rather than 'You were rude'.",
      "If you were wrong, apologise briefly and move forward.",
    ],
    dialogue: [
      { speaker: "You", text: "I may have read your message wrong — did you mean that you'd rather work alone?" },
      { speaker: "Them", text: "Oh no, I meant alone for that one part. I still want to do the rest together." },
      { speaker: "You", text: "Thanks for clearing that up. I should have asked before assuming." },
    ],
    quiz: [
      {
        id: "gl-mis-q1",
        question: "What is the safest first step in a misunderstanding?",
        options: [
          "Assume the worst and reply sharply.",
          "Ask a calm clarifying question.",
          "Ignore it and stay silent forever.",
        ],
        answerIndex: 1,
        explanation: "A calm question turns a guess into shared understanding.",
      },
      {
        id: "gl-mis-q2",
        question: "Which sentence uses a healthy 'I' statement?",
        options: [
          "You always ignore me.",
          "You are so careless with words.",
          "I felt confused by that message — could you explain it?",
        ],
        answerIndex: 2,
        explanation: "'I felt… could you…' names your experience and invites an explanation.",
      },
    ],
  },
  {
    id: "gl-boundaries",
    title: "Respecting boundaries",
    emoji: "🛡️",
    summary: "Notice comfort signals, accept limits the first time and never pressure for more.",
    tips: [
      "A 'no', a short reply or silence is a valid answer.",
      "Do not keep asking after someone declines.",
      "Ask before sharing someone's photo, number or private information.",
      "If you are unsure, say 'No pressure — tell me if you'd rather not.'",
    ],
    dialogue: [
      { speaker: "You", text: "Would you like to join the study group on Saturday? No pressure at all." },
      { speaker: "Them", text: "I can't this time, thanks for asking." },
      { speaker: "You", text: "Totally fine. I'll let you know about the next one, and that's that." },
    ],
    quiz: [
      {
        id: "gl-bound-q1",
        question: "Someone says 'I can't this time'. What should you do?",
        options: [
          "Ask again three more times.",
          "Accept it and change the subject kindly.",
          "Ask why they are refusing.",
        ],
        answerIndex: 1,
        explanation: "Accept the answer the first time; repeated asking becomes pressure.",
      },
      {
        id: "gl-bound-q2",
        question: "Which phrase respects a boundary best?",
        options: [
          "You have to come.",
          "Everyone is coming, so why not?",
          "No pressure — tell me if you'd rather not.",
        ],
        answerIndex: 2,
        explanation: "Explicitly removing pressure makes it safe to say no.",
      },
    ],
  },
  {
    id: "gl-rejection",
    title: "Responding to rejection",
    emoji: "🤍",
    summary: "Accept disappointment with grace. One kind reply protects your dignity and their comfort.",
    tips: [
      "Thank them for being honest.",
      "Do not argue, persuade or ask for a reason.",
      "Stop repeated messaging after disinterest.",
      "Take a break and do something kind for yourself.",
    ],
    dialogue: [
      { speaker: "You", text: "Would you like to go to the fest together? Only if you'd enjoy it." },
      { speaker: "Them", text: "Thank you for asking, but I'd rather just go with my friends." },
      { speaker: "You", text: "Completely understandable. Thanks for telling me — have a great time!" },
    ],
    quiz: [
      {
        id: "gl-rej-q1",
        question: "What is a respectful response to 'no'?",
        options: [
          "Why not? Give me a better reason.",
          "Thanks for being honest. I understand — take care.",
          "Send another message every hour.",
        ],
        answerIndex: 1,
        explanation: "Gratitude plus acceptance keeps things respectful and final.",
      },
      {
        id: "gl-rej-q2",
        question: "After clear disinterest, what is the right next step?",
        options: [
          "Stop reaching out and give them space.",
          "Try a different approach until they say yes.",
          "Ask their friends to convince them.",
        ],
        answerIndex: 0,
        explanation: "Space is the clearest form of respect after a no.",
      },
    ],
  },
];
