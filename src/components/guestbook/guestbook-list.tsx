"use client";

import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { useOptimistic } from "@/hooks/use-optimistic";
import { SignInButton } from "@/components/guestbook/sign-in-button";
import { SignOutButton } from "@/components/guestbook/sign-out-button";
import { GuestbookEntry } from "@/components/guestbook/guestbook-entry";
import { GuestbookForm } from "@/components/guestbook/guestbook-form";
import { DeleteEntryDialog } from "@/components/guestbook/delete-entry-dialog";
import { createGuestbookEntry, deleteGuestbookEntry } from "@/actions/guestbook";
import type { ActionResult } from "@/types";
import type { GuestbookEntryItem, GuestbookUser } from "@/types/guestbook";

export interface GuestbookListProps {
  initialEntries: GuestbookEntryItem[];
  currentUser?: GuestbookUser | null;
  createAction?: (input: { content: string }) => Promise<ActionResult<GuestbookEntryItem>>;
  deleteAction?: (id: string) => Promise<ActionResult<{ id: string }>>;
  hideAuthHeader?: boolean;
}

type OptimisticAction =
  | { type: "add"; entry: GuestbookEntryItem }
  | { type: "delete"; id: string }
  | { type: "reset"; entries: GuestbookEntryItem[] };

export function GuestbookList({
  initialEntries,
  currentUser,
  createAction,
  deleteAction,
  hideAuthHeader = false,
}: GuestbookListProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Trạng thái Dialog xác nhận xóa
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<{
    id: string;
    username: string;
  } | null>(null);

  // Quản lý trạng thái lạc quan bằng useOptimistic
  const [optimisticEntries, setOptimisticEntries] = useOptimistic<
    GuestbookEntryItem[],
    OptimisticAction
  >(initialEntries, (state, action) => {
    switch (action.type) {
      case "add":
        return [action.entry, ...state];
      case "delete":
        return state.filter((item) => item.id !== action.id);
      case "reset":
        return action.entries;
      default:
        return state;
    }
  });

  // Xử lý gửi lời nhắn mới với Optimistic UI
  const handleCreateEntry = async (content: string): Promise<boolean> => {
    if (!currentUser) {
      toast({
        variant: "warning",
        title: "Chưa đăng nhập",
        description: "Vui lòng đăng nhập bằng GitHub trước khi gửi lời nhắn.",
      });
      return false;
    }

    setIsSubmitting(true);

    const tempId = `optimistic-${Date.now()}`;
    const optimisticItem: GuestbookEntryItem = {
      id: tempId,
      userId: currentUser.id || "current-user",
      content: content.trim(),
      createdAt: new Date().toISOString(),
      user: {
        name: currentUser.name,
        username: currentUser.username,
        image: currentUser.image,
        isAdmin: Boolean(currentUser.isAdmin),
      },
      isOptimistic: true,
    };

    // 1. Hiển thị tức thì trên danh sách với độ mờ nhẹ (opacity-70)
    setOptimisticEntries({ type: "add", entry: optimisticItem });

    try {
      const actionFn = createAction || createGuestbookEntry;
      const res = await actionFn({ content: optimisticItem.content });

      if (!res.ok) {
        // Rollback và hiển thị lỗi qua useToast
        setOptimisticEntries({ type: "reset", entries: initialEntries });
        toast({
          variant: "error",
          title: "Không thể gửi lời nhắn",
          description: res.message || "Vui lòng kiểm tra lại nội dung.",
        });
        return false;
      }

      toast({
        variant: "success",
        title: "Đã gửi thành công",
        description: "Lời nhắn của bạn đã xuất hiện trên sổ lưu niệm.",
      });
      return true;
    } catch (err) {
      // Rollback và hiển thị lỗi qua useToast
      setOptimisticEntries({ type: "reset", entries: initialEntries });
      toast({
        variant: "error",
        title: "Lỗi kết nối",
        description: err instanceof Error ? err.message : "Đã có lỗi xảy ra khi gửi.",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mở Dialog yêu cầu xóa
  const handleRequestDelete = (id: string, username: string) => {
    setEntryToDelete({ id, username });
    setIsDialogOpen(true);
  };

  // Xác nhận xóa với Optimistic UI
  const handleConfirmDelete = async () => {
    if (!entryToDelete) return;
    const targetId = entryToDelete.id;

    setIsDeleting(true);

    // 1. Ẩn ngay lập tức khỏi danh sách
    setOptimisticEntries({ type: "delete", id: targetId });
    setIsDialogOpen(false);

    try {
      const actionFn = deleteAction || deleteGuestbookEntry;
      const res = await actionFn(targetId);

      if (!res.ok) {
        // Rollback và hiển thị thông báo lỗi qua useToast
        setOptimisticEntries({ type: "reset", entries: initialEntries });
        toast({
          variant: "error",
          title: "Không thể xóa lời nhắn",
          description: res.message || "Đã có lỗi xảy ra khi xóa.",
        });
      } else {
        toast({
          variant: "success",
          title: "Đã xóa lời nhắn",
          description: "Lời nhắn đã được gỡ bỏ khỏi sổ lưu niệm.",
        });
      }
    } catch (err) {
      setOptimisticEntries({ type: "reset", entries: initialEntries });
      toast({
        variant: "error",
        title: "Lỗi hệ thống",
        description: err instanceof Error ? err.message : "Không thể xóa lời nhắn.",
      });
    } finally {
      setIsDeleting(false);
      setEntryToDelete(null);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Khối Auth & Form */}
      {!hideAuthHeader && (
        <>
          {!currentUser ? (
            <Card className="p-6 border-border bg-surface">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-text">
                    Đăng nhập để để lại lời nhắn
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    Xác thực danh tính qua tài khoản GitHub của bạn để ngăn chặn spam.
                  </p>
                </div>
                <SignInButton />
              </div>
            </Card>
          ) : (
            <Card className="p-6 border-border bg-surface space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {currentUser.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentUser.image}
                      alt={currentUser.name || currentUser.username}
                      className="h-9 w-9 shrink-0 aspect-square rounded-full border border-border object-cover bg-surface-2"
                    />
                  ) : (
                    <div
                      className="flex h-9 w-9 shrink-0 aspect-square items-center justify-center rounded-full border border-border bg-surface-2 font-mono text-xs font-semibold text-text uppercase"
                      aria-hidden="true"
                    >
                      {currentUser.username.charAt(0) || "U"}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-text truncate">
                        {currentUser.name || currentUser.username}
                      </span>
                      {currentUser.isAdmin && (
                        <Badge variant="accent" className="text-[10px] px-1.5 py-0 h-4.5 font-mono uppercase">
                          Admin
                        </Badge>
                      )}
                    </div>
                    <span className="font-mono text-xs text-muted block truncate">
                      @{currentUser.username}
                    </span>
                  </div>
                </div>

                <SignOutButton />
              </div>

              <div className="border-t border-border pt-3">
                <GuestbookForm
                  onSubmit={handleCreateEntry}
                  isSubmitting={isSubmitting}
                />
              </div>
            </Card>
          )}
        </>
      )}

      {/* Danh sách lời nhắn */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
            Lời nhắn từ cộng đồng
          </h3>
          <Badge variant="neutral" className="font-mono text-xs">
            {optimisticEntries.length} lời nhắn
          </Badge>
        </div>

        {optimisticEntries.length === 0 ? (
          <EmptyState
            icon={
              <MessageSquare
                className="h-6 w-6 shrink-0 aspect-square text-muted"
                aria-hidden="true"
              />
            }
            title="Chưa có lời nhắn nào"
            description="Hãy là người đầu tiên để lại lời chào hoặc góp ý kỹ thuật."
          />
        ) : (
          <div className="space-y-3" role="feed" aria-label="Danh sách lời nhắn">
            {optimisticEntries.map((entry) => (
              <GuestbookEntry
                key={entry.id}
                entry={entry}
                currentUserId={currentUser?.id}
                currentUserIsAdmin={currentUser?.isAdmin}
                onDelete={handleRequestDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialog xác nhận xóa lời nhắn */}
      <DeleteEntryDialog
        isOpen={isDialogOpen}
        authorUsername={entryToDelete?.username}
        isDeleting={isDeleting}
        onClose={() => {
          if (!isDeleting) {
            setIsDialogOpen(false);
            setEntryToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
