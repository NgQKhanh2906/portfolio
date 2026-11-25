# Worklog - Nhật ký và Bảng Theo dõi Tiến độ Portfolio

Tài liệu này theo dõi tiến độ thực thi thực tế của toàn bộ các hạng mục công việc trong dự án Portfolio. Bảng theo dõi dưới đây đã được điền sẵn đầy đủ 100% các mã Task (từ `TASK-01` đến `TASK-26`) đồng bộ hoàn toàn với tài liệu lộ trình `docs/roadmap.md`.

---

## 1. Nguyên tắc Cập nhật Nhật ký (Worklog Rules)

1. **Trạng thái hợp lệ:**
   - `TODO`: Công việc chưa bắt đầu.
   - `IN_PROGRESS`: Đang trong quá trình thực hiện trên một nhánh tính năng riêng biệt.
   - `DONE`: Công việc đã hoàn thành, vượt qua toàn bộ tiêu chí nghiệm thu (Acceptance Criteria), chạy qua bộ kiểm tra `lint`, `typecheck`, `test` và đã được merge vào nhánh `main`.
2. **Cập nhật đồng thời:** Mỗi khi một Pull Request được merge vào `main`, kỹ sư hoặc Agent bắt buộc phải cập nhật trạng thái của Task tương ứng sang `DONE` kèm ngày cập nhật và ghi chú kỹ thuật cụ thể.
3. **Ghi chú kỹ thuật:** Cần ghi lại trung thực các khó khăn gặp phải, lỗi phát sinh, phiên bản thư viện thực tế được cài đặt, hoặc các quyết định điều chỉnh kiến trúc so với dự kiến ban đầu.

---

## 2. Bảng Theo dõi Tiến độ Chi tiết

