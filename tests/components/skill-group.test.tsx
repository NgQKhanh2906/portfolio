import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkillGroup } from "@/components/home/skill-group";

describe("SkillGroup Component", () => {
  const mockGroup = {
    groupName: "Backend & API",
    skills: [
      {
        name: "Express.js",
        proof: "/case-studies/taskflow",
      },
      {
        name: "Authentication (OAuth 2.0, JWT)",
        proof: "/case-studies/taskflow",
      },
    ],
  };

  it("renders group title and skill items with non-squished circular checkmarks", () => {
    const { container } = render(<SkillGroup group={mockGroup} />);

    expect(screen.getByText("Backend & API")).toBeInTheDocument();
    expect(screen.getByText("Express.js")).toBeInTheDocument();
    expect(
      screen.getByText("Authentication (OAuth 2.0, JWT)"),
    ).toBeInTheDocument();

    // Verify all checkmark circular spans have shrink-0 aspect-square rounded-full
    const circularCheckmarks = container.querySelectorAll(
      ".shrink-0.aspect-square.rounded-full",
    );
    expect(circularCheckmarks.length).toBe(2);
  });
});
