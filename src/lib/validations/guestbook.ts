import { z } from "zod";

/**
 * Zod schema cho chuỗi nội dung lời nhắn Guestbook.
 * Ràng buộc: kiểu chuỗi, tự động trim khoảng trắng thừa, tối thiểu 1 ký tự, tối đa 280 ký tự.
 */
export const guestbookContentSchema = z
  .string({
    required_error: "Nội dung lời nhắn không được để trống.",
    invalid_type_error: "Nội dung lời nhắn phải là chuỗi ký tự.",
  })
  .trim()
  .min(1, "Nội dung lời nhắn không được để trống.")
  .max(280, "Nội dung lời nhắn không được vượt quá 280 ký tự.");

/**
 * Zod schema cho mã định danh UUID của bản ghi Guestbook.
 */
export const guestbookIdSchema = z
  .string({
    required_error: "Mã định danh không được để trống.",
    invalid_type_error: "Mã định danh phải là chuỗi ký tự.",
  })
  .uuid("Mã định danh lời nhắn không hợp lệ.");

/**
 * Schema xác thực dữ liệu đầu vào khi tạo lời nhắn Guestbook mới.
 */
export const createGuestbookSchema = z.object({
  content: guestbookContentSchema,
});

export const createGuestbookEntrySchema = createGuestbookSchema;

/**
 * Schema xác thực dữ liệu đầu vào khi yêu cầu xóa lời nhắn Guestbook.
 */
export const deleteGuestbookSchema = z.object({
  id: guestbookIdSchema,
});

export const deleteGuestbookEntrySchema = deleteGuestbookSchema;

export type CreateGuestbookInput = z.infer<typeof createGuestbookSchema>;
export type CreateGuestbookEntryInput = CreateGuestbookInput;

export type DeleteGuestbookInput = z.infer<typeof deleteGuestbookSchema>;
export type DeleteGuestbookEntryInput = DeleteGuestbookInput;