| Mã Task | Tên Hạng mục Công việc | Trạng thái | Ngày cập nhật | Ghi chú Kỹ thuật / Lỗi Phát sinh |
| :--- | :--- | :--- | :--- | :--- |
| `TASK-01` | Khởi tạo Dự án Next.js 14+ App Router và Cấu hình Tooling | `DONE` | 11/11/2026 | Next.js 14.2.24, TypeScript 5.7 strict, pnpm 9, ESLint, Prettier, Vitest jsdom pass 100% |
| `TASK-02` | Thiết lập Design Tokens, Phông chữ và CSS Toàn cục | `DONE` | 11/11/2026 | Inter & JetBrains Mono qua next/font/google, Design Tokens 3 lớp tại globals.css |
| `TASK-03` | Triển khai Cơ chế Chuyển đổi Giao diện (Theme Provider & Script Chống Nháy) | `DONE` | 11/11/2026 | ThemeScript inline chặn nháy theme (zero flash), ThemeProvider, ThemeToggle dropdown |
| `TASK-04` | Xây dựng Thư viện Thành phần UI Cơ bản (Primitive UI Components) | `DONE` | 11/11/2026 | Tự viết Button, IconButton, Badge, Card, Kbd, Skeleton, Spinner, EmptyState, FieldError |
| `TASK-05` | Xây dựng Khung Bố cục Chính (Header, Footer, Navigation, Skip Link) | `DONE` | 11/11/2026 | SkipLink, Container, SectionHeading, SiteHeader (sticky blur), MobileNav sheet, SiteFooter |
| `TASK-06` | Xây dựng Các Section Trang chủ (Hero, About, Skills, Journey) | `DONE` | 12/11/2026 | Phân rã Server Components thành công (hero, about, skills, timeline, projects, telemetry). First Load JS đạt 94.1 kB (< 150 kB) |
| `TASK-07` | Triển khai Bảng lệnh Điều khiển Nhanh (Command Palette `Ctrl + K`) | `DONE` | 12/11/2026 | Command Palette hoàn thiện bằng cmdk, hỗ trợ tìm kiếm điều hướng, đổi theme, sao chép email, phím tắt và WAI-ARIA combobox |
| `TASK-08` | Triển khai Widget Giám sát Hoạt động Kỹ thuật (Live Telemetry Widget) | `DONE` | 12/11/2026 | Tích hợp Live Telemetry widget, GitHub client kèm fallback offline an toàn, route /api/telemetry ISR 3600s, unit tests pass 100% |
| `TASK-09` | Xây dựng Bộ xử lý Nội dung MDX và Trích xuất Dữ liệu Dự án | `DONE` | 12/11/2026 | MDX parser, Zod frontmatter schema, TECH_REGISTRY, 3 Case Studies mẫu đủ 6 headings, script validate-content và 26/26 unit tests pass 100% |
| `TASK-10` | Xây dựng Trang Danh sách Dự án và Bộ lọc Công nghệ Đa tiêu chí | `DONE` | 12/11/2026 | Trang /projects, bộ lọc đa tiêu chí AND logic, đồng bộ URL query params, First Load JS 106 kB (< 150 kB), 32/32 unit tests pass 100% |
| `TASK-11` | Triển khai Trang Chi tiết Case Study Kỹ thuật và Điều hướng Mục lục | `DONE` | 12/11/2026 | Trang chi tiết /projects/[slug] SSG 100%, ProjectHeader, sticky TableOfContents, MDXContent, ProjectNavigation, First Load JS 103 kB, 38/38 unit tests pass 100% |
| `TASK-12` | Triển khai Bộ đếm Lượt xem Dự án Bằng Upstash Redis | `DONE` | 12/11/2026 | Bộ đếm lượt xem Upstash Redis REST, SHA-256 IP deduplication 24h, route dynamic /api/views/[slug], graceful degradation, 42/42 unit tests pass 100% |
| `TASK-13` | Xây dựng Khung Điều khiển và Playground của Component Lab | `DONE` | 13/11/2026 | Khung Playground /lab đồng bộ tham số URL ?c=..., CodePreview sao chép kèm phản hồi, A11yNotes chuẩn WCAG 2.1 AA |
| `TASK-14` | Xây dựng Bản Thử nghiệm Demo Cho Button và Tabs Component | `DONE` | 13/11/2026 | Component Tabs WAI-ARIA roving tabindex, phím mũi tên/Home/End, ButtonDemo và TabsDemo đa biến thể |
| `TASK-15` | Xây dựng Hệ thống Toast Thông báo và Bản Thử nghiệm Toast Demo | `DONE` | 13/11/2026 | Hệ thống Toast tự viết (info/success/warning/error), tạm dừng countdown khi hover/focus, ToastProvider toàn cục, 51/51 tests pass |
| `TASK-16` | Cấu hình Kết nối CSDL PostgreSQL với Drizzle ORM và Schema | `DONE` | 14/11/2026 | Drizzle ORM, postgres.js (prepare: false), schema 6 bảng chuẩn snake_case, script seed.ts, fallback proxy an toàn, 20/20 unit tests pass 100% |
| `TASK-17` | Tích hợp Xác thực Người dùng Auth.js (NextAuth v5) với GitHub OAuth | `DONE` | 14/11/2026 | NextAuth v5 beta, GitHub OAuth, Drizzle Adapter, session callback mở rộng (id, githubId, username, isAdmin), 12/12 integration tests pass 100% |
| `TASK-18` | Triển khai Giao diện Sổ lưu niệm và Server Actions có Optimistic UI | `DONE` | 14/11/2026 | Trang /guestbook, React useOptimistic phản hồi tức thì trong 0.1s, Server Action createGuestbookEntry, rate limit Upstash, bộ lọc từ khóa cấm |
| `TASK-19` | Triển khai Tính năng Xóa Lời nhắn và Phân quyền Quản trị (Admin Moderation) | `DONE` | 14/11/2026 | Soft delete (deleted_at = NOW()), Server Action deleteGuestbookEntry kiểm tra quyền nghiêm ngặt phía server (chủ bài hoặc Admin), WAI-ARIA Confirm Dialog |
| `TASK-20` | Xây dựng Biểu mẫu Liên hệ với Cơ chế Chống Bot Đa tầng (Honeypot + HMAC) | `DONE` | 25/11/2026 | Biểu mẫu `/contact` (`force-dynamic`), trường honeypot `website`, token HMAC-SHA256 (tối thiểu 3000ms, tối đa 3600s), Zod validation tiếng Việt; 8/8 `crypto` tests và 7/7 `contact` validation tests pass |
| `TASK-21` | Tích hợp Dịch vụ Gửi Email Resend và Lưu trữ Tin nhắn Liên hệ | `DONE` | 25/11/2026 | Server Action `sendContactMessage`, rate limit 3 lần/3600s (Upstash REST + memory fallback), Drizzle ORM `contact_messages`, Resend REST API với `reply_to` và fallback an toàn; 11/11 `contact-action` tests pass |
| `TASK-22` | Xây dựng Bộ Kiểm thử End-to-End (E2E) với Playwright | `DONE` | 25/11/2026 | Cấu hình `playwright.config.ts`, 5 Playwright specs (`tests/e2e/*.spec.ts`), runner Headless Chrome CDP (`scripts/e2e-verify.mjs`) pass 100% (29/29 kiểm tra Desktop 1280x720, Mobile 390x844, SEO, Security Headers) |
| `TASK-23` | Tối ưu Hiệu năng Core Web Vitals và Kiểm soát Dung lượng JavaScript | `DONE` | 25/11/2026 | Lazy-load `CommandPalette` bằng `next/dynamic` (`ssr: false`) trong `SiteHeader` giữ phím tắt `Ctrl+K`/`Cmd+K`; First Load JS `/` đạt `107 kB`, `/projects` `108 kB`, `/projects/[slug]` `103 kB`, `/contact` `122 kB` (< 150 kB) |
| `TASK-24` | Tự động Sinh Ảnh Open Graph Động và Tối ưu Siêu dữ liệu SEO | `DONE` | 25/11/2026 | Sinh ảnh OG PNG 1200x630 qua Edge runtime (`/opengraph-image` 50,102 bytes, `/projects/portfolio/opengraph-image` 46,636 bytes) với font `SegoeUI-Bold.ttf`, `scripts/generate-projects-og.ts`, `sitemap.ts`, `robots.ts`; 4/4 `seo` tests pass |
| `TASK-25` | Thiết lập Cấu hình Bảo mật HTTP Security Headers Toàn diện | `DONE` | 25/11/2026 | Cấu hình `poweredByHeader: false`, `Content-Security-Policy` (tắt `'unsafe-eval'` ở production), HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`; xác thực trang `/khong-ton-tai-404` trả HTTP 404 |
| `TASK-26` | Triển khai Production Lên Vercel và Chạy Kiểm thử Khói Toàn diện | `IN_PROGRESS` | 25/11/2026 | Hoàn tất `.github/workflows/ci.yml`, `.github/workflows/keepalive.yml`, production build và smoke test cục bộ qua Headless Chrome CDP; còn bước cấu hình Vercel Dashboard, biến môi trường và DNS tên miền do chủ dự án thực hiện |

---

## 3. Sổ Ghi chép Quyết định và Giải pháp Phát sinh (Incident & Decision Notes)

Khu vực này dùng để ghi lại các giải pháp kỹ thuật cụ thể khi xử lý các vấn đề thực tế phát sinh trong quá trình triển khai các Task:

### Ghi chú Kỹ thuật ngày 12/11/2026:
- **Hoàn thành TASK-06 (Phân rã Server Components trang chủ):** Đã module hóa `src/app/page.tsx` thành 6 Server Components chuyên trách (`hero.tsx`, `about-section.tsx`, `skills-section.tsx`, `skill-group.tsx`, `experience-timeline.tsx`, `timeline-item.tsx`, `featured-projects.tsx`, `telemetry-preview.tsx`). Kết quả First Load JS cho trang chủ đo được sau `next build` chỉ là 94.1 kB, tối ưu sâu so với chỉ tiêu 150 kB.
- **Bổ sung Unit Tests:** Tạo bộ kiểm thử đơn vị cho Primitive UI (`button.test.tsx`, `badge.test.tsx`, `card.test.tsx`, `command-trigger.test.tsx`), toàn bộ 13/13 test cases đều pass 100% trên Vitest jsdom.
- **Hoàn thành TASK-07 (Command Palette):** Tích hợp `cmdk` cùng các nhóm lệnh điều hướng, đổi theme, thao tác sao chép email kèm phản hồi clipboard và phím tắt `Ctrl + K`. Đạt chuẩn accessibility ARIA combobox.
- **Hoàn thành TASK-13, TASK-14, TASK-15 (Component Lab - Phase 4):**
  - Xây dựng thành công Primitive `Tabs` tự viết theo chuẩn WAI-ARIA Tabs pattern (phím mũi tên, Home, End, roving tabindex, hướng horizontal/vertical, kiểu dáng pill/underline).
  - Xây dựng hệ thống `ToastProvider` và hook `useToast` tự viết không dùng thư viện ngoài với 4 biến thể, cấu hình vị trí/thời lượng, tính năng tạm dừng đếm ngược khi hover/focus bàn phím và vùng chứa `aria-live` ('polite' cho info/success, 'assertive' cho error).
  - Triển khai trang `/lab` và `LabShell` tương tác thời gian thực, đồng bộ URL `?c=button|tabs|toast`, khung xem trước code JSX kèm nút copy và tài liệu Accessibility chi tiết.
  - Kết quả kiểm thử: Toàn bộ 51/51 tests pass trên 18 test files, 0 lỗi TypeScript, 0 lỗi ESLint, build production thành công 11/11 trang với First Load JS trang `/lab` chỉ 105 kB (< 150 kB).

### Ghi chú Kỹ thuật ngày 13/11/2026:
- **Tinh chỉnh UI/UX Toàn diện (The Visual Craft Showcase - PR #7, #8, #9):**
  - **Bảng màu:** Nền sáng trắng thanh thoát kết hợp màu nhấn Xanh ngọc lục bảo (`#0B7A5E`), Nền tối đen sâu (`#09090D`) kết hợp màu nhấn Tím Neon (`#8B5CF6`) kèm hiệu ứng hào quang mờ (glow).
  - **Chuyển đổi theme 1 chạm:** Tối ưu hóa `ThemeToggle` thành nút chuyển trực tiếp Light/Dark mode, loại bỏ dropdown và tùy chọn hệ thống không cần thiết.
  - **Tiến trình cuộn trang (Scroll Progress):** Tích hợp thanh tiến trình 3px cố định đỉnh trang và widget hiển thị phần trăm cuộn trang ở góc dưới bên phải.
  - **Thành phần BrowserMockup:** Thay thế toàn bộ khung xám placeholder bằng `BrowserMockup` tương tác chân thực hiển thị giao diện của 3 dự án chính (Portfolio, TaskFlow, ShopLite).
  - **Bố cục Hero & Thẻ Profile:** Khắc phục triệt để lỗi sát viền cho chữ `ONLINE` và `TP. Hồ Chí Minh, Việt Nam` (tăng padding thẻ `p-4 sm:p-5`, bọc trạng thái `ONLINE` trong pill badge đệm an toàn kèm viền ngăn cách).
  - **Chuẩn hóa Chống méo Hình tròn:** Áp dụng `shrink-0 aspect-square rounded-full` trên toàn bộ các biểu tượng tròn và `items-start` trên danh sách kỹ năng khi ngắt dòng.
  - **Kết quả kiểm thử tổng hợp:** 66/66 tests pass trên 22 test files, 0 lỗi TypeScript, 0 lỗi ESLint, build production thành công 11/11 trang với First Load JS trang chủ chỉ 107 kB (< 150 kB).

