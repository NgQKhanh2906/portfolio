import { expect, test } from "@playwright/test";

const VALID_ROUTES = [
  "/",
  "/projects",
  "/projects/portfolio",
  "/projects/backend-services",
  "/contact",
];

test.describe("Navigation, Theme Toggle, SkipLink, and 404", () => {
  test("valid routes load with HTTP 200 and zero console/network errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const failedResponses: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });
    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });
    page.on("response", (response) => {
      if (response.status() >= 400) {
        failedResponses.push(`${response.status()} ${response.url()}`);
      }
    });

    for (const route of VALID_ROUTES) {
      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.status(), `Expected 200 for ${route}`).toBe(200);
      await expect(page.locator("#main-content")).toBeVisible();
    }

    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
    expect(failedResponses).toEqual([]);
  });

  test("skip link receives keyboard focus and jumps to main content", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const skipLink = page.locator('a[href="#main-content"]');
    for (let step = 0; step < 3; step += 1) {
      await page.keyboard.press("Tab");
      if (await skipLink.evaluate((el) => el === document.activeElement)) {
        break;
      }
    }
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toContainText("Bỏ qua đến nội dung chính");

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main-content$/);
  });

  test("header and mobile navigation work across viewports", async ({
    page,
  }, testInfo) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const isMobile = testInfo.project.name.includes("mobile");

    if (isMobile) {
      const openMenuButton = page.getByRole("button", { name: "Mở menu" });
      await expect(openMenuButton).toBeVisible();
      await openMenuButton.click();

      const drawer = page.getByRole("dialog", { name: "Menu điều hướng" });
      await expect(drawer).toBeVisible();

      await page.keyboard.press("Escape");
      await expect(drawer).toBeHidden();

      await openMenuButton.click();
      await expect(drawer).toBeVisible();
      await drawer.getByRole("link", { name: "Dự án" }).click();
      await expect(page).toHaveURL(/\/projects$/);
      await expect(drawer).toBeHidden();
    } else {
      const nav = page.locator("header nav");
      await nav.getByRole("link", { name: "Dự án" }).click();
      await expect(page).toHaveURL(/\/projects$/);
      await expect(
        nav.getByRole("link", { name: "Dự án" }),
      ).toHaveAttribute("aria-current", "page");

      await nav.getByRole("link", { name: "Liên hệ" }).click();
      await expect(page).toHaveURL(/\/contact$/);
      await expect(
        nav.getByRole("link", { name: "Liên hệ" }),
      ).toHaveAttribute("aria-current", "page");

      await nav.getByRole("link", { name: "Trang chủ" }).click();
      await expect(page).toHaveURL(/\/$/);
    }
  });

  test("theme toggle switches dark class and persists across reload", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const html = page.locator("html");
    const initialHasDark = await html.evaluate((el) =>
      el.classList.contains("dark"),
    );

    const toggleButton = page.locator(
      'button[aria-label*="Chuyển sang giao diện"]',
    );
    await toggleButton.click();

    const afterClickHasDark = await html.evaluate((el) =>
      el.classList.contains("dark"),
    );
    expect(afterClickHasDark).toBe(!initialHasDark);

    const storedTheme = await page.evaluate(() =>
      window.localStorage.getItem("theme"),
    );
    expect(storedTheme).toBe(afterClickHasDark ? "dark" : "light");

    await page.reload({ waitUntil: "domcontentloaded" });
    const afterReloadHasDark = await html.evaluate((el) =>
      el.classList.contains("dark"),
    );
    expect(afterReloadHasDark).toBe(afterClickHasDark);
  });

  test("unknown route renders custom 404 page", async ({ page }) => {
    const response = await page.goto("/khong-ton-tai-404", {
      waitUntil: "networkidle",
    });
    expect(response?.status()).toBe(404);
    await expect(page.getByText("404 / NOT FOUND")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Không tìm thấy trang" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Về trang chủ" }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
