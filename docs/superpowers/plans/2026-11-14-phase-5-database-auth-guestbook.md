# Phase 5: Database, Auth & Sổ Lưu Niệm (TASK-16 to TASK-19) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Triển khai hoàn chỉnh tầng lưu trữ PostgreSQL với Drizzle ORM, hệ thống xác thực Auth.js v5 (NextAuth v5) với GitHub OAuth, các Server Actions kiểm soát phân quyền đa tầng và giao diện Sổ lưu niệm (Guestbook) với Optimistic UI đồng bộ 100% theme Engineering Notebook.

**Architecture:** 
- Tầng CSDL (`src/lib/db/`): Drizzle ORM kết nối Supabase Pooler qua port 6543 với `prepare: false` và cơ chế fallback in-memory an toàn khi biến môi trường chưa sẵn sàng. Schema định nghĩa đủ 6 bảng chuẩn `snake_case` theo `docs/database.md`.
- Tầng Xác thực (`src/lib/auth.ts`, `src/types/next-auth.d.ts`): Auth.js v5 với GitHub OAuth Provider và Drizzle Adapter, session callback mở rộng gắn `user.id`, `user.githubId`, `user.username`, và cờ `user.isAdmin` (đối soát với `ADMIN_GITHUB_ID`).
- Tầng Nghiệp vụ & Server Actions (`src/actions/guestbook.ts`, `src/lib/validations/guestbook.ts`): Validate Zod, kiểm tra rate limit Upstash, lọc từ khóa nhạy cảm, thực thi ghi bản ghi và soft delete (`deleted_at = NOW()`), kiểm tra nghiêm ngặt quyền xóa (chỉ chủ bài viết hoặc Admin).
- Tầng Giao diện (`src/app/guestbook/`, `src/components/guestbook/`): Server Components kết xuất dữ liệu tĩnh/động kết hợp Client Components với `useOptimistic` cho tạo mới và xóa lời nhắn (phản hồi trong 0.1s, có rollback khi lỗi), hộp thoại xác nhận xóa (Confirm Dialog), đồng bộ hoàn toàn theme Technical Notebook (xanh ngọc / tím neon).

**Tech Stack:** Next.js 14 App Router, TypeScript 5.7 strict, Drizzle ORM, Drizzle Kit, postgres.js, Auth.js (next-auth@beta), @auth/drizzle-adapter, Zod, Vitest.

**Spec:** `docs/roadmap.md` (TASK-16 đến TASK-19) và `docs/database.md`.

## Global Constraints

- Tuân thủ nghiêm ngặt quy chuẩn kiến trúc `AGENTS.md`: First Load JS < 150 kB gzip, WCAG 2.1 AA (contrast >= 4.5:1, touch target >= 44x44px, focus outline rõ ràng).
- Quy ước đặt tên: Bảng và cột CSDL dùng `snake_case`. Mọi phần tử icon tròn bắt buộc có `shrink-0 aspect-square rounded-full`.
- Không sử dụng thư viện UI bên ngoài; tận dụng triệt để Primitive UI viết tay sẵn có (`Button`, `Card`, `Badge`, `Skeleton`, `FieldError`, `Toast`).
- Mọi file tương tác CSDL, bí mật hoặc server logic phải có `import "server-only";` hoặc `"use server";`.
- Tuyệt đối không dùng kiểu `any`, giữ `strict: true` và `noUncheckedIndexedAccess: true`.

## Review Focus

