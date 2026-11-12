import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "@/components/ui/card";

describe("Card Component", () => {
  it("renders children correctly", () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });

  it("applies interactive styling when interactive prop is true", () => {
    render(<Card interactive data-testid="interactive-card">Content</Card>);
    const card = screen.getByTestId("interactive-card");
    expect(card).toHaveClass("cursor-pointer");
  });
});
