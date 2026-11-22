import { dateKey } from "@/lib/storage/store";
import type { PracticeQuestion } from "@/components/learning/quiz-types";

export type VocabularyCategory = "Daily Life" | "Work & Study" | "Social" | "Feelings" | "Travel" | "Technology";

export interface VocabularyWord {
  word: string;
  pronunciation: string;
  englishMeaning: string;
  teluguMeaning: string;
  example: string;
  synonyms: string[];
  category: VocabularyCategory;
}

export const vocabularyCategories: VocabularyCategory[] = [
  "Daily Life",
  "Work & Study",
  "Social",
  "Feelings",
  "Travel",
  "Technology",
];

export const vocabularyWords: VocabularyWord[] = [
  /* ----------------------------- Daily Life ---------------------------- */
  {
    word: "arrange",
    pronunciation: "/əˈreɪndʒ/ (uh-RAYNJ)",
    englishMeaning: "to put things in order or make plans for something",
    teluguMeaning: "ఏర్పాటు చేయు, అమర్చు",
    example: "I will arrange the meeting for 10 a.m.",
    synonyms: ["organize", "plan", "set up"],
    category: "Daily Life",
  },
  {
    word: "borrow",
    pronunciation: "/ˈbɒroʊ/ (BOR-oh)",
    englishMeaning: "to take something from someone and return it later",
    teluguMeaning: "అరువు తీసుకోవు",
    example: "Can I borrow your pen for a moment?",
    synonyms: ["take on loan"],
    category: "Daily Life",
  },
  {
    word: "deliver",
    pronunciation: "/dɪˈlɪvər/ (dih-LIV-er)",
    englishMeaning: "to bring a package or message to a person or place",
    teluguMeaning: "డెలివరీ చేయు, అందజేయు",
    example: "The courier will deliver the package today.",
    synonyms: ["hand over", "bring"],
    category: "Daily Life",
  },
  {
    word: "errand",
    pronunciation: "/ˈerənd/ (ER-uhnd)",
    englishMeaning: "a short trip to do one small task",
    teluguMeaning: "చిన్న పని కోసం వెళ్ళడం",
    example: "I need to run an errand after work.",
    synonyms: ["chore", "small task"],
    category: "Daily Life",
  },
  {
    word: "gather",
    pronunciation: "/ˈɡæðər/ (GA-thur)",
    englishMeaning: "to collect things or come together as a group",
    teluguMeaning: "సేకరించు, గుమికూడు",
    example: "We gather at the park every Sunday.",
    synonyms: ["collect", "meet"],
    category: "Daily Life",
  },
  {
    word: "laundry",
    pronunciation: "/ˈlɔːndri/ (LAWN-dree)",
    englishMeaning: "clothes that need washing, or the act of washing them",
    teluguMeaning: "బట్టలు ఉతికే పని",
    example: "I do the laundry on Saturday mornings.",
    synonyms: ["washing"],
    category: "Daily Life",
  },
  {
    word: "leftovers",
    pronunciation: "/ˈleftoʊvərz/ (LEFT-oh-verz)",
    englishMeaning: "food that remains after a meal",
    teluguMeaning: "భోజనం తర్వాత మిగిలిన ఆహారం",
    example: "We had leftovers for lunch.",
    synonyms: ["remains"],
    category: "Daily Life",
  },
  {
    word: "manage",
    pronunciation: "/ˈmænɪdʒ/ (MAN-ij)",
    englishMeaning: "to deal with something successfully",
    teluguMeaning: "నిర్వహించు, సమర్థించు",
    example: "She manages her time very well.",
    synonyms: ["handle", "cope with"],
    category: "Daily Life",
  },
  {
    word: "prepare",
    pronunciation: "/prɪˈper/ (pri-PER)",
    englishMeaning: "to get something ready before you need it",
    teluguMeaning: "సిద్ధం చేయు",
    example: "I will prepare dinner before the guests arrive.",
    synonyms: ["get ready", "arrange"],
    category: "Daily Life",
  },
  {
    word: "repair",
    pronunciation: "/rɪˈper/ (ri-PER)",
    englishMeaning: "to fix something that is broken",
    teluguMeaning: "రిపేరు చేయు, బాగుచేయు",
    example: "The mechanic will repair my bike.",
    synonyms: ["fix", "mend"],
    category: "Daily Life",
  },
  {
    word: "substitute",
    pronunciation: "/ˈsʌbstɪtuːt/ (SUB-sti-toot)",
    englishMeaning: "a person or thing used in place of another",
    teluguMeaning: "ప్రత్యామ్నాయం, బదులు",
    example: "You can use honey as a substitute for sugar.",
    synonyms: ["replacement", "alternative"],
    category: "Daily Life",
  },
  {
    word: "tidy",
    pronunciation: "/ˈtaɪdi/ (TIE-dee)",
    englishMeaning: "neat and in the right place",
    teluguMeaning: "చక్కగా అమర్చబడిన",
    example: "Her desk is always tidy.",
    synonyms: ["neat", "orderly"],
    category: "Daily Life",
  },

  /* ---------------------------- Work & Study --------------------------- */
  {
    word: "agenda",
    pronunciation: "/əˈdʒendə/ (uh-JEN-duh)",
    englishMeaning: "a list of things to discuss in a meeting",
    teluguMeaning: "సమావేశంలో చర్చించే అంశాల జాబితా",
    example: "Let us go through the agenda before the call.",
    synonyms: ["schedule", "plan"],
    category: "Work & Study",
  },
  {
    word: "apply",
    pronunciation: "/əˈplaɪ/ (uh-PLY)",
    englishMeaning: "to ask officially for a job, a place, or a document",
    teluguMeaning: "దరఖాస్తు చేయు",
    example: "I will apply for the marketing role today.",
    synonyms: ["request", "submit"],
    category: "Work & Study",
  },
  {
    word: "brief",
    pronunciation: "/briːf/ (BREEF)",
    englishMeaning: "short and clear; to tell someone the main facts",
    teluguMeaning: "సంక్షిప్తమైన, సంక్షిప్తంగా తెలియజేయు",
    example: "Could you give me a brief update on the project?",
    synonyms: ["short", "concise"],
    category: "Work & Study",
  },
  {
    word: "colleague",
    pronunciation: "/ˈkɒliːɡ/ (KOL-eeg)",
    englishMeaning: "a person you work with",
    teluguMeaning: "సహోద్యోగి",
    example: "My colleague shared the report with me.",
    synonyms: ["coworker", "teammate"],
    category: "Work & Study",
  },
  {
    word: "deadline",
    pronunciation: "/ˈdedlaɪn/ (DED-line)",
    englishMeaning: "the latest time by which something must be finished",
    teluguMeaning: "గడువు",
    example: "The deadline for the proposal is Friday.",
    synonyms: ["due date", "cutoff"],
    category: "Work & Study",
  },
  {
    word: "discuss",
    pronunciation: "/dɪˈskʌs/ (dih-SKUS)",
    englishMeaning: "to talk about something seriously and exchange ideas",
    teluguMeaning: "చర్చించు",
    example: "We need to discuss the budget today.",
    synonyms: ["talk over", "debate"],
    category: "Work & Study",
  },
  {
    word: "efficient",
    pronunciation: "/ɪˈfɪʃnt/ (ih-FISH-uhnt)",
    englishMeaning: "working well without wasting time or effort",
    teluguMeaning: "సమర్థవంతమైన",
    example: "She is an efficient worker.",
    synonyms: ["productive", "effective"],
    category: "Work & Study",
  },
  {
    word: "feedback",
    pronunciation: "/ˈfiːdbæk/ (FEED-bak)",
    englishMeaning: "comments that tell someone how well they did something",
    teluguMeaning: "అభిప్రాయం, సూచన",
    example: "Thank you for your honest feedback.",
    synonyms: ["comments", "response"],
    category: "Work & Study",
  },
  {
    word: "improve",
    pronunciation: "/ɪmˈpruːv/ (im-PROOV)",
    englishMeaning: "to make something better than it was before",
    teluguMeaning: "మెరుగుపరచు",
    example: "I want to improve my English this year.",
    synonyms: ["better", "enhance"],
    category: "Work & Study",
  },
  {
    word: "mention",
    pronunciation: "/ˈmenʃn/ (MEN-shun)",
    englishMeaning: "to say something briefly without explaining it fully",
    teluguMeaning: "ప్రస్తావించు",
    example: "He will mention the client's name in the email.",
    synonyms: ["refer to", "note"],
    category: "Work & Study",
  },
  {
    word: "priority",
    pronunciation: "/praɪˈɒrəti/ (pry-OR-uh-tee)",
    englishMeaning: "the thing that is most important to you",
    teluguMeaning: "ప్రాధాన్యత",
    example: "Family is my top priority.",
    synonyms: ["importance", "main concern"],
    category: "Work & Study",
  },
  {
    word: "schedule",
    pronunciation: "/ˈskedʒuːl/ (SKED-jool)",
    englishMeaning: "a plan of times and dates; to arrange a time for something",
    teluguMeaning: "షెడ్యూల్, సమయం నిర్ణయించు",
    example: "Let us schedule a call for tomorrow.",
    synonyms: ["timetable", "plan"],
    category: "Work & Study",
  },

  /* ------------------------------- Social ------------------------------ */
  {
    word: "apologize",
    pronunciation: "/əˈpɒlədʒaɪz/ (uh-POL-uh-jyz)",
    englishMeaning: "to say that you are sorry for something you did",
    teluguMeaning: "క్షమాపణ చెప్పు",
    example: "I apologize for being late.",
    synonyms: ["say sorry", "regret"],
    category: "Social",
  },
  {
    word: "appreciate",
    pronunciation: "/əˈpriːʃieɪt/ (uh-PREE-shee-ayt)",
    englishMeaning: "to value someone's help or say thank you for it",
    teluguMeaning: "మెచ్చుకోవు, కృతజ్ఞత చెప్పు",
    example: "I really appreciate your help.",
    synonyms: ["value", "thank"],
    category: "Social",
  },
  {
    word: "compliment",
    pronunciation: "/ˈkɒmplɪment/ (KOM-plih-ment)",
    englishMeaning: "a kind remark that shows you admire someone",
    teluguMeaning: "ప్రశంస, మెచ్చుకోలు",
    example: "She gave me a nice compliment on my dress.",
    synonyms: ["praise", "kind words"],
    category: "Social",
  },
  {
    word: "confident",
    pronunciation: "/ˈkɒnfɪdənt/ (KON-fih-duhnt)",
    englishMeaning: "feeling sure about your own abilities",
    teluguMeaning: "ఆత్మవిశ్వాసం కలిగిన",
    example: "He feels confident about the interview.",
    synonyms: ["sure", "self-assured"],
    category: "Social",
  },
  {
    word: "consider",
    pronunciation: "/kənˈsɪdər/ (kun-SID-ur)",
    englishMeaning: "to think carefully about something before deciding",
    teluguMeaning: "పరిగణించు, ఆలోచించు",
    example: "Please consider my suggestion.",
    synonyms: ["think about", "weigh"],
    category: "Social",
  },
  {
    word: "encourage",
    pronunciation: "/ɪnˈkʌrɪdʒ/ (in-KUR-ij)",
    englishMeaning: "to give someone support and confidence to try",
    teluguMeaning: "ప్రోత్సహించు",
    example: "My friend will encourage me to try again.",
    synonyms: ["support", "motivate"],
    category: "Social",
  },
  {
    word: "forgive",
    pronunciation: "/fərˈɡɪv/ (fur-GIV)",
    englishMeaning: "to stop feeling angry with someone for a mistake",
    teluguMeaning: "క్షమించు",
    example: "I forgive you for the mistake.",
    synonyms: ["pardon", "excuse"],
    category: "Social",
  },
  {
    word: "greet",
    pronunciation: "/ɡriːt/ (GREET)",
    englishMeaning: "to say hello or welcome someone in a friendly way",
    teluguMeaning: "పలకరించు, స్వాగతించు",
    example: "She will greet you with a smile.",
    synonyms: ["welcome", "say hello"],
    category: "Social",
  },
  {
    word: "honest",
    pronunciation: "/ˈɒnɪst/ (ON-ist)",
    englishMeaning: "always telling the truth",
    teluguMeaning: "నిజాయితీగల",
    example: "Let us be honest about the problem.",
    synonyms: ["truthful", "sincere"],
    category: "Social",
  },
  {
    word: "invite",
    pronunciation: "/ɪnˈvaɪt/ (in-VYT)",
    englishMeaning: "to ask someone to come to an event or join you",
    teluguMeaning: "ఆహ్వానించు",
    example: "They will invite us to dinner.",
    synonyms: ["ask", "request"],
    category: "Social",
  },
  {
    word: "polite",
    pronunciation: "/pəˈlaɪt/ (puh-LYT)",
    englishMeaning: "behaving in a respectful and kind way",
    teluguMeaning: "మర్యాదగల",
    example: "It is polite to say thank you.",
    synonyms: ["courteous", "respectful"],
    category: "Social",
  },
  {
    word: "recommend",
    pronunciation: "/ˌrekəˈmend/ (rek-uh-MEND)",
    englishMeaning: "to suggest something as a good choice",
    teluguMeaning: "సిఫార్సు చేయు",
    example: "Can you recommend a good book?",
    synonyms: ["suggest", "advise"],
    category: "Social",
  },
  {
    word: "respect",
    pronunciation: "/rɪˈspekt/ (ri-SPEKT)",
    englishMeaning: "admiration for someone; to show that admiration",
    teluguMeaning: "గౌరవం, గౌరవించు",
    example: "I respect your opinion.",
    synonyms: ["admire", "value"],
    category: "Social",
  },

  /* ------------------------------ Feelings ----------------------------- */
  {
    word: "anxious",
    pronunciation: "/ˈæŋkʃəs/ (ANG-shuhs)",
    englishMeaning: "feeling worried or nervous about something",
    teluguMeaning: "ఆందోళనగల, చింతితమైన",
    example: "I feel anxious before exams.",
    synonyms: ["worried", "nervous"],
    category: "Feelings",
  },
  {
    word: "calm",
    pronunciation: "/kɑːm/ (KAHM)",
    englishMeaning: "peaceful and not worried or excited",
    teluguMeaning: "ప్రశాంతమైన",
    example: "Take a deep breath and stay calm.",
    synonyms: ["peaceful", "relaxed"],
    category: "Feelings",
  },
  {
    word: "curious",
    pronunciation: "/ˈkjʊriəs/ (KYOOR-ee-uhs)",
    englishMeaning: "wanting to know or learn about something",
    teluguMeaning: "ఆసక్తిగల",
    example: "The children are curious about space.",
    synonyms: ["inquisitive", "interested"],
    category: "Feelings",
  },
  {
    word: "delighted",
    pronunciation: "/dɪˈlaɪtɪd/ (dih-LY-tid)",
    englishMeaning: "very happy and pleased about something",
    teluguMeaning: "ఆనందితమైన, సంతోషించిన",
    example: "I was delighted to hear the news.",
    synonyms: ["pleased", "thrilled"],
    category: "Feelings",
  },
  {
    word: "embarrassed",
    pronunciation: "/ɪmˈbærəst/ (im-BER-uhst)",
    englishMeaning: "feeling shy or ashamed in front of other people",
    teluguMeaning: "సిగ్గుపడిన, ఇబ్బందిగల",
    example: "I felt embarrassed when I forgot her name.",
    synonyms: ["ashamed", "awkward"],
    category: "Feelings",
  },
  {
    word: "exhausted",
    pronunciation: "/ɪɡˈzɔːstɪd/ (ig-ZAW-stid)",
    englishMeaning: "extremely tired after hard work or effort",
    teluguMeaning: "అలసిపోయిన",
    example: "I was exhausted after the long trip.",
    synonyms: ["tired", "worn out"],
    category: "Feelings",
  },
  {
    word: "frustrated",
    pronunciation: "/frʌˈstreɪtɪd/ (fruh-STRAY-tid)",
    englishMeaning: "annoyed because you cannot do something or get what you want",
    teluguMeaning: "నిరాశ చెందిన, అసహనం కలిగిన",
    example: "I feel frustrated when the internet is slow.",
    synonyms: ["annoyed", "irritated"],
    category: "Feelings",
  },
  {
    word: "grateful",
    pronunciation: "/ˈɡreɪtfl/ (GRAYT-fuhl)",
    englishMeaning: "feeling or showing thanks to someone",
    teluguMeaning: "కృతజ్ఞత కలిగిన",
    example: "I am grateful for your support.",
    synonyms: ["thankful", "appreciative"],
    category: "Feelings",
  },
  {
    word: "lonely",
    pronunciation: "/ˈloʊnli/ (LOHN-lee)",
    englishMeaning: "sad because you are alone or lack company",
    teluguMeaning: "ఒంటరిగా ఉండి బాధపడే",
    example: "She felt lonely in the new city.",
    synonyms: ["alone", "isolated"],
    category: "Feelings",
  },
  {
    word: "nervous",
    pronunciation: "/ˈnɜːrvəs/ (NER-vuhs)",
    englishMeaning: "worried or a little afraid about what will happen",
    teluguMeaning: "భయపడుతున్న, చింతితమైన",
    example: "He was nervous during the interview.",
    synonyms: ["anxious", "tense"],
    category: "Feelings",
  },
  {
    word: "relieved",
    pronunciation: "/rɪˈliːvd/ (ri-LEEVD)",
    englishMeaning: "happy because a worry or pain has gone away",
    teluguMeaning: "ఉపశమనం కలిగిన",
    example: "I was relieved when the exam was over.",
    synonyms: ["comforted", "reassured"],
    category: "Feelings",
  },

  /* ------------------------------- Travel ------------------------------ */
  {
    word: "reserve",
    pronunciation: "/rɪˈzɜːrv/ (ri-ZERV)",
    englishMeaning: "to keep a ticket, room, or table for your use",
    teluguMeaning: "రిజర్వ్ చేయు",
    example: "I would like to reserve a table for two.",
    synonyms: ["book", "keep"],
    category: "Travel",
  },
  {
    word: "board",
    pronunciation: "/bɔːrd/ (BORD)",
    englishMeaning: "to get on a plane, train, or bus",
    teluguMeaning: "విమానం లేదా రైలు ఎక్కు",
    example: "We board the plane at 6 a.m.",
    synonyms: ["get on", "enter"],
    category: "Travel",
  },
  {
    word: "destination",
    pronunciation: "/ˌdestɪˈneɪʃn/ (des-tih-NAY-shun)",
    englishMeaning: "the place you are travelling to",
    teluguMeaning: "గమ్యస్థానం",
    example: "Varanasi is our next destination.",
    synonyms: ["goal", "endpoint"],
    category: "Travel",
  },
  {
    word: "journey",
    pronunciation: "/ˈdʒɜːrni/ (JER-nee)",
    englishMeaning: "the act of travelling from one place to another",
    teluguMeaning: "ప్రయాణం",
    example: "The journey took four hours.",
    synonyms: ["trip", "travel"],
    category: "Travel",
  },
  {
    word: "luggage",
    pronunciation: "/ˈlʌɡɪdʒ/ (LUG-ij)",
    englishMeaning: "the bags and cases you take when you travel",
    teluguMeaning: "ప్రయాణ సామాను",
    example: "Please keep your luggage near you.",
    synonyms: ["bags", "baggage"],
    category: "Travel",
  },
  {
    word: "platform",
    pronunciation: "/ˈplætfɔːrm/ (PLAT-form)",
    englishMeaning: "the place where you wait and get on a train",
    teluguMeaning: "రైలు ఎక్కే చోటు, ప్లాట్ ఫార్మ్",
    example: "The train arrives at platform 3.",
    synonyms: ["station area"],
    category: "Travel",
  },
  {
    word: "route",
    pronunciation: "/ruːt/ (ROOT)",
    englishMeaning: "the way you take to get from one place to another",
    teluguMeaning: "మార్గం",
    example: "This route avoids heavy traffic.",
    synonyms: ["path", "way"],
    category: "Travel",
  },
  {
    word: "scenery",
    pronunciation: "/ˈsiːnəri/ (SEE-nuh-ree)",
    englishMeaning: "the beautiful natural views of a place",
    teluguMeaning: "ప్రకృతి దృశ్యం",
    example: "We enjoyed the scenery on the drive.",
    synonyms: ["views", "landscape"],
    category: "Travel",
  },
  {
    word: "ticket",
    pronunciation: "/ˈtɪkɪt/ (TIK-it)",
    englishMeaning: "a paper or electronic pass that lets you travel",
    teluguMeaning: "టికెట్",
    example: "Show your ticket at the gate.",
    synonyms: ["pass", "travel pass"],
    category: "Travel",
  },
  {
    word: "tour",
    pronunciation: "/tʊr/ (TOOR)",
    englishMeaning: "a guided visit to a place of interest",
    teluguMeaning: "పర్యటన",
    example: "We took a tour of the old city.",
    synonyms: ["guided visit", "trip"],
    category: "Travel",
  },
  {
    word: "traffic",
    pronunciation: "/ˈtræfɪk/ (TRAF-ik)",
    englishMeaning: "the vehicles moving on a road at one time",
    teluguMeaning: "ట్రాఫిక్, రద్దీ",
    example: "There was heavy traffic this morning.",
    synonyms: ["congestion", "vehicles"],
    category: "Travel",
  },

  /* ----------------------------- Technology ---------------------------- */
  {
    word: "access",
    pronunciation: "/ˈækses/ (AK-ses)",
    englishMeaning: "the ability to use or enter something",
    teluguMeaning: "ప్రవేశం, ఉపయోగించే అవకాశం",
    example: "I cannot access my email right now.",
    synonyms: ["entry", "use"],
    category: "Technology",
  },
  {
    word: "charge",
    pronunciation: "/tʃɑːrdʒ/ (CHARJ)",
    englishMeaning: "to put power into a battery; an amount of money to pay",
    teluguMeaning: "ఛార్జ్ చేయు, రుసుము",
    example: "Please charge your phone before the trip.",
    synonyms: ["power up", "fee"],
    category: "Technology",
  },
  {
    word: "download",
    pronunciation: "/ˌdaʊnˈloʊd/ (down-LOHD)",
    englishMeaning: "to copy a file from the internet to your own device",
    teluguMeaning: "డౌన్ లోడ్ చేయు",
    example: "I will download the app tonight.",
    synonyms: ["save", "fetch"],
    category: "Technology",
  },
  {
    word: "file",
    pronunciation: "/faɪl/ (FYL)",
    englishMeaning: "a stored piece of information on a computer",
    teluguMeaning: "ఫైల్, దస్త్రం",
    example: "Please attach the file to your email.",
    synonyms: ["document", "record"],
    category: "Technology",
  },
  {
    word: "link",
    pronunciation: "/lɪŋk/ (LINGK)",
    englishMeaning: "an address that takes you to a web page",
    teluguMeaning: "లింక్",
    example: "Send me the link to the document.",
    synonyms: ["web address", "URL"],
    category: "Technology",
  },
  {
    word: "message",
    pronunciation: "/ˈmesɪdʒ/ (MES-ij)",
    englishMeaning: "a piece of information sent to another person",
    teluguMeaning: "సందేశం",
    example: "I will send her a message this morning.",
    synonyms: ["text", "note"],
    category: "Technology",
  },
  {
    word: "notification",
    pronunciation: "/ˌnoʊtɪfɪˈkeɪʃn/ (noh-tih-fih-KAY-shun)",
    englishMeaning: "an alert or reminder shown on your device",
    teluguMeaning: "సూచన, హెచ్చరిక",
    example: "Turn off notifications while you sleep.",
    synonyms: ["alert", "reminder"],
    category: "Technology",
  },
  {
    word: "password",
    pronunciation: "/ˈpæswɜːrd/ (PAS-wurd)",
    englishMeaning: "a secret word you type to log in to an account",
    teluguMeaning: "పాస్ వర్డ్",
    example: "Never share your password with anyone.",
    synonyms: ["passcode", "login code"],
    category: "Technology",
  },
  {
    word: "reply",
    pronunciation: "/rɪˈplaɪ/ (ri-PLY)",
    englishMeaning: "to answer a message or an email",
    teluguMeaning: "సమాధానం ఇవ్వు, బదిలీ చెప్పు",
    example: "I will reply to your email tonight.",
    synonyms: ["answer", "respond"],
    category: "Technology",
  },
  {
    word: "screen",
    pronunciation: "/skriːn/ (SCREEN)",
    englishMeaning: "the display of a phone, tablet, or computer",
    teluguMeaning: "స్క్రీన్, ప్రదర్శన",
    example: "The screen is too bright at night.",
    synonyms: ["display", "monitor"],
    category: "Technology",
  },
  {
    word: "upload",
    pronunciation: "/ˈʌploʊd/ (UP-lohd)",
    englishMeaning: "to send a file from your device to the internet",
    teluguMeaning: "అప్ లోడ్ చేయు",
    example: "Please upload your photo here.",
    synonyms: ["post", "send"],
    category: "Technology",
  },
];

