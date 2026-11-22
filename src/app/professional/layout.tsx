import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional English Coach",
  description:
    "Practise self-introductions, college conversations, presentations, emails, interviews and workplace English with feedback.",
};

export default function ProfessionalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