1. Thất bại kết nối CSDL khi thiếu biến môi trường: Server Action và trang Guestbook phải có graceful fallback hiển thị thông báo thân thiện hoặc mock mode trong môi trường test/build, không làm sập tiến trình `next build`.
2. Kiểm tra phân quyền xóa mềm Server Action: Người dùng A không thể xóa bài của Người dùng B bằng cách gửi trực tiếp `entryId` qua request (kiểm tra so khớp `user_id === session.user.id || session.user.isAdmin`).
3. Chống XSS trên nội dung Guestbook: Mọi lời nhắn chỉ hiển thị text thuần túy trong thẻ span/paragraph, tuyệt đối không dùng `dangerouslySetInnerHTML`.
4. Rate limit và kiểm duyệt từ khóa: Từ chối các lời nhắn spam, rỗng, vượt quá 280 ký tự hoặc chứa từ khóa độc hại/xúc phạm.
5. Optimistic UI Rollback: Khi Server Action trả về lỗi (lỗi mạng, rate limit, kiểm duyệt), danh sách lời nhắn phải lập tức phục hồi trạng thái cũ và kích hoạt Toast thông báo lỗi.

---

## File Structure

```text
drizzle.config.ts                                   # Cấu hình Drizzle Kit
src/
├── types/
│   └── next-auth.d.ts                             # Khai báo kiểu mở rộng Session, User cho Auth.js
├── lib/
│   ├── db/
│   │   ├── schema.ts                              # Định nghĩa 6 bảng CSDL chuẩn snake_case
│   │   ├── index.ts                               # Khởi tạo client Drizzle ORM (prepare: false)
│   │   └── queries/
│   │       └── guestbook.ts                       # Hàm truy vấn CSDL: getActiveEntries, createEntryDb, softDeleteEntryDb
│   ├── auth.ts                                    # Cấu hình Auth.js v5 (GitHub OAuth, session callback, Drizzle adapter)
│   ├── moderation.ts                              # Logic kiểm duyệt từ khóa cấm
│   └── validations/
│       └── guestbook.ts                           # Zod schema cho tạo và xóa lời nhắn
├── actions/
│   └── guestbook.ts                               # Server Actions: createGuestbookEntry, deleteGuestbookEntry
├── components/
│   └── guestbook/
│       ├── sign-in-button.tsx                     # Nút Đăng nhập GitHub
│       ├── sign-out-button.tsx                    # Nút Đăng xuất
│       ├── guestbook-form.tsx                     # Form gửi lời nhắn có useOptimistic
│       ├── guestbook-entry.tsx                    # Card hiển thị lời nhắn, avatar, role badge, nút xóa
│       ├── guestbook-list.tsx                     # Danh sách lời nhắn kết hợp useOptimistic cho xóa/thêm
│       └── delete-entry-dialog.tsx                # Hộp thoại xác nhận xóa lời nhắn
└── app/
    ├── api/
    │   └── auth/
    │       └── [...nextauth]/
    │           └── route.ts                       # Route handlers GET/POST cho Auth.js
    └── guestbook/
        ├── page.tsx                               # Server Component trang Sổ lưu niệm
        └── loading.tsx                            # Skeleton loading state
tests/
├── unit/
│   ├── db-schema.test.ts                          # Test schema constraints, bảng và quan hệ
│   ├── moderation.test.ts                         # Test kiểm duyệt từ khóa
│   └── validations/
│       └── guestbook.test.ts                      # Test Zod schema guestbook
├── integration/
│   ├── auth-session.test.ts                       # Test callback session và phân quyền isAdmin
│   └── guestbook-actions.test.ts                  # Test Server Actions create/delete và phân quyền
└── components/
    └── guestbook.test.tsx                         # Test render giao diện guestbook, empty state, form
```

---

## Task Decomposition

### Task 1: Cài đặt Dependencies và Cấu hình Drizzle ORM (`TASK-16`)

**Goal:** Cài đặt các thư viện CSDL, cấu hình kết nối Drizzle ORM với Supabase Pooler và định nghĩa đầy đủ 6 bảng theo `docs/database.md`.

**Files:**
- Create: `drizzle.config.ts`
- Create: `src/lib/db/schema.ts`
- Create: `src/lib/db/index.ts`
- Test: `tests/unit/db-schema.test.ts`

