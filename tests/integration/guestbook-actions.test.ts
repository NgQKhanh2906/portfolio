import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @/lib/auth để giả lập các phiên đăng nhập khác nhau
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

// Mock next/cache để tránh lỗi ngoài môi trường Next.js request context
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

import { auth } from "@/lib/auth";
import {
  createGuestbookEntry,
  deleteGuestbookEntry,
} from "@/actions/guestbook";
import {
  getGuestbookEntries,
  getGuestbookEntryById,
  resetMockGuestbookStore,
} from "@/lib/db/queries/guestbook";
import { resetRateLimitStore } from "@/lib/rate-limit";

const mockAuth = vi.mocked(auth);

describe("Guestbook Actions Integration Tests (TASK-18 & TASK-19)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMockGuestbookStore();
    resetRateLimitStore();
  });

  describe("createGuestbookEntry Action (TASK-18)", () => {
    it("từ chối yêu cầu khi người dùng chưa đăng nhập", async () => {
      mockAuth.mockResolvedValueOnce(null as never);

      const result = await createGuestbookEntry("Một lời nhắn thử nghiệm");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          "Bạn cần đăng nhập bằng GitHub để gửi lời nhắn."
        );
      }
    });

    it("từ chối khi session không chứa id người dùng", async () => {
      mockAuth.mockResolvedValueOnce({
        user: { name: "Ẩn danh" },
        expires: "2099-01-01",
      } as never);

      const result = await createGuestbookEntry("Một lời nhắn thử nghiệm");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          "Bạn cần đăng nhập bằng GitHub để gửi lời nhắn."
        );
      }
    });

    it("từ chối khi nội dung rỗng hoặc chỉ có khoảng trắng", async () => {
      mockAuth.mockResolvedValue({
        user: {
          id: "user-test-1",
          name: "Test User",
          username: "testuser",
          isAdmin: false,
        },
        expires: "2099-01-01",
      } as never);

      const emptyRes = await createGuestbookEntry("");
      expect(emptyRes.success).toBe(false);
      if (!emptyRes.success) {
        expect(emptyRes.error).toBe("Nội dung lời nhắn không được để trống.");
      }

      const whitespaceRes = await createGuestbookEntry("      ");
      expect(whitespaceRes.success).toBe(false);
      if (!whitespaceRes.success) {
        expect(whitespaceRes.error).toBe(
          "Nội dung lời nhắn không được để trống."
        );
      }
    });

    it("từ chối khi nội dung vượt quá 280 ký tự", async () => {
      mockAuth.mockResolvedValue({
        user: {
          id: "user-test-1",
          name: "Test User",
          username: "testuser",
          isAdmin: false,
        },
        expires: "2099-01-01",
      } as never);

      const longContent = "A".repeat(281);
      const result = await createGuestbookEntry(longContent);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          "Nội dung lời nhắn không được vượt quá 280 ký tự."
        );
      }
    });

    it("từ chối khi nội dung chứa từ ngữ cấm (Moderation Check)", async () => {
      mockAuth.mockResolvedValue({
        user: {
          id: "user-test-1",
          name: "Test User",
          username: "testuser",
          isAdmin: false,
        },
        expires: "2099-01-01",
      } as never);

      const result = await createGuestbookEntry(
        "Chơi tài xỉu kiếm tiền triệu mỗi ngày!"
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          "Nội dung chứa từ ngữ không phù hợp hoặc vi phạm tiêu chuẩn cộng đồng."
        );
      }
    });

    it("tạo lời nhắn thành công khi dữ liệu hợp lệ", async () => {
      mockAuth.mockResolvedValue({
        user: {
          id: "user-linh-id",
          name: "Linh Trần",
          username: "seed-linh",
          isAdmin: false,
        },
        expires: "2099-01-01",
      } as never);

      const validContent =
        "Trang web thiết kế theo phong cách Engineering Notebook rất đẹp!";
      const result = await createGuestbookEntry(validContent);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.entry).toBeDefined();
        expect(result.entry.content).toBe(validContent);
        expect(result.entry.userId).toBe("user-linh-id");
        expect(result.entry.deletedAt).toBeNull();
      }

      // Xác minh bản ghi đã hiển thị trong danh sách chung
      const entries = await getGuestbookEntries();
      expect(entries.some((e) => e.content === validContent)).toBe(true);
    });

    it("áp dụng rate limit nghiêm ngặt: cho phép tối đa 3 lần và chặn lần thứ 4 trong 10 phút", async () => {
      mockAuth.mockResolvedValue({
        user: {
          id: "user-spammer-id",
          name: "Spam User",
          username: "spammer",
          isAdmin: false,
        },
        expires: "2099-01-01",
      } as never);

      // Gửi 3 lần hợp lệ
      const res1 = await createGuestbookEntry("Tin nhắn hợp lệ số 1");
      const res2 = await createGuestbookEntry("Tin nhắn hợp lệ số 2");
      const res3 = await createGuestbookEntry("Tin nhắn hợp lệ số 3");

      expect(res1.success).toBe(true);
      expect(res2.success).toBe(true);
      expect(res3.success).toBe(true);

      // Lần thứ 4 phải bị chặn đứng
      const res4 = await createGuestbookEntry("Tin nhắn spam cố tình gửi tiếp");

      expect(res4.success).toBe(false);
      if (!res4.success) {
        expect(res4.error).toContain(
          "Bạn đã gửi quá giới hạn cho phép (tối đa 3 lần / 10 phút)"
        );
      }
    });
  });

  describe("deleteGuestbookEntry Action (TASK-19)", () => {
    it("từ chối khi người dùng chưa đăng nhập", async () => {
      mockAuth.mockResolvedValueOnce(null as never);

      const result = await deleteGuestbookEntry(
        "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c80"
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          "Bạn cần đăng nhập để thực hiện thao tác này."
        );
      }
    });

    it("từ chối khi ID không phải UUID hợp lệ", async () => {
      mockAuth.mockResolvedValue({
        user: {
          id: "user-linh-id",
          name: "Linh Trần",
          username: "seed-linh",
          isAdmin: false,
        },
        expires: "2099-01-01",
      } as never);

      const result = await deleteGuestbookEntry("malformed-id");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Mã định danh lời nhắn không hợp lệ.");
      }
    });

    it("từ chối khi lời nhắn không tồn tại", async () => {
      mockAuth.mockResolvedValue({
        user: {
          id: "user-linh-id",
          name: "Linh Trần",
          username: "seed-linh",
          isAdmin: false,
        },
        expires: "2099-01-01",
      } as never);

      const result = await deleteGuestbookEntry(
        "00000000-0000-0000-0000-000000000000"
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Lời nhắn không tồn tại hoặc đã bị xóa.");
      }
    });

    it("CHẶN ĐỨNG người dùng thường cố tình xóa lời nhắn của người khác", async () => {
      // Bản ghi mẫu "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c80" thuộc về user-minh-id
      const entryBefore = await getGuestbookEntryById(
        "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c80"
      );
      expect(entryBefore).not.toBeNull();
      expect(entryBefore?.userId).toBe("user-minh-id");

      // Giả lập user-linh-id (người khác, không phải admin) cố tình xóa
      mockAuth.mockResolvedValue({
        user: {
          id: "user-linh-id",
          name: "Linh Trần",
          username: "seed-linh",
          isAdmin: false,
        },
        expires: "2099-01-01",
      } as never);

      const result = await deleteGuestbookEntry(
        "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c80"
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Bạn không có quyền xóa lời nhắn này.");
      }

      // Xác minh lời nhắn vẫn còn nguyên vẹn
      const entryAfter = await getGuestbookEntryById(
        "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c80"
      );
      expect(entryAfter).not.toBeNull();
    });

    it("cho phép chính chủ (tác giả) tự xóa lời nhắn của mình", async () => {
      // Giả lập user-minh-id đăng nhập để xóa bài viết của chính mình
      mockAuth.mockResolvedValue({
        user: {
          id: "user-minh-id",
          name: "Minh Phạm",
          username: "seed-minh",
          isAdmin: false,
        },
        expires: "2099-01-01",
      } as never);

      const result = await deleteGuestbookEntry(
        "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c80"
      );

      expect(result.success).toBe(true);

      // Xác minh lời nhắn đã bị xóa mềm và không còn xuất hiện trong danh sách active
      const entryAfter = await getGuestbookEntryById(
        "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c80"
      );
      expect(entryAfter).toBeNull();
    });

    it("cho phép Admin xóa lời nhắn của bất kỳ người dùng nào", async () => {
      // Bản ghi "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81" thuộc về user-huy-id
      const targetId = "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81";
      const entryBefore = await getGuestbookEntryById(targetId);
      expect(entryBefore).not.toBeNull();
      expect(entryBefore?.userId).toBe("user-huy-id");

      // Giả lập tài khoản Admin đăng nhập (isAdmin = true)
      mockAuth.mockResolvedValue({
        user: {
          id: "admin-user-id",
          name: "Admin Quoc Khanh",
          username: "nqkhanh-dev",
          isAdmin: true,
        },
        expires: "2099-01-01",
      } as never);

      const result = await deleteGuestbookEntry(targetId);

      expect(result.success).toBe(true);

      // Xác minh lời nhắn đã bị xóa khỏi danh sách công khai
      const entryAfter = await getGuestbookEntryById(targetId);
      expect(entryAfter).toBeNull();
    });
  });
});
