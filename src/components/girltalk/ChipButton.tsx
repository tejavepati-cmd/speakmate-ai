"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChipButtonProps {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
  title?: string;
  disabled?: boolean;
}

export function ChipButton({ active = false, onClick, children, className, title, disabled }: ChipButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      disabled={disabled}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-xl border px-3 py-2 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm",
        active
          ? "border-pink bg-pink-soft text-pink shadow-sm"
          : "border-border-strong bg-surface text-muted hover:border-pink/50 hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}
