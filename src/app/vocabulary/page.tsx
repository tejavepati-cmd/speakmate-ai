import type { Metadata } from "next";
import { VocabularyBuilder } from "@/components/learning/VocabularyBuilder";

export const metadata: Metadata = {
  title: "Vocabulary Builder",
  description: "Learn useful English words every day with Telugu meanings, examples, quick quizzes and revision.",
};

export default function VocabularyPage() {
  return <VocabularyBuilder />;
}
