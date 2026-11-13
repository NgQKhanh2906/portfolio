import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/home/hero";
import { siteConfig } from "@/data/site-config";

describe("Hero Component - The Visual Craft Showcase", () => {
  it("renders left column greeting, role, and CTA buttons", () => {
    render(<Hero />);

    expect(screen.getByText("I'M A WEB DEVELOPER")).toBeInTheDocument();
    const nameElements = screen.getAllByText(siteConfig.name);
    expect(nameElements.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Xem dự án")).toBeInTheDocument();
    expect(screen.getByText("Tải CV (PDF)")).toBeInTheDocument();
    expect(screen.getByText("Công nghệ thực chiến")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders right column studio portrait representation and code card", () => {
    const { container } = render(<Hero />);

    expect(
      screen.getByRole("img", {
        name: "Ảnh đại diện phong cách studio của Nguyễn Quốc Khánh",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("developer.config.ts")).toBeInTheDocument();
    expect(screen.getByText("Ready for opportunities")).toBeInTheDocument();
    expect(screen.getByText("TypeScript Strict")).toBeInTheDocument();

    // Verify all circular dots have shrink-0 aspect-square rounded-full
    const circularElements = container.querySelectorAll(
      ".shrink-0.aspect-square.rounded-full",
    );
    expect(circularElements.length).toBeGreaterThanOrEqual(7);
  });
});