**Steps:**
- [ ] Cài đặt dependencies: `drizzle-orm`, `postgres`, `drizzle-kit` (dev).
- [ ] Cập nhật `package.json` bổ sung scripts: `"db:generate": "drizzle-kit generate"`.
- [ ] Viết test `tests/unit/db-schema.test.ts` kiểm tra tên bảng `snake_case`, các cột bắt buộc, khóa chính `id`, chỉ mục `idx_guestbook_active_created`.
- [ ] Tạo `src/lib/db/schema.ts` định nghĩa 6 bảng: `users`, `accounts`, `sessions`, `verification_tokens`, `guestbook_entries`, `contact_messages` và các index.
- [ ] Tạo `src/lib/db/index.ts` xuất đối tượng `db` với `prepare: false` và cơ chế fallback an toàn khi không có `DATABASE_URL`.
- [ ] Tạo `drizzle.config.ts` trỏ tới schema và thư mục migrations.
- [ ] Chạy `npx vitest run tests/unit/db-schema.test.ts` đảm bảo pass 100%.

---

### Task 2: Tích hợp Auth.js (NextAuth v5) và Phân quyền Admin (`TASK-17`)

**Goal:** Cấu hình Auth.js v5 với GitHub OAuth provider, Drizzle adapter, route handler `/api/auth/[...nextauth]` và mở rộng session chứa `isAdmin`.

