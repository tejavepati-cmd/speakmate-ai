/**
 * Static content for the Professional English Coach.
 * Each module is self-contained so it can be rendered by the shared workspace.
 */

export type ProfessionalCategory =
  | "College life"
  | "Technical communication"
  | "Career & workplace";

export interface ProfessionalModule {
  /** Stable short id, also used for deep links and saved-session notes. */
  id: string;
  /** Display letter A–J. */
  letter: string;
  title: string;
  description: string;
  /** The concrete task the learner should answer. */
  prompt: string;
  samplePhrases: string[];
  followUpQuestions: string[];
  tips: string[];
  category: ProfessionalCategory;
}

export const professionalModules: ProfessionalModule[] = [
  {
    id: "self-introduction",
    letter: "A",
    title: "Self-introduction",
    description: "Introduce yourself clearly in college, at a meetup or on a first call.",
    prompt:
      "Write a 40–60 second introduction: your name, what you study or do, one thing you are currently learning, and a friendly closing line.",
    samplePhrases: [
      "Hi, I'm … and I'm currently studying …",
      "I'm especially interested in how … works.",
      "Right now I'm working on improving my …",
      "I'd be happy to tell you a little more about that.",
    ],
    followUpQuestions: [
      "What made you choose that field?",
      "What are you hoping to learn next?",
      "Could you tell me about a recent project you enjoyed?",
    ],
    tips: [
      "Lead with your name and role — context first, details second.",
      "Keep one idea per sentence so the listener can follow you.",
      "End with an open invitation, not a full stop.",
    ],
    category: "College life",
  },
  {
    id: "college-conversations",
    letter: "B",
    title: "College conversations",
    description: "Small talk with classmates, lab partners and friends between lectures.",
    prompt:
      "Reply to a classmate who asks how your week is going. Mention one real detail, ask one question back, and keep the tone relaxed.",
    samplePhrases: [
      "It's been busy, but in a good way.",
      "I'm currently working on … for the … class.",
      "How about you? Did you finish the … ?",
      "Let's compare notes after the lecture.",
    ],
    followUpQuestions: [
      "Which part of the assignment are you finding tricky?",
      "Are you free to study together this afternoon?",
      "Did you understand the last example the lecturer gave?",
    ],
    tips: [
      "Match the other person's energy — casual for classmates, formal for staff.",
      "A short answer plus a question keeps a conversation alive.",
      "Use ‘we’ and ‘let's’ to sound collaborative.",
    ],
    category: "College life",
  },
  {
    id: "talking-to-lecturers",
    letter: "C",
    title: "Talking to lecturers",
    description: "Ask questions, request clarification and speak to staff with respect.",
    prompt:
      "Write a polite message to your lecturer asking for clarification about an assignment. State what you understood, what is unclear, and when you need the answer.",
    samplePhrases: [
      "Thank you for explaining … in class today.",
      "I understood the first part, but I'm not sure about …",
      "Could you please clarify whether … ?",
      "I'd really appreciate your guidance before the deadline on …",
    ],
    followUpQuestions: [
      "Would an example of the expected format help?",
      "Should we include references for the reflection section?",
      "Would it be alright to discuss this briefly after class?",
    ],
    tips: [
      "Show what you already understood before asking for more.",
      "‘Could you please…’ sounds softer than ‘Explain this’.",
      "Give a reason for the timing so the lecturer can prioritise.",
    ],
    category: "College life",
  },
  {
    id: "technical-concepts",
    letter: "D",
    title: "Explaining technical concepts",
    description: "Make a complex idea simple without losing accuracy.",
    prompt:
      "Explain one technical idea you know (for example, caching, a database index, or a circuit) to a smart person who is not in your field. Use one analogy.",
    samplePhrases: [
      "In simple terms, … is like …",
      "The main idea is that …",
      "A useful analogy is …",
      "So the practical benefit is …",
    ],
    followUpQuestions: [
      "Can you give a real-world example of that?",
      "What happens if that part fails?",
      "How is it different from the older approach?",
    ],
    tips: [
      "Define the term before you explain how it works.",
      "One analogy is powerful; three analogies confuse people.",
      "Close with the ‘so what’ — why the idea matters.",
    ],
    category: "Technical communication",
  },
  {
    id: "explaining-projects",
    letter: "E",
    title: "Explaining projects",
    description: "Describe the problem, your contribution and the result in a clear arc.",
    prompt:
      "Describe a project in 5–6 sentences: the problem, your role, the approach, one obstacle, the outcome, and what you would do differently.",
    samplePhrases: [
      "The problem we were solving was …",
      "My role was to …",
      "The approach we chose was … because …",
      "One challenge we hit was …, and we handled it by …",
      "The result was …",
    ],
    followUpQuestions: [
      "What was the hardest technical decision you made?",
      "How did you measure whether it worked?",
      "What would you change if you started again?",
    ],
    tips: [
      "Use the problem → action → result structure every time.",
      "Use ‘I’ for your own work and ‘we’ for the team's work.",
      "Numbers make results believable — add one if you can.",
    ],
    category: "Technical communication",
  },
  {
    id: "presentation-practice",
    letter: "F",
    title: "Presentation practice",
    description: "Deliver a project talk and handle realistic audience questions.",
    prompt:
      "Imagine you are presenting your project to a mixed audience of classmates and faculty. Write a 60–90 second opening: hook, problem, your solution, and a preview of what you will cover.",
    samplePhrases: [
      "Let me start with a quick question: …",
      "Today I'll walk you through …",
      "The problem we looked at was …",
      "In the next few minutes, I'll show you …",
      "I'll finish with what we learned and what comes next.",
    ],
    followUpQuestions: [
      "How did you decide on this approach instead of the alternatives?",
      "What was the biggest limitation of your result?",
      "If you had another month, what would you improve first?",
    ],
    tips: [
      "The first 15 seconds should tell people why they should care.",
      "Signpost the structure so the audience knows where they are.",
      "Pause after a key point — silence reads as confidence.",
    ],
    category: "Technical communication",
  },
  {
    id: "professional-emails",
    letter: "G",
    title: "Professional emails",
    description: "Write concise, courteous emails that get a clear response.",
    prompt:
      "Write a short email to a project supervisor requesting a 15-minute meeting this week. Include a subject line, a purpose, two agenda points and a polite close.",
    samplePhrases: [
      "Subject: Request for a short meeting about …",
      "I'm writing to ask about …",
      "I'd like to cover two points: … and …",
      "Would you be available on … ?",
      "Thank you for your time and guidance.",
    ],
    followUpQuestions: [
      "Would a shorter version work better for a busy recipient?",
      "What if you need to decline the proposed time?",
      "How would you follow up if there is no reply in three days?",
    ],
    tips: [
      "Put the ask in the first two lines — not the last paragraph.",
      "Keep paragraphs to two or three lines for mobile reading.",
      "Always make the next step easy: offer specific times.",
    ],
    category: "Career & workplace",
  },
  {
    id: "interview-preparation",
    letter: "H",
    title: "Interview preparation",
    description: "Answer common questions with specific, confident evidence.",
    prompt:
      "Answer this interview question: ‘Tell me about yourself and why this role interests you.’ Use the present–past–future structure and one concrete example.",
    samplePhrases: [
      "Currently, I'm …",
      "Previously, I worked on … where I …",
      "One project I'm proud of is …",
      "I'm looking for a role where I can …",
      "That's why this position interests me.",
    ],
    followUpQuestions: [
      "Tell me about a time you disagreed with a teammate.",
      "What is one skill you are actively improving?",
      "Why should we hire you over another candidate?",
    ],
    tips: [
      "Keep the answer to 90 seconds, then stop and let them ask.",
      "Use evidence, not adjectives — show instead of claiming.",
      "Connect your motivation to the specific role, not a generic compliment.",
    ],
    category: "Career & workplace",
  },
  {
    id: "group-discussions",
    letter: "I",
    title: "Group discussions",
    description: "Enter a discussion, build on ideas and disagree politely.",
    prompt:
      "Write your contribution to a group discussion about whether remote work helps students. Agree with one point, add a new point, and politely disagree with one point.",
    samplePhrases: [
      "I agree with … because …",
      "Building on that point, …",
      "I see it slightly differently — …",
      "Could I add one more example?",
      "That's a fair point, but have we considered … ?",
    ],
    followUpQuestions: [
      "How would you respond if someone interrupted you?",
      "What would you say to bring a quiet teammate in?",
      "How do you close a discussion and summarise the group's view?",
    ],
    tips: [
      "Acknowledge before you disagree — it lowers defensiveness.",
      "Use names and short sentences in a live group.",
      "A good summary at the end makes you sound like a leader.",
    ],
    category: "Career & workplace",
  },
  {
    id: "workplace-communication",
    letter: "J",
    title: "Workplace communication",
    description: "Status updates, handovers, feedback and everyday office English.",
    prompt:
      "Write a Monday status update for your team: what you finished last week, what you are doing this week, and one blocker or risk.",
    samplePhrases: [
      "Last week I completed …",
      "This week I'm focusing on …",
      "One thing blocking progress is …",
      "I'll need a decision on … by …",
      "Happy to help if anyone needs a hand with …",
    ],
    followUpQuestions: [
      "How would you raise the same blocker more formally with a manager?",
      "What if the person you need is on leave?",
      "How would you give gentle feedback to a teammate?",
    ],
    tips: [
      "Lead with outcomes, not with the number of hours worked.",
      "Name the blocker and the deadline for a decision.",
      "Offer help — it makes a status update feel like teamwork.",
    ],
    category: "Career & workplace",
  },
];

export const professionalCategories: ProfessionalCategory[] = [
  "College life",
  "Technical communication",
  "Career & workplace",
];

export function findProfessionalModule(id: string | null | undefined): ProfessionalModule | undefined {
  if (!id) return undefined;
  return professionalModules.find((module) => module.id === id || module.letter.toLowerCase() === id.toLowerCase());
}
