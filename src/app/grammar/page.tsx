import type { Metadata } from "next";
import { GrammarCoach } from "@/components/learning/GrammarCoach";

export const metadata: Metadata = {
  title: "Grammar Coach",
  description: "Twelve bite-sized English grammar lessons with Telugu explanations, examples and quizzes.",
};

export default function GrammarPage() {
  return <GrammarCoach />;
}
