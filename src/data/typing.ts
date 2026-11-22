export type TypingLevel = "beginner" | "intermediate" | "advanced";

export type TypingCategoryId =
  | "daily"
  | "college"
  | "technology"
  | "professional"
  | "conversation"
  | "presentation"
  | "interview";

export interface TypingPassage {
  id: string;
  text: string;
}

export interface TypingLevelMeta {
  id: TypingLevel;
  label: string;
  description: string;
}

export interface TypingCategoryMeta {
  id: TypingCategoryId;
  label: string;
  description: string;
}

export const TYPING_LEVELS: TypingLevelMeta[] = [
  {
    id: "beginner",
    label: "Beginner",
    description: "Short, familiar sentences with everyday words.",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    description: "Longer sentences and a wider, more useful vocabulary.",
  },
  {
    id: "advanced",
    label: "Advanced",
    description: "Rich, complex sentences with abstract and professional language.",
  },
];

export const TYPING_CATEGORIES: TypingCategoryMeta[] = [
  { id: "daily", label: "Daily English", description: "Routines, home and everyday life." },
  { id: "college", label: "College English", description: "Campus, classes and study habits." },
  { id: "technology", label: "Technology English", description: "Devices, software and the internet." },
  { id: "professional", label: "Professional English", description: "Workplace writing and teamwork." },
  { id: "conversation", label: "Conversation English", description: "Natural replies and small talk." },
  { id: "presentation", label: "Presentation English", description: "Speaking to an audience." },
  { id: "interview", label: "Interview English", description: "Answering interview questions clearly and calmly." },
];

export const TYPING_LEVEL_LABELS: Record<TypingLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const TYPING_CATEGORY_LABELS: Record<TypingCategoryId, string> = {
  daily: "Daily English",
  college: "College English",
  technology: "Technology English",
  professional: "Professional English",
  conversation: "Conversation English",
  presentation: "Presentation English",
  interview: "Interview English",
};

function p(prefix: string, texts: string[]): TypingPassage[] {
  return texts.map((text, index) => ({ id: `${prefix}-${index + 1}`, text }));
}

