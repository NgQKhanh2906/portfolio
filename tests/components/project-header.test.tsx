import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ProjectHeader } from "@/components/projects/project-header";
import { type ProjectFrontmatter } from "@/lib/validations/project-frontmatter";

describe("ProjectHeader Component", () => {
  beforeEach(() => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ views: 50 }),
    } as Response);
  });

  const sampleProject: ProjectFrontmatter = {
    title: "TaskFlow Project",
    slug: "taskflow",
    summary: "A collaborative Kanban board web app.",
    coverImage: "/images/taskflow.png",
    year: 2025,
    role: "Lead Frontend",
    teamSize: "3 người",
    period: "3 tháng",
    tech: ["react", "typescript", "tailwind"],
    featured: false,
    published: true,
    order: 2,
    links: {
      demo: "https://demo.example.com",
      source: "https://github.com/example/taskflow",
    },
  };

  it("renders all header meta info properly", async () => {
    render(<ProjectHeader project={sampleProject} />);
    expect(screen.getByText("TaskFlow Project")).toBeInTheDocument();
    expect(screen.getByText("A collaborative Kanban board web app.")).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(screen.getByText("Lead Frontend")).toBeInTheDocument();
    expect(screen.getByText("3 người")).toBeInTheDocument();
    expect(screen.getByText("3 tháng")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/50 lượt xem/i)).toBeInTheDocument();
    });
  });

  it("renders demo and source action buttons", async () => {
    render(<ProjectHeader project={sampleProject} />);
    expect(screen.getByRole("link", { name: /mã nguồn/i })).toHaveAttribute(
      "href",
      "https://github.com/example/taskflow",
    );
    expect(screen.getByRole("link", { name: /trải nghiệm/i })).toHaveAttribute(
      "href",
      "https://demo.example.com",
    );

    await waitFor(() => {
      expect(screen.getByText(/50 lượt xem/i)).toBeInTheDocument();
    });
  });
});