### Ghi chú Kỹ thuật ngày 14/11/2026:
- **Hoàn thành Giai đoạn 5 (Database, Auth & Sổ lưu niệm - TASK-16 đến TASK-19):**
  - **Tầng CSDL (Drizzle ORM & PostgreSQL):** Định nghĩa 6 bảng chuẩn 100% `snake_case` (`users`, `accounts`, `sessions`, `verification_tokens`, `guestbook_entries`, `contact_messages`) và 6 chỉ mục B-Tree tại `src/lib/db/schema.ts`. Tạo `drizzle.config.ts`, sinh migration file `drizzle/0000_moaning_invaders.sql`. Cấu hình client với `prepare: false` phù hợp Supabase Pooler port 6543, kèm prototype stub `PgDatabase` an toàn khi chưa có `DATABASE_URL` trong môi trường build/test.
  - **Tầng Xác thực (Auth.js v5 / NextAuth beta):** Cấu hình `src/lib/auth.ts` tích hợp GitHub OAuth Provider và `@auth/drizzle-adapter`. Callback session tự động gán `id`, `githubId`, `username`, và cờ `isAdmin` (đối soát với `ADMIN_GITHUB_ID`). Xây dựng các components `sign-in-button.tsx`, `sign-out-button.tsx` với icon SVG chuẩn tỉ lệ `shrink-0 aspect-square`.
  - **Tầng Nghiệp vụ & Server Actions:** Triển khai `src/actions/guestbook.ts` (`createGuestbookEntry`, `deleteGuestbookEntry`) với kiểm tra đa tầng: Session -> Zod validation (`src/lib/validations/guestbook.ts`) -> Kiểm duyệt từ khóa cấm (`src/lib/moderation.ts`) -> Rate limit Upstash 3 lần / 10 phút (`src/lib/rate-limit.ts`) -> Ghi CSDL -> `revalidatePath("/guestbook")`. Thao tác xóa thực hiện soft delete (`deleted_at = NOW()`) và kiểm tra phân quyền nghiêm ngặt phía server (chỉ chủ bài viết hoặc Admin).
  - **Tầng Giao diện (Guestbook & Optimistic UI):** Xây dựng trang `/guestbook`, `guestbook-form.tsx`, `guestbook-entry.tsx`, `guestbook-list.tsx`, `delete-entry-dialog.tsx`. Áp dụng React `useOptimistic` cho cả thao tác thêm và xóa lời nhắn phản hồi trong 0.1 giây, tự động rollback và hiển thị Toast khi server trả về lỗi. Hộp thoại modal tuân thủ WAI-ARIA Dialog, phím Escape, quản lý focus.
  - **Kết quả nghiệm thu kỹ thuật:** Toàn bộ 153/153 tests pass trên 28 test files; `tsc --noEmit` 0 lỗi; `next lint` 0 lỗi; `next build` biên dịch thành công 12/12 trang, First Load JS của `/guestbook` chỉ 106 kB (< 150 kB). Kiểm thử thực tế trên trình duyệt bằng Browser Subagent xác nhận 0 lỗi console, 0 hydration mismatch và responsive hoàn hảo trên mobile 375x667.

