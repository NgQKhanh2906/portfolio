import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  it("renders with default props and text", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-accent");
  });

  it("renders all variants correctly", () => {
    const { rerender } = render(<Button variant="primary">Action</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-accent");

    rerender(<Button variant="secondary">Action</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-surface-2");

    rerender(<Button variant="ghost">Action</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-transparent");

    rerender(<Button variant="danger">Action</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-status-danger");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disables interaction when loading is true", () => {
    const handleClick = vi.fn();
    render(<Button loading onClick={handleClick}>Loading Action</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("disables interaction when disabled is true", () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled Action</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
