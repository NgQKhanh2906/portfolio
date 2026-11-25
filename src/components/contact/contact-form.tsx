"use client";

import React, { useState } from "react";
import { AlertCircle, CheckCircle2, RefreshCw, Send } from "lucide-react";
import { sendContactMessage } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";
import {
  CONTACT_SUBJECTS,
  CONTACT_SUBJECT_LABELS,
  contactFieldsSchema,
  type ContactSubject,
} from "@/lib/validations/contact";
import type { ErrorCode } from "@/types/action";

export interface ContactFormProps {
  formToken: string;
}

type FieldName = "name" | "email" | "subject" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

const inputBaseClass =
  "w-full rounded-lg border border-border bg-surface-2/60 px-3.5 py-2.5 text-sm text-text placeholder:text-subtle transition-colors min-h-[44px] focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60";

export function ContactForm({ formToken }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<ContactSubject>("job");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const trimmedMessageLength = message.trim().length;

  function validateSingleField(field: FieldName, value: string): string | undefined {
    const schemaMap = {
      name: contactFieldsSchema.shape.name,
      email: contactFieldsSchema.shape.email,
      subject: contactFieldsSchema.shape.subject,
      message: contactFieldsSchema.shape.message,
    };

    const parsed = schemaMap[field].safeParse(value);
    if (parsed.success) {
      return undefined;
    }

    return parsed.error.issues[0]?.message;
  }

  function handleFieldBlur(field: FieldName, value: string) {
    const error = validateSingleField(field, value);
    setFieldErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  }

  function handleFieldChange(field: FieldName, value: string) {
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "subject") setSubject(value as ContactSubject);
    if (field === "message") setMessage(value);

    if (fieldErrors[field]) {
      const error = validateSingleField(field, value);
      setFieldErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }

    if (generalError) {
      setGeneralError(null);
      setErrorCode(null);
    }
  }

  function handleResetAfterSuccess() {
    setSuccessMessage(null);
    setFieldErrors({});
    setGeneralError(null);
    setErrorCode(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGeneralError(null);
    setErrorCode(null);

    const clientParsed = contactFieldsSchema.safeParse({
      name,
      email,
      subject,
      message,
    });

    if (!clientParsed.success) {
      const flattened = clientParsed.error.flatten().fieldErrors;
      setFieldErrors({
        name: flattened.name?.[0],
        email: flattened.email?.[0],
        subject: flattened.subject?.[0],
        message: flattened.message?.[0],
      });
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const result = await sendContactMessage({
        name,
        email,
        subject,
        message,
        website,
        token: formToken,
      });

      if (!result.ok) {
        setErrorCode(result.code);
        setGeneralError(result.message);

        if (result.fieldErrors) {
          setFieldErrors({
            name: result.fieldErrors.name?.[0],
            email: result.fieldErrors.email?.[0],
            subject: result.fieldErrors.subject?.[0],
            message: result.fieldErrors.message?.[0],
          });
        }
        return;
      }

      setName("");
      setEmail("");
      setSubject("job");
      setMessage("");
      setWebsite("");
      setFieldErrors({});
      setSuccessMessage(result.data.message);
    } catch {
      setErrorCode("INTERNAL_ERROR");
      setGeneralError(
        `Không thể kết nối tới máy chủ. Vui lòng thử lại hoặc gửi email trực tiếp đến ${siteConfig.email}.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="p-6 sm:p-8 flex flex-col justify-between">
      <div>
        <div className="mb-6 flex items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
              01 / MESSAGE_FORM
            </p>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-text">
              Gửi tin nhắn trực tiếp
            </h2>
          </div>
          <span className="hidden sm:inline-flex items-center rounded-sm border border-border bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-muted">
            Phản hồi &lt; 48h
          </span>
        </div>

        {successMessage ? (
          <div
            role="status"
            aria-live="polite"
            className="rounded-xl border border-status-success/30 bg-status-success-soft p-6 text-text"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2
                className="h-6 w-6 shrink-0 text-status-success mt-0.5"
                aria-hidden="true"
              />
              <div className="space-y-3">
                <div>
                  <h3 className="text-base font-bold text-text">
                    Đã tiếp nhận tin nhắn
                  </h3>
                  <p className="mt-1 text-sm text-muted leading-relaxed">
                    {successMessage}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={handleResetAfterSuccess}
                  iconLeft={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
                >
                  Gửi tin nhắn khác
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {generalError && (
              <div
                role="alert"
                className="rounded-lg border border-status-danger/40 bg-status-danger-soft px-4 py-3 text-sm text-status-danger"
              >
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1.5">
                    <p className="font-medium leading-relaxed">{generalError}</p>
                    {(errorCode === "RATE_LIMITED" || errorCode === "INTERNAL_ERROR") && (
                      <p className="text-xs text-muted">
                        Bạn có thể gửi email trực tiếp tới{" "}
                        <a
                          href={`mailto:${siteConfig.email}`}
                          className="font-mono underline text-text hover:text-accent"
                        >
                          {siteConfig.email}
                        </a>
                        .
                      </p>
                    )}
                    {errorCode === "BAD_REQUEST" && (
                      <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="inline-flex min-h-[32px] items-center gap-1.5 text-xs font-mono font-semibold underline text-text hover:text-accent"
                      >
                        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                        Tải lại trang để lấy phiên mới
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-1.5 block text-sm font-medium text-text"
                >
                  Họ và tên <span className="text-status-danger" aria-hidden="true">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  maxLength={80}
                  autoComplete="name"
                  placeholder="Nguyễn Văn A"
                  value={name}
                  disabled={isSubmitting}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  onBlur={(e) => handleFieldBlur("name", e.target.value)}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
                  className={cn(
                    inputBaseClass,
                    fieldErrors.name && "border-status-danger focus:border-status-danger",
                  )}
                />
                {fieldErrors.name && (
                  <p
                    id="contact-name-error"
                    role="alert"
                    className="mt-1.5 text-xs text-status-danger"
                  >
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-1.5 block text-sm font-medium text-text"
                >
                  Địa chỉ email <span className="text-status-danger" aria-hidden="true">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  placeholder="ban@congty.com"
                  value={email}
                  disabled={isSubmitting}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  onBlur={(e) => handleFieldBlur("email", e.target.value)}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
                  className={cn(
                    inputBaseClass,
                    fieldErrors.email && "border-status-danger focus:border-status-danger",
                  )}
                />
                {fieldErrors.email && (
                  <p
                    id="contact-email-error"
                    role="alert"
                    className="mt-1.5 text-xs text-status-danger"
                  >
                    {fieldErrors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-subject"
                className="mb-1.5 block text-sm font-medium text-text"
              >
                Chủ đề <span className="text-status-danger" aria-hidden="true">*</span>
              </label>
              <select
                id="contact-subject"
                name="subject"
                value={subject}
                disabled={isSubmitting}
                onChange={(e) => handleFieldChange("subject", e.target.value)}
                onBlur={(e) => handleFieldBlur("subject", e.target.value)}
                aria-invalid={Boolean(fieldErrors.subject)}
                aria-describedby={fieldErrors.subject ? "contact-subject-error" : undefined}
                className={cn(
                  inputBaseClass,
                  fieldErrors.subject && "border-status-danger focus:border-status-danger",
                )}
              >
                {CONTACT_SUBJECTS.map((item) => (
                  <option key={item} value={item} className="bg-surface text-text">
                    {CONTACT_SUBJECT_LABELS[item]}
                  </option>
                ))}
              </select>
              {fieldErrors.subject && (
                <p
                  id="contact-subject-error"
                  role="alert"
                  className="mt-1.5 text-xs text-status-danger"
                >
                  {fieldErrors.subject}
                </p>
              )}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-medium text-text"
                >
                  Nội dung tin nhắn{" "}
                  <span className="text-status-danger" aria-hidden="true">*</span>
                </label>
                <span
                  id="contact-message-counter"
                  className={cn(
                    "font-mono text-xs",
                    trimmedMessageLength > 1900 ? "text-status-warning" : "text-muted",
                  )}
                >
                  {trimmedMessageLength}/2000 ký tự
                </span>
              </div>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                maxLength={2000}
                placeholder="Chia sẻ ngắn gọn về vị trí thực tập, dự án hợp tác hoặc vấn đề kỹ thuật bạn muốn trao đổi (tối thiểu 20 ký tự)..."
                value={message}
                disabled={isSubmitting}
                onChange={(e) => handleFieldChange("message", e.target.value)}
                onBlur={(e) => handleFieldBlur("message", e.target.value)}
                aria-invalid={Boolean(fieldErrors.message)}
                aria-describedby={
                  fieldErrors.message
                    ? "contact-message-error contact-message-counter"
                    : "contact-message-counter"
                }
                className={cn(
                  inputBaseClass,
                  "min-h-[132px] resize-y leading-relaxed",
                  fieldErrors.message && "border-status-danger focus:border-status-danger",
                )}
              />
              {fieldErrors.message ? (
                <p
                  id="contact-message-error"
                  role="alert"
                  className="mt-1.5 text-xs text-status-danger"
                >
                  {fieldErrors.message}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-muted">
                  Tối thiểu 20 ký tự để đảm bảo đầy đủ ngữ cảnh trao đổi.
                </p>
              )}
            </div>

            {/* Honeypot field: visually hidden offscreen for human users */}
            <div
              className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
              aria-hidden="true"
            >
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <input type="hidden" name="token" value={formToken} />

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-border">
              <p className="text-xs text-muted font-mono">
                Bảo vệ chống spam bằng Honeypot &amp; HMAC.
              </p>
              <Button
                type="submit"
                size="lg"
                loading={isSubmitting}
                iconLeft={<Send className="h-4 w-4" aria-hidden="true" />}
                className="w-full sm:w-auto min-h-[44px]"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Card>
  );
}
