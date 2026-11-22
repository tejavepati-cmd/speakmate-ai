"use client";

import * as React from "react";
import { Lightbulb, Smile } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/shared/CopyButton";
import {
  complimentCategories,
  compliments,
  type ComplimentCategory,
} from "@/data/flirting";
import { ChipButton } from "./ChipButton";

export function ComplimentCoach() {
  const [category, setCategory] = React.useState<ComplimentCategory | "All">("All");
  const visible = React.useMemo(
    () => (category === "All" ? compliments : compliments.filter((item) => item.category === category)),
    [category],
  );

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-pink/30 bg-gradient-to-br from-pink-soft via-surface to-primary-soft">
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-pink text-white">
              <Smile className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <CardTitle>Compliments that feel good to receive</CardTitle>
              <CardDescription>
                Genuine, non-creepy and non-explicit. Notice a choice, effort or character — then move on naturally.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pick a kind of compliment</CardTitle>
          <CardDescription>{visible.length} {visible.length === 1 ? "example" : "examples"} with a short explanation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Compliment categories">
            <ChipButton active={category === "All"} onClick={() => setCategory("All")}>All</ChipButton>
            {complimentCategories.map((item) => (
              <ChipButton key={item} active={category === item} onClick={() => setCategory(item)}>
                {item}
              </ChipButton>
            ))}
          </div>

          <ul className="space-y-3">
            {visible.map((item) => (
              <li key={item.id} className="rounded-2xl border border-border p-4">
                <Badge variant="pink">{item.category}</Badge>
                <p className="mt-2 break-words text-sm font-semibold leading-relaxed">“{item.text}”</p>
                <p className="mt-2 flex gap-2 break-words rounded-xl bg-pink-soft/60 p-3 text-xs leading-relaxed">
                  <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-pink" aria-hidden="true" />
                  <span><span className="font-bold">Why this works:</span> {item.why}</span>
                </p>
                <div className="mt-2 flex justify-end [&_button]:min-h-11">
                  <CopyButton text={item.text} label="Copy compliment" />
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
