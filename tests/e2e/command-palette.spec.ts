import { expect, test } from "@playwright/test";

test.describe("Command Palette (Ctrl+K)", () => {
  test("opens with Ctrl+K, filters Vietnamese commands, switches theme, and navigates", async ({
    page,
  }, testInfo) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Open via Ctrl+K (wait for lazy-loaded CommandPalette chunk)
    await page.keyboard.press("Control+k");
    const input = page.locator('input[placeholder*="Gõ lệnh hoặc tìm kiếm"]');
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();

    // Filter for dark mode command
    await input.fill("toi");
    const darkModeItem = page.getByText("Giao diện tối (Dark Mode)");
    await expect(darkModeItem).toBeVisible();
    await page.keyboard.press("Enter");

    await expect(input).toBeHidden();
    const isDark = await page
      .locator("html")
      .evaluate((el) => el.classList.contains("dark"));
    expect(isDark).toBe(true);

    // On desktop, also verify clicking the CommandTrigger button opens the palette
    if (!testInfo.project.name.includes("mobile")) {
      const trigger = page.getByRole("button", {
        name: "Mở bảng lệnh (Ctrl+K)",
      });
      await expect(trigger).toBeVisible();
      await trigger.click();
    } else {
      await page.keyboard.press("Control+k");
    }

    await expect(input).toBeVisible();
    await input.fill("du an");
    const projectsItem = page.getByText("Xem Dự án");
    await expect(projectsItem).toBeVisible();
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/\/projects$/);
    await expect(input).toBeHidden();
  });

  test("closes cleanly on Escape", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    await page.keyboard.press("Control+k");
    const input = page.locator('input[placeholder*="Gõ lệnh hoặc tìm kiếm"]');
    await expect(input).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(input).toBeHidden();
  });
});
