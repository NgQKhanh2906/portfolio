import { describe, it, expect } from "vitest";
import { getGitHubTelemetry } from "@/lib/github";

describe("GitHub Telemetry Lib", () => {
  it("returns fallback telemetry data when GITHUB_TOKEN is not configured", async () => {
    const data = await getGitHubTelemetry();
    expect(data).toBeDefined();
    expect(data.username).toBeDefined();
    expect(data.totalContributions).toBeGreaterThan(0);
    expect(data.recentEvents.length).toBeGreaterThan(0);
    expect(data.isFallback).toBe(true);
  });
});
