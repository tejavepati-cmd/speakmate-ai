import type { Difficulty } from "@/lib/types";

export type ScenarioModeId =
  | "daily"
  | "college"
  | "colleague"
  | "interviewer"
  | "presentation"
  | "friendly"
  | "girltalk"
  | "flirting";

export interface ScenarioMode {
  id: ScenarioModeId;
  label: string;
  description: string;
  /** Pink accent is reserved for GirlTalk and Flirting modes. */
  accent?: "pink";
  /** Specialised coaches live on their own pages. */
  href?: string;
  hrefLabel?: string;
}

export interface RoleplayScenario {
  id: string;
  mode: ScenarioModeId;
  title: string;
  situation: string;
  openingLine: string;
  goals: string[];
  tips: string[];
  tone: string;
}

export const scenarioModes: ScenarioMode[] = [
  { id: "daily", label: "Daily conversation", description: "Everyday small talk with neighbours, shopkeepers and strangers." },
  { id: "college", label: "College friend", description: "Lectures, assignments, canteen plans and campus life." },
  { id: "colleague", label: "Professional colleague", description: "Status updates, handovers and polite workplace requests." },
  { id: "interviewer", label: "Interviewer", description: "Answer questions with clear, specific evidence." },
  { id: "presentation", label: "Presentation audience", description: "Explain your work and handle curious questions." },
  { id: "friendly", label: "Friendly conversation", description: "Warm, low-pressure chat that builds connection." },
  {
    id: "girltalk",
    label: "GirlTalk conversation",
    description: "Supportive, respectful friendship conversation.",
    accent: "pink",
    href: "/girltalk",
    hrefLabel: "Open GirlTalk Coach",
  },
  {
    id: "flirting",
    label: "Flirting practice",
    description: "Playful, respectful flirting with clear boundaries.",
    accent: "pink",
    href: "/girltalk/flirting",
    hrefLabel: "Open Flirting Coach",
  },
];

export const difficultyOptions: Array<{ value: Difficulty; label: string; hint: string }> = [
  { value: "easy", label: "Easy", hint: "Short, patient replies" },
  { value: "medium", label: "Medium", hint: "Natural pace" },
  { value: "advanced", label: "Advanced", hint: "Fast, nuanced" },
];

