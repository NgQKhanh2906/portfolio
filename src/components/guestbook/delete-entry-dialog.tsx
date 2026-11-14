"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DeleteEntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  isDeleting?: boolean;
  authorUsername?: string;
}

export function DeleteEntryDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  authorUsername,
}: DeleteEntryDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Lưu active element trước khi mở dialog để phục hồi khi đóng
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      // Khóa cuộn trang khi dialog mở
      document.body.style.overflow = "hidden";

      // Focus mặc định vào nút Hủy để tránh thao tác nhầm lẫn
      const timer = setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 50);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
        previousActiveElementRef.current?.focus?.();
      };
    }
  }, [isOpen]);

  // Xử lý Focus Trap và phím Escape
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (!isDeleting) {
          onClose();
        }
        return;
      }

      if (e.key === "Tab") {
        if (!dialogRef.current) return;
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    },
    [isDeleting, onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in-0 duration-fast"
      onClick={(e) => {
        // Đóng khi click ngoài hộp thoại nếu không đang trong quá trình xóa
        if (e.target === e.currentTarget && !isDeleting) {
          onClose();
        }
      }}
      aria-hidden={!isOpen}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-desc"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl outline-none"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 aspect-square items-center justify-center rounded-full bg-status-danger-soft text-status-danger border border-status-danger/20">
            <AlertTriangle className="h-5 w-5 shrink-0 aspect-square" aria-hidden="true" />
          </div>

          <div className="flex-1 min-w-0">
            <h3
              id="delete-dialog-title"
              className="text-base font-semibold text-text"
            >
              Xác nhận xóa lời nhắn
            </h3>
            <p
              id="delete-dialog-desc"
              className="mt-2 text-sm text-muted leading-relaxed"
            >
              {authorUsername
                ? `Bạn có chắc chắn muốn xóa lời nhắn của @${authorUsername}?`
                : "Bạn có chắc chắn muốn xóa lời nhắn này khỏi sổ lưu niệm?"}
              {" "}Hành động này sẽ ẩn lời nhắn khỏi giao diện công khai và không thể hoàn tác.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <Button
            ref={cancelButtonRef}
            type="button"
            variant="secondary"
            size="md"
            disabled={isDeleting}
            onClick={onClose}
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            loading={isDeleting}
            disabled={isDeleting}
            onClick={onConfirm}
            iconLeft={<Trash2 className="h-4 w-4 shrink-0 aspect-square" aria-hidden="true" />}
          >
            Xác nhận xóa
          </Button>
        </div>
      </div>
    </div>
  );
}
