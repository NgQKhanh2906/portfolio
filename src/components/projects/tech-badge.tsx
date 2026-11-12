import React from "react";
import { TECH_REGISTRY } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface TechBadgeProps {
  slug: string;
  className?: string;
  active?: boolean;
  onClick?: () => void;
}

export function TechBadge({
  slug,
  className,
  active = false,
  onClick,
}: TechBadgeProps) {
  const techInfo = TECH_REGISTRY[slug];
  const displayName = techInfo?.name || slug;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-xs font-mono transition-all duration-fast select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          active
            ? "border-accent/40 bg-accent/15 text-accent font-semibold shadow-xs"
            : "border-border bg-surface-2/60 text-muted hover:border-border-strong hover:bg-surface-2 hover:text-text",
          className,
        )}
      >
        <span>{displayName}</span>
      </button>
    );
  }

  return (
    <Badge
      variant="neutral"
      className={cn("font-mono text-[11px] px-2 py-0.5", className)}
    >
      {displayName}
    </Badge>
  );
}
