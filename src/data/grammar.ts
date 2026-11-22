export interface GrammarExample {
  wrong?: string;
  correct: string;
  note: string;
}

export interface GrammarQuestion {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface GrammarLesson {
  id: string;
  title: string;
  simpleExplanation: string;
  teluguExplanation: string;
  examples: GrammarExample[];
  quiz: GrammarQuestion[];
  estimatedMinutes: number;
}

export const grammarLessons: GrammarLesson[] = [
  {
    id: "parts-of-speech",
    title: "Parts of Speech",
    simpleExplanation:
      "Every English word has a job. Some words name things, some show actions, some describe, and some connect ideas. When you know each word's job, building a correct sentence becomes much easier.",
    teluguExplanation:
      "ఇంగ్లీషులో ప్రతి పదానికి ఒక పని ఉంటుంది. కొన్ని పదాలు వస్తువుల పేర్లు చెబుతాయి (nouns), కొన్ని చర్యలు చెబుతాయి (verbs), కొన్ని విశేషణాలు (adjectives), ఇంకొన్ని ఆలోచనలను కలుపుతాయి. ఈ పనులు తెలుసుకుంటే సరిగ్గా వాక్యాలు రాయడం సులభం.",
    examples: [
      {
        wrong: "She beautiful",
        correct: "She is beautiful.",
        note: "'Beautiful' is an adjective. It needs a verb like 'is' before it.",
      },
      {
        wrong: "He run fast",
        correct: "He runs fast.",
        note: "'Runs' is the verb, and it matches the subject 'he'.",
      },
      {
        correct: "The quick brown fox jumps.",
        note: "'The' is an article, 'quick' and 'brown' are adjectives, 'fox' is a noun, 'jumps' is a verb.",
      },
    ],
    quiz: [
      {
        id: "pos-q1",
        prompt: "Which word is a noun in: 'The happy child plays outside.'?",
        options: ["happy", "child", "plays", "outside"],
        answerIndex: 1,
        explanation: "A noun names a person, place or thing. 'Child' is a person.",
      },
      {
        id: "pos-q2",
        prompt: "Which word is the verb in: 'She reads every morning.'?",
        options: ["She", "reads", "every", "morning"],
        answerIndex: 1,
        explanation: "'Reads' shows the action, so it is the verb.",
      },
      {
        id: "pos-q3",
        prompt: "What job does 'quickly' do in 'He runs quickly'?",
        options: ["Names a person", "Describes how an action happens", "Connects two sentences", "Shows ownership"],
        answerIndex: 1,
        explanation: "'Quickly' is an adverb. It tells us how he runs.",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    id: "nouns",
    title: "Nouns",
    simpleExplanation:
      "A noun names a person, place, thing, or idea: teacher, Hyderabad, book, happiness. Countable nouns have a plural form (one book, two books). Uncountable nouns such as advice, water and information do not take 'a' or '-s' in the same way.",
    teluguExplanation:
      "నామవాచకం అంటే వ్యక్తి, స్థలం, వస్తువు లేదా ఆలోచన పేరు. ఉదాహరణలు: teacher, Hyderabad, book, happiness. లెక్కించగల నామవాచకాలకు బహువచన రూపం ఉంటుంది: books, teachers. advice, water, information వంటివి లెక్కించలేము, వాటికి 'a' లేదా '-s' సాధారణంగా రావు.",
    examples: [
      {
        wrong: "I have two book",
        correct: "I have two books.",
        note: "Use the plural form after a number greater than one.",
      },
      {
        wrong: "She gave me an advice",
        correct: "She gave me a piece of advice.",
        note: "'Advice' is uncountable, so say 'a piece of advice'.",
      },
      {
        correct: "Hyderabad is a busy city.",
        note: "'Hyderabad' and 'city' are both nouns.",
      },
    ],
    quiz: [
      {
        id: "nouns-q1",
        prompt: "Which of these is a countable noun?",
        options: ["advice", "water", "chair", "music"],
        answerIndex: 2,
        explanation: "You can say 'one chair, two chairs'. The others are uncountable.",
      },
      {
        id: "nouns-q2",
        prompt: "Choose the correct plural form:",
        options: ["two childs", "two children", "two childrens", "two child"],
        answerIndex: 1,
        explanation: "'Child' has the irregular plural 'children'.",
      },
      {
        id: "nouns-q3",
        prompt: "Which sentence is correct?",
        options: ["I need an information.", "I need information.", "I need informations.", "I need some informations."],
        answerIndex: 1,
        explanation: "'Information' is uncountable: no article and no plural -s.",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    id: "pronouns",
    title: "Pronouns",
    simpleExplanation:
      "A pronoun replaces a noun. Use I, you, he, she, it, we, they as the subject of a sentence, and me, you, him, her, it, us, them after a verb or preposition. Use 'it' for things and 'they' for plurals.",
    teluguExplanation:
      "సర్వనామం అంటే నామవాచకం స్థానంలో వాడే పదం. I, you, he, she, it, we, they అనేవి కర్తగా (subject) వస్తాయి. me, him, her, us, them అనేవి క్రియ లేదా preposition తర్వాత వస్తాయి. ఆడవారికి she, మగవారికి he, వస్తువులకు it, బహువచనానికి they వాడాలి.",
    examples: [
      {
        wrong: "Him is my friend",
        correct: "He is my friend.",
        note: "Use the subject pronoun 'he', not 'him'.",
      },
      {
        wrong: "I gave the book to she",
        correct: "I gave the book to her.",
        note: "After the preposition 'to', use 'her'.",
      },
      {
        correct: "Ravi was late. He apologized.",
        note: "'He' replaces the name 'Ravi' so we do not repeat it.",
      },
    ],
    quiz: [
      {
        id: "pronouns-q1",
        prompt: "Choose the pronoun: '___ is a doctor.' (talking about a woman)",
        options: ["He", "She", "It", "They"],
        answerIndex: 1,
        explanation: "Use 'she' for one woman.",
      },
      {
        id: "pronouns-q2",
        prompt: "Choose the pronoun: 'I spoke to ___ yesterday.' (talking about a man)",
        options: ["he", "him", "his", "himself"],
        answerIndex: 1,
        explanation: "After 'to', use the object pronoun 'him'.",
      },
      {
        id: "pronouns-q3",
        prompt: "Which sentence is correct?",
        options: ["Me and her are friends.", "She and I are friends.", "Her and I are friends.", "She and me are friends."],
        answerIndex: 1,
        explanation: "As the subject, use 'she and I'.",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    id: "verbs",
    title: "Verbs",
    simpleExplanation:
      "A verb shows an action (run, eat, write) or a state (be, know, feel). It changes with the subject and with time: I work, she works, I worked, I am working. State verbs such as 'know' are not usually used with continuous forms.",
    teluguExplanation:
      "క్రియ అంటే చర్య (run, eat, write) లేదా స్థితి (be, know, feel) చెప్పే పదం. కర్తను బట్టి, కాలాన్ని బట్టి క్రియ రూపం మారుతుంది: I work, she works, I worked, I am working. 'know' వంటి స్థితి క్రియలను సాధారణంగా continuous లో వాడం.",
    examples: [
      {
        wrong: "She go to college",
        correct: "She goes to college.",
        note: "Add -es for he/she/it in the present simple.",
      },
      {
        wrong: "I am know him",
        correct: "I know him.",
        note: "'Know' is a state verb, so we do not say 'am knowing'.",
      },
      {
        correct: "They are discussing the plan.",
        note: "'Are discussing' is the present continuous form.",
      },
    ],
    quiz: [
      {
        id: "verbs-q1",
        prompt: "Which word is a verb in 'The dog slept under the table.'?",
        options: ["dog", "slept", "under", "table"],
        answerIndex: 1,
        explanation: "'Slept' is the action, so it is the verb.",
      },
      {
        id: "verbs-q2",
        prompt: "Choose the correct verb: 'He ___ football every Sunday.'",
        options: ["play", "plays", "playing", "is play"],
        answerIndex: 1,
        explanation: "Use 'plays' with the singular subject 'he'.",
      },
      {
        id: "verbs-q3",
        prompt: "Which of these is a state verb?",
        options: ["run", "jump", "know", "write"],
        answerIndex: 2,
        explanation: "'Know' describes a state, not a physical action.",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    id: "adjectives",
    title: "Adjectives",
    simpleExplanation:
      "An adjective describes a noun: a small room, a useful tip, a busy street. In English it usually comes before the noun, and it does not change in the plural: we say 'big houses', not 'bigs houses'.",
    teluguExplanation:
      "విశేషణం నామవాచకం ఎలాంటిదో చెబుతుంది: a small room, a useful tip, a busy street. ఇంగ్లీషులో ఇది సాధారణంగా నామవాచకానికి ముందు వస్తుంది. బహువచనంలో కూడా విశేషణం మారదు: big houses (bigs houses కాదు).",
    examples: [
      {
        wrong: "a car red",
        correct: "a red car",
        note: "Put the adjective before the noun.",
      },
      {
        wrong: "She is a very beautifully singer",
        correct: "She is a very beautiful singer.",
        note: "Use the adjective 'beautiful' before the noun 'singer'.",
      },
      {
        correct: "We need three more chairs.",
        note: "'Three' and 'more' describe the noun 'chairs'.",
      },
    ],
    quiz: [
      {
        id: "adjectives-q1",
        prompt: "Choose the adjective in 'It was a cold night.'",
        options: ["It", "was", "cold", "night"],
        answerIndex: 2,
        explanation: "'Cold' describes the noun 'night'.",
      },
      {
        id: "adjectives-q2",
        prompt: "Which word order is correct?",
        options: ["a red big bag", "a big red bag", "a bag red big", "a red bag big"],
        answerIndex: 1,
        explanation: "Size comes before colour: 'a big red bag'.",
      },
      {
        id: "adjectives-q3",
        prompt: "Which word describes a feeling?",
        options: ["happy", "quickly", "wooden", "five"],
        answerIndex: 0,
        explanation: "'Happy' is an adjective that describes how someone feels.",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    id: "articles",
    title: "Articles",
    simpleExplanation:
      "Use 'a' or 'an' for one thing when it is not specific. Use 'an' before a vowel sound (an apple, an hour) and 'a' before a consonant sound (a book, a university). Use 'the' when you and the listener know exactly which thing you mean.",
    teluguExplanation:
      "ఒకటి, అది ఏదో ఒకటి అని చెప్పాలంటే a లేదా an వాడాలి. వowel శబ్దం ముందుకు వస్తే an (an apple, an hour), కన్సనెంట్ శబ్దం ముందైతే a (a book, a university). ఏ వస్తువు గురించి మాట్లాడుతున్నామో ఇద్దరికీ తెలిస్తే the వాడాలి.",
    examples: [
      {
        wrong: "I need a umbrella",
        correct: "I need an umbrella.",
        note: "'Umbrella' starts with a vowel sound.",
      },
      {
        wrong: "He is the doctor",
        correct: "He is a doctor.",
        note: "Use 'a' when you mention a job for the first time.",
      },
      {
        correct: "I bought a book. The book is interesting.",
        note: "'The' points back to the book already mentioned.",
      },
    ],
    quiz: [
      {
        id: "articles-q1",
        prompt: "Choose the article: 'She is ___ engineer.'",
        options: ["a", "an", "the", "no article"],
        answerIndex: 1,
        explanation: "'Engineer' begins with a vowel sound.",
      },
      {
        id: "articles-q2",
        prompt: "Choose the article: '___ sun rises in the east.'",
        options: ["A", "An", "The", "No article"],
        answerIndex: 2,
        explanation: "Use 'the' for unique things like the sun.",
      },
      {
        id: "articles-q3",
        prompt: "Which phrase is correct?",
        options: ["an university", "a hour", "an honest man", "a apple"],
        answerIndex: 2,
        explanation: "'Honest' has a silent 'h', so it starts with a vowel sound.",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    id: "prepositions",
    title: "Prepositions",
    simpleExplanation:
      "Prepositions such as in, on, at, to, for and with show the relationship between things. Use 'at' for exact times (at 6 o'clock), 'on' for days and dates (on Monday), and 'in' for months, years and larger places (in July, in India).",
    teluguExplanation:
      "Preposition అంటే in, on, at, to, for, with వంటి పదాలు. ఇవి సమయం, స్థలం, దిశ చూపిస్తాయి. ఖచ్చితమైన సమయానికి at (at 6), రోజులకి on (on Monday), నెలలు, సంవత్సరాలు, పెద్ద స్థలాలకి in (in July, in India) వాడాలి.",
    examples: [
      {
        wrong: "I will meet you in Monday",
        correct: "I will meet you on Monday.",
        note: "Use 'on' with days of the week.",
      },
      {
        wrong: "She is good in English",
        correct: "She is good at English.",
        note: "'Good at' is the fixed phrase for a skill.",
      },
      {
        correct: "The keys are on the table.",
        note: "'On' shows something resting on a surface.",
      },
    ],
    quiz: [
      {
        id: "prepositions-q1",
        prompt: "Choose the preposition: 'The train leaves ___ 8:30.'",
        options: ["in", "on", "at", "for"],
        answerIndex: 2,
        explanation: "Use 'at' for an exact clock time.",
      },
      {
        id: "prepositions-q2",
        prompt: "Choose the preposition: 'I was born ___ 1998.'",
        options: ["in", "on", "at", "to"],
        answerIndex: 0,
        explanation: "Use 'in' for years.",
      },
      {
        id: "prepositions-q3",
        prompt: "Choose the preposition: 'He is interested ___ music.'",
        options: ["in", "on", "at", "with"],
        answerIndex: 0,
        explanation: "The fixed phrase is 'interested in'.",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    id: "tenses",
    title: "Tenses",
    simpleExplanation:
      "Tenses tell us when something happens. Present: I work, I am working. Past: I worked, I was working. Future: I will work. Clue words such as now, yesterday and tomorrow help you choose the right one.",
    teluguExplanation:
      "కాలం (tense) అంటే ఎప్పుడు జరిగిందో చెప్పడం. వర్తమానం: I work, I am working. గతం: I worked, I was working. భవిష్యత్తు: I will work. now, yesterday, tomorrow వంటి పదాలు సరైన కాలం ఎంచుకోవడానికి సహాయపడతాయి.",
    examples: [
      {
        wrong: "I go to Delhi yesterday",
        correct: "I went to Delhi yesterday.",
        note: "'Yesterday' needs the past tense 'went'.",
      },
      {
        wrong: "She will comes tomorrow",
        correct: "She will come tomorrow.",
        note: "After 'will', always use the base verb.",
      },
      {
        correct: "I am learning English these days.",
        note: "Present continuous for something happening around now.",
      },
    ],
    quiz: [
      {
        id: "tenses-q1",
        prompt: "What is the past tense of 'eat'?",
        options: ["eated", "ate", "eaten", "eats"],
        answerIndex: 1,
        explanation: "'Eat' is irregular: eat → ate → eaten.",
      },
      {
        id: "tenses-q2",
        prompt: "Choose the correct form: 'They ___ to the party tomorrow.'",
        options: ["come", "came", "will come", "are come"],
        answerIndex: 2,
        explanation: "'Tomorrow' needs the future form 'will come'.",
      },
      {
        id: "tenses-q3",
        prompt: "Which sentence uses the present continuous tense?",
        options: ["I read every day.", "I am reading now.", "I read yesterday.", "I will read later."],
        answerIndex: 1,
        explanation: "'Am reading' is present continuous.",
      },
    ],
    estimatedMinutes: 6,
  },
  {
    id: "sentence-structure",
    title: "Sentence Structure",
    simpleExplanation:
      "A basic English sentence follows Subject + Verb + Object: 'I eat rice'. Add extra information with short phrases, but keep one main idea per sentence. Short, clear sentences sound more confident than one very long sentence.",
    teluguExplanation:
      "ఇంగ్లీషు వాక్యంలో సాధారణ క్రమం కర్త + క్రియ + కర్మ: I (కర్త) eat (క్రియ) rice (కర్మ). అదనపు సమాచారం చిన్న ఫ్రేజీలుగా జోడించాలి. ఒక వాక్యంలో ఒక ముఖ్యమైన ఆలోచనే చెప్పాలి; చిన్న వాక్యాలు స్పష్టంగా, ధైర్యంగా ఉంటాయి.",
    examples: [
      {
        wrong: "Yesterday to the market went I",
        correct: "I went to the market yesterday.",
        note: "English usually puts the subject before the verb.",
      },
      {
        wrong: "I like very much coffee",
        correct: "I like coffee very much.",
        note: "Keep the object 'coffee' close to the verb 'like'.",
      },
      {
        correct: "She sent me an email last night.",
        note: "Subject + verb + two objects + time phrase.",
      },
    ],
    quiz: [
      {
        id: "structure-q1",
        prompt: "What is the subject in 'The teacher praised the student.'?",
        options: ["The teacher", "praised", "the student", "The"],
        answerIndex: 0,
        explanation: "The subject is who performed the action: the teacher.",
      },
      {
        id: "structure-q2",
        prompt: "Choose the correct word order:",
        options: ["Coffee drink I every day", "I drink coffee every day", "Drink I coffee every day", "I coffee drink every day"],
        answerIndex: 1,
        explanation: "Subject + verb + object: I drink coffee.",
      },
      {
        id: "structure-q3",
        prompt: "Which is the clearest sentence?",
        options: [
          "I went to a shop yesterday and bought milk and also met my friend and we talked.",
          "I went shopping yesterday. I bought milk and met my friend.",
          "Went shopping yesterday I.",
          "Yesterday shopping went I.",
        ],
        answerIndex: 1,
        explanation: "Two short sentences are easier to read than one long one.",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    id: "question-formation",
    title: "Question Formation",
    simpleExplanation:
      "For questions with ordinary verbs, use do/does/did + subject + base verb: 'Do you like tea?' With be verbs, move the verb before the subject: 'Are you ready?' Always end a question with a question mark.",
    teluguExplanation:
      "సాధారణ క్రియలతో ప్రశ్న అడగాలంటే do/does/did + కర్త + క్రియ మూల రూపం వాడాలి: Do you like tea? be క్రియ ఉంటే దాన్ని కర్తకు ముందుకు తీసుకుంటాం: Are you ready? ప్రశ్న చివర question mark (?) పెట్టాలి.",
    examples: [
      {
        wrong: "You like tea?",
        correct: "Do you like tea?",
        note: "Add 'do' for a present simple question.",
      },
      {
        wrong: "Does she likes coffee?",
        correct: "Does she like coffee?",
        note: "After 'does', use the base verb 'like'.",
      },
      {
        correct: "Where do you work?",
        note: "Question word + do/does + subject + base verb.",
      },
    ],
    quiz: [
      {
        id: "questions-q1",
        prompt: "Choose the correct word: '___ he live in Chennai?'",
        options: ["Do", "Does", "Is", "Are"],
        answerIndex: 1,
        explanation: "Use 'does' with the singular subject 'he'.",
      },
      {
        id: "questions-q2",
        prompt: "Choose the correct verb: 'Did you ___ the film?'",
        options: ["saw", "see", "seen", "seeing"],
        answerIndex: 1,
        explanation: "After 'did', use the base form 'see'.",
      },
      {
        id: "questions-q3",
        prompt: "Which is a correctly formed question?",
        options: ["Are you coming?", "You are coming?", "Are coming you?", "You coming are?"],
        answerIndex: 0,
        explanation: "With a be verb, put 'are' before the subject.",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    id: "subject-verb-agreement",
    title: "Subject-Verb Agreement",
    simpleExplanation:
      "The verb must match its subject. A singular subject takes a singular verb: he works, she is. A plural subject takes a plural verb: they work, we are. In the present simple, add -s or -es to the verb for he, she and it.",
    teluguExplanation:
      "కర్తకు తగినట్టుగా క్రియ ఉండాలి. ఒకవచన కర్తకు ఒకవచన క్రియ: he works, she is. బహువచన కర్తకు బహువచన క్రియ: they work, we are. present simple లో he, she, it తర్వాత క్రియకు -s లేదా -es చేర్చాలి.",
    examples: [
      {
        wrong: "He don't like rice",
        correct: "He doesn't like rice.",
        note: "'He' is singular, so use 'doesn't'.",
      },
      {
        wrong: "They is happy",
        correct: "They are happy.",
        note: "'They' always takes 'are' in the present.",
      },
      {
        correct: "The children play outside.",
        note: "Plural subject 'children' + base verb 'play'.",
      },
    ],
    quiz: [
      {
        id: "agreement-q1",
        prompt: "Choose the correct verb: 'She ___ in a bank.'",
        options: ["work", "works", "working", "are work"],
        answerIndex: 1,
        explanation: "Use 'works' with 'she' in the present simple.",
      },
      {
        id: "agreement-q2",
        prompt: "Choose the correct verb: 'My friends ___ here.'",
        options: ["is", "are", "am", "was"],
        answerIndex: 1,
        explanation: "'Friends' is plural, so use 'are'.",
      },
      {
        id: "agreement-q3",
        prompt: "Choose the correct form: 'He ___ know the answer.'",
        options: ["don't", "doesn't", "isn't", "aren't"],
        answerIndex: 1,
        explanation: "Use 'doesn't' with he/she/it.",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    id: "common-english-mistakes",
    title: "Common English Mistakes",
    simpleExplanation:
      "Many mistakes happen when we translate word-for-word from Telugu. Watch for an extra 'is' with state verbs, missing articles, double negatives, and wrong question word order. Slow down and check these four things before you speak or write.",
    teluguExplanation:
      "తెలుగు నుంచి పదాల వారీగా అనువదించేటప్పుడు చాలా తప్పులు వస్తాయి. 'I am knowing him' లాంటి వాటిలో extra is, లేని article, రెండు negative పదాలు, తప్పుడు ప్రశ్న క్రమం — ఇవి సాధారణమైనవి. మాట్లాడే లేదా రాసే ముందు ఈ నాలుగింటినీ ఒక్కసారి గమనించండి.",
    examples: [
      {
        wrong: "I am knowing him",
        correct: "I know him.",
        note: "Do not use continuous forms with state verbs like 'know'.",
      },
      {
        wrong: "I didn't saw him",
        correct: "I didn't see him.",
        note: "After 'didn't', use the base verb.",
      },
      {
        wrong: "She is going to office",
        correct: "She is going to the office.",
        note: "Add 'the' before a specific place like 'the office'.",
      },
    ],
    quiz: [
      {
        id: "mistakes-q1",
        prompt: "Find the mistake: 'He don't have a car.'",
        options: ["He", "don't", "have", "a car"],
        answerIndex: 1,
        explanation: "It should be 'He doesn't have a car.'",
      },
      {
        id: "mistakes-q2",
        prompt: "Choose the most natural sentence:",
        options: ["I am knowing her.", "I know her.", "I am know her.", "I knowing her."],
        answerIndex: 1,
        explanation: "'Know' is a state verb: say 'I know her'.",
      },
      {
        id: "mistakes-q3",
        prompt: "Choose the correct form: 'I look forward to ___ you.'",
        options: ["see", "seeing", "saw", "seen"],
        answerIndex: 1,
        explanation: "After 'look forward to', use the -ing form.",
      },
    ],
    estimatedMinutes: 6,
  },
];

export function getGrammarLesson(id: string): GrammarLesson | undefined {
  return grammarLessons.find((lesson) => lesson.id === id);
}
