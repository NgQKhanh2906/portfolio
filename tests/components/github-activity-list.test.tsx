import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GitHubActivityList } from "@/components/telemetry/github-activity-list";

describe("GitHubActivityList Component", () => {
  it("renders empty state message when events list is empty", () => {
    render(<GitHubActivityList events={[]} />);
    expect(
      screen.getByText("Không có hoạt động commit nào gần đây."),
    ).toBeInTheDocument();
  });

  it("renders list of git events properly", () => {
    const mockEvents = [
      {
        id: "ev-1",
        type: "PushEvent",
        repoName: "portfolio",
        message: "feat: add telemetry",
        createdAt: "2026-11-12T10:00:00Z",
        url: "https://github.com/example/portfolio",
      },
    ];

    render(<GitHubActivityList events={mockEvents} />);
    expect(screen.getByText("portfolio")).toBeInTheDocument();
    expect(screen.getByText("feat: add telemetry")).toBeInTheDocument();
  });
});
