import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserMockup } from "@/components/ui/browser-mockup";

describe("BrowserMockup Component", () => {
  it("renders with default props and default url", () => {
    render(<BrowserMockup>Viewport Content</BrowserMockup>);

    expect(screen.getByTestId("browser-mockup")).toBeInTheDocument();
    expect(screen.getByTestId("browser-header")).toBeInTheDocument();
    expect(screen.getByText("localhost:3000")).toBeInTheDocument();
    expect(screen.getByTestId("browser-lock-icon")).toBeInTheDocument();
    expect(screen.getByText("Viewport Content")).toBeInTheDocument();
  });

  it("renders macOS traffic light window control dots with shrink-0 aspect-square rounded-full", () => {
    render(<BrowserMockup>Content</BrowserMockup>);

    const dotsContainer = screen.getByTestId("browser-dots");
    expect(dotsContainer).toBeInTheDocument();

    const dots = dotsContainer.querySelectorAll("span");
    expect(dots).toHaveLength(3);

    dots.forEach((dot) => {
      expect(dot).toHaveClass("shrink-0");
      expect(dot).toHaveClass("aspect-square");
      expect(dot).toHaveClass("rounded-full");
    });
  });

  it("displays custom url in monospace address bar", () => {
    const customUrl = "https://portfolio.khanh.dev";
    render(<BrowserMockup url={customUrl}>Content</BrowserMockup>);

    expect(screen.getByText(customUrl)).toBeInTheDocument();
  });

  it("renders children inside the viewport container", () => {
    render(
      <BrowserMockup>
        <div data-testid="custom-child">Child Element</div>
      </BrowserMockup>,
    );

    const viewport = screen.getByTestId("browser-viewport");
    expect(viewport).toBeInTheDocument();
    expect(viewport).toHaveClass("aspect-video");
    expect(screen.getByTestId("custom-child")).toBeInTheDocument();
  });

  it("applies custom className and custom viewportClassName", () => {
    render(
      <BrowserMockup
        className="custom-root-class"
        viewportClassName="custom-viewport-class"
      >
        <span>Content</span>
      </BrowserMockup>,
    );

    expect(screen.getByTestId("browser-mockup")).toHaveClass("custom-root-class");
    expect(screen.getByTestId("browser-viewport")).toHaveClass("custom-viewport-class");
  });

  it("forwards ref to root element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<BrowserMockup ref={ref}>Content</BrowserMockup>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("data-testid", "browser-mockup");
  });
});
