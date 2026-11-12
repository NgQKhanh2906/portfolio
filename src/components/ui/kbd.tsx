import React from "react";
import { cn } from "@/lib/utils";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Kbd({ className, children, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center rounded-sm border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}
