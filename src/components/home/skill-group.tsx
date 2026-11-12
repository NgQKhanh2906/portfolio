import React from "react";
import Link from "next/link";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { type SkillGroup as SkillGroupType } from "@/data/skills";
import { Card } from "@/components/ui/card";

export interface SkillGroupProps {
  group: SkillGroupType;
}

export function SkillGroup({ group }: SkillGroupProps) {
  return (
    <Card className="p-5 flex flex-col justify-between">
      <div>
        <h3 className="font-mono text-sm font-bold text-accent uppercase mb-3">
          {group.groupName}
        </h3>
        <ul className="space-y-2">
          {group.skills.map((skill, skillIndex) => (
            <li
              key={skillIndex}
              className="flex items-center justify-between text-sm text-text"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                <span>{skill.name}</span>
              </span>
              {skill.proof && (
                <Link
                  href={skill.proof}
                  className="text-xs text-accent hover:underline flex items-center gap-0.5 ml-2"
                >
                  <span>Xem chứng minh</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
