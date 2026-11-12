"use client";

import React from "react";
import { Search } from "lucide-react";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

export interface CommandTriggerProps {
  onClick: () => void;
  className?: string;
}

export function CommandTrigger({ onClick, className }: CommandTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted hover:border-border-strong hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className,
      )}
      aria-label="Mở bảng lệnh (Ctrl+K)"
    >
      <Search className="h-3.5 w-3.5 text-muted" />
      <span className="hidden sm:inline">Tìm kiếm...</span>
      <Kbd>Ctrl K</Kbd>
    </button>
  );
}