export const roleplayScenarios: RoleplayScenario[] = [
  /* ------------------------------- Daily ------------------------------- */
  {
    id: "daily-cafe",
    mode: "daily",
    title: "At the café",
    situation: "You are in a busy café. The barista is friendly but the line is moving fast. Order clearly and add one small bit of small talk.",
    openingLine: "Hi there! What can I get for you today?",
    goals: ["Order one item clearly", "Ask one short question", "Thank them politely"],
    tips: ["Say the size first: ‘A medium latte, please.’", "One friendly sentence is enough in a queue."],
    tone: "friendly and efficient",
  },
  {
    id: "daily-neighbour",
    mode: "daily",
    title: "Meeting a neighbour",
    situation: "You meet the person who lives next door in the lift. They smile and say hello. Keep it brief and warm.",
    openingLine: "Hey! I don't think we've properly met — I'm on the same floor.",
    goals: ["Introduce yourself", "Mention one neutral detail", "End the chat gracefully"],
    tips: ["Weather, lifts and local places are safe small talk.", "‘Nice to meet you’ is a natural closer."],
    tone: "warm and casual",
  },
  {
    id: "daily-shop",
    mode: "daily",
    title: "Returning an item",
    situation: "You need to return a shirt that does not fit. Explain the problem calmly and ask what options you have.",
    openingLine: "Hello, how can I help you today?",
    goals: ["Explain the issue clearly", "Ask about exchange or refund", "Stay polite and concise"],
    tips: ["‘I bought this yesterday, but the fit isn't right.’", "Ask one question at a time."],
    tone: "polite and practical",
  },

  /* ------------------------------ College ------------------------------ */
  {
    id: "college-lecture",
    mode: "college",
    title: "After the lecture",
    situation: "A classmate sits beside you after a long lecture and asks whether you understood the last example.",
    openingLine: "That last example completely lost me. Did you get it?",
    goals: ["Be honest without sounding defeated", "Offer your understanding", "Suggest a next step"],
    tips: ["‘I got the first half, but not the last bit.’", "Study together is a natural next step."],
    tone: "relaxed and helpful",
  },
  {
    id: "college-group",
    mode: "college",
    title: "Group project kickoff",
    situation: "Your group is dividing work for a submission. One person is quiet. Help the group move forward without taking over.",
    openingLine: "So, how do we want to split this up?",
    goals: ["Suggest a fair division", "Invite the quiet person in", "Agree on a check-in time"],
    tips: ["‘What would you feel comfortable owning?’", "Use ‘we’ more than ‘I’."],
    tone: "collaborative",
  },
  {
    id: "college-canteen",
    mode: "college",
    title: "Canteen catch-up",
    situation: "A friend is stressed about exams and asks how your week has been. Respond with care, then share something real.",
    openingLine: "I'm so tired of revision. How's your week been?",
    goals: ["Acknowledge their feelings", "Share one real detail", "Ask one caring question"],
    tips: ["‘That sounds like a lot.’ comes before advice.", "Keep your own update short."],
    tone: "supportive and casual",
  },

  /* ----------------------------- Colleague ----------------------------- */
  {
    id: "colleague-status",
    mode: "colleague",
    title: "Monday status check",
    situation: "Your teammate asks for a quick update before a team meeting. Be specific about progress and one blocker.",
    openingLine: "Quick check-in before the meeting — where are we on the report?",
    goals: ["State what is done", "Name one blocker", "Give a realistic timing"],
    tips: ["Lead with the outcome, not the effort.", "‘I'll need a decision by Wednesday’ is clear and polite."],
    tone: "concise and professional",
  },
  {
    id: "colleague-deadline",
    mode: "colleague",
    title: "Asking for more time",
    situation: "A colleague asks you to finish a task a day early. You cannot, but you can offer a partial delivery.",
    openingLine: "Could you send the slides by Thursday instead of Friday?",
    goals: ["Say no without sounding unhelpful", "Offer a realistic alternative", "Keep the relationship warm"],
    tips: ["‘I can't do Thursday, but I can send the first half.’", "Give the reason in one short clause."],
    tone: "respectful and solution-focused",
  },
  {
    id: "colleague-feedback",
    mode: "colleague",
    title: "Gentle feedback",
    situation: "A teammate keeps changing the shared document without commenting. Raise it without blaming them.",
    openingLine: "Did you get a chance to look at the latest version?",
    goals: ["Describe the behaviour neutrally", "Explain the impact", "Request a specific change"],
    tips: ["‘I noticed the edits went in without notes’ is factual.", "Ask for the change instead of demanding it."],
    tone: "calm and constructive",
  },

  /* ---------------------------- Interviewer ---------------------------- */
  {
    id: "interviewer-intro",
    mode: "interviewer",
    title: "Tell me about yourself",
    situation: "A friendly interviewer opens with the classic question. Give a focused answer and stop.",
    openingLine: "Thanks for coming in. To start, could you tell me a little about yourself?",
    goals: ["Use present–past–future", "Include one concrete example", "Stop after ~90 seconds"],
    tips: ["Connect your motivation to this role.", "Avoid your whole life story."],
    tone: "confident and warm",
  },
  {
    id: "interviewer-conflict",
    mode: "interviewer",
    title: "A disagreement at work",
    situation: "The interviewer asks about a conflict with a teammate. Show maturity without gossip.",
    openingLine: "Tell me about a time you disagreed with someone on your team.",
    goals: ["Use a real but safe example", "Show you listened", "End with the outcome"],
    tips: ["Use ‘we’ and ‘we agreed’ rather than blame.", "Keep names and companies generic."],
    tone: "reflective and professional",
  },
  {
    id: "interviewer-weakness",
    mode: "interviewer",
    title: "A skill you are improving",
    situation: "You are asked about a weakness. Be honest, specific and show active improvement.",
    openingLine: "What's one skill you'd like to get better at?",
    goals: ["Name a real skill", "Show what you are doing about it", "Avoid a fake weakness"],
    tips: ["‘Public speaking’ is fine if you then describe practice.", "End with the progress so far."],
    tone: "honest and growth-minded",
  },

  /* -------------------------- Presentation ----------------------------- */
  {
    id: "presentation-opening",
    mode: "presentation",
    title: "The opening minute",
    situation: "You are presenting a class project to faculty and students. You have about 60 seconds before questions.",
    openingLine: "Whenever you're ready, please begin.",
    goals: ["Hook the audience", "State the problem", "Preview your structure"],
    tips: ["‘Let me start with a question’ is a strong hook.", "Signpost what comes next."],
    tone: "clear and confident",
  },
  {
    id: "presentation-questions",
    mode: "presentation",
    title: "Tough audience question",
    situation: "After your talk, an audience member challenges your results. Stay composed and answer honestly.",
    openingLine: "How do you know your result wasn't just luck?",
    goals: ["Acknowledge the question", "Give evidence", "Name one limitation"],
    tips: ["‘That's a fair question’ buys you a second.", "Admitting a limitation builds credibility."],
    tone: "composed and evidence-led",
  },
  {
    id: "presentation-explain",
    mode: "presentation",
    title: "Explain it simply",
    situation: "A non-technical guest asks what your project actually does. Avoid jargon and use one analogy.",
    openingLine: "Sorry, I'm not technical — what does your system do in plain English?",
    goals: ["Avoid jargon", "Use one analogy", "End with the benefit"],
    tips: ["‘It's like a … for …’ works well.", "Check understanding with a short question."],
    tone: "plain and patient",
  },

  /* ----------------------------- Friendly ------------------------------ */
  {
    id: "friendly-weekend",
    mode: "friendly",
    title: "Weekend plans",
    situation: "A casual friend asks what you did this weekend. Share something small and ask one question back.",
    openingLine: "Hey! Did you do anything fun this weekend?",
    goals: ["Share one real detail", "Ask a question back", "Keep it light"],
    tips: ["Specific beats impressive: one good meal counts.", "Curiosity is the easiest way to be liked."],
    tone: "light and curious",
  },
  {
    id: "friendly-new-person",
    mode: "friendly",
    title: "A new friend at the club",
    situation: "You are at a hobby club and someone new joins the table. Start a conversation without interrogating them.",
    openingLine: "Hi, is this your first time here?",
    goals: ["Welcome them", "Share one thing about yourself", "Find a common interest"],
    tips: ["‘I'm also new-ish’ lowers the pressure.", "Follow their answer instead of jumping topics."],
    tone: "welcoming and easygoing",
  },
  {
    id: "friendly-compliment",
    mode: "friendly",
    title: "Giving a compliment",
    situation: "A friend did well in a competition. Congratulate them sincerely without comparing yourself.",
    openingLine: "I got the result — you were amazing!",
    goals: ["Be specific", "Avoid ‘I could never’", "Ask one interested question"],
    tips: ["Name the thing you admired.", "Let them enjoy the moment."],
    tone: "genuine and warm",
  },

  /* ----------------------------- GirlTalk ------------------------------ */
  {
    id: "girltalk-support",
    mode: "girltalk",
    title: "A friend needs support",
    situation: "A friend messages that she feels left out after a group plan changed. Respond with care before advice.",
    openingLine: "Everyone went without me and I feel awful about it.",
    goals: ["Acknowledge the feeling", "Avoid immediate fixing", "Offer one caring next step"],
    tips: ["‘That sounds really hurtful’ comes first.", "Ask before giving advice."],
    tone: "empathetic and supportive",
  },
  {
    id: "girltalk-boundary",
    mode: "girltalk",
    title: "Saying no kindly",
    situation: "A friend keeps asking you to cover her shift. You want to help sometimes but not this weekend.",
    openingLine: "Can you take my shift again this Saturday?",
    goals: ["Be clear about your limit", "Stay kind", "Offer one realistic alternative"],
    tips: ["‘I can't this Saturday’ is a complete sentence.", "You do not owe a long explanation."],
    tone: "kind and boundaried",
  },
  {
    id: "girltalk-confidence",
    mode: "girltalk",
    title: "A confidence boost",
    situation: "Your friend is nervous about a presentation and asks whether you think she will be fine.",
    openingLine: "I'm terrified — what if I forget everything on stage?",
    goals: ["Encourage without empty promises", "Name one strength", "Offer practical help"],
    tips: ["‘You've practised a lot’ is more useful than ‘don't worry’.", "Offer to listen to one run-through."],
    tone: "encouraging and grounded",
  },

  /* ----------------------------- Flirting ------------------------------ */
  {
    id: "flirting-playful",
    mode: "flirting",
    title: "A playful opener",
    situation: "You are chatting with someone you find interesting at a social event. Keep it light and respectful.",
    openingLine: "You look like you know the best snack here.",
    goals: ["Be playful, not pushy", "Show genuine curiosity", "Leave space for a no"],
    tips: ["One small joke is enough.", "Respect a short or neutral reply."],
    tone: "playful and respectful",
  },
  {
    id: "flirting-boundary",
    mode: "flirting",
    title: "Reading a gentle no",
    situation: "The person gives short replies and changes the topic when you flirt. Respond gracefully.",
    openingLine: "Anyway, did you see the game last night?",
    goals: ["Notice the cue", "Shift to comfortable conversation", "Avoid pressure"],
    tips: ["A topic change is a valid boundary.", "‘Totally — I haven't’ is a warm reset."],
    tone: "considerate and relaxed",
  },
  {
    id: "flirting-compliment",
    mode: "flirting",
    title: "A respectful compliment",
    situation: "You want to compliment someone without making them uncomfortable or assuming interest.",
    openingLine: "That was a really thoughtful point you made earlier.",
    goals: ["Compliment a choice or idea", "Keep it brief", "Move on without demanding a reaction"],
    tips: ["Praise something they chose, not just appearance.", "No follow-up question is needed."],
    tone: "sincere and low-pressure",
  },
];

export function scenariosForMode(mode: ScenarioModeId): RoleplayScenario[] {
  return roleplayScenarios.filter((scenario) => scenario.mode === mode);
}

export function findScenario(id: string): RoleplayScenario | undefined {
  return roleplayScenarios.find((scenario) => scenario.id === id);
}

export function findScenarioMode(id: ScenarioModeId): ScenarioMode | undefined {
  return scenarioModes.find((mode) => mode.id === id);
}