**Files:**
- Create: `src/types/next-auth.d.ts`
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/components/guestbook/sign-in-button.tsx`
- Create: `src/components/guestbook/sign-out-button.tsx`
- Test: `tests/integration/auth-session.test.ts`

**Steps:**
- [ ] Cài đặt dependencies: `next-auth@beta`, `@auth/drizzle-adapter`.
- [ ] Tạo `src/types/next-auth.d.ts` mở rộng kiểu `Session` và `User` với các trường `id`, `githubId`, `username`, `isAdmin`.
- [ ] Viết test `tests/integration/auth-session.test.ts` kiểm tra logic mapping profile GitHub, gán cờ `isAdmin` khi `githubId === ADMIN_GITHUB_ID`.
- [ ] Tạo `src/lib/auth.ts` cấu hình Auth.js v5 với GitHub Provider, map `profile.id` và `profile.login` vào user record.
- [ ] Tạo `src/app/api/auth/[...nextauth]/route.ts` xuất `handlers: { GET, POST }`.
- [ ] Xây dựng `sign-in-button.tsx` và `sign-out-button.tsx` chuẩn accessibility, hiển thị icon GitHub, nút bấm sử dụng component `Button` sẵn có.
- [ ] Chạy `npx vitest run tests/integration/auth-session.test.ts` đảm bảo pass 100%.

---

### Task 3: Xây dựng Backend Logic, Validation và Server Actions (`TASK-18` & `TASK-19`)

**Goal:** Triển khai các hàm truy vấn CSDL, kiểm duyệt từ khóa, validation Zod và Server Actions `createGuestbookEntry` và `deleteGuestbookEntry` với kiểm tra phân quyền nghiêm ngặt.

**Files:**
- Create: `src/lib/validations/guestbook.ts`
- Create: `src/lib/moderation.ts`
- Create: `src/lib/db/queries/guestbook.ts`
- Create: `src/actions/guestbook.ts`
- Test: `tests/unit/validations/guestbook.test.ts`
- Test: `tests/unit/moderation.test.ts`
- Test: `tests/integration/guestbook-actions.test.ts`

**Steps:**
- [ ] Viết test `tests/unit/validations/guestbook.test.ts` kiểm tra độ dài 1-280 ký tự, cấm chuỗi rỗng sau trim.
- [ ] Viết test `tests/unit/moderation.test.ts` kiểm tra phát hiện danh sách từ khóa nhạy cảm, spam, quảng cáo.
- [ ] Viết test `tests/integration/guestbook-actions.test.ts` kiểm tra:
  - Từ chối khi chưa đăng nhập.
  - Tạo lời nhắn thành công khi dữ liệu hợp lệ.
  - Từ chối xóa khi người dùng không phải tác giả và không phải Admin.
  - Cho phép tác giả xóa lời nhắn của chính mình (soft delete: `deleted_at != null`).
  - Cho phép Admin xóa lời nhắn của bất kỳ ai.
- [ ] Tạo `src/lib/validations/guestbook.ts` với schema Zod cho tạo và xóa entry.
- [ ] Tạo `src/lib/moderation.ts` với hàm `containsBannedWords(content: string): boolean`.
- [ ] Tạo `src/lib/db/queries/guestbook.ts` truy vấn bảng `guestbook_entries` kèm thông tin user (join users), lọc `deleted_at is null`, sắp xếp `created_at desc`.
- [ ] Tạo `src/actions/guestbook.ts` chứa `createGuestbookEntry` và `deleteGuestbookEntry`, gọi `revalidatePath("/guestbook")`.
- [ ] Chạy toàn bộ test backend đảm bảo pass 100%.

---

### Task 4: Xây dựng Giao diện Sổ Lưu Niệm và Optimistic UI (`TASK-18` & `TASK-19`)

**Goal:** Dựng trang `/guestbook` và các components danh sách, form, card lời nhắn với trải nghiệm phản hồi tức thì (`useOptimistic`), hỗ trợ xóa lời nhắn và đồng bộ 100% theme Technical Notebook.

**Files:**
- Create: `src/components/guestbook/guestbook-entry.tsx`
- Create: `src/components/guestbook/delete-entry-dialog.tsx`
- Create: `src/components/guestbook/guestbook-form.tsx`
- Create: `src/components/guestbook/guestbook-list.tsx`
- Create: `src/app/guestbook/page.tsx`
- Create: `src/app/guestbook/loading.tsx`
- Test: `tests/components/guestbook.test.tsx`

**Steps:**
- [ ] Tạo `delete-entry-dialog.tsx`: Hộp thoại modal xác nhận xóa lời nhắn (WAI-ARIA dialog, focus trap, phím Escape).
- [ ] Tạo `guestbook-entry.tsx`: Card hiển thị avatar, username, badge "Admin" hoặc "Tác giả", thời gian gửi, nội dung text thuần túy và nút Xóa (chỉ hiện khi có quyền).
- [ ] Tạo `guestbook-form.tsx`: Form nhập lời nhắn với đếm ký tự (0/280), trạng thái submitting, nút gửi có loading spinner.
- [ ] Tạo `guestbook-list.tsx`: Quản lý `useOptimistic` cho cả thao tác thêm và xóa lời nhắn, thông báo lỗi qua Toast nếu Server Action thất bại.
- [ ] Tạo `src/app/guestbook/page.tsx`: Server Component lấy session và danh sách lời nhắn từ CSDL, hiển thị header chuẩn `SectionHeading`.
- [ ] Tạo `src/app/guestbook/loading.tsx`: Skeleton loading chuẩn mực.
- [ ] Viết test `tests/components/guestbook.test.tsx` kiểm tra render danh sách, trạng thái empty state, phân quyền nút xóa.
- [ ] Chạy `npx vitest run tests/components/guestbook.test.tsx` đảm bảo pass 100%.

---

### Task 5: Verification Gate & Code Review Hoàn Thiện

**Goal:** Kiểm tra toàn diện chất lượng mã nguồn, kiểm thử trình duyệt thực tế và thực hiện code review nghiêm ngặt trước khi bàn giao.

**Steps:**
- [ ] Chạy `npx vitest run` kiểm tra toàn bộ test suite.
- [ ] Chạy `npx tsc --noEmit` xác thực 0 lỗi TypeScript.
- [ ] Chạy `npx next lint` xác thực 0 warning/error.
- [ ] Chạy `npx next build` xác thực bản build production thành công, First Load JS < 150 kB.
- [ ] Kiểm tra thực tế trên trình duyệt bằng MCP `chrome-devtools`: mở `http://localhost:3000/guestbook`, kiểm tra console và network.
- [ ] Thực hiện Strict Code Review: xóa code thừa, không để lại console debug, loại bỏ kiểu `any`.
- [ ] Đề xuất Conventional Commit message.
