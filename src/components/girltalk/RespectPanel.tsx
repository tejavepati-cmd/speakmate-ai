import { Ban, CheckCircle2, Eye, Lock, MessageSquareOff, ShieldCheck, Smile } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { boundaryRules, type BoundaryRule } from "@/data/flirting";

const icons: Record<BoundaryRule["icon"], LucideIcon> = {
  shield: ShieldCheck,
  ban: Ban,
  lock: Lock,
  message: MessageSquareOff,
  eye: Eye,
  smile: Smile,
  check: CheckCircle2,
};

export function RespectPanel() {
  return (
    <Card className="overflow-hidden border-pink/40 bg-gradient-to-br from-pink-soft via-surface to-danger-soft/40">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-pink text-white">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <CardTitle>Respect &amp; boundaries come first</CardTitle>
              <CardDescription className="mt-1">
                Read this before trying any flirting practice. It is always here — nothing in this module asks you to skip it.
              </CardDescription>
            </div>
          </div>
          <Badge variant="pink">Always on</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="grid gap-2 sm:grid-cols-2">
          {boundaryRules.map((rule) => {
            const Icon = icons[rule.icon] ?? ShieldCheck;
            return (
              <li key={rule.id} className="flex gap-2.5 rounded-2xl border border-border bg-surface/90 p-3">
                <Icon className="mt-0.5 size-4 shrink-0 text-pink" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm font-bold">{rule.title}</p>
                  <p className="mt-0.5 break-words text-xs leading-relaxed text-muted">{rule.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="rounded-2xl border border-pink/30 bg-surface/90 p-3 text-sm leading-relaxed">
          <p className="font-bold">Do not assume the other person is romantically interested.</p>
          <p className="mt-1 text-muted">
            A friendly reply is just a friendly reply. All examples are age-appropriate and non-explicit. When unsure, ask kindly —
            and accept the answer the first time.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
