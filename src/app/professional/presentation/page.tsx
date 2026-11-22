"use client";

import Link from "next/link";
import { ArrowLeft, Presentation, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { findProfessionalModule } from "@/data/professional";
import { ProfessionalWorkspace } from "@/components/practice/ProfessionalWorkspace";

export default function PresentationSimulatorPage() {
  const presentationModule = findProfessionalModule("presentation-practice")!;

  return (
    <div className="mx-auto min-w-0 max-w-5xl px-4 py-6 md:px-6 md:py-10">
      <PageHeader
        eyebrow="Presentation simulator"
        title="Explain your project"
        description="Deliver a project opening, receive structured feedback across six skills, then answer three realistic audience questions."
        icon={Presentation}
        actions={
          <Button asChild variant="outline">
            <Link href="/professional">
              <ArrowLeft className="size-4" aria-hidden="true" />
              All modules
            </Link>
          </Button>
        }
      />

      <Card className="mb-6 min-w-0 border-primary/20 bg-primary-soft/50 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge><Sparkles className="size-3" aria-hidden="true" /> Simulator flow</Badge>
        </div>
        <ol className="mt-2 grid gap-1.5 text-xs leading-relaxed text-muted sm:grid-cols-3">
          <li>1. Write your 60–90 second project opening.</li>
          <li>2. Read scores, correction and the audience tone note.</li>
          <li>3. Answer three follow-up questions, one at a time.</li>
        </ol>
      </Card>

      <ProfessionalWorkspace module={presentationModule} presentation />
    </div>
  );
}
