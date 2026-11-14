"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import {
  createGuestbookSchema,
  deleteGuestbookSchema,
} from "@/lib/validations/guestbook";
import { containsBannedWords } from "@/lib/moderation";
import { checkGuestbookRateLimit } from "@/lib/rate-limit";
import {
  createGuestbookEntryDb,
  softDeleteGuestbookEntryDb,
  getGuestbookEntryById,
  type GuestbookEntryWithUser,
} from "@/lib/db/queries/guestbook";

export type CreateGuestbookResponse =
  | {
      success: true;
      ok: true;
      entry: GuestbookEntryWithUser;
      data: GuestbookEntryWithUser;
    }
  | {
      success: false;
      ok: false;
      error: string;
      message: string;
      code?: string;
    };

export type DeleteGuestbookResponse =
  | {
      success: true;
      ok: true;
      data?: { id: string };
    }
  | {
      success: false;
      ok: false;
      error: string;
      message: string;
      code?: string;
    };

/**
 * Server Action: Tạo lời nhắn Guestbook mới.
 *
 * Kiểm tra đa tầng:
 * 1. Session qua auth() (bắt buộc đã đăng nhập GitHub)
 * 2. Validate Zod createGuestbookSchema (1-280 ký tự sau khi trim)
 * 3. Kiểm tra containsBannedWords (lọc từ ngữ cấm, cá độ, xúc phạm)
 * 4. Kiểm tra rate limit (tối đa 3 lần / 10 phút mỗi user)
 * 5. Gọi createGuestbookEntryDb, revalidatePath("/guestbook")
 * 6. Trả về { success: true, entry } hoặc { success: false, error }
 */
export async function createGuestbookEntry(
  input: string | { content: string } | FormData
): Promise<CreateGuestbookResponse> {
  try {
    // 1. Kiểm tra session đăng nhập
    const session = await auth();
    if (!session?.user?.id) {
      const msg = "Bạn cần đăng nhập bằng GitHub để gửi lời nhắn.";
      return {
        success: false,
        ok: false,
        error: msg,
        message: msg,
        code: "UNAUTHORIZED",
      };
    }

    // Trích xuất chuỗi nội dung từ các dạng tham số truyền vào
    let rawContent = "";
    if (typeof input === "string") {
      rawContent = input;
    } else if (input instanceof FormData) {
      rawContent = (input.get("content") as string) || "";
    } else if (input && typeof input === "object" && "content" in input) {
      rawContent = (input as { content: string }).content || "";
    }

    // 2. Kiểm tra schema Zod
    const validation = createGuestbookSchema.safeParse({ content: rawContent });
    if (!validation.success) {
      const firstError =
        validation.error.errors[0]?.message || "Nội dung lời nhắn không hợp lệ.";
      return {
        success: false,
        ok: false,
        error: firstError,
        message: firstError,
        code: "VALIDATION_ERROR",
      };
    }

    const cleanContent = validation.data.content;

    // 3. Kiểm duyệt từ ngữ cấm
    if (containsBannedWords(cleanContent)) {
      const msg =
        "Nội dung chứa từ ngữ không phù hợp hoặc vi phạm tiêu chuẩn cộng đồng.";
      return {
        success: false,
        ok: false,
        error: msg,
        message: msg,
        code: "MODERATION_BLOCKED",
      };
    }

    // 4. Kiểm tra rate limit (tối đa 3 lần / 10 phút)
    const rateLimit = await checkGuestbookRateLimit(session.user.id);
    if (!rateLimit.success) {
      const msg =
        "Bạn đã gửi quá giới hạn cho phép (tối đa 3 lần / 10 phút). Vui lòng thử lại sau.";
      return {
        success: false,
        ok: false,
        error: msg,
        message: msg,
        code: "RATE_LIMITED",
      };
    }

    // 5. Ghi dữ liệu vào CSDL
    const entry = await createGuestbookEntryDb(session.user.id, cleanContent);

    // 6. Revalidate cache trang guestbook
    try {
      revalidatePath("/guestbook");
    } catch {
      // Bỏ qua lỗi khi gọi ngoài ngữ cảnh HTTP request của Next.js (ví dụ trong test)
    }

    return {
      success: true,
      ok: true,
      entry,
      data: entry,
    };
  } catch (error) {
    const msg =
      error instanceof Error
        ? error.message
        : "Đã có lỗi xảy ra khi gửi lời nhắn.";
    return {
      success: false,
      ok: false,
      error: msg,
      message: msg,
      code: "INTERNAL_ERROR",
    };
  }
}

/**
 * Server Action: Xóa mềm lời nhắn Guestbook.
 *
 * Kiểm tra phân quyền:
 * 1. Session qua auth() (bắt buộc đã đăng nhập)
 * 2. Validate Zod deleteGuestbookSchema
 * 3. Tìm entry qua getGuestbookEntryById
 * 4. Kiểm tra quyền NGHIÊM NGẶT: chỉ chủ bài viết (entry.userId === session.user.id)
 *    HOẶC Admin (session.user.isAdmin === true) mới được phép xóa.
 * 5. Gọi softDeleteGuestbookEntryDb, revalidatePath("/guestbook")
 * 6. Trả về { success: true } hoặc { success: false, error }
 */
export async function deleteGuestbookEntry(
  id: string
): Promise<DeleteGuestbookResponse> {
  try {
    // 1. Kiểm tra session đăng nhập
    const session = await auth();
    if (!session?.user?.id) {
      const msg = "Bạn cần đăng nhập để thực hiện thao tác này.";
      return {
        success: false,
        ok: false,
        error: msg,
        message: msg,
        code: "UNAUTHORIZED",
      };
    }

    // 2. Xác thực ID bằng Zod
    const validation = deleteGuestbookSchema.safeParse({ id });
    if (!validation.success) {
      const firstError =
        validation.error.errors[0]?.message || "Mã định danh lời nhắn không hợp lệ.";
      return {
        success: false,
        ok: false,
        error: firstError,
        message: firstError,
        code: "VALIDATION_ERROR",
      };
    }

    const entryId = validation.data.id;

    // 3. Tìm bản ghi trong CSDL
    const entry = await getGuestbookEntryById(entryId);
    if (!entry) {
      const msg = "Lời nhắn không tồn tại hoặc đã bị xóa.";
      return {
        success: false,
        ok: false,
        error: msg,
        message: msg,
        code: "NOT_FOUND",
      };
    }

    // 4. Kiểm tra phân quyền: chủ bài viết hoặc Admin
    const isOwner = entry.userId === session.user.id;
    const isAdmin = Boolean(session.user.isAdmin);

    if (!isOwner && !isAdmin) {
      const msg = "Bạn không có quyền xóa lời nhắn này.";
      return {
        success: false,
        ok: false,
        error: msg,
        message: msg,
        code: "FORBIDDEN",
      };
    }

    // 5. Thực hiện xóa mềm
    await softDeleteGuestbookEntryDb(entryId);

    // 6. Revalidate cache
    try {
      revalidatePath("/guestbook");
    } catch {
      // Bỏ qua lỗi khi gọi ngoài ngữ cảnh Next.js
    }

    return {
      success: true,
      ok: true,
      data: { id: entryId },
    };
  } catch (error) {
    const msg =
      error instanceof Error
        ? error.message
        : "Đã có lỗi xảy ra khi xóa lời nhắn.";
    return {
      success: false,
      ok: false,
      error: msg,
      message: msg,
      code: "INTERNAL_ERROR",
    };
  }
}
