import { describe, it, expect } from "vitest";
import {
  parseFrontmatter,
  extractTableOfContents,
  validateCaseStudySections,
  slugify,
  getProjectBySlug,
  getAllProjects,
} from "@/lib/mdx";

describe("MDX Processor & Case Study Utilities", () => {
  it("slugifies Vietnamese text properly into clean URL anchors", () => {
    expect(slugify("Bối cảnh và bài toán")).toBe("boi-canh-va-bai-toan");
    expect(slugify("Kiến trúc giải pháp (System Architecture)")).toBe(
      "kien-truc-giai-phap-system-architecture",
    );
  });

  it("parses YAML frontmatter and content accurately", () => {
    const raw = `---
title: "Sample Project"
order: 5
published: true
tech:
  - react
  - typescript
---

## Bối cảnh và bài toán
Nội dung bài toán ở đây.
`;

    const { rawFrontmatter, content } = parseFrontmatter(raw);
    expect(rawFrontmatter.title).toBe("Sample Project");
    expect(rawFrontmatter.order).toBe(5);
    expect(rawFrontmatter.published).toBe(true);
    expect(rawFrontmatter.tech).toEqual(["react", "typescript"]);
    expect(content).toContain("## Bối cảnh và bài toán");
  });

  it("extracts Table of Contents from headings", () => {
    const markdown = `
# Tiêu đề chính
## Bối cảnh và bài toán
Đoạn văn.
### Chi tiết bài toán
Nội dung.
## Mục tiêu và ràng buộc
`;

    const toc = extractTableOfContents(markdown);
    expect(toc).toHaveLength(3);
    expect(toc[0]).toEqual({
      level: 2,
      title: "Bối cảnh và bài toán",
      id: "boi-canh-va-bai-toan",
    });
    expect(toc[1]).toEqual({
      level: 3,
      title: "Chi tiết bài toán",
      id: "chi-tiet-bai-toan",
    });
  });

  it("validates mandatory case study sections and catches missing ones", () => {
    const validContent = `
## Bối cảnh và bài toán
...
## Mục tiêu và ràng buộc
...
## Kiến trúc giải pháp
...
## Quyết định kỹ thuật và trade-off
...
## Thách thức và cách giải quyết
...
## Kết quả và bài học
...
`;
    const validResult = validateCaseStudySections(validContent);
    expect(validResult.isValid).toBe(true);
    expect(validResult.missingSections).toHaveLength(0);

    const incompleteContent = `
## Bối cảnh và bài toán
## Kết quả và bài học
`;
    const incompleteResult = validateCaseStudySections(incompleteContent);
    expect(incompleteResult.isValid).toBe(false);
    expect(incompleteResult.missingSections.length).toBeGreaterThan(0);
  });

  it("loads and parses existing projects in content/projects/", async () => {
    const portfolioProject = await getProjectBySlug("portfolio");
    expect(portfolioProject).not.toBeNull();
    expect(portfolioProject?.frontmatter.title).toBe("Portfolio Web Application");
    expect(portfolioProject?.toc.length).toBeGreaterThanOrEqual(6);

    const allProjects = await getAllProjects();
    expect(allProjects.length).toBeGreaterThanOrEqual(3);
  });
});
