import { describe, it, expect } from "vitest";
import { projectFrontmatterSchema } from "@/lib/validations/project-frontmatter";

describe("Project Frontmatter Validation Schema", () => {
  const validData = {
    title: "Dự án Portfolio",
    slug: "portfolio",
    summary: "Dự án cá nhân giới thiệu năng lực lập trình web full-stack.",
    coverImage: "/images/projects/portfolio-cover.png",
    year: 2026,
    role: "Full-stack Developer",
    teamSize: "1 người",
    period: "10/2026 - 11/2026",
    tech: ["nextjs", "react", "typescript", "postgresql"],
    featured: true,
    published: true,
    order: 1,
    links: {
      demo: "https://example.com",
      source: "https://github.com/example/repo",
    },
  };

  it("validates valid frontmatter successfully", () => {
    const result = projectFrontmatterSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails when required fields are missing", () => {
    const invalidData = { ...validData, title: "" };
    const result = projectFrontmatterSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails when slug format contains spaces or uppercase letters", () => {
    const invalidData = { ...validData, slug: "Invalid Slug With Spaces" };
    const result = projectFrontmatterSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails when tech array contains invalid slugs not in TECH_REGISTRY", () => {
    const invalidData = { ...validData, tech: ["nextjs", "unknown-technology-xyz"] };
    const result = projectFrontmatterSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("TECH_REGISTRY");
    }
  });

  it("fails when summary is too short", () => {
    const invalidData = { ...validData, summary: "Ngắn" };
    const result = projectFrontmatterSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