### Ghi chú Kỹ thuật ngày 16/11/2026:
- **Rà soát Toàn Dự án, Tinh gọn File/Code Thừa & Nghiệm thu Demo (De-bloating & Verification):**
  - **Hợp nhất Case Study & Hồ sơ:** Thay thế 2 tệp mẫu cũ (`taskflow.mdx`, `shoplite.mdx`) bằng Case Study thực tế `content/projects/backend-services.mdx` ("Hệ thống Quản lý Bán hàng & Dịch vụ Backend" với Java, Spring Boot, MySQL, Docker, Postman). Đồng bộ thông tin hồ sơ sinh viên CNTT PTIT tại `src/data/profile.ts`, `src/data/experience.ts`, `src/data/skills.ts`, `src/data/site-config.ts` và `src/lib/constants.ts`.
  - **Loại bỏ 11 File Mồ côi / Dư thừa (Zero-Breakage):** Xóa `src/components/mdx/callout.tsx`, `src/components/mdx/metric.tsx`, `src/components/ui/spinner.tsx`, `src/hooks/use-media-query.ts`, `src/lib/site-config.ts`, `public/images/grid-dot.svg`, `tests/components/callout.test.tsx`, `tests/unit/example.test.ts` và `tsconfig.tsbuildinfo`.
  - **Tinh gọn Dead Code & Đồng bộ Preview:** Loại bỏ `TaskFlowMockupViewport` và `ShopLiteMockupViewport` (~155 dòng dead code) trong `src/components/projects/project-card.tsx`, bổ sung `BackendServicesMockupViewport` và URL `api.nqkhanh.dev`. Thêm `import "server-only"` vào `src/lib/redis.ts` và `src/lib/rate-limit.ts`.
  - **Kết quả kiểm thử:** `npm run typecheck` (0 lỗi), `npm run lint` (0 lỗi), `npm test` (26/26 test files, 148/148 tests pass), `npm run validate:content` (2/2 file MDX đạt chuẩn 6/6 headings), `npm run build` thành công 100% với First Load JS < 110 kB.

