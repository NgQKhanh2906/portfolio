import { expect, test } from "@playwright/test";

test.describe("Contact Form Validation and Anti-bot Flow", () => {
  test("shows Vietnamese validation errors on empty submission and succeeds after anti-bot delay", async ({
    page,
  }) => {
    const pageLoadStart = Date.now();
    await page.goto("/contact", { waitUntil: "networkidle" });

    const submitButton = page.getByRole("button", { name: "Gửi tin nhắn" });
    await expect(submitButton).toBeVisible();

    // 1. Submit empty form to trigger client-side Vietnamese validation
    await submitButton.click();
    await expect(page.locator("#contact-name-error")).toContainText(
      "Họ và tên phải có tối thiểu 2 ký tự.",
    );
    await expect(page.locator("#contact-email-error")).toContainText(
      "Vui lòng nhập địa chỉ email.",
    );
    await expect(page.locator("#contact-message-error")).toContainText(
      "Nội dung tin nhắn phải có độ dài tối thiểu 20 ký tự.",
    );

    // 2. Fill valid fields
    await page.locator("#contact-name").fill("Nguyễn Văn Kiểm Thử");
    await page.locator("#contact-email").fill("qa.tester@example.com");
    await page.locator("#contact-subject").selectOption("project");
    await page
      .locator("#contact-message")
      .fill(
        "Xin chào, mình muốn trao đổi về cơ hội hợp tác phát triển dự án Backend và Web.",
      );

    // 3. Respect server-side HMAC minimum elapsed time (3000ms)
    const elapsed = Date.now() - pageLoadStart;
    if (elapsed < 3300) {
      await page.waitForTimeout(3300 - elapsed);
    }

    await submitButton.click();

    const statusBanner = page.getByRole("status");
    await expect(statusBanner).toBeVisible({ timeout: 10_000 });
    await expect(statusBanner).toContainText("Đã tiếp nhận tin nhắn");

    // 4. Verify reset button brings back the form
    await page.getByRole("button", { name: "Gửi tin nhắn khác" }).click();
    await expect(page.locator("#contact-name")).toBeVisible();
  });
});
