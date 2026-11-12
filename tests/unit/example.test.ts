import { describe, it, expect } from "vitest";

describe("Vitest Environment Setup", () => {
  it("executes basic assertions successfully", () => {
    expect(1 + 1).toBe(2);
  });

  it("has access to jsdom window object", () => {
    expect(window).toBeDefined();
    expect(window.matchMedia).toBeDefined();
  });
});