export const TYPING_PASSAGES: Record<TypingLevel, Record<TypingCategoryId, TypingPassage[]>> = {
  beginner: {
    daily: p("beginner-daily", [
      "I wake up early every morning. I brush my teeth, drink a glass of water, and make a simple breakfast. Then I check the time and get ready for my day. Small habits make a big difference.",
      "Today is a busy day. I need to buy some milk, bread, and fruit at the store. After that, I will clean my room and call my friend. I like quiet evenings at home.",
      "My favorite food is rice with vegetables. It is easy to cook and good for me. I usually eat lunch at noon and take a short walk. A little fresh air helps me feel better.",
    ]),
    college: p("beginner-college", [
      "I go to college every day. My classes start at nine in the morning. I carry my books, a notebook, and a pen. I sit near the front so I can hear the teacher clearly.",
      "My favorite subject is English. I practice speaking with my friends after class. We read short stories and learn new words together. Studying with a friend makes learning more fun.",
      "The library is my favorite place on campus. It is quiet and warm. I read there for one hour after lunch. I borrow books about science and history every week.",
    ]),
    technology: p("beginner-technology", [
      "I use my phone every day. I send messages, take photos, and read the news. My laptop helps me study and write notes. Technology makes many things easy, but I still like to rest my eyes.",
      "The internet is full of useful information. I watch short videos to learn new skills. I save good websites so I can find them again. It is important to keep my passwords safe.",
      "My computer was slow, so I closed some apps. Now it works much faster. I charge the battery every night. I also keep my files in one folder so nothing gets lost.",
    ]),
    professional: p("beginner-professional", [
      "Good morning. My name is Anita and I work in a small office. I answer emails and help customers every day. I try to be polite and clear when I speak with people.",
      "I arrived at work on time today. I made a cup of tea and opened my computer. First, I checked my calendar for meetings. Then I wrote a short report for my manager.",
      "Teamwork is important at my job. I listen carefully and share my ideas in a calm way. When I do not understand something, I ask a question. Clear communication saves time.",
    ]),
    conversation: p("beginner-conversation", [
      "Hello, how are you today? I am fine, thank you. The weather is nice, so I went for a walk. What did you do this morning? Let us meet for coffee tomorrow.",
      "I like talking with my friends after work. We share stories about our day and laugh a lot. Sometimes we talk about movies or music. A good conversation makes me happy.",
      "Excuse me, can you help me? I am looking for the train station. It is near the big park, just two streets away. Thank you very much for your help. Have a nice day.",
    ]),
    presentation: p("beginner-presentation", [
      "Good morning, everyone. Today I will talk about my favorite book. First, I will tell you why I like it. Then I will share one important idea from the story.",
      "Thank you for coming today. My talk is short and simple. I will show you three points and then ask for your questions. Please feel free to stop me at any time.",
      "This picture shows my plan for the next month. We have three steps. Each step is small and clear. If we follow the plan together, we will finish on time.",
    ]),
    interview: p("beginner-interview", [
      "Good morning. Thank you for meeting me today. My name is Ravi and I studied business in college. I like working with people and solving simple problems.",
      "I can use a computer well. I know how to write emails and make reports. I am always on time and I listen carefully. I want to learn more in this job.",
      "My strongest skill is patience. I stay calm when work is busy. I ask questions when I need help. I believe a good worker is honest and ready to learn.",
    ]),
  },

  intermediate: {
    daily: p("intermediate-daily", [
      "After a long week, I enjoy a slow Sunday morning. I make coffee, open the window, and plan the days ahead. A short walk in the park helps me clear my mind and return to work with fresh energy.",
      "Cooking has become my favorite way to relax. I follow simple recipes, but I often add my own small twist. My friends say the food tastes better when I take my time and enjoy the process.",
      "I keep a short notebook beside my bed. Every night I write down three things that went well and one thing I want to improve. This small habit has made me more grateful and more focused.",
    ]),
    college: p("intermediate-college", [
      "University life taught me how to manage my time. Between lectures, assignments, and part-time work, I learned to plan each week carefully. Attending study groups helped me understand difficult topics much faster than studying alone.",
      "For our final project, our team researched how cities handle waste. We collected data from three neighborhoods, compared the results, and presented our findings to the class. The discussion that followed was surprisingly lively.",
      "I used to avoid asking questions in class because I feared looking unprepared. Now I realize that curious students learn more. Professors appreciate thoughtful questions, and classmates often share useful examples from their own experience.",
    ]),
    technology: p("intermediate-technology", [
      "Modern software depends on clear design as much as clean code. When an interface is simple, people make fewer mistakes and finish tasks faster. Good developers test their work with real users before releasing a new feature.",
      "Cloud storage lets teams share documents from anywhere in the world. Instead of emailing attachments back and forth, everyone edits the same file and sees changes instantly. This saves time and reduces confusion about which version is correct.",
      "Passwords alone are no longer enough to protect important accounts. Two-factor verification adds a second step, such as a code sent to your phone. It is a small inconvenience that prevents most common attacks.",
    ]),
    professional: p("intermediate-professional", [
      "In a professional setting, clear writing builds trust. A good email states the purpose in the first line, gives the necessary details, and ends with a clear next step. Readers should never have to guess what action is expected of them.",
      "During the meeting, we reviewed the quarterly results and discussed three possible solutions. Instead of blaming one another, the team focused on facts and agreed on a practical plan. Everyone left with a clear understanding of their responsibilities.",
      "Time management is a skill that improves with practice. I block my calendar for focused work, check messages at set times, and set realistic deadlines. These habits help me deliver consistent results without working late every night.",
    ]),
    conversation: p("intermediate-conversation", [
      "I understand how you feel. It can be frustrating when plans change at the last minute. Would it help to talk through what happened? Sometimes saying things out loud makes the situation feel lighter and easier to handle.",
      "That is an interesting point. I had not considered it that way before. In my experience, a quick conversation early on prevents a much bigger misunderstanding later. What do you think would be the best first step?",
      "Thanks for telling me honestly. I appreciate it when you share your thoughts instead of staying quiet. Let us find a solution that works for both of us, and let us agree on the details before we move forward.",
    ]),
    presentation: p("intermediate-presentation", [
      "Let me start with a simple question. How many of you check your phone before you even get out of bed? Today I will explain how small daily habits shape our attention, and what we can do to protect it.",
      "The chart on your screen shows our progress over six months. As you can see, growth was slow at first, then accelerated after we changed our approach. I will focus on the two decisions that made the biggest difference.",
      "To summarize, there are three takeaways. First, start small. Second, measure what matters. Third, review your results every week. If you remember only one idea from this talk, let it be the value of steady, patient effort.",
    ]),
    interview: p("intermediate-interview", [
      "Thank you for the question. In my previous role, I led a small team through a difficult transition. I listened to every concern, set clear priorities, and kept everyone informed. We finished the project two weeks ahead of schedule.",
      "I am looking for a position where I can grow and contribute at the same time. I am comfortable learning new tools quickly, and I enjoy sharing what I know with teammates. A supportive environment matters more to me than a fancy title.",
      "One challenge I faced was an unhappy customer. I stayed calm, repeated their concern in my own words, and offered a practical solution. The conversation ended with an apology from them and a useful lesson for our whole team.",
    ]),
  },

  advanced: {
    daily: p("advanced-daily", [
      "There is a particular kind of calm that arrives after a morning walk, when the streets are still quiet and the day has not yet begun making demands. I have started guarding that hour carefully, because the decisions I make before breakfast tend to shape everything that follows.",
      "I used to believe that productivity meant filling every gap with noise and activity. Over time I have learned the opposite: the most useful hours are often the unstructured ones, where a slow walk or a page of reading quietly rearranges my priorities.",
      "Weekends have become less about escape and more about maintenance. I cook something slowly, answer the messages I have been avoiding, and tidy the small corners of the flat that quietly accumulate clutter during the working week.",
    ]),
    college: p("advanced-college", [
      "The most valuable lesson I took from university was not found in a textbook. It came from a heated seminar discussion where three classmates disagreed respectfully for an entire hour. By the end, my own argument had changed, and I had learned more from listening than from speaking.",
      "Academic writing demands a kind of intellectual honesty that is easy to overlook. Every claim should be traceable, every limitation acknowledged, and every counterargument treated fairly. Students who master this habit often find that their ideas become sharper, not weaker.",
      "Balancing coursework with part-time work forced me to confront the difference between urgency and importance. Essays had deadlines, but sleep and exercise had consequences just as real. Learning to protect both turned out to be the semester's most practical education.",
    ]),
    technology: p("advanced-technology", [
      "Good engineering is largely the art of managing complexity. A feature that seems simple on the surface often conceals a dozen edge cases, and the disciplined engineer documents those cases before writing a single line of code. Clarity, in the long run, is cheaper than cleverness.",
      "As artificial intelligence becomes woven into everyday tools, the ability to question its output matters as much as the ability to use it. Systems can produce confident answers that are subtly wrong, so thoughtful verification remains an essential human responsibility.",
      "Data rarely speaks for itself. The same set of numbers can support opposite conclusions depending on which questions we ask and what we choose to leave out. Responsible analysis begins by stating those choices openly, before anyone mistakes a chart for the truth.",
    ]),
    professional: p("advanced-professional", [
      "Effective leadership is less about having the right answer and more about creating the conditions in which other people can find it. That means setting clear boundaries, sharing context generously, and resisting the urge to intervene the moment a colleague takes a different route.",
      "Negotiation works best when both sides understand what the other truly needs. A rigid position usually hides a flexible interest, and a few careful questions can reveal options that were invisible during the opening exchange. Patience, in this setting, is a practical advantage.",
      "Professional reputation is built through a hundred small acts of reliability: the email answered on time, the mistake acknowledged without excuse, the promise kept when keeping it is inconvenient. None of these moments feels dramatic, yet together they define how colleagues describe you.",
    ]),
    conversation: p("advanced-conversation", [
      "I hear what you are saying, and I want to be careful not to jump to a solution before I understand the problem. It sounds as though the timing hurt more than the decision itself. Am I getting that right, or is there something else underneath it?",
      "That is a generous way to put it, though I suspect you are being harder on yourself than the situation deserves. Most people would have reacted in a similar way. What matters now is not perfecting the past but deciding what you want to do differently next time.",
      "I appreciate the honesty more than you know. Conversations like this are uncomfortable, but they are also the ones that leave me understanding you better. Let us set aside the assumptions we have been carrying and simply start from what we both want.",
    ]),
    presentation: p("advanced-presentation", [
      "Consider, for a moment, the last presentation you truly remember. Chances are it was not the one with the most slides or the most impressive statistics. It was the one where a single clear idea was repeated with enough conviction that the audience could carry it home.",
      "The data before you tells a story of gradual change rather than sudden success. Revenue grew modestly, but retention improved sharply, and that distinction matters. I want to spend the next few minutes explaining why we chose to measure the less obvious number.",
      "I will close with a practical invitation rather than a slogan. Choose one habit from today, try it for a single week, and record what actually happened. Evidence gathered in your own context will always persuade you more reliably than a convincing slide.",
    ]),
    interview: p("advanced-interview", [
      "Throughout my career, the challenges I have valued most were the ones that arrived without instructions. In my last role, a key supplier disappeared two weeks before launch. I gathered the team, narrowed the scope honestly, and we delivered a smaller product on time rather than a perfect one too late.",
      "I am drawn to this position because the problems you describe are genuinely difficult, and because the culture seems to reward clear thinking over loud confidence. I bring patience, a habit of asking precise questions, and a willingness to change my mind when the evidence asks me to.",
      "If I were to describe my working style in one sentence, I would say that I make decisions slowly and communicate them quickly. Colleagues know where they stand, disagreements surface early, and by the time we commit to a direction, most of the uncertainty has already been removed.",
    ]),
  },
};

export function getPassages(level: TypingLevel, category: TypingCategoryId): TypingPassage[] {
  const byLevel = TYPING_PASSAGES[level] ?? TYPING_PASSAGES.beginner;
  return byLevel[category] ?? TYPING_PASSAGES.beginner.daily;
}

export function getPassage(level: TypingLevel, category: TypingCategoryId, index = 0): TypingPassage {
  const list = getPassages(level, category);
  const safeIndex = ((index % list.length) + list.length) % list.length;
  return list[safeIndex];
}

export function levelLabel(level: TypingLevel): string {
  return TYPING_LEVEL_LABELS[level] ?? "Beginner";
}

export function categoryLabel(category: TypingCategoryId): string {
  return TYPING_CATEGORY_LABELS[category] ?? "Daily English";
}
