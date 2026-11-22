"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/components/providers/AppProviders";

/** Copy control with a 44px touch target for mobile-first layouts. */
export function CopyLineButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);
  const { toast } = useAppContext();

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast("Copied to clipboard", "success");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast("Could not copy. Please select the text manually.", "warning");
    }
  }

  return (
    <Button type="button" variant="ghost" size="sm" className="min-h-11 px-3" onClick={copy} aria-label={copied ? "Copied" : label}>
      {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
      {copied ? "Copied" : label}
    </Button>
  );
}
