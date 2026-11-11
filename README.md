# Portfolio

Portfolio cá nhân dạng Web Application full-stack của một Web Developer. Trang web vừa là hồ sơ năng lực, vừa là sản phẩm phần mềm hoạt động thật: có database, xác thực OAuth, rate limiting, giám sát trực tiếp và tối ưu hiệu năng đo lường được.

Nguyên tắc xuyên suốt: **Show, don't tell** - mỗi kỹ năng ghi trên CV phải có một tính năng chạy được trên trang để chứng minh.

---

## 1. Mục tiêu dự án

| Mục tiêu | Tiêu chí đo lường |
| :--- | :--- |
| Tạo ấn tượng trong 15 giây đầu với HR | Hero section hiển thị tên, vai trò, CTA "Xem dự án" và "Tải CV" ngay màn hình đầu, không cần cuộn |
| Chứng minh năng lực Frontend | Command Palette, Theme switch, Component Lab hoạt động đầy đủ bằng bàn phím |
| Chứng minh năng lực Backend | Guestbook có GitHub OAuth, ghi PostgreSQL, Zod validation, rate limit bằng Redis |
| Chứng minh tư duy hiệu năng | Lighthouse (mobile) Performance, Accessibility, Best Practices, SEO đều đạt từ 95 trở lên |
| Chứng minh tư duy kỹ sư | Mỗi dự án có Case Study gồm bài toán, kiến trúc, quyết định kỹ thuật, kết quả đo lường |
| Mã nguồn chuyên nghiệp | TypeScript strict, CI pass (lint, typecheck, test, build), commit theo Conventional Commits |

---

## 2. Tính năng chính (MVP)

1. **Trang chủ:** Hero, giới thiệu ngắn, kỹ năng nhóm theo lĩnh vực, dự án nổi bật, dòng thời gian kinh nghiệm/học vấn.
2. **Projects và Case Studies:** Danh sách dự án lọc theo công nghệ; trang chi tiết viết bằng MDX, có sơ đồ kiến trúc và bộ đếm lượt xem.
3. **Command Palette (`Ctrl + K` / `Cmd + K`):** Điều hướng, tìm dự án, đổi theme, sao chép email, tải CV.
4. **Theme:** Dark / Light / System, lưu lựa chọn, không nhấp nháy (no flash) khi tải trang.
5. **Guestbook:** Đăng nhập GitHub, để lại lời nhắn, xóa lời nhắn của chính mình; chủ trang có quyền kiểm duyệt.
6. **Contact form:** Gửi email qua Server Action, có honeypot chống bot và rate limit theo IP.
7. **Component Lab:** Trưng bày component tự viết, chỉnh props trực tiếp và xem code sinh ra.
8. **Live Telemetry:** Hoạt động GitHub gần nhất, commit đang được deploy, thời điểm build.
9. **SEO:** Metadata động, Open Graph image sinh tự động cho từng dự án, `sitemap.xml`, `robots.txt`.

Đặc tả chi tiết: [docs/spec.md](docs/spec.md).

---

## 3. Công nghệ sử dụng

| Lớp | Công nghệ | Vai trò |
| :--- | :--- | :--- |
| Framework | Next.js (App Router) + React + TypeScript | Server Components, Server Actions, Route Handlers, SSG/ISR |
| Styling | Tailwind CSS | Design token, responsive, dark mode |
| Animation | Motion (tên mới của Framer Motion) | Micro-interaction, chuyển cảnh, tôn trọng `prefers-reduced-motion` |
| Command Palette | `cmdk` | Danh sách lệnh có tìm kiếm mờ, hỗ trợ bàn phím |
| Icon | `lucide-react` | Icon giao diện |
| Nội dung | MDX (`next-mdx-remote` + `gray-matter`) | Viết Case Study bằng Markdown kèm component React |
| Database | PostgreSQL trên Supabase (Free tier) | Lưu user, guestbook, contact message |
| ORM | Drizzle ORM + drizzle-kit | Schema type-safe, migration |
| Auth | Auth.js (NextAuth) với GitHub Provider | OAuth 2.0, session |
| Cache / Rate limit | Upstash Redis + `@upstash/ratelimit` | Rate limit, đếm lượt xem |
| Email | Resend | Gửi email từ Contact form |
| Validation | Zod | Kiểm tra input ở server và client |
| Test | Vitest + Testing Library, Playwright | Unit test, E2E test |
| Deploy | Vercel | Preview mỗi Pull Request, Production từ nhánh `main` |

