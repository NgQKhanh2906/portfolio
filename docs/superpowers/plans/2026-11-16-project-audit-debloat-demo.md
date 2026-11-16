# Project Audit, De-bloating & Demo Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rà soát toàn diện dự án Portfolio, xử lý triệt để dead code và dữ liệu mockup lệch sau khi gộp dự án `backend-services`, xác minh 10 file dư thừa đã loại bỏ an toàn theo quy tắc Zero-Breakage, và chạy kiểm thử thực tế bản demo trên trình duyệt.

**Architecture:** Giữ nguyên kiến trúc phân tầng Next.js 14 App Router (`src/app`, `src/components`, `src/data`, `src/actions`, `src/lib`, `content/projects`). Loại bỏ các thành phần MDX/UI/Hook mồ côi không có tham chiếu, thay thế 2 hàm preview cũ (`TaskFlowMockupViewport`, `ShopLiteMockupViewport`) trong `src/components/projects/project-card.tsx` bằng `BackendServicesMockupViewport` đồng bộ với `content/projects/backend-services.mdx`, và hợp nhất kiểu `GuestbookUser`.

**Tech Stack:** Next.js 14.2.24 (App Router), React 18.3.1, TypeScript 5.7.3 (`strict: true`), Tailwind CSS 3.4.17, Drizzle ORM 0.45.4, NextAuth v5 beta, Vitest 2.1.8 + React Testing Library.

**Spec:** `docs/spec.md`, `docs/folder-structure.md`, `AGENTS.md`

## Global Constraints

- `strict: true`, `noUncheckedIndexedAccess: true`, không sử dụng kiểu `any`.
- Mọi file truy cập database hoặc secret trong `src/lib/` phải có `import "server-only";`.
- Bảo toàn 100% entry points (`src/app/**`), dynamic routes (`/projects/[slug]`, `/api/views/[slug]`, `/api/auth/[...nextauth]`), Drizzle migrations (`drizzle/**`) và cấu hình gốc.
- First Load JS cho mọi trang phải dưới `150 kB` gzip.
- Mọi phần tử hình tròn phải có `shrink-0 aspect-square rounded-full`.

## Review Focus

1. **Đồng bộ slug dự án `backend-services` trong `ProjectCard`:** Trên trang `/projects`, thẻ dự án `backend-services` phải hiển thị đúng địa chỉ `api.nqkhanh.dev` trên thanh địa chỉ `BrowserMockup` và hiển thị `BackendServicesMockupViewport` (`data-testid="mockup-backend-services"`) thay vì rơi vào `DefaultMockupViewport`.
2. **Bảo toàn static generation cho `/projects/[slug]`:** `npm run validate:content` và `npm run build` phải biên dịch thành công cả 2 trang tĩnh `/projects/portfolio` và `/projects/backend-services` với đủ 6/6 headings chuẩn Case Study.
3. **Không gãy tham chiếu sau khi xóa 11 file dư thừa:** Toàn bộ `npm run typecheck`, `npm run lint`, `npm test` và `npm run build` phải đạt 0 lỗi, 0 cảnh báo.
4. **Rò rỉ timer trong test Toast:** `afterEach` trong `tests/components/toast.test.tsx` phải bọc `vi.runOnlyPendingTimers()` trong `act(...)` để không phát sinh cảnh báo React state update ngoài `act`.
5. **Hoạt động thực tế trên trình duyệt Desktop & Mobile:** Không có lỗi Console hay request 4xx/5xx khi điều hướng qua `/`, `/projects`, `/projects/portfolio`, `/projects/backend-services`, `/lab`, `/guestbook`.

---

## Danh sách File Dư thừa Đã Xác minh Theo Quy tắc Bảo toàn (Zero-Breakage Audit)

| STT | Đường dẫn File | Loại File | Kết quả Truy vết Tham chiếu (`import` / `require` / config) | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `content/projects/shoplite.mdx` | Nội dung MDX cũ | Đã hợp nhất nội dung vào `content/projects/backend-services.mdx` | Xác nhận xóa |
| 2 | `content/projects/taskflow.mdx` | Nội dung MDX cũ | Đã hợp nhất nội dung vào `content/projects/backend-services.mdx` | Xác nhận xóa |
| 3 | `public/images/grid-dot.svg` | Asset tĩnh thừa | 0 tham chiếu (nền lưới dùng `radial-gradient` tại `.hero-grid-pattern` trong `globals.css`) | Xác nhận xóa |
| 4 | `src/components/mdx/callout.tsx` | Component mồ côi | 0 tham chiếu trong `src/` (`mdx-content.tsx` không gọi `Callout`) | Xác nhận xóa |
| 5 | `src/components/mdx/metric.tsx` | Component mồ côi | 0 tham chiếu trên toàn bộ workspace | Xác nhận xóa |
| 6 | `src/components/ui/spinner.tsx` | Component mồ côi | 0 tham chiếu trên toàn bộ workspace (`Button` dùng trực tiếp `Loader2`) | Xác nhận xóa |
| 7 | `src/hooks/use-media-query.ts` | Hook mồ côi | 0 tham chiếu trên toàn bộ workspace | Xác nhận xóa |
| 8 | `src/lib/site-config.ts` | Wrapper 1 dòng thừa | Re-export trùng lặp `export * from "@/data/site-config"`, toàn bộ app đã import `@/data/site-config` | Xác nhận xóa |
| 9 | `tests/components/callout.test.tsx` | Test của file đã xóa | Chỉ test `src/components/mdx/callout.tsx` | Xác nhận xóa |
| 10 | `tests/unit/example.test.ts` | Test nháp khởi tạo | Test mẫu `expect(1 + 1).toBe(2)` không kiểm thử logic dự án | Xác nhận xóa |
| 11 | `tsconfig.tsbuildinfo` | Build artifact tạm | File cache biên dịch TypeScript, đã có trong `.gitignore` | Xác nhận xóa |

