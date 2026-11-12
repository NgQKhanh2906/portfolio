import React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  monoLabel: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  className,
  monoLabel,
  title,
  description,
  align = "left",
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-8 md:mb-12",
        align === "center" && "text-center",
        className,
      )}
      {...props}
    >
      <div className="font-mono text-xs font-semibold uppercase tracking-wider text-accent mb-2">
        {monoLabel}
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl md:text-4xl text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-sm text-muted sm:text-base max-w-2xl text-pretty">
          {description}
        </p>
      )}
    </div>
  );
}
