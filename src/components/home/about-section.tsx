import React from "react";
import { profile } from "@/data/profile";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Card } from "@/components/ui/card";

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 border-t border-border bg-surface/30">
      <Container>
        <SectionHeading
          monoLabel="01 / ABOUT"
          title="Đôi nét về mình"
          description="Tư duy phát triển phần mềm, học vấn và nguyên tắc làm việc."
        />

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4 text-base text-muted leading-relaxed">
            {profile.about.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {profile.quickFacts.map((fact, index) => (
              <Card key={index} className="p-4">
                <div className="text-xs font-mono text-accent mb-1">
                  {fact.label}
                </div>
                <div className="text-sm font-semibold text-text">
                  {fact.value}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
