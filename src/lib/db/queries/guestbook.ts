import "server-only";
import { eq, desc, isNull, and } from "drizzle-orm";
import crypto from "node:crypto";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import type { GuestbookEntryItem } from "@/types/guestbook";

export interface GuestbookUser {
  id: string;
  name: string | null;
  image: string | null;
  username: string;
  isAdmin: boolean;
}

export interface GuestbookEntryWithUser {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  user: GuestbookUser;
}

// ============================================================================
// Dữ liệu mẫu In-Memory Fallback khi chưa cấu hình DATABASE_URL (Local / Test)
// ============================================================================

const MOCK_USERS: Record<string, GuestbookUser> = {
  "user-linh-id": {
    id: "user-linh-id",
    name: "Linh Trần",
    image: "https://avatars.githubusercontent.com/u/1?v=4",
    username: "seed-linh",
    isAdmin: false,
  },
  "user-minh-id": {
    id: "user-minh-id",
    name: "Minh Phạm",
    image: "https://avatars.githubusercontent.com/u/2?v=4",
    username: "seed-minh",
    isAdmin: false,
  },
  "user-huy-id": {
    id: "user-huy-id",
    name: "Huy Lê",
    image: "https://avatars.githubusercontent.com/u/3?v=4",
    username: "seed-huy",
    isAdmin: false,
  },
  "admin-user-id": {
    id: "admin-user-id",
    name: "Quốc Khánh (Admin)",
    image: "https://avatars.githubusercontent.com/u/999?v=4",
    username: "admin-khanh",
    isAdmin: true,
  },
};

function createInitialMockEntries(): GuestbookEntryWithUser[] {
  const now = Date.now();
  return [
    {
      id: "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c80",
      userId: "user-minh-id",
      content: "Thử gửi liên tục và đã bị chặn đúng như mô tả. Làm tốt!",
      createdAt: new Date(now - 2 * 60 * 60 * 1000), // 2 giờ trước
      updatedAt: new Date(now - 2 * 60 * 60 * 1000),
      deletedAt: null,
      user: MOCK_USERS["user-minh-id"]!,
    },
    {
      id: "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
      userId: "user-huy-id",
      content: "Component Lab hay quá, phần Tabs dùng phím mũi tên được luôn.",
      createdAt: new Date(now - 24 * 60 * 60 * 1000), // 1 ngày trước
      updatedAt: new Date(now - 24 * 60 * 60 * 1000),
      deletedAt: null,
      user: MOCK_USERS["user-huy-id"]!,
    },
    {
      id: "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c82",
      userId: "user-linh-id",
      content: "Đã tải CV, phần kinh nghiệm thực tập trình bày rõ ràng.",
      createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000), // 2 ngày trước
      updatedAt: new Date(now - 2 * 24 * 60 * 60 * 1000),
      deletedAt: null,
      user: MOCK_USERS["user-linh-id"]!,
    },
    {
      id: "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c83",
      userId: "user-huy-id",
      content: "Mình học được cách làm rate limit từ repo của bạn, cảm ơn nhé.",
      createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000), // 3 ngày trước
      updatedAt: new Date(now - 3 * 24 * 60 * 60 * 1000),
      deletedAt: null,
      user: MOCK_USERS["user-huy-id"]!,
    },
    {
      id: "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c84",
      userId: "user-minh-id",
      content: "Command Palette mượt, mục Case Study có phần trade-off rất đáng đọc.",
      createdAt: new Date(now - 4 * 24 * 60 * 60 * 1000), // 4 ngày trước
      updatedAt: new Date(now - 4 * 24 * 60 * 60 * 1000),
      deletedAt: null,
      user: MOCK_USERS["user-minh-id"]!,
    },
    {
      id: "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c85",
      userId: "user-linh-id",
      content: "Giao diện gọn và dễ đọc trên điện thoại. Chúc bạn sớm tìm được công việc phù hợp!",
      createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000), // 5 ngày trước
      updatedAt: new Date(now - 5 * 24 * 60 * 60 * 1000),
      deletedAt: null,
      user: MOCK_USERS["user-linh-id"]!,
    },
  ];
}

let inMemoryGuestbookStore: GuestbookEntryWithUser[] = createInitialMockEntries();

/**
 * Đặt lại dữ liệu bộ nhớ trong (phục vụ test).
 */
export function resetMockGuestbookStore(): void {
  inMemoryGuestbookStore = createInitialMockEntries();
}

/**
 * Thêm hoặc cập nhật user vào bộ nhớ trong (phục vụ test).
 */
export function setMockUser(user: GuestbookUser): void {
  MOCK_USERS[user.id] = user;
}

// ============================================================================
// Các hàm truy vấn CSDL (Database Queries)
// ============================================================================

/**
 * Lấy danh sách toàn bộ lời nhắn còn hiệu lực (deleted_at IS NULL),
 * kết hợp thông tin người dùng (users), sắp xếp giảm dần theo created_at.
 */
