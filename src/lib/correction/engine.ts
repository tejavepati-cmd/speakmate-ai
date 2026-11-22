import type { Correction } from "@/lib/types";
import { isLikelyRomanTelugu, translateRoman } from "@/lib/translation/roman";

interface Rule {
  pattern: RegExp;
  replace: string;
  why: string;
}

const rules: Rule[] = [
  { pattern: /\bi\s+am\s+go\b/gi, replace: "I am going", why: 'Use "going" after "am" for the present continuous tense.' },
  { pattern: /\bi\s+go\s+to\s+(.+?)\s+yesterday\b/gi, replace: "I went to $1 yesterday", why: '"Yesterday" needs the past tense "went".' },
  { pattern: /\bi\s+go\s+college\b/gi, replace: "I go to college", why: 'Add "to" before a place you are going to.' },
  { pattern: /\bi\s+didn't\s+went\b/gi, replace: "I didn't go", why: 'After "didn\'t", use the base verb "go".' },
  { pattern: /\bdid\s+you\s+went\b/gi, replace: "did you go", why: 'After "did", use the base verb "go".' },
  { pattern: /\bdoes\s+he\s+likes\b/gi, replace: "does he like", why: 'After "does", use the base verb "like".' },
  { pattern: /\bhe\s+don't\b/gi, replace: "he doesn't", why: 'Use "doesn\'t" with he, she and it.' },
  { pattern: /\bshe\s+don't\b/gi, replace: "she doesn't", why: 'Use "doesn\'t" with he, she and it.' },
  { pattern: /\bi\s+has\b/gi, replace: "I have", why: 'Use "have" with I, you, we and they.' },
  { pattern: /\bi\s+am\s+agree\b/gi, replace: "I agree", why: '"Agree" is a state verb, so we do not usually use it with "am".' },
  { pattern: /\bmore\s+better\b/gi, replace: "better", why: '"Better" is already a comparative, so "more" is not needed.' },
  { pattern: /\bdiscuss\s+about\b/gi, replace: "discuss", why: '"Discuss" already means "talk about", so "about" is extra.' },
  { pattern: /\bcan\s+able\s+to\b/gi, replace: "can", why: 'Use either "can" or "be able to", not both.' },
  { pattern: /\bi\s+am\s+having\s+a\b/gi, replace: "I have a", why: 'For possession, prefer the simple present "I have".' },
  { pattern: /\bvery\s+thanks\b/gi, replace: "thank you very much", why: 'The natural phrase is "thank you very much".' },
  { pattern: /\bhe\s+go\s+to\b/gi, replace: "he goes to", why: 'Add "es" for he/she/it in the present tense.' },
  { pattern: /\bshe\s+go\s+to\b/gi, replace: "she goes to", why: 'Add "es" for he/she/it in the present tense.' },
  { pattern: /\bim\s/gi, replace: "I'm ", why: 'Write "I\'m" with a capital I and an apostrophe.' },
  { pattern: /\bthanx\b/gi, replace: "thanks", why: 'The standard spelling is "thanks".' },
  { pattern: /\brepu\b/gi, replace: "tomorrow", why: 'The English word for "repu" is "tomorrow".' },
];

export function correctSentence(input: string): Correction {
  const original = input.trim();
  const normalizedInput = original.replace(/\s+/g, " ");

  if (isLikelyRomanTelugu(normalizedInput)) {
    const translated = translateRoman(normalizedInput);
    return {
      original,
      correct: translated.natural || translated.professional || original,
      natural: translated.natural || original,
      professional: translated.professional || translated.natural || original,
      telugu: translated.telugu,
      explanation: translated.explanation,
      practice: `Now try saying it in English: "${translated.natural || "I would like to learn English."}"`,
    };
  }

  let corrected = normalizedInput;
  const explanations: string[] = [];
  for (const rule of rules) {
    const next = corrected.replace(rule.pattern, rule.replace);
    if (next !== corrected) {
      corrected = next;
      if (!explanations.includes(rule.why)) explanations.push(rule.why);
    }
  }

  corrected = corrected.replace(/\s+([,.!?])/g, "$1").replace(/\s{2,}/g, " ").trim();
  if (corrected) {
    corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
    if (!/[.!?]$/.test(corrected)) corrected += ".";
  }

  const natural = corrected
    .replace(/^I am /, "I'm ")
    .replace(/^I am going to /, "I'm heading to ")
    .replace(/^It is /, "It's ");
  const professional = corrected
    .replace(/^I'm heading to /, "I am going to ")
    .replace(/^I'm /, "I am ")
    .replace(/^gonna /, "going to ");

  return {
    original,
    correct: corrected,
    natural,
    professional,
    telugu: "ఇంగ్లీష్ వాక్యం సరిగ్గా చెప్పడానికి ఇది ఒక ఉదాహరణ.",
    explanation: explanations.length
      ? explanations.join(" ")
      : "Your sentence is already clear. Here are a few more natural and professional ways to say the same thing.",
    practice: `Practise saying: "${natural.replace(/[.!?]$/, "")}" out loud, then change the subject to something from your day.`,
  };
}

export function hasCommonMistake(text: string): boolean {
  return rules.some((rule) => new RegExp(rule.pattern.source, "i").test(text));
}
