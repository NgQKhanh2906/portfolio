"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GuestbookEntryItem } from "@/types/guestbook";

export interface GuestbookEntryProps {
  entry: GuestbookEntryItem;
  currentUserId?: string;
  currentUserIsAdmin?: boolean;
  onDelete?: (id: string, authorUsername: string) => void;
  className?: string;
}

/**
 * Định dạng ngày giờ chuẩn ISO/kỹ thuật để tránh lỗi hydration mismatch giữa server và client
 */
function formatEntryDate(dateInput: Date | string): string {
  try {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return "";

    const pad = (n: number) => n.toString().padStart(2, "0");
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  } catch {
    return "";
  }
}

export function GuestbookEntry({
  entry,
  currentUserId,
  currentUserIsAdmin = false,
  onDelete,
  className,
}: GuestbookEntryProps) {
  const isOwner = Boolean(currentUserId && currentUserId === entry.userId);
  const canDelete = Boolean(currentUserId && (isOwner || currentUserIsAdmin));
  const isOptimistic = Boolean(entry.isOptimistic);

  const formattedDate = formatEntryDate(entry.createdAt);
  const authorName = entry.user?.name || entry.user?.username || "Khách ẩn danh";
  const authorUsername = entry.user?.username || "user";
  const avatarUrl = entry.user?.image;
  const isAdmin = Boolean(entry.user?.isAdmin);

  return (
    <Card
      className={cn(
        "p-5 transition-all duration-base border-border bg-surface",
        isOptimistic && "opacity-70 border-dashed animate-pulse",
        className
      )}
      data-testid="guestbook-entry"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={authorName}
              className="h-10 w-10 shrink-0 aspect-square rounded-full border border-border object-cover bg-surface-2"
              loading="lazy"
            />
          ) : (
            <div
              className="flex h-10 w-10 shrink-0 aspect-square items-center justify-center rounded-full border border-border bg-surface-2 font-mono text-sm font-semibold text-text uppercase"
              aria-hidden="true"
            >
              {authorUsername.charAt(0) || "U"}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-text truncate max-w-[180px] sm:max-w-xs">
                {authorName}
              </span>

              <span className="font-mono text-xs text-muted truncate">
                @{authorUsername}
              </span>

              {isAdmin && (
                <Badge variant="accent" className="text-[10px] px-1.5 py-0 h-4.5 uppercase tracking-wider font-mono">
                  Admin
                </Badge>
              )}

              {isOwner && (
                <Badge variant="neutral" className="text-[10px] px-1.5 py-0 h-4.5 uppercase tracking-wider font-mono">
                  Tác giả
                </Badge>
              )}

              {isOptimistic && (
                <Badge variant="warning" className="text-[10px] px-1.5 py-0 h-4.5 font-mono">
                  Đang gửi...
                </Badge>
              )}
            </div>

            {formattedDate && (
              <time
                dateTime={typeof entry.createdAt === "string" ? entry.createdAt : entry.createdAt.toISOString()}
                className="mt-0.5 block font-mono text-xs text-muted"
              >
                {formattedDate}
              </time>
            )}
          </div>
        </div>

        {canDelete && !isOptimistic && onDelete && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDelete(entry.id, authorUsername)}
            aria-label={`Xóa lời nhắn của @${authorUsername}`}
            className="text-muted hover:text-status-danger hover:bg-status-danger-soft/30 -mr-2 -mt-1 h-8 px-2"
          >
            <Trash2 className="h-4 w-4 shrink-0 aspect-square" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only sm:text-xs sm:ml-1">Xóa</span>
          </Button>
        )}
      </div>

      <p className="mt-3 text-sm text-text leading-relaxed whitespace-pre-wrap break-words">
        {entry.content}
      </p>
    </Card>
  );
}
