import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutSection } from "@/components/home/about-section";
import { profile } from "@/data/profile";

describe("AboutSection Component", () => {
  it("renders section heading, bio, and CTA button", () => {
    render(<AboutSection />);

    expect(screen.getByText("01 / ABOUT")).toBeInTheDocument();
    expect(screen.getByText("Đôi nét về mình")).toBeInTheDocument();

    profile.about.forEach((paragraph) => {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    });

    const ctaButton = screen.getByRole("button", {
      name: /khám phá các case study/i,
    });
    expect(ctaButton).toBeInTheDocument();

    const link = ctaButton.closest("a");
    expect(link).toHaveAttribute("href", "/projects");
  });

  it("renders all 4 stat cards with correct values, labels, and subtexts", () => {
    const { container } = render(<AboutSection />);

    profile.stats.forEach((stat) => {
      expect(screen.getByText(stat.value)).toBeInTheDocument();
      expect(screen.getByText(stat.label)).toBeInTheDocument();
      expect(screen.getByText(stat.subtext)).toBeInTheDocument();
    });

    const circularBadges = container.querySelectorAll(
      ".shrink-0.aspect-square.rounded-full",
    );
    expect(circularBadges.length).toBe(profile.stats.length);
  });
});
