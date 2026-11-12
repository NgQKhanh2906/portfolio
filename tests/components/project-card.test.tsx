import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "@/components/projects/project-card";
import { type ProjectFrontmatter } from "@/lib/validations/project-frontmatter";

describe("ProjectCard Component", () => {
  const mockProject: ProjectFrontmatter = {
    title: "Awesome App",
    slug: "awesome-app",
    summary: "A comprehensive web application demonstrating architecture.",
    coverImage: "/images/cover.png",
    year: 2026,
    role: "Full-stack Developer",
    teamSize: "1",
    period: "2026",
    tech: ["nextjs", "react", "typescript", "postgresql", "tailwind", "redis"],
    featured: true,
    published: true,
    order: 1,
    links: {
      demo: "https://demo.example.com",
      source: "https://github.com/example/repo",
    },
  };

  it("renders project information correctly", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("Awesome App")).toBeInTheDocument();
    expect(screen.getByText("2026")).toBeInTheDocument();
    expect(screen.getByText("Full-stack Developer")).toBeInTheDocument();
    expect(
      screen.getByText("A comprehensive web application demonstrating architecture."),
    ).toBeInTheDocument();
  });

  it("limits visible tech badges to 4 and displays +N count for excess", () => {
    render(<ProjectCard project={mockProject} />);
    // 6 tech slugs in mockProject -> 4 visible + '+2' badge
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("renders detail link pointing to project case study slug", () => {
    render(<ProjectCard project={mockProject} />);
    const detailLink = screen.getByRole("link", { name: /chi tiết case study/i });
    expect(detailLink).toHaveAttribute("href", "/projects/awesome-app");
  });
});
