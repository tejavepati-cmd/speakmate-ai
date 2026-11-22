import { Sparkles, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OFFLINE_LABEL } from "./utils";

export function SourceBadge({ source }: { source?: "ai" | "offline" }) {
  if (source === "offline") {
    return (
      <Badge variant="outline" className="border-pink/40 bg-pink-soft/60 text-pink">
        <WifiOff className="size-3" aria-hidden="true" />
        {OFFLINE_LABEL}
      </Badge>
    );
  }
  if (source === "ai") {
    return (
      <Badge variant="success">
        <Sparkles className="size-3" aria-hidden="true" />
        AI assisted
      </Badge>
    );
  }
  return <Badge variant="pink">Local practice</Badge>;
}

export function OfflineBadge() {
  return <SourceBadge source="offline" />;
}
