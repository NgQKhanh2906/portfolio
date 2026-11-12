import React from "react";
import { Briefcase, Award, GraduationCap } from "lucide-react";
import { type TimelineEntry } from "@/data/experience";

export interface TimelineItemProps {
  item: TimelineEntry;
}

export function TimelineItem({ item }: TimelineItemProps) {
  const iconMap = {
    work: <Briefcase className="h-3.5 w-3.5 text-accent" />,
    award: <Award className="h-3.5 w-3.5 text-status-warning" />,
    education: <GraduationCap className="h-3.5 w-3.5 text-status-info" />,
  };

  return (
    <div className="relative">
      {/* Dot icon */}
      <div className="absolute -left-[31px] md:-left-[39px] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface">
        {iconMap[item.type]}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
        <h3 className="text-base font-bold text-text">
          {item.title}
        </h3>
        <span className="font-mono text-xs text-muted">
          {item.period}
        </span>
      </div>

      <p className="text-sm font-medium text-accent mb-2">
        {item.organization}
      </p>

      <ul className="list-disc list-inside space-y-1 text-sm text-muted">
        {item.highlights.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
    </div>
  );
}
