"use client";

import * as React from "react";
import { MessageCircleHeart, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/shared/CopyButton";
import { openers, openerCategories, type OpenerCategory } from "@/data/girltalk";
import { ChipButton } from "./ChipButton";

export function ConversationStarter() {
  const [category, setCategory] = React.useState<OpenerCategory | "All">("All");

  const visible = React.useMemo(
    () => (category === "All" ? openers : openers.filter((opener) => opener.category === category)),
    [category],
  );

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-pink/30 bg-gradient-to-br from-pink-soft via-surface to-primary-soft">
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-pink text-white">
              <MessageCircleHeart className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <CardTitle>Say hello without the awkwardness</CardTitle>
              <CardDescription>
                A good opener is short, kind and easy to answer. Pick one, say it with a smile, and let the other person join in.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="pink">👋 Start small</Badge>
          <Badge variant="outline">🌱 Be genuine</Badge>
          <Badge variant="outline">🛡️ Respect space</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{visible.length} example openers</CardTitle>
          <CardDescription>Choose a situation, then copy a line you feel comfortable saying.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter openers by situation">
            <ChipButton active={category === "All"} onClick={() => setCategory("All")}>
              All ({openers.length})
            </ChipButton>
            {openerCategories.map((item) => (
              <ChipButton key={item} active={category === item} onClick={() => setCategory(item)}>
                {item}
              </ChipButton>
            ))}
          </div>

          <ul className="space-y-3">
            {visible.map((opener) => (
              <li
                key={opener.id}
                className="rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-pink/40"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="pink">{opener.category}</Badge>
                  <Sparkles className="size-3.5 text-pink" aria-hidden="true" />
                </div>
                <p className="mt-2 break-words text-sm font-semibold leading-relaxed">“{opener.text}”</p>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  <span className="font-bold text-foreground">When to use:</span> {opener.when}
                </p>
                {opener.note && <p className="mt-1 text-xs leading-relaxed text-muted">{opener.note}</p>}
                <div className="mt-2 flex justify-end [&_button]:min-h-11">
                  <CopyButton text={opener.text} label="Copy opener" />
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
