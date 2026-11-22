import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  accent?: "purple" | "pink";
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, icon: Icon, accent = "purple", actions, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>}
        <div className="flex items-start gap-3">
          {Icon && (
            <span
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-2xl",
                accent === "pink" ? "bg-pink-soft text-pink" : "bg-primary-soft text-primary dark:text-foreground",
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
            </span>
          )}
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">{title}</h2>
            {description && <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>}
          </div>
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