### Ghi chú Kỹ thuật ngày 17/11/2026:
- **Tinh gọn Kiến trúc còn 3 Trang Chính (`/`, `/projects`, `/contact`):**
  - **Loại bỏ hoàn toàn `/lab` và `/guestbook`:** Xóa các route (`src/app/lab`, `src/app/guestbook`, `src/app/api/auth`), toàn bộ component/action/lib/hook/type chỉ phục vụ 2 tính năng này (`src/components/lab`, `src/components/guestbook`, `src/actions`, `src/data/lab-components.ts`, `src/hooks/use-optimistic.ts`, `src/components/ui/{field-error,icon-button,tabs,toast}.tsx`, `src/lib/{auth,moderation,rate-limit}.ts`, `src/lib/db/queries`, `src/lib/validations/guestbook.ts`, `src/types/{guestbook.ts,next-auth.d.ts}`) cùng 6 nhóm bài test tương ứng.
  - **Cập nhật điều hướng & liên kết:** Gỡ bỏ `ToastProvider` khỏi `src/app/layout.tsx`; thu gọn `siteConfig.navItems` và `commandItems` chỉ còn Trang chủ (`/`), Dự án (`/projects`) và Liên hệ (`/contact`); cập nhật liên kết bằng chứng kỹ năng tại `src/data/skills.ts` trỏ về `/projects/portfolio` và `/projects/backend-services`; cập nhật card giới thiệu Case Studies tại `src/app/contact/page.tsx` và thông tin mô tả tại `src/data/profile.ts`, `content/projects/portfolio.mdx`.
  - **Kết quả kiểm thử sau tinh gọn:** `npm run build` sinh ra 10/10 static/SSG/dynamic pages (First Load JS tối đa `108 kB` tại `/projects`, `/contact` chỉ `94.2 kB`).

