import { describe, it, expect } from "vitest";
import { hashIp, incrementProjectViews, getProjectViews } from "@/lib/redis";

describe("Redis View Counter Lib", () => {
  it("generates consistent sha256 hash for identical IPs", () => {
    const hash1 = hashIp("192.168.1.1");
    const hash2 = hashIp("192.168.1.1");
    const hash3 = hashIp("10.0.0.1");

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
    expect(hash1).toMatch(/^[a-f0-9]{64}$/);
  });

  it("increments views on first visit and deduplicates subsequent views from same IP", async () => {
    const slug = "test-project-demo";
    const ip = "127.0.0.99";

    const initial = await incrementProjectViews(slug, ip);
    expect(initial).toBeGreaterThanOrEqual(42);

    // Call again with same IP -> should deduplicate and return same count
    const second = await incrementProjectViews(slug, ip);
    expect(second).toBe(initial);

    // Read views via getProjectViews
    const current = await getProjectViews(slug);
    expect(current).toBe(initial);
  });
});
