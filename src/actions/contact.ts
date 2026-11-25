"use server";

import { headers } from "next/headers";
import { hashIp, verifyFormToken } from "@/lib/crypto";
import { createContactMessage, updateContactEmailStatus } from "@/lib/db/queries/contact";
import { sendContactNotificationEmail } from "@/lib/email";
import { checkContactRateLimit } from "@/lib/rate-limit";
import { contactSchema, type SendContactInput } from "@/lib/validations/contact";
import type { ActionResult } from "@/types/action";

export type ContactSuccessPayload = {
  status: "received";
  message: string;
};

const CONTACT_SUCCESS_DATA: ContactSuccessPayload = {
  status: "received",
  message:
    "Cảm ơn bạn đã liên hệ! Mình đã nhận được tin nhắn và sẽ phản hồi sớm nhất có thể.",
};

/**
 * Processes a public contact form submission with multi-layer anti-bot defense,
 * IP-based sliding-window rate limiting, Zod validation, DB persistence, and Resend email.
 */
export async function sendContactMessage(
  input: SendContactInput,
): Promise<ActionResult<ContactSuccessPayload>> {
  if (!input || typeof input !== "object") {
    return {
      ok: false,
      code: "BAD_REQUEST",
      message: "Yêu cầu không hợp lệ.",
    };
  }

  // 1. Honeypot check: silently succeed without storing or emailing when filled.
  if (typeof input.website === "string" && input.website.trim().length > 0) {
    return {
      ok: true,
      data: CONTACT_SUCCESS_DATA,
    };
  }

  // 2. Verify signed render timestamp token (anti-bot timing & tampering defense).
  const token = typeof input.token === "string" ? input.token : "";
  const tokenResult = verifyFormToken(token);
  if (!tokenResult.valid) {
    if (tokenResult.reason === "expired") {
      return {
        ok: false,
        code: "BAD_REQUEST",
        message: "Phiên biểu mẫu đã hết hạn. Vui lòng tải lại trang và thử lại.",
      };
    }

    return {
      ok: true,
      data: CONTACT_SUCCESS_DATA,
    };
  }

  // 3. Extract client IP and hash with SHA-256 + salt.
  const headerList = headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  const realIp = headerList.get("x-real-ip");
  const clientIp =
    forwardedFor?.split(",")[0]?.trim() || realIp?.trim() || "127.0.0.1";
  const ipHash = hashIp(clientIp);

  // 4. Rate limit check (max 3 submissions / 3600s per IP hash).
  const rateLimit = await checkContactRateLimit(ipHash);
  if (!rateLimit.allowed) {
    const retryAfterMinutes = rateLimit.retryAfterMinutes ?? 60;
    return {
      ok: false,
      code: "RATE_LIMITED",
      message: `Bạn gửi quá nhanh. Vui lòng thử lại sau ${retryAfterMinutes} phút.`,
    };
  }

  // 5. Server-side Zod schema validation.
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const flattened = parsed.error.flatten().fieldErrors;
    const fieldErrors: Record<string, string[]> = {};

    for (const [field, messages] of Object.entries(flattened)) {
      if (messages && messages.length > 0) {
        fieldErrors[field] = messages;
      }
    }

    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Dữ liệu nhập vào không hợp lệ.",
      fieldErrors,
    };
  }

  // 6. Persist message in PostgreSQL (pending) and notify via Resend.
  const { name, email, subject, message } = parsed.data;
  const created = await createContactMessage({
    name,
    email,
    subject,
    message,
    ipHash,
  });

  let emailOk = false;
  let emailError: string | undefined;

  try {
    const emailResult = await sendContactNotificationEmail({
      name,
      email,
      subject,
      message,
    });
    emailOk = emailResult.ok;
    if (!emailResult.ok) {
      emailError = emailResult.error;
    }
  } catch (error) {
    emailOk = false;
    emailError = error instanceof Error ? error.message : "Unknown email error";
  }

  if (created) {
    await updateContactEmailStatus(
      created.id,
      emailOk ? "sent" : "failed",
      emailOk ? undefined : emailError,
    );
  }

  // 7. Always return success once persisted/handled so transient email issues never break UX.
  return {
    ok: true,
    data: CONTACT_SUCCESS_DATA,
  };
}
