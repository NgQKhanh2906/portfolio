import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createFormToken, hashIp } from "@/lib/crypto";

const mockHeadersGet = vi.fn<(name: string) => string | null>();

vi.mock("next/headers", () => ({
  headers: () => ({
    get: mockHeadersGet,
  }),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkContactRateLimit: vi.fn(),
}));

vi.mock("@/lib/db/queries/contact", () => ({
  createContactMessage: vi.fn(),
  updateContactEmailStatus: vi.fn(),
}));

vi.mock("@/lib/email", () => ({
  sendContactNotificationEmail: vi.fn(),
}));

import { sendContactMessage } from "@/actions/contact";
import { createContactMessage, updateContactEmailStatus } from "@/lib/db/queries/contact";
import { sendContactNotificationEmail } from "@/lib/email";
import { checkContactRateLimit } from "@/lib/rate-limit";

describe("sendContactMessage Server Action", () => {
  const validBaseInput = {
    name: "Trần Minh Khoa",
    email: "khoa@example.com",
    subject: "project" as const,
    message: "Chào Khánh, mình muốn trao đổi về việc hợp tác xây dựng hệ thống API.",
    website: "",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockHeadersGet.mockImplementation((name: string) => {
      if (name === "x-forwarded-for") return "203.0.113.5, 10.0.0.1";
      return null;
    });
    vi.mocked(checkContactRateLimit).mockResolvedValue({ allowed: true });
    vi.mocked(createContactMessage).mockResolvedValue({ id: "msg-uuid-1" });
    vi.mocked(sendContactNotificationEmail).mockResolvedValue({ ok: true, id: "email-1" });
    vi.mocked(updateContactEmailStatus).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("short-circuits with simulated success when honeypot field is filled", async () => {
    const token = createFormToken(Date.now() - 10_000);
    const result = await sendContactMessage({
      ...validBaseInput,
      website: "https://spam-bot.example",
      token,
    });

    expect(result).toEqual({
      ok: true,
      data: {
        status: "received",
        message:
          "Cảm ơn bạn đã liên hệ! Mình đã nhận được tin nhắn và sẽ phản hồi sớm nhất có thể.",
      },
    });
    expect(checkContactRateLimit).not.toHaveBeenCalled();
    expect(createContactMessage).not.toHaveBeenCalled();
    expect(sendContactNotificationEmail).not.toHaveBeenCalled();
  });

  it("short-circuits with simulated success when submitted too fast (< 3s) or with tampered token", async () => {
    const fastToken = createFormToken(Date.now() - 500);
    const fastResult = await sendContactMessage({
      ...validBaseInput,
      token: fastToken,
    });

    expect(fastResult.ok).toBe(true);
    expect(checkContactRateLimit).not.toHaveBeenCalled();
    expect(createContactMessage).not.toHaveBeenCalled();

    const invalidResult = await sendContactMessage({
      ...validBaseInput,
      token: "1700000000000.tampered",
    });

    expect(invalidResult.ok).toBe(true);
    expect(createContactMessage).not.toHaveBeenCalled();
    expect(sendContactNotificationEmail).not.toHaveBeenCalled();
  });

  it("returns BAD_REQUEST when the form token has expired", async () => {
    const expiredToken = createFormToken(Date.now() - 3_700_000);
    const result = await sendContactMessage({
      ...validBaseInput,
      token: expiredToken,
    });

    expect(result).toEqual({
      ok: false,
      code: "BAD_REQUEST",
      message: "Phiên biểu mẫu đã hết hạn. Vui lòng tải lại trang và thử lại.",
    });
    expect(checkContactRateLimit).not.toHaveBeenCalled();
    expect(createContactMessage).not.toHaveBeenCalled();
  });

  it("returns RATE_LIMITED when IP exceeds the hourly submission limit", async () => {
    vi.mocked(checkContactRateLimit).mockResolvedValue({
      allowed: false,
      retryAfterMinutes: 42,
    });

    const token = createFormToken(Date.now() - 10_000);
    const result = await sendContactMessage({
      ...validBaseInput,
      token,
    });

    expect(result).toEqual({
      ok: false,
      code: "RATE_LIMITED",
      message: "Bạn gửi quá nhanh. Vui lòng thử lại sau 42 phút.",
    });
    expect(checkContactRateLimit).toHaveBeenCalledWith(hashIp("203.0.113.5"));
    expect(createContactMessage).not.toHaveBeenCalled();
    expect(sendContactNotificationEmail).not.toHaveBeenCalled();
  });

  it("returns VALIDATION_ERROR with fieldErrors on invalid input", async () => {
    const token = createFormToken(Date.now() - 10_000);
    const result = await sendContactMessage({
      ...validBaseInput,
      email: "not-valid",
      message: "Quá ngắn",
      token,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("VALIDATION_ERROR");
      expect(result.fieldErrors?.email?.length).toBeGreaterThan(0);
      expect(result.fieldErrors?.message?.length).toBeGreaterThan(0);
    }
    expect(createContactMessage).not.toHaveBeenCalled();
    expect(sendContactNotificationEmail).not.toHaveBeenCalled();
  });

  it("persists hashed IP, sends notification email, and marks email_status as sent on success", async () => {
    const token = createFormToken(Date.now() - 8000);
    const result = await sendContactMessage({
      ...validBaseInput,
      name: "  Trần Minh Khoa  ",
      token,
    });

    expect(result).toEqual({
      ok: true,
      data: {
        status: "received",
        message:
          "Cảm ơn bạn đã liên hệ! Mình đã nhận được tin nhắn và sẽ phản hồi sớm nhất có thể.",
      },
    });

    const expectedIpHash = hashIp("203.0.113.5");
    expect(createContactMessage).toHaveBeenCalledWith({
      name: "Trần Minh Khoa",
      email: "khoa@example.com",
      subject: "project",
      message: validBaseInput.message,
      ipHash: expectedIpHash,
    });
    expect(sendContactNotificationEmail).toHaveBeenCalledWith({
      name: "Trần Minh Khoa",
      email: "khoa@example.com",
      subject: "project",
      message: validBaseInput.message,
    });
    expect(updateContactEmailStatus).toHaveBeenCalledWith("msg-uuid-1", "sent", undefined);
  });

  it("still succeeds for the user and logs failed email_status when email delivery fails", async () => {
    vi.mocked(sendContactNotificationEmail).mockResolvedValue({
      ok: false,
      error: "Resend API responded with status 502",
    });

    const token = createFormToken(Date.now() - 8000);
    const result = await sendContactMessage({
      ...validBaseInput,
      token,
    });

    expect(result.ok).toBe(true);
    expect(updateContactEmailStatus).toHaveBeenCalledWith(
      "msg-uuid-1",
      "failed",
      "Resend API responded with status 502",
    );
  });

  it("still succeeds gracefully when DB returns null in local/demo mode", async () => {
    vi.mocked(createContactMessage).mockResolvedValue(null);
    vi.mocked(sendContactNotificationEmail).mockResolvedValue({
      ok: false,
      skipped: true,
      error: "RESEND_API_KEY is not configured",
    });

    const token = createFormToken(Date.now() - 8000);
    const result = await sendContactMessage({
      ...validBaseInput,
      token,
    });

    expect(result.ok).toBe(true);
    expect(updateContactEmailStatus).not.toHaveBeenCalled();
  });

  it("falls back to x-real-ip and 127.0.0.1 when x-forwarded-for is absent", async () => {
    mockHeadersGet.mockImplementation((name: string) => {
      if (name === "x-real-ip") return "198.51.100.42";
      return null;
    });

    const token = createFormToken(Date.now() - 8000);
    await sendContactMessage({ ...validBaseInput, token });
    expect(checkContactRateLimit).toHaveBeenCalledWith(hashIp("198.51.100.42"));

    mockHeadersGet.mockReturnValue(null);
    await sendContactMessage({ ...validBaseInput, token });
    expect(checkContactRateLimit).toHaveBeenCalledWith(hashIp("127.0.0.1"));
  });

  describe("Rate Limit & Email Helpers (actual implementations)", () => {
    it("enforces max 3 submissions per hour in memory fallback and handles Upstash errors gracefully", async () => {
      const actualRateLimit = await vi.importActual<typeof import("@/lib/rate-limit")>(
        "@/lib/rate-limit",
      );
      actualRateLimit.resetContactRateLimitStore();

      vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://fake-upstash.example");
      vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "fake-token");
      vi.stubGlobal(
        "fetch",
        vi.fn().mockRejectedValue(new Error("Network unreachable")),
      );

      const ipHash = hashIp("192.0.2.55");
      expect((await actualRateLimit.checkContactRateLimit(ipHash)).allowed).toBe(true);
      expect((await actualRateLimit.checkContactRateLimit(ipHash)).allowed).toBe(true);
      expect((await actualRateLimit.checkContactRateLimit(ipHash)).allowed).toBe(true);

      const fourth = await actualRateLimit.checkContactRateLimit(ipHash);
      expect(fourth.allowed).toBe(false);
      expect(fourth.retryAfterMinutes).toBeGreaterThanOrEqual(1);
    });

    it("escapes HTML safely and skips Resend call when RESEND_API_KEY is missing", async () => {
      const actualEmail = await vi.importActual<typeof import("@/lib/email")>(
        "@/lib/email",
      );

      expect(actualEmail.escapeHtml('<script>alert("xss")</script> & \'test\'')).toBe(
        "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; &amp; &#39;test&#39;",
      );

      vi.stubEnv("RESEND_API_KEY", "");
      const skipped = await actualEmail.sendContactNotificationEmail({
        name: "Test User",
        email: "user@example.com",
        subject: "feedback",
        message: "Tin nhắn góp ý kỹ thuật đủ độ dài để kiểm thử hệ thống.",
      });
      expect(skipped).toEqual({
        ok: false,
        skipped: true,
        error: "RESEND_API_KEY is not configured",
      });

      vi.stubEnv("RESEND_API_KEY", "re_test_key");
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: "email_123" }),
      });
      vi.stubGlobal("fetch", mockFetch);

      const sent = await actualEmail.sendContactNotificationEmail({
        name: "Nguyễn <b>Khách</b>",
        email: "guest@example.com",
        subject: "job",
        message: "Mình muốn liên hệ trao đổi về cơ hội thực tập Web Developer.",
      });

      expect(sent).toEqual({ ok: true, id: "email_123" });
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callArgs = mockFetch.mock.calls[0];
      const init = callArgs?.[1] as { body?: string } | undefined;
      expect(init?.body).toContain("reply_to");
      expect(init?.body).toContain("&lt;b&gt;Khách&lt;/b&gt;");
    });
  });
});
