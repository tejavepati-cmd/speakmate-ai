"use client";

import { Keyboard, Timer, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { TypingTrainer } from "@/components/typing/TypingTrainer";

export default function TypingPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Practice"
        title="Typing Trainer"
        icon={Keyboard}
        description="Build speed and accuracy with real passages. Live WPM, per-character feedback and personal bests — all saved on this device."
        actions={
          <>
            <Badge variant="outline"><Timer className="size-3" aria-hidden="true" /> 15s – 10min</Badge>
            <Badge variant="success"><TrendingUp className="size-3" aria-hidden="true" /> 7 topics</Badge>
          </>
        }
      />
      <TypingTrainer />
    </div>
  );
}