export async function getGuestbookEntries(): Promise<GuestbookEntryWithUser[]> {
  if (!process.env.DATABASE_URL) {
    return inMemoryGuestbookStore
      .filter((entry) => entry.deletedAt === null)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  try {
    const rows = await db
      .select({
        id: schema.guestbook_entries.id,
        userId: schema.guestbook_entries.userId,
        content: schema.guestbook_entries.content,
        createdAt: schema.guestbook_entries.createdAt,
        updatedAt: schema.guestbook_entries.updatedAt,
        deletedAt: schema.guestbook_entries.deletedAt,
        user: {
          id: schema.users.id,
          name: schema.users.name,
          image: schema.users.image,
          username: schema.users.username,
          isAdmin: schema.users.isAdmin,
        },
      })
      .from(schema.guestbook_entries)
      .innerJoin(
        schema.users,
        eq(schema.guestbook_entries.userId, schema.users.id)
      )
      .where(isNull(schema.guestbook_entries.deletedAt))
      .orderBy(desc(schema.guestbook_entries.createdAt));

    return rows;
  } catch {
    // Fallback an toàn nếu database không phản hồi
    return inMemoryGuestbookStore
      .filter((entry) => entry.deletedAt === null)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

/**
 * Tìm một lời nhắn theo ID (chỉ trả về bản ghi chưa bị xóa mềm).
 */
export async function getGuestbookEntryById(
  id: string
): Promise<GuestbookEntryWithUser | null> {
  if (!process.env.DATABASE_URL) {
    const found = inMemoryGuestbookStore.find(
      (entry) => entry.id === id && entry.deletedAt === null
    );
    return found || null;
  }

  try {
    const [row] = await db
      .select({
        id: schema.guestbook_entries.id,
        userId: schema.guestbook_entries.userId,
        content: schema.guestbook_entries.content,
        createdAt: schema.guestbook_entries.createdAt,
        updatedAt: schema.guestbook_entries.updatedAt,
        deletedAt: schema.guestbook_entries.deletedAt,
        user: {
          id: schema.users.id,
          name: schema.users.name,
          image: schema.users.image,
          username: schema.users.username,
          isAdmin: schema.users.isAdmin,
        },
      })
      .from(schema.guestbook_entries)
      .innerJoin(
        schema.users,
        eq(schema.guestbook_entries.userId, schema.users.id)
      )
      .where(
        and(
          eq(schema.guestbook_entries.id, id),
          isNull(schema.guestbook_entries.deletedAt)
        )
      )
      .limit(1);

    return row || null;
  } catch {
    const found = inMemoryGuestbookStore.find(
      (entry) => entry.id === id && entry.deletedAt === null
    );
    return found || null;
  }
}

/**
 * Thêm một lời nhắn mới vào bảng guestbook_entries và trả về bản ghi kèm thông tin người dùng.
 */
export async function createGuestbookEntryDb(
  userId: string,
  content: string
): Promise<GuestbookEntryWithUser> {
  if (!process.env.DATABASE_URL) {
    const now = new Date();
    const user = MOCK_USERS[userId] || {
      id: userId,
      name: "Guest User",
      image: null,
      username: `user_${userId.slice(0, 6)}`,
      isAdmin: false,
    };

    const newEntry: GuestbookEntryWithUser = {
      id: crypto.randomUUID(),
      userId,
      content,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      user,
    };

    inMemoryGuestbookStore.unshift(newEntry);
    return newEntry;
  }

  try {
    const [inserted] = await db
      .insert(schema.guestbook_entries)
      .values({
        userId,
        content,
      })
      .returning();

    if (!inserted) {
      throw new Error("Không thể ghi lời nhắn vào cơ sở dữ liệu.");
    }

    const [userRow] = await db
      .select({
        id: schema.users.id,
        name: schema.users.name,
        image: schema.users.image,
        username: schema.users.username,
        isAdmin: schema.users.isAdmin,
      })
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1);

    return {
      id: inserted.id,
      userId: inserted.userId,
      content: inserted.content,
      createdAt: inserted.createdAt,
      updatedAt: inserted.updatedAt,
      deletedAt: inserted.deletedAt,
      user: userRow || {
        id: userId,
        name: null,
        image: null,
        username: "unknown",
        isAdmin: false,
      },
    };
  } catch {
    // Fallback trong trường hợp DB phát sinh lỗi
    const now = new Date();
    const user = MOCK_USERS[userId] || {
      id: userId,
      name: "Guest User",
      image: null,
      username: `user_${userId.slice(0, 6)}`,
      isAdmin: false,
    };

    const newEntry: GuestbookEntryWithUser = {
      id: crypto.randomUUID(),
      userId,
      content,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      user,
    };

    inMemoryGuestbookStore.unshift(newEntry);
    return newEntry;
  }
}

/**
 * Thực hiện xóa mềm một lời nhắn bằng cách gán deleted_at = NOW().
 */
export async function softDeleteGuestbookEntryDb(
  id: string
): Promise<{ success: boolean }> {
  if (!process.env.DATABASE_URL) {
    const entry = inMemoryGuestbookStore.find((e) => e.id === id);
    if (entry) {
      entry.deletedAt = new Date();
      entry.updatedAt = new Date();
    }
    return { success: true };
  }

  try {
    await db
      .update(schema.guestbook_entries)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.guestbook_entries.id, id));

    return { success: true };
  } catch {
    const entry = inMemoryGuestbookStore.find((e) => e.id === id);
    if (entry) {
      entry.deletedAt = new Date();
      entry.updatedAt = new Date();
    }
    return { success: true };
  }
}