/** Stable, date-based rotation: the same date always shows the same words. */
export function dailyWords(count = 8, key: string = dateKey()): VocabularyWord[] {
  if (count <= 0 || vocabularyWords.length === 0) return [];
  let seed = 7;
  for (let i = 0; i < key.length; i += 1) {
    seed = (seed * 31 + key.charCodeAt(i)) >>> 0;
  }
  const start = seed % vocabularyWords.length;
  const amount = Math.min(Math.max(count, 5), 10);
  return Array.from(
    { length: amount },
    (_, offset) => vocabularyWords[(start + offset) % vocabularyWords.length],
  );
}

export function findVocabularyWord(word: string): VocabularyWord | undefined {
  return vocabularyWords.find((item) => item.word.toLowerCase() === word.toLowerCase());
}

function distractorsFor(word: VocabularyWord, pool: VocabularyWord[]): VocabularyWord[] {
  const index = Math.max(0, pool.findIndex((item) => item.word === word.word));
  return [11, 23, 37]
    .map((offset) => pool[(index + offset) % pool.length])
    .filter((item) => item && item.word !== word.word);
}

function withAnswer(correct: string, others: string[], seed: number): { options: string[]; answerIndex: number } {
  const unique = [...new Set([correct, ...others])].slice(0, 4);
  const choices = unique.filter((item) => item !== correct).slice(0, 3);
  const answerIndex = seed % (choices.length + 1);
  const options = [...choices];
  options.splice(answerIndex, 0, correct);
  return { options, answerIndex };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Builds one short practice question per word, alternating meaning and fill-in-the-blank. */
export function buildVocabularyQuestions(
  words: VocabularyWord[],
  pool: VocabularyWord[] = vocabularyWords,
): PracticeQuestion[] {
  const safePool = pool.length ? pool : vocabularyWords;
  return words.map((word, index) => {
    const others = distractorsFor(word, safePool);
    const seed = word.word.length + index;

    if (index % 2 === 1) {
      const pattern = new RegExp(`\\b${escapeRegExp(word.word)}\\b`, "i");
      const blanked = pattern.test(word.example) ? word.example.replace(pattern, "_____") : "";
      if (blanked) {
        const { options, answerIndex } = withAnswer(
          word.word,
          others.map((item) => item.word),
          seed,
        );
        return {
          id: `vocab-fill-${word.word}-${index}`,
          prompt: `Fill in the blank: "${blanked}"`,
          options,
          answerIndex,
          explanation: `"${word.word}" means ${word.englishMeaning} — ${word.example}`,
        };
      }
    }

    const { options, answerIndex } = withAnswer(
      word.englishMeaning,
      others.map((item) => item.englishMeaning),
      seed,
    );
    return {
      id: `vocab-meaning-${word.word}-${index}`,
      prompt: `What does "${word.word}" mean?`,
      options,
      answerIndex,
      explanation: `${word.word}: ${word.teluguMeaning} — ${word.example}`,
    };
  });
}
