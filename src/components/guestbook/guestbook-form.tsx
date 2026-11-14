"use client";

import React, { useState, useCallback } from "react";
import { CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { cn } from "@/lib/utils";

export interface GuestbookFormProps {
  onSubmit: (content: string) => Promise<boolean | void>;
  isSubmitting?: boolean;
  className?: string;
}

const MAX_CHAR_COUNT = 280;

export function GuestbookForm({
  onSubmit,
  isSubmitting = false,
  className,
}: GuestbookFormProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const trimmedContent = content.trim();
  const charCount = content.length;
  const isOverLimit = charCount > MAX_CHAR_COUNT;
  const isValid = trimmedContent.length > 0 && !isOverLimit && !isSubmitting;

  const handleFormSubmit = useCallback(async () => {
    if (!trimmedContent) {
      setError("Vui lòng nhập nội dung lời nhắn.");
      return;
    }

    if (isOverLimit) {
      setError(`Nội dung không được vượt quá ${MAX_CHAR_COUNT} ký tự.`);
      return;
    }

    setError(null);
    try {
      const result = await onSubmit(trimmedContent);
      if (result !== false) {
        // Reset form khi gửi thành công
        setContent("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra khi gửi lời nhắn.");
    }
  }, [trimmedContent, isOverLimit, onSubmit]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleFormSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (isValid) {
        handleFormSubmit();
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("w-full space-y-3", className)}
      noValidate
      aria-label="Biểu mẫu gửi lời nhắn sổ lưu niệm"
    >
      <div className="relative">
        <label htmlFor="guestbook-message" className="sr-only">
          Nội dung lời nhắn
        </label>
        <textarea
          id="guestbook-message"
          name="content"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          maxLength={MAX_CHAR_COUNT}
          rows={3}
          placeholder="Để lại lời chào hoặc góp ý kỹ thuật..."
          aria-describedby="guestbook-counter guestbook-error-msg"
          aria-invalid={Boolean(error)}
          className={cn(
            "w-full resize-none rounded-lg border bg-surface-2 p-3 text-sm text-text placeholder:text-muted transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
            error ? "border-status-danger focus:border-status-danger" : "border-border",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        />
      </div>

      <div id="guestbook-error-msg">
        <FieldError message={error || undefined} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <span
            id="guestbook-counter"
            className={cn(
              "font-mono text-xs",
              charCount >= MAX_CHAR_COUNT
                ? "text-status-danger font-semibold"
                : charCount > MAX_CHAR_COUNT - 30
                  ? "text-status-warning font-medium"
                  : "text-muted"
            )}
            aria-live="polite"
          >
            {charCount}/{MAX_CHAR_COUNT}
          </span>

          <span className="hidden sm:inline font-mono text-[11px] text-muted">
            (Nhấn <kbd className="px-1 py-0.5 rounded bg-surface border border-border text-[10px]">Ctrl</kbd> + <kbd className="px-1 py-0.5 rounded bg-surface border border-border text-[10px]">Enter</kbd> để gửi)
          </span>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="sm"
          loading={isSubmitting}
          disabled={!isValid}
          iconLeft={
            <CornerDownLeft
              className="h-3.5 w-3.5 shrink-0 aspect-square"
              aria-hidden="true"
            />
          }
        >
          Gửi lời nhắn
        </Button>
      </div>
    </form>
  );
}
