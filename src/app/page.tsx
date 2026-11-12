import React from "react";
import { Hero } from "@/components/home/hero";
import { AboutSection } from "@/components/home/about-section";
import { SkillsSection } from "@/components/home/skills-section";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { ExperienceTimeline } from "@/components/home/experience-timeline";
import { TelemetryPreview } from "@/components/home/telemetry-preview";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <AboutSection />
      <SkillsSection />
      <FeaturedProjects />
      <ExperienceTimeline />
      <TelemetryPreview />
    </div>
  );
}
