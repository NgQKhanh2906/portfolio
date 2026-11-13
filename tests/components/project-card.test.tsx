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

  it("renders BrowserMockup with address bar and default viewport for unknown slug", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByTestId("browser-mockup")).toBeInTheDocument();
    expect(screen.getByTestId("browser-dots")).toBeInTheDocument();
    expect(screen.getByText("demo.example.com")).toBeInTheDocument();
    expect(screen.getByTestId("mockup-default")).toBeInTheDocument();
    expect(screen.getByText("LIVE SYSTEM")).toBeInTheDocument();
  });

  it("renders dark editor preview with telemetry for portfolio project", () => {
    const portfolioProject: ProjectFrontmatter = {
      ...mockProject,
      title: "Portfolio Web Application",
      slug: "portfolio",
      links: { demo: "https://nqkhanh.dev" },
    };
    render(<ProjectCard project={portfolioProject} />);
    expect(screen.getByText("nqkhanh.dev")).toBeInTheDocument();
    expect(screen.getByTestId("mockup-portfolio")).toBeInTheDocument();
    expect(screen.getByText("ONLINE 100%")).toBeInTheDocument();
    expect(screen.getByText(/runtime/i)).toBeInTheDocument();
  });

  it("renders Kanban board preview with columns for taskflow project", () => {
    const taskflowProject: ProjectFrontmatter = {
      ...mockProject,
      title: "TaskFlow - Kanban Board",
      slug: "taskflow",
      links: { demo: "https://taskflow.dev" },
    };
    render(<ProjectCard project={taskflowProject} />);
    expect(screen.getByText("taskflow.dev/board")).toBeInTheDocument();
    expect(screen.getByTestId("mockup-taskflow")).toBeInTheDocument();
    expect(screen.getByText("TaskFlow Board")).toBeInTheDocument();
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("renders storefront UI preview with product cards for shoplite project", () => {
    const shopliteProject: ProjectFrontmatter = {
      ...mockProject,
      title: "ShopLite - Micro Storefront",
      slug: "shoplite",
      links: { demo: "https://shoplite.store" },
    };
    render(<ProjectCard project={shopliteProject} />);
    expect(screen.getByText("shoplite.store")).toBeInTheDocument();
    expect(screen.getByTestId("mockup-shoplite")).toBeInTheDocument();
    expect(screen.getByText("SHOPLITE")).toBeInTheDocument();
    expect(screen.getByText("Cart (2)")).toBeInTheDocument();
    expect(screen.getByText("Mech Key 75%")).toBeInTheDocument();
    expect(screen.getByText("$129")).toBeInTheDocument();
  });
});
