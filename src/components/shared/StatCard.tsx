import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  tone?: "purple" | "pink" | "green" | "blue";
  className?: string;
}

const tones = {
  purple: "bg-primary-soft text-primary dark:text-foreground",
  pink: "bg-pink-soft text-pink",
  green: "bg-success-soft text-success",
  blue: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
};

export function StatCard({ label, value, hint, icon: Icon, tone = "purple", className }: StatCardProps) {
  return (
    <Card className={cn("p-4 md:p-5", className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold text-muted">{label}</p>
        {Icon && (
          <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-xl", tones[tone])}>
            <Icon className="size-4" aria-hidden="true" />
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </Card>
  );
}
