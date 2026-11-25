import { expect, test } from "@playwright/test";

const REQUIRED_SECTIONS = [
  "Bối cảnh và bài toán",
  "Mục tiêu và ràng buộc",
  "Kiến trúc giải pháp",
  "Quyết định kỹ thuật và trade-off",
  "Thách thức và cách giải quyết",
  "Kết quả và bài học",
];

test.describe("Projects Filter and Case Study Detail", () => {
  test("filters projects with AND logic, syncs URL query params, and clears filters", async ({
    page,
  }) => {
    await page.goto("/projects", { waitUntil: "networkidle" });

    await expect(page.getByText(/Hiển thị\s*2\s*\/\s*2 dự án/)).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Portfolio Web Application" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Hệ thống Quản lý Bán hàng & Dịch vụ Backend",
      }),
    ).toBeVisible();

    const nextChip = page.getByRole("button", { name: "Next.js", exact: true });
    await nextChip.click();

    await expect(nextChip).toHaveAttribute("aria-pressed", "true");
    await expect(page).toHaveURL(/\/projects\?tech=nextjs/);
    await expect(page.getByText(/Hiển thị\s*1\s*\/\s*2 dự án/)).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Portfolio Web Application" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Hệ thống Quản lý Bán hàng & Dịch vụ Backend",
      }),
    ).toBeHidden();

    // Selecting Java as well results in 0 matches (AND logic)
    const javaChip = page.getByRole("button", { name: "Java", exact: true });
    await javaChip.click();

    await expect(page).toHaveURL(/tech=nextjs(%2C|,)java/);
    await expect(
      page.getByRole("heading", { name: "Không tìm thấy dự án phù hợp" }),
    ).toBeVisible();

    const clearButton = page.getByRole("button", { name: "Xóa bộ lọc" });
    await clearButton.click();

    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByText(/Hiển thị\s*2\s*\/\s*2 dự án/)).toBeVisible();
  });

  test("hydrates active filter chips from URL and renders Case Study TOC and sections", async ({
    page,
  }, testInfo) => {
    await page.goto("/projects?tech=java,docker", { waitUntil: "networkidle" });

    await expect(
      page.getByRole("button", { name: "Java", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByRole("button", { name: "Docker", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText(/Hiển thị\s*1\s*\/\s*2 dự án/)).toBeVisible();

    // Navigate to portfolio Case Study
    await page.goto("/projects/portfolio", { waitUntil: "networkidle" });
    await expect(
      page.getByRole("heading", { name: "Portfolio Web Application", level: 1 }),
    ).toBeVisible();

    for (const heading of REQUIRED_SECTIONS) {
      await expect(
        page.getByRole("heading", { name: heading, level: 2 }),
      ).toBeVisible();
    }

    const isMobile = testInfo.project.name.includes("mobile");
    if (isMobile) {
      const mobileTocToggle = page.getByRole("button", {
        name: /Mục lục bài viết/,
      });
      await expect(mobileTocToggle).toBeVisible();
      await mobileTocToggle.click();
      await expect(
        page.getByRole("link", { name: "Kiến trúc giải pháp" }).first(),
      ).toBeVisible();
    } else {
      const desktopToc = page.getByRole("navigation", {
        name: "Mục lục bài viết",
      });
      await expect(desktopToc).toBeVisible();
      await expect(
        desktopToc.getByRole("link", { name: "Kiến trúc giải pháp" }),
      ).toBeVisible();
    }
  });
});
