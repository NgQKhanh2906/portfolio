import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ViewCounter } from "@/components/projects/view-counter";

describe("ViewCounter Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches and renders view count with vi-VN formatting", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ views: 1250 }),
    } as Response);

    render(<ViewCounter slug="portfolio" />);

    await waitFor(() => {
      expect(screen.getByText(/1\.250 lượt xem/i)).toBeInTheDocument();
    });
  });

  it("gracefully hides component when fetch returns null (degradation mode)", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ views: null }),
    } as Response);

    const { container } = render(<ViewCounter slug="offline-project" />);

    await waitFor(() => {
      expect(container).toBeEmptyDOMElement();
    });
  });
});