---

### Task 1: Tinh gọn Dead Code trong `project-card.tsx` và Đồng bộ Mockup cho `backend-services`

**Files:**
- Modify: `src/components/projects/project-card.tsx`
- Test: `tests/components/project-card.test.tsx`

**Interfaces:**
- Produces:
  - `getProjectMockupUrl(slug: string, demoLink?: string): string` (trả về `"nqkhanh.dev"` cho `"portfolio"`, `"api.nqkhanh.dev"` cho `"backend-services"`)
  - `BackendServicesMockupViewport(): React.JSX.Element` (`data-testid="mockup-backend-services"`)
  - `ProjectMockupViewport({ slug, title }: { slug: string; title?: string }): React.JSX.Element`

- [x] **Step 1: Cập nhật unit test trong `tests/components/project-card.test.tsx` để kiểm thử `backend-services` thay cho 2 dự án cũ `taskflow` và `shoplite`**

```tsx
  it("renders backend API architecture preview for backend-services project", () => {
    const backendProject: ProjectFrontmatter = {
      ...mockProject,
      title: "Hệ thống Quản lý Bán hàng & Dịch vụ Backend",
      slug: "backend-services",
      links: { source: "https://github.com/NgQKhanh2906/backend-services" },
    };
    render(<ProjectCard project={backendProject} />);
    expect(screen.getByText("api.nqkhanh.dev")).toBeInTheDocument();
    expect(screen.getByTestId("mockup-backend-services")).toBeInTheDocument();
    expect(screen.getByText("Spring Boot REST API")).toBeInTheDocument();
    expect(screen.getByText("POST /api/v1/orders")).toBeInTheDocument();
    expect(screen.getByText("ACID Transaction")).toBeInTheDocument();
  });
```

- [x] **Step 2: Chạy test để xác nhận test mới fail**

Run: `npx vitest run tests/components/project-card.test.tsx`
Expected: FAIL với thông báo không tìm thấy `api.nqkhanh.dev` và `mockup-backend-services`

- [x] **Step 3: Tinh gọn `src/components/projects/project-card.tsx`**

Xóa `TaskFlowMockupViewport`, `ShopLiteMockupViewport` và các icon không dùng (`Laptop`, `Layers`, `Cpu`); thêm `BackendServicesMockupViewport` hiển thị kiến trúc `Spring Boot REST API`, endpoint `POST /api/v1/orders`, trạng thái `ACID Transaction` và `MySQL 3NF + Docker`; cập nhật `getProjectMockupUrl` và `ProjectMockupViewport` cho `case "backend-services"`.

- [x] **Step 4: Chạy lại unit test để xác nhận pass**

Run: `npx vitest run tests/components/project-card.test.tsx`
Expected: PASS (6/6 tests)

---

### Task 2: Hợp nhất Kiểu Dữ liệu `GuestbookUser` và Kiểm tra Tĩnh Toàn Dự án

**Files:**
- Modify: `src/types/guestbook.ts`
- Modify: `src/lib/db/queries/guestbook.ts`
- Test: `tests/integration/guestbook-actions.test.ts`, `tests/components/guestbook.test.tsx`

**Interfaces:**
- Consumes: `GuestbookUser` từ `src/types/guestbook.ts`
- Produces: Re-export `GuestbookUser` nhất quán giữa `src/types/guestbook.ts` và `src/lib/db/queries/guestbook.ts`

- [x] **Step 1: Đồng bộ hóa định nghĩa `GuestbookUser` và kiểm tra bằng `npm run typecheck`, `npm run lint`, `npm test`**

Run: `npm run typecheck && npm run lint && npm test && npm run validate:content`
Expected: 0 lỗi TypeScript, 0 lỗi ESLint, 100% test files pass, 2/2 file MDX hợp lệ.

---

### Task 3: Build Production, Chạy Thử Bản Demo và Kiểm thử Trình duyệt Thực tế (`@verification-before-completion`)

**Files:**
- Create: `src/app/contact/page.tsx` (xử lý triệt để lỗi 404 prefetch `/contact?_rsc=...` trên thanh Header)
- Modify: `docs/worklog.md` (cập nhật ghi chú rà soát & tinh gọn codebase)

- [x] **Step 1: Chạy `npm run build` để xác minh bản build production sau khi tinh gọn**

Run: `npm run build`
Expected: Exit code 0, toàn bộ routes biên dịch thành công, First Load JS < 150 kB.

- [x] **Step 2: Khởi chạy server và nghiệm thu qua Browser Subagent / Chrome DevTools**

Kiểm tra các trang `/`, `/projects`, `/projects/portfolio`, `/projects/backend-services`, `/lab`, `/guestbook`, `/contact` trên cả viewport Desktop (`1366x768`) và Mobile (`375x667`), xác nhận 0 lỗi Console, 0 lỗi Hydration, 0 request 4xx/5xx, sau đó tắt server.
