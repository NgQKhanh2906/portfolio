import React from "react";
import { experienceTimeline } from "@/data/experience";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { TimelineItem } from "./timeline-item";

export function ExperienceTimeline() {
  return (
    <section id="journey" className="py-16 md:py-24 border-t border-border">
      <Container>
        <SectionHeading
          monoLabel="04 / JOURNEY"
          title="Hành trình phát triển"
          description="Kinh nghiệm làm việc, giải thưởng và quá trình học tập."
        />

        <div className="relative border-l border-border ml-3 md:ml-4 pl-6 md:pl-8 space-y-8">
          {experienceTimeline.map((item, index) => (
            <TimelineItem key={index} item={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
