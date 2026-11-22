import {
  BarChart3,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  Heart,
  Home,
  Keyboard,
  Languages,
  MessageCircleHeart,
  Settings,
  Sparkles,
  VenusAndMars,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
  accent?: "pink";
}

export const navGroups: Array<{ title: string; items: NavItem[] }> = [
  {
    title: "Learn",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: Home, description: "Your learning home" },
      { href: "/typing", label: "Typing Practice", icon: Keyboard, description: "Speed & accuracy trainer" },
      { href: "/telugu-english", label: "Telugu → English", icon: Languages, description: "Roman Telugu assistant" },
      { href: "/grammar", label: "Grammar Coach", icon: BookOpen, description: "Rules, examples & quizzes" },
      { href: "/vocabulary", label: "Vocabulary", icon: Sparkles, description: "5–10 words every day" },
    ],
  },
  {
    title: "Communicate",
    items: [
      { href: "/chat", label: "SpeakMate AI", icon: Bot, description: "Natural AI conversation" },
      { href: "/professional", label: "Professional English", icon: BriefcaseBusiness, description: "Work, college & interviews" },
      { href: "/girltalk", label: "GirlTalk Coach", icon: VenusAndMars, description: "Social confidence", accent: "pink" },
      { href: "/girltalk/flirting", label: "Flirting Coach", icon: Heart, description: "Respectful, playful flirting", accent: "pink" },
      { href: "/emotion", label: "Emotion Coach", icon: MessageCircleHeart, description: "Empathy & tone" },
      { href: "/practice", label: "Roleplay Simulator", icon: Sparkles, description: "Realistic practice scenarios" },
    ],
  },
  {
    title: "Your journey",
    items: [
      { href: "/progress", label: "Progress", icon: BarChart3, description: "Real activity analytics" },
      { href: "/settings", label: "Settings", icon: Settings, description: "Preferences & privacy" },
    ],
  },
];

export const allNavItems: NavItem[] = navGroups.flatMap((group) => group.items);

export const bottomNavItems: NavItem[] = [
  allNavItems[0],
  allNavItems[5],
  allNavItems[1],
  allNavItems[11],
];

export function titleForPath(pathname: string): string {
  if (pathname === "/dashboard") return "Dashboard";
  const exact = allNavItems.find((item) => item.href === pathname);
  if (exact) return exact.label;
  if (pathname.startsWith("/girltalk/flirting")) return "Flirting Coach";
  return "SpeakMate AI";
}
