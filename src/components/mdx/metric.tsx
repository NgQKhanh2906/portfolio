import React from "react";
import { cn } from "@/lib/utils";

export interface MetricProps {
  label: string;
  value: string;
  description?: string;
  className?: string;
}

export function Metric({
  label,
  value,
  description,
  className,
}: MetricProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-lg border border-border bg-surface p-4 shadow-xs",
        className,
      )}
    >
      <span className="text-xs font-mono text-muted uppercase tracking-wider mb-1">
        {label}
      </span>
      <span className="text-2xl sm:text-3xl font-extrabold font-mono text-accent tracking-tight my-1">
        {value}
      </span>
      {description && (
        <span className="text-xs text-muted leading-normal mt-1">
          {description}
        </span>
      )}
    </div>
  );
}
