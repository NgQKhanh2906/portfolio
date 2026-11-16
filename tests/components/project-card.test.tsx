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

  it("renders backend API architecture preview for backend-services project", () => {
    const backendProject: ProjectFrontmatter = {
      ...mockProject,
      title: "Hệ thống Quản lý Bán hàng & Dịch vụ Backend",
      slug: "backend-services",
      links: { source: "https://github.com/NgQKhanh2906/backend-services" },
    };
    render(<ProjectCard project={backendProject} />);
    expect(screen.getByText("api.nqkhanh.dev")).toBeInTheDocument();
    expect(screen.getByTestId("mockup-backend-services")).toBeInTheDocument();
    expect(screen.getByText("Spring Boot REST API")).toBeInTheDocument();
    expect(screen.getByText("POST /api/v1/orders")).toBeInTheDocument();
    expect(screen.getByText("ACID Transaction")).toBeInTheDocument();
  });
});
