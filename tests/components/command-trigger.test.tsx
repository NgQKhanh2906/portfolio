import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CommandTrigger } from "@/components/command-palette/command-trigger";

describe("CommandTrigger Component", () => {
  it("renders trigger button with correct accessibility label", () => {
    const handleClick = vi.fn();
    render(<CommandTrigger onClick={handleClick} />);
    const button = screen.getByRole("button", {
      name: /mở bảng lệnh \(ctrl\+k\)/i,
    });
    expect(button).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<CommandTrigger onClick={handleClick} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