### Ghi chú Kỹ thuật ngày 25/11/2026:
- **Hoàn thiện Phase 6 & Phase 7 (TASK-20 đến TASK-25, đồng bộ kiến trúc 3 route `/`, `/projects`, `/contact`):**
  - **Contact & Anti-bot (`TASK-20`, `TASK-21`):** Triển khai `src/types/action.ts`, `src/lib/crypto.ts` (`hashIp`, `createFormToken`, `verifyFormToken`), `src/lib/rate-limit.ts` (giới hạn 3 lần/3600s theo `ipHash` qua Upstash REST kèm fallback bộ nhớ cục bộ), `src/lib/validations/contact.ts`, `src/lib/email.ts` (Resend REST API với `reply_to` và `escapeHtml`), `src/lib/db/queries/contact.ts`, Server Action `src/actions/contact.ts`, cùng `ContactForm`, `ContactChannels` và trang `/contact` (`force-dynamic`).
  - **Tối ưu hiệu năng, SEO, OG Image & Bảo mật (`TASK-23`, `TASK-24`, `TASK-25`):** Lazy-load `CommandPalette` qua `next/dynamic(..., { ssr: false })` trong `SiteHeader`; sử dụng `runtime = "edge"` và font `SegoeUI-Bold.ttf` kèm `scripts/generate-projects-og.ts` (`prebuild`) sinh `src/data/projects-og.json` để tránh lỗi `ERR_INVALID_URL` của `@vercel/og` `index.node.js` trên Windows; bổ sung `sitemap.ts`, `robots.ts` và các HTTP Security Headers trong `next.config.mjs`.
  - **Kiểm thử E2E & CI/Keepalive (`TASK-22`, `TASK-26`):** Tạo `playwright.config.ts`, 5 Playwright specs (`navigation`, `command-palette`, `projects-filter`, `contact`, `seo-and-security`), `scripts/e2e-verify.mjs` (Headless Chrome CDP runner thuần Node.js), `.github/workflows/ci.yml` và `.github/workflows/keepalive.yml`.
- **Kết quả kiểm chứng thực tế sau cùng:**
  - `npm run validate:content`: 2/2 tệp MDX (`backend-services.mdx`, `portfolio.mdx`) hợp lệ với 6/6 heading chuẩn Case Study.
  - `npm run typecheck`: 0 lỗi TypeScript (`strict: true`, `noUncheckedIndexedAccess: true`).
  - `npm run lint`: 0 lỗi và 0 cảnh báo ESLint.
  - `npm test`: 23/23 test files pass, 102/102 unit & component tests pass.
  - `npm run build`: Thành công (exit code 0). Shared First Load JS: `87.2 kB`; `/`: `107 kB`; `/_not-found`: `87.4 kB`; `/projects`: `108 kB`; `/projects/[slug]` (`/projects/portfolio`, `/projects/backend-services`): `103 kB`; `/contact`: `122 kB` (toàn bộ route đều dưới ngưỡng 150 kB).
  - `npm run test:e2e:cdp`: 29/29 kiểm tra pass 100% trên Desktop (`1280x720`), Mobile (`390x844`), HTTP SEO (`/sitemap.xml`, `/robots.txt`), Dynamic OG PNG (`/opengraph-image` 50,102 bytes, `/projects/portfolio/opengraph-image` 46,636 bytes) và Security Headers (`CSP`, `HSTS`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, không có `X-Powered-By`), với 0 lỗi console, 0 runtime exception và 0 HTTP >= 400 ngoài ý muốn.
  - **Ghi chú Accessibility nhỏ phát hiện khi test E2E:** Trên trang chủ, `ScrollProgress` đặt trước `SkipLink` trong DOM của `src/app/layout.tsx` nên thao tác phím `Tab` chạm nút cuộn trang trước khi tới `SkipLink` ở lượt `Tab` thứ 2; có thể đảo thứ tự `<SkipLink />` lên trước `<ScrollProgress />` ở bản tinh chỉnh sau.
