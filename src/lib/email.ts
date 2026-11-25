import "server-only";
import { siteConfig } from "@/data/site-config";
import { CONTACT_SUBJECT_LABELS, type ContactSubject } from "@/lib/validations/contact";

export type ContactEmailPayload = {
  name: string;
  email: string;
  subject: ContactSubject;
  message: string;
};

export type SendEmailResult =
  | { ok: true; id?: string }
  | { ok: false; skipped?: boolean; error: string };

/**
 * Escapes HTML special characters to prevent injection inside email templates.
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sends a notification email through the Resend REST API when configured.
 * Never throws; returns a structured failure/skipped result on errors.
 */
export async function sendContactNotificationEmail(
  payload: ContactEmailPayload,
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      skipped: true,
      error: "RESEND_API_KEY is not configured",
    };
  }

  const from =
    process.env.RESEND_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";
  const to = process.env.NOTIFICATION_EMAIL || siteConfig.email;
  const subjectLabel = CONTACT_SUBJECT_LABELS[payload.subject];
  const safeNameForHeader = payload.name.replace(/[\r\n]+/g, " ").trim();
  const emailSubject = `[Portfolio Contact] ${subjectLabel}: ${safeNameForHeader}`;

  const textBody = [
    "Bạn vừa nhận được một tin nhắn liên hệ mới từ Portfolio.",
    "",
    `Người gửi: ${payload.name}`,
    `Email: ${payload.email}`,
    `Chủ đề: ${subjectLabel}`,
    "",
    "Nội dung tin nhắn:",
    "----------------------------------------",
    payload.message,
    "----------------------------------------",
  ].join("\n");

  const htmlBody = [
    '<div style="font-family:sans-serif;line-height:1.6;color:#111827;">',
    "<h2>Tin nhắn liên hệ mới từ Portfolio</h2>",
    `<p><strong>Người gửi:</strong> ${escapeHtml(payload.name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>`,
    `<p><strong>Chủ đề:</strong> ${escapeHtml(subjectLabel)}</p>`,
    "<hr />",
    `<pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(payload.message)}</pre>`,
    "</div>",
  ].join("");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: payload.email,
        subject: emailSubject,
        text: textBody,
        html: htmlBody,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Resend API responded with status ${res.status}${errorText ? `: ${errorText}` : ""}`,
      };
    }

    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return {
      ok: true,
      id: data.id,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown email sending error",
    };
  }
}
