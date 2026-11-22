"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { charStateAt } from "@/lib/typing/engine";

const LEADING_CHARS = 48;
const TRAILING_CHARS = 170;

interface TypingPassageProps {
  target: string;
  typed: string;
  active: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (event: React.ClipboardEvent<HTMLInputElement>) => void;
}

export function TypingPassage({
  target,
  typed,
  active,
  inputRef,
  onChange,
  onKeyDown,
  onPaste,
}: TypingPassageProps) {
  const caret = typed.length;
  const start = Math.max(0, caret - LEADING_CHARS);
  const end = Math.min(target.length, caret + TRAILING_CHARS);

  const visible = React.useMemo(() => {
    const items: Array<{ index: number; char: string; state: ReturnType<typeof charStateAt> }> = [];
    for (let index = start; index < end; index += 1) {
      items.push({ index, char: target[index], state: charStateAt(target, typed, index) });
    }
    return items;
  }, [target, typed, start, end]);

  return (
    <div
      className="relative cursor-text overflow-hidden rounded-2xl border border-border bg-surface-muted/40 p-4 md:p-5"
      onClick={() => {
        if (active) inputRef.current?.focus();
      }}
    >
      <p
        aria-hidden="true"
        className="pointer-events-none select-none whitespace-pre-wrap break-all font-mono text-[1.05rem] leading-8 tracking-wide md:text-xl md:leading-9"
      >
        {start > 0 && <span className="text-muted/40">… </span>}
        {visible.map(({ index, char, state }) => (
          <span
            key={index}
            className={cn(
              "rounded-[3px] transition-colors duration-100",
              state === "correct" && "text-success",
              state === "incorrect" && "bg-danger-soft text-danger",
              state === "pending" && "text-muted/65",
              active && index === caret && "bg-primary/15 text-primary ring-1 ring-primary/50",
            )}
          >
            {char}
          </span>
        ))}
        {end < target.length && <span className="text-muted/40"> …</span>}
      </p>

      <label htmlFor="typing-input" className="sr-only">
        Type the passage shown above
      </label>
      <input
        id="typing-input"
        ref={inputRef}
        type="text"
        value={typed}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        disabled={!active}
        maxLength={target.length}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="done"
        inputMode="text"
        aria-describedby="typing-help"
        className="absolute inset-0 z-10 h-full w-full cursor-text rounded-2xl border-0 bg-transparent px-4 py-4 text-base leading-8 text-transparent caret-transparent outline-none md:px-5 md:py-5 md:leading-9"
      />
    </div>
  );
}
