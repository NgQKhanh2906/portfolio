import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import { type SkillGroup as SkillGroupType } from "@/data/skills";
import { Card } from "@/components/ui/card";

export interface SkillGroupProps {
  group: SkillGroupType;
}

export function SkillGroup({ group }: SkillGroupProps) {
  return (
    <Card className="p-6 flex flex-col justify-between card-interactive rounded-xl border border-border bg-surface shadow-xs">
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/70">
          <h3 className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
            {group.groupName}
          </h3>
          <span className="text-[11px] font-mono text-muted">
            {group.skills.length} kỹ năng
          </span>
        </div>

        <ul className="space-y-3">
          {group.skills.map((skill, skillIndex) => (
            <li
              key={skillIndex}
              className="flex items-center justify-between text-sm text-text group/item py-1"
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <span className="flex h-5 w-5 shrink-0 aspect-square items-center justify-center rounded-full bg-accent/15 text-accent group-hover/item:bg-accent group-hover/item:text-accent-fg transition-all duration-fast">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
                <span className="font-medium group-hover/item:text-accent transition-colors">
                  {skill.name}
                </span>
              </span>

              {skill.proof && (
                <Link
                  href={skill.proof}
                  className="inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-xs text-accent hover:bg-accent/10 border border-transparent hover:border-accent/30 transition-all duration-fast"
                >
                  <span>Bằng chứng</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
