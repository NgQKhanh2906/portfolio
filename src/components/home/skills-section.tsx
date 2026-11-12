import React from "react";
import { skillGroups } from "@/data/skills";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { SkillGroup } from "./skill-group";

export function SkillsSection() {
  return (
    <section id="skills" className="py-16 md:py-24 border-t border-border">
      <Container>
        <SectionHeading
          monoLabel="02 / SKILLS"
          title="Kỹ năng chuyên môn"
          description="Mỗi kỹ năng đều đi kèm tính năng hoặc dự án kiểm chứng thực tế."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <SkillGroup key={group.groupName} group={group} />
          ))}
        </div>
      </Container>
    </section>
  );
}