> Phiên bản cụ thể của từng thư viện được chốt tại thời điểm khởi tạo dự án (lấy bản stable mới nhất) và ghi vào `docs/worklog.md`. Không ghi version theo trí nhớ.

Lý do lựa chọn chi tiết: `docs/architecture.md` (Đợt 2).

---

## 4. Yêu cầu môi trường

- Node.js bản LTS đang được hỗ trợ (kiểm tra tại https://nodejs.org khi cài đặt).
- pnpm (trình quản lý package của dự án).
- Tài khoản: GitHub (tạo OAuth App), Supabase, Upstash, Resend, Vercel. Tất cả dùng gói miễn phí.

---

## 5. Khởi chạy nhanh

```bash
# 1. Clone mã nguồn
git clone https://github.com/<github-username>/portfolio.git
cd portfolio

# 2. Cài dependency
pnpm install

# 3. Tạo file môi trường và điền giá trị thật
cp .env.example .env.local

# 4. Đẩy schema lên database
pnpm db:migrate

# 5. (Tùy chọn) Nạp dữ liệu mẫu cho Guestbook
pnpm db:seed

# 6. Chạy môi trường phát triển
pnpm dev
```

Mở http://localhost:3000.

### Các script chính

| Script | Mô tả |
| :--- | :--- |
| `pnpm dev` | Chạy dev server |
| `pnpm build` | Build production |
| `pnpm start` | Chạy bản build production |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Unit test bằng Vitest |
| `pnpm test:e2e` | E2E test bằng Playwright |
| `pnpm db:generate` | Sinh file migration từ `src/lib/db/schema.ts` |
| `pnpm db:migrate` | Áp dụng migration lên database |
| `pnpm db:seed` | Nạp dữ liệu mẫu |
| `pnpm db:studio` | Mở Drizzle Studio để xem dữ liệu |

Danh sách đầy đủ biến môi trường: `docs/github-setup.md` (Đợt 3).

---

## 6. Bộ tài liệu dự án

| File | Nội dung | Đợt |
| :--- | :--- | :--- |
| [README.md](README.md) | Tổng quan, khởi chạy nhanh | 1 |
| [docs/product.md](docs/product.md) | Tầm nhìn, persona, USP, phạm vi MVP | 1 |
| [docs/spec.md](docs/spec.md) | Đặc tả chức năng, user flow, business rule | 1 |
| [docs/design-system.md](docs/design-system.md) | Màu, typography, spacing, component, trạng thái | 1 |
| [docs/assets.md](docs/assets.md) | Icon, hình ảnh, font, seed data | 1 |
| [docs/folder-structure.md](docs/folder-structure.md) | Cây thư mục và trách nhiệm từng file | 1 |
| `docs/architecture.md` | Kiến trúc, data flow, bảo mật | 2 |
| `docs/database.md` | ERD, bảng, ràng buộc, index | 2 |
| `docs/api.md` | Server Actions, Route Handlers, mã lỗi | 2 |
| `docs/git-workflow.md` | Branching, commit convention | 3 |
| `docs/github-setup.md` | `.env.example`, `.gitignore`, CI, issue template | 3 |
| `docs/deploy.md` | Triển khai Vercel, Supabase, Upstash | 3 |
| `docs/roadmap.md` | Phase và danh sách TASK | 3 |
| `docs/worklog.md` | Bảng theo dõi tiến độ | 3 |

---

## 7. Giấy phép

Mã nguồn phát hành theo giấy phép MIT. Nội dung cá nhân (ảnh, CV, bài viết Case Study) thuộc bản quyền của chủ sở hữu, không áp dụng MIT.
