import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TableOfContents } from "@/components/projects/table-of-contents";
import { type TocItem } from "@/lib/mdx";

describe("TableOfContents Component", () => {
  const mockToc: TocItem[] = [
    { level: 2, title: "Bối cảnh và bài toán", id: "boi-canh-va-bai-toan" },
    { level: 2, title: "Mục tiêu và ràng buộc", id: "muc-tieu-va-rang-buoc" },
    { level: 3, title: "Ràng buộc hệ thống", id: "rang-buoc-he-thong" },
  ];

  it("renders table of contents list with proper anchor links", () => {
    render(<TableOfContents toc={mockToc} />);
    const links = screen.getAllByRole("link", { name: "Bối cảnh và bài toán" });
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute("href", "#boi-canh-va-bai-toan");
  });

  it("renders null when toc is empty", () => {
    const { container } = render(<TableOfContents toc={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
