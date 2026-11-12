import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectFilter } from "@/components/projects/project-filter";

describe("ProjectFilter Component", () => {
  const availableTechs = ["nextjs", "react", "typescript", "postgresql"];

  it("renders all available tech badges and project count", () => {
    render(
      <ProjectFilter
        availableTechs={availableTechs}
        selectedTechs={[]}
        onToggleTech={vi.fn()}
        onClear={vi.fn()}
        totalCount={10}
        filteredCount={10}
      />,
    );

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("triggers onToggleTech when clicking a technology chip", () => {
    const handleToggle = vi.fn();
    render(
      <ProjectFilter
        availableTechs={availableTechs}
        selectedTechs={[]}
        onToggleTech={handleToggle}
        onClear={vi.fn()}
        totalCount={5}
        filteredCount={5}
      />,
    );

    const reactBtn = screen.getByRole("button", { name: "React" });
    fireEvent.click(reactBtn);
    expect(handleToggle).toHaveBeenCalledWith("react");
  });

  it("displays clear filter button when filters are active and calls onClear", () => {
    const handleClear = vi.fn();
    render(
      <ProjectFilter
        availableTechs={availableTechs}
        selectedTechs={["react", "nextjs"]}
        onToggleTech={vi.fn()}
        onClear={handleClear}
        totalCount={5}
        filteredCount={2}
      />,
    );

    const clearBtn = screen.getByRole("button", { name: /xóa bộ lọc/i });
    expect(clearBtn).toBeInTheDocument();
    fireEvent.click(clearBtn);
    expect(handleClear).toHaveBeenCalledTimes(1);
  });
});
