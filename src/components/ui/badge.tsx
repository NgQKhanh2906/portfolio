import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "accent" | "success" | "warning" | "danger";
}

export function Badge({
  className,
  variant = "neutral",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    neutral: "bg-surface-2 text-muted border-border",
    accent: "bg-accent/10 text-accent border-accent/20",
    success: "bg-status-success-soft text-status-success border-status-success/20",
    warning: "bg-status-warning-soft text-status-warning border-status-warning/20",
    danger: "bg-status-danger-soft text-status-danger border-status-danger/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
