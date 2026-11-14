import { describe, it, expect } from "vitest";
import {
  createGuestbookSchema,
  deleteGuestbookSchema,
  guestbookContentSchema,
  guestbookIdSchema,
} from "@/lib/validations/guestbook";

describe("Guestbook Validations (Zod)", () => {
  describe("createGuestbookSchema & guestbookContentSchema", () => {
    it("chấp nhận nội dung hợp lệ chuẩn", () => {
      const input = { content: "Trang web rất đẹp và chuyên nghiệp!" };
      const result = createGuestbookSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.content).toBe("Trang web rất đẹp và chuyên nghiệp!");
      }
    });

    it("tự động cắt bỏ (trim) khoảng trắng ở hai đầu chuỗi", () => {
      const input = { content: "   Lời nhắn có khoảng trắng thừa   " };
      const result = createGuestbookSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.content).toBe("Lời nhắn có khoảng trắng thừa");
      }
    });

    it("từ chối khi chuỗi rỗng hoàn toàn", () => {
      const input = { content: "" };
      const result = createGuestbookSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe(
          "Nội dung lời nhắn không được để trống."
        );
      }
    });

    it("từ chối khi chuỗi chỉ gồm khoảng trắng (sau khi trim rỗng)", () => {
      const input = { content: "     " };
      const result = createGuestbookSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe(
          "Nội dung lời nhắn không được để trống."
        );
      }
    });

    it("chấp nhận trường hợp biên dưới 1 ký tự", () => {
      const input = { content: "A" };
      const result = createGuestbookSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.content).toBe("A");
      }
    });

    it("chấp nhận trường hợp biên trên đúng 280 ký tự", () => {
      const content280 = "x".repeat(280);
      const result = createGuestbookSchema.safeParse({ content: content280 });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.content.length).toBe(280);
      }
    });

    it("từ chối trường hợp vượt quá 280 ký tự (281 ký tự)", () => {
      const content281 = "x".repeat(281);
      const result = createGuestbookSchema.safeParse({ content: content281 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe(
          "Nội dung lời nhắn không được vượt quá 280 ký tự."
        );
      }
    });

    it("từ chối khi không truyền trường content", () => {
      const result = createGuestbookSchema.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe(
          "Nội dung lời nhắn không được để trống."
        );
      }
    });

    it("từ chối khi trường content không phải dạng chuỗi", () => {
      const result = createGuestbookSchema.safeParse({ content: 12345 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe(
          "Nội dung lời nhắn phải là chuỗi ký tự."
        );
      }
    });

    it("xác thực trực tiếp qua guestbookContentSchema", () => {
      expect(guestbookContentSchema.safeParse("Hợp lệ").success).toBe(true);
      expect(guestbookContentSchema.safeParse("").success).toBe(false);
    });
  });

  describe("deleteGuestbookSchema & guestbookIdSchema", () => {
    it("chấp nhận UUID hợp lệ", () => {
      const validUuid = "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c80";
      const result = deleteGuestbookSchema.safeParse({ id: validUuid });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(validUuid);
      }
    });

    it("từ chối chuỗi không phải định dạng UUID", () => {
      const invalidUuid = "not-a-valid-uuid-12345";
      const result = deleteGuestbookSchema.safeParse({ id: invalidUuid });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe(
          "Mã định danh lời nhắn không hợp lệ."
        );
      }
    });

    it("từ chối khi id là chuỗi rỗng", () => {
      const result = deleteGuestbookSchema.safeParse({ id: "" });
      expect(result.success).toBe(false);
    });

    it("từ chối khi không cung cấp trường id", () => {
      const result = deleteGuestbookSchema.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe(
          "Mã định danh không được để trống."
        );
      }
    });

    it("xác thực trực tiếp qua guestbookIdSchema", () => {
      expect(
        guestbookIdSchema.safeParse("123e4567-e89b-12d3-a456-426614174000")
          .success
      ).toBe(true);
      expect(guestbookIdSchema.safeParse("abc").success).toBe(false);
    });
  });
});
