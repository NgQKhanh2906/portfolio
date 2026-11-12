# Assets - Tài nguyên tĩnh và Dữ liệu mẫu

> Toàn bộ thông tin cá nhân, dự án và kinh nghiệm trong tài liệu này là **dữ liệu mẫu** để dựng giao diện và test. Trước khi deploy Production, chủ trang thay bằng thông tin thật. Các mục cần thay được đánh dấu `[THAY THẬT]`.

---

## 1. Icon

### 1.1. Icon giao diện - `lucide-react`

Import theo từng icon (tree-shaking), kích thước mặc định 16px (trong nút nhỏ, badge) và 20px (trong nút thường), `stroke-width` 1.75.

| Vị trí sử dụng | Tên icon Lucide |
| :--- | :--- |
| Mở Command Palette, ô tìm kiếm | `Search` |
| Theme Dark / Light / System | `Moon`, `Sun`, `Monitor` |
| Dấu check mục đang chọn | `Check` |
| Mở / đóng Mobile Nav | `Menu`, `X` |
| Tải CV | `Download` |
| Link Demo | `ExternalLink` |
| Link Source | `Code2` |
| Sao chép | `Copy`, chuyển thành `Check` sau khi sao chép |
| Email | `Mail` |
| Địa điểm | `MapPin` |
| Trường học | `GraduationCap` |
| Kinh nghiệm làm việc | `Briefcase` |
| Giải thưởng | `Award` |
| Ngôn ngữ giao tiếp | `Languages` |
| Lượt xem | `Eye` |
| Thời gian | `Clock` |
| Team | `Users` |
| Mũi tên điều hướng | `ArrowLeft`, `ArrowRight`, `ArrowUpRight` |
| Xóa | `Trash2` |
| Đăng xuất | `LogOut` |
| Gửi | `Send` |
| Guestbook trống | `MessageSquare` |
| Lỗi | `AlertTriangle` |
| Thông tin | `Info` |
| Thành công | `CheckCircle2` |
| Cảnh báo | `AlertCircle` |
| Loading spinner | `Loader2` (xoay bằng CSS) |
| Bộ lọc | `Filter`, `XCircle` (xóa bộ lọc) |
| Telemetry: push, PR, tạo repo | `GitCommit`, `GitPullRequest`, `FolderGit2` |
| Deploy info | `Rocket` |
| Bằng chứng kỹ năng | `FlaskConical` |
| Component Lab | `Blocks` |

### 1.2. Logo công nghệ và mạng xã hội - Simple Icons

- Nguồn: https://simpleicons.org (giấy phép CC0 cho bộ SVG; logo thương hiệu vẫn thuộc chủ sở hữu, chỉ dùng để chỉ danh công nghệ).
- Cách dùng: tải file SVG về `public/icons/tech/` và `public/icons/social/`, dùng `fill="currentColor"` để icon ăn theo màu chữ (không dùng màu thương hiệu, xem `design-system.md` mục 2.3).
- Kích thước hiển thị: 16px trong badge, 20px trong Skills.

| File | Slug Simple Icons |
| :--- | :--- |
| `public/icons/tech/html5.svg` | `html5` |
| `public/icons/tech/css.svg` | `css` (kiểm tra slug hiện hành trên trang Simple Icons) |
| `public/icons/tech/javascript.svg` | `javascript` |
| `public/icons/tech/typescript.svg` | `typescript` |
| `public/icons/tech/react.svg` | `react` |
| `public/icons/tech/nextjs.svg` | `nextdotjs` |
| `public/icons/tech/tailwindcss.svg` | `tailwindcss` |
| `public/icons/tech/nodejs.svg` | `nodedotjs` |
| `public/icons/tech/express.svg` | `express` |
| `public/icons/tech/postgresql.svg` | `postgresql` |
| `public/icons/tech/mongodb.svg` | `mongodb` |
| `public/icons/tech/redis.svg` | `redis` |
| `public/icons/tech/prisma.svg` | `prisma` |
| `public/icons/tech/drizzle.svg` | `drizzle` |
| `public/icons/tech/supabase.svg` | `supabase` |
| `public/icons/tech/docker.svg` | `docker` |
| `public/icons/tech/git.svg` | `git` |
| `public/icons/tech/github-actions.svg` | `githubactions` |
| `public/icons/tech/vercel.svg` | `vercel` |
| `public/icons/tech/figma.svg` | `figma` |
| `public/icons/tech/vitest.svg` | `vitest` |
| `public/icons/tech/playwright.svg` | Không có trên Simple Icons tại thời điểm viết tài liệu - kiểm tra lại; nếu không có thì hiển thị badge chỉ có chữ |
| `public/icons/social/github.svg` | `github` |
| `public/icons/social/linkedin.svg` | Simple Icons đã gỡ một số logo thương hiệu theo yêu cầu - kiểm tra lại; nếu không có thì dùng icon `Linkedin` của Lucide (nếu còn) hoặc chữ "in" |

> Danh sách slug cần được kiểm tra trên simpleicons.org tại thời điểm tải, vì thư viện có thể đổi tên hoặc gỡ logo.

---

## 2. Hình ảnh

Quy ước: ảnh nguồn chất lượng cao lưu tại `public/images/`, định dạng nguồn PNG hoặc JPG; `next/image` tự chuyển AVIF/WebP khi phục vụ. Tên file viết thường, gạch ngang.

| File | Kích thước nguồn | Dung lượng tối đa | Nội dung | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| `public/images/avatar.jpg` | 800x800 | 200 KB | Ảnh chân dung chuyên nghiệp, nền trơn, ánh sáng đều | `[THAY THẬT]`; hiển thị tròn 160px (desktop), 96px (mobile) |
| `public/images/projects/portfolio/cover.png` | 1600x900 | 400 KB | Ảnh chụp trang chủ portfolio ở theme Dark, đặt trong khung trình duyệt | Chụp sau khi hoàn thành giao diện |
| `public/images/projects/portfolio/architecture.svg` | Vector | 60 KB | Sơ đồ kiến trúc: Browser, Vercel Edge, Next.js Server, Supabase, Upstash, Resend, GitHub API | Vẽ bằng Excalidraw hoặc Figma, xuất SVG |
| `public/images/projects/taskflow/cover.png` | 1600x900 | 400 KB | Ảnh chụp bảng Kanban | `[THAY THẬT]` bằng dự án thật |
| `public/images/projects/taskflow/architecture.svg` | Vector | 60 KB | Sơ đồ kiến trúc TaskFlow | `[THAY THẬT]` |
| `public/images/projects/shoplite/cover.png` | 1600x900 | 400 KB | Ảnh chụp trang danh sách sản phẩm | `[THAY THẬT]` bằng dự án thật |
| `public/images/projects/shoplite/architecture.svg` | Vector | 60 KB | Sơ đồ kiến trúc ShopLite | `[THAY THẬT]` |
| `public/images/grid-dot.svg` | 24x24 (lặp lại) | 1 KB | Chấm tròn 1px màu `currentColor`, dùng làm nền lưới chấm ở Hero | Dùng qua CSS `mask-image` để đổi màu theo theme |

### 2.1. Favicon và icon ứng dụng

| File | Kích thước | Nội dung |
| :--- | :--- | :--- |
| `src/app/icon.svg` | Vector | Chữ viết tắt "NQK" font mono, nền `#0B0B0C`, chữ `#2DD4A3`, bo góc 20% |
| `src/app/favicon.ico` | 32x32 | Bản raster của `icon.svg` |
| `src/app/apple-icon.png` | 180x180 | Bản raster của `icon.svg`, không bo góc (iOS tự bo) |

Next.js App Router tự nhận diện các file trên theo quy ước tên file.

### 2.2. Open Graph image

Không lưu ảnh tĩnh. Sinh động bằng `ImageResponse`:
- `src/app/opengraph-image.tsx`: 1200x630, nền `#0B0B0C`, lưới chấm mờ, nhãn mono `PORTFOLIO`, họ tên (64px, trắng), vai trò (32px, `#2DD4A3`), domain ở góc dưới.
- `src/app/projects/[slug]/opengraph-image.tsx`: 1200x630, nhãn mono `CASE STUDY`, tiêu đề dự án, tối đa 5 tech, họ tên ở góc dưới.
- Font cho OG image: nạp file font Inter (bản có hỗ trợ tiếng Việt) lưu tại `src/assets/fonts/Inter-SemiBold.ttf` và `src/assets/fonts/Inter-Bold.ttf` để chữ tiếng Việt có dấu hiển thị đúng.

---

## 3. Font

| Font | Nguồn | Weight | Cách nạp |
| :--- | :--- | :--- | :--- |
| Inter | Google Fonts | 400, 500, 600, 700 | `next/font/google`, subset `latin`, `vietnamese` |
| JetBrains Mono | Google Fonts | 400, 500 | `next/font/google`, subset `latin`, `vietnamese` (nếu khả dụng) |
| Inter (file TTF cho OG image) | Tải từ trang chính thức của Inter hoặc Google Fonts | 600, 700 | Lưu `src/assets/fonts/`, đọc bằng `fetch(new URL(..., import.meta.url))` hoặc `readFile` |

Cả hai font dùng giấy phép SIL Open Font License, được phép dùng và nhúng miễn phí.

---

## 4. Âm thanh

Không sử dụng âm thanh trong MVP. Lý do: âm thanh tự phát gây khó chịu khi nhà tuyển dụng mở trang ở văn phòng và không đóng góp vào việc chứng minh kỹ năng.

---

## 5. Tài liệu tải về

| File | Yêu cầu |
| :--- | :--- |
| `public/resume.pdf` | `[THAY THẬT]`. CV 1 trang, dưới 1 MB, chữ chọn được (không phải ảnh scan), có link portfolio và GitHub bấm được. |

---

## 6. Dữ liệu mẫu (Seed Data)

### 6.1. Cấu hình trang - `src/data/site-config.ts` (và re-export tại `src/lib/site-config.ts`)

```ts
export const siteConfig = {
  name: "Nguyễn Quốc Khánh", // [THAY THẬT] nếu cần
  shortName: "NQK",
  role: "Web Developer",
  tagline:
    "Mình xây dựng web app nhanh, dễ dùng và có kiến trúc rõ ràng - từ giao diện đến database.",
  url: "https://nqkhanh.dev", // [THAY THẬT] domain thật hoặc domain *.vercel.app
  email: "khanh.dev@example.com", // [THAY THẬT]
  location: "TP. Hồ Chí Minh, Việt Nam", // [THAY THẬT]
  openToWork: true,
  openToWorkLabel: "Đang tìm cơ hội Intern / Fresher Web Developer",
  resumePath: "/resume.pdf",
  resumeFileName: "CV-Nguyen-Quoc-Khanh-WebDeveloper.pdf",
  social: {
    github: "https://github.com/nqkhanh-dev", // [THAY THẬT]
    linkedin: "https://www.linkedin.com/in/nqkhanh-dev", // [THAY THẬT]
  },
  githubUsername: "nqkhanh-dev", // [THAY THẬT]
  repoUrl: "https://github.com/nqkhanh-dev/portfolio", // [THAY THẬT]
  timezone: "Asia/Ho_Chi_Minh",
  locale: "vi-VN",
} as const;
```

### 6.2. Thông tin giới thiệu - `src/data/profile.ts`

```ts
export const profile = {
  about: [
    "Mình là sinh viên năm cuối ngành Kỹ thuật Phần mềm, tập trung vào phát triển web full-stack với React, Next.js và PostgreSQL.",
    "Mình thích biến một yêu cầu mơ hồ thành sản phẩm chạy được: bắt đầu từ việc hiểu bài toán, thiết kế dữ liệu, rồi mới viết giao diện.",
    "Trang web bạn đang xem cũng là một dự án: nó có database, xác thực GitHub, rate limit và CI/CD. Bạn có thể thử ngay ở Guestbook hoặc nhấn Ctrl + K.",
  ],
  quickFacts: [
    { icon: "MapPin", label: "Địa điểm", value: "TP. Hồ Chí Minh" },
    { icon: "GraduationCap", label: "Học vấn", value: "Kỹ thuật Phần mềm - Đại học ABC (2022 - 2026)" },
    { icon: "Languages", label: "Ngôn ngữ", value: "Tiếng Việt (bản ngữ), Tiếng Anh (đọc hiểu tài liệu, TOEIC 750)" },
  ],
} as const; // Toàn bộ là [THAY THẬT]
```

### 6.3. Kỹ năng - `src/data/skills.ts`

Trường `proof` trỏ tới route chứng minh kỹ năng (để trống nếu không có).

| Nhóm | Tên kỹ năng | Icon | `proof` |
| :--- | :--- | :--- | :--- |
| Frontend | HTML5 ngữ nghĩa và Accessibility | `html5.svg` | `/lab` |
| Frontend | CSS, Responsive Design | `css.svg` | `/lab` |
| Frontend | JavaScript (ES2023+) | `javascript.svg` | (trống) |
| Frontend | TypeScript | `typescript.svg` | `/projects/portfolio` |
| Frontend | React | `react.svg` | `/lab` |
| Frontend | Next.js (App Router) | `nextjs.svg` | `/projects/portfolio` |
| Frontend | Tailwind CSS | `tailwindcss.svg` | `/lab` |
| Backend | Node.js | `nodejs.svg` | (trống) |
| Backend | Express | `express.svg` | `/projects/shoplite` |
| Backend | REST API, Server Actions | (không icon) | `/guestbook` |
| Backend | Authentication (OAuth 2.0, JWT) | (không icon) | `/guestbook` |
| Database | PostgreSQL | `postgresql.svg` | `/guestbook` |
| Database | Drizzle ORM | `drizzle.svg` | `/projects/portfolio` |
| Database | Prisma | `prisma.svg` | `/projects/taskflow` |
| Database | Redis | `redis.svg` | `/projects/portfolio` |
| Database | MongoDB | `mongodb.svg` | (trống) |
| DevOps và Tools | Git, GitHub | `git.svg` | (link repo) |
| DevOps và Tools | GitHub Actions (CI) | `github-actions.svg` | (link repo) |
| DevOps và Tools | Docker (cơ bản) | `docker.svg` | (trống) |
| DevOps và Tools | Vercel | `vercel.svg` | (trống) |
| DevOps và Tools | Vitest, Playwright | `vitest.svg` | (link repo) |
| DevOps và Tools | Figma (đọc design) | `figma.svg` | (trống) |
| Kỹ năng mềm | Đọc tài liệu kỹ thuật tiếng Anh | (không icon) | (trống) |
| Kỹ năng mềm | Viết tài liệu kỹ thuật | (không icon) | `/projects/portfolio` |
| Kỹ năng mềm | Làm việc nhóm theo Scrum | (không icon) | (trống) |

### 6.4. Hành trình - `src/data/experience.ts`

| `type` | `period` | `title` | `organization` | `highlights` |
| :--- | :--- | :--- | :--- | :--- |
| `work` | 06/2025 - 09/2025 | Thực tập sinh Frontend Developer | Công ty TNHH Phần mềm XYZ | (1) Xây dựng 12 màn hình quản trị bằng React và TypeScript theo thiết kế Figma; (2) Giảm thời gian tải trang danh sách đơn hàng từ 3.2 giây xuống 1.1 giây bằng phân trang phía server và memo hóa component; (3) Viết 40 unit test với Vitest cho các hàm định dạng dữ liệu |
| `award` | 11/2024 | Giải Nhì Hackathon sinh viên | Đại học ABC | (1) Xây dựng ứng dụng chia sẻ đồ dùng học tập trong 36 giờ cùng team 4 người; (2) Phụ trách API và thiết kế database PostgreSQL |
| `education` | 09/2022 - 06/2026 | Kỹ sư Kỹ thuật Phần mềm | Đại học ABC | (1) GPA 3.4/4.0; (2) Đồ án môn học: hệ thống quản lý thư viện dùng Next.js và PostgreSQL |

Toàn bộ bảng trên là `[THAY THẬT]`. Số liệu trong `highlights` phải là số liệu thật có thể giải thích khi phỏng vấn.

### 6.5. Dự án - `content/projects/*.mdx`

#### Schema frontmatter (validate bằng Zod trong `src/lib/mdx.ts`)

| Trường | Kiểu | Bắt buộc | Ràng buộc |
| :--- | :--- | :--- | :--- |
| `title` | string | Có | 3 đến 80 ký tự |
| `summary` | string | Có | 20 đến 200 ký tự |
| `role` | string | Có | Ví dụ "Full-stack Developer (cá nhân)" |
| `period` | string | Có | Định dạng `MM/YYYY - MM/YYYY` hoặc `MM/YYYY - nay` |
| `year` | number | Có | 4 chữ số |
| `teamSize` | number | Có | Từ 1 trở lên |
| `tech` | string[] | Có | Ít nhất 1 phần tử; mỗi phần tử là slug có trong `TECH_REGISTRY` (`src/lib/constants.ts`) |
| `cover` | string | Có | Đường dẫn bắt đầu bằng `/images/projects/` |
| `coverAlt` | string | Có | 10 đến 160 ký tự |
| `demoUrl` | string (URL) | Không | |
| `sourceUrl` | string (URL) | Không | |
| `featured` | boolean | Có | |
| `order` | number | Có | Số nguyên, duy nhất giữa các dự án |
| `published` | boolean | Có | |
| `keywords` | string[] | Không | Từ khóa phụ cho Command Palette |

#### Dự án mẫu 1 - `content/projects/portfolio.mdx`

```mdx
---
title: "Web Developer Portfolio"
summary: "Portfolio full-stack chứng minh kỹ năng bằng tính năng chạy thật: OAuth, PostgreSQL, rate limit Redis, OG image động và CI/CD."
role: "Full-stack Developer (cá nhân)"
period: "11/2026 - nay"
year: 2026
teamSize: 1
tech: ["nextjs", "typescript", "tailwindcss", "postgresql", "drizzle", "redis", "vercel"]
cover: "/images/projects/portfolio/cover.png"
coverAlt: "Trang chủ Portfolio ở giao diện tối, hiển thị Hero và danh sách dự án"
demoUrl: "https://nqkhanh.dev"
sourceUrl: "https://github.com/nqkhanh-dev/portfolio"
featured: true
order: 1
published: true
keywords: ["portfolio", "guestbook", "command palette"]
---

## Bối cảnh và bài toán
Portfolio của sinh viên thường là trang tĩnh, không chứng minh được năng lực backend...

## Mục tiêu và ràng buộc
- Lighthouse mobile từ 95 trở lên ở cả 4 hạng mục.
- Chi phí hạ tầng bằng 0.

## Kiến trúc giải pháp
<ArchitectureDiagram src="/images/projects/portfolio/architecture.svg" alt="Trình duyệt gửi request đến Next.js trên Vercel; Next.js đọc ghi PostgreSQL trên Supabase, dùng Upstash Redis cho rate limit, gọi Resend để gửi email và GitHub GraphQL API để lấy hoạt động." />

## Quyết định kỹ thuật và trade-off
<Callout type="info">Chọn Auth.js thay vì Supabase Auth để kiểm soát luồng OAuth và session.</Callout>

## Thách thức và cách giải quyết
### Chống spam Guestbook
Dùng thuật toán sliding window của `@upstash/ratelimit`, khóa theo user ID...

## Kết quả và bài học
<Metric label="Lighthouse Performance (mobile)" value="98" />
```

Ghi chú: thân bài ở trên là khung minh họa cấu trúc. Nội dung thật được viết sau khi hoàn thành dự án, dựa trên số liệu đo được, mỗi phần tối thiểu 80 từ.

#### Dự án mẫu 2 - `content/projects/taskflow.mdx` (frontmatter) `[THAY THẬT]`

```yaml
title: "TaskFlow - Bảng Kanban cho nhóm học tập"
summary: "Ứng dụng quản lý công việc dạng Kanban, kéo thả thẻ, phân quyền thành viên, lưu trữ PostgreSQL qua Prisma."
role: "Full-stack Developer (team 3 người, phụ trách backend và kéo thả)"
period: "02/2025 - 05/2025"
year: 2025
teamSize: 3
tech: ["react", "typescript", "nodejs", "express", "postgresql", "prisma"]
cover: "/images/projects/taskflow/cover.png"
coverAlt: "Bảng Kanban TaskFlow với 3 cột Cần làm, Đang làm, Hoàn thành"
demoUrl: "https://taskflow-demo.vercel.app"
sourceUrl: "https://github.com/nqkhanh-dev/taskflow"
featured: true
order: 2
published: true
keywords: ["kanban", "drag and drop", "quản lý công việc"]
```

#### Dự án mẫu 3 - `content/projects/shoplite.mdx` (frontmatter) `[THAY THẬT]`

```yaml
title: "ShopLite - Cửa hàng trực tuyến tối giản"
summary: "Website bán hàng có giỏ hàng, tìm kiếm, phân trang phía server và trang quản trị sản phẩm."
role: "Full-stack Developer (cá nhân)"
period: "09/2024 - 12/2024"
year: 2024
teamSize: 1
tech: ["nextjs", "typescript", "tailwindcss", "express", "mongodb"]
cover: "/images/projects/shoplite/cover.png"
coverAlt: "Trang danh sách sản phẩm ShopLite với bộ lọc danh mục bên trái"
demoUrl: "https://shoplite-demo.vercel.app"
sourceUrl: "https://github.com/nqkhanh-dev/shoplite"
featured: true
order: 3
published: true
keywords: ["e-commerce", "giỏ hàng", "bán hàng"]
```

### 6.6. Danh mục công nghệ - `TECH_REGISTRY` trong `src/lib/constants.ts`

| `slug` | `label` | `icon` |
| :--- | :--- | :--- |
| `html` | HTML5 | `/icons/tech/html5.svg` |
| `css` | CSS | `/icons/tech/css.svg` |
| `javascript` | JavaScript | `/icons/tech/javascript.svg` |
| `typescript` | TypeScript | `/icons/tech/typescript.svg` |
| `react` | React | `/icons/tech/react.svg` |
| `nextjs` | Next.js | `/icons/tech/nextjs.svg` |
| `tailwindcss` | Tailwind CSS | `/icons/tech/tailwindcss.svg` |
| `nodejs` | Node.js | `/icons/tech/nodejs.svg` |
| `express` | Express | `/icons/tech/express.svg` |
| `postgresql` | PostgreSQL | `/icons/tech/postgresql.svg` |
| `mongodb` | MongoDB | `/icons/tech/mongodb.svg` |
| `redis` | Redis | `/icons/tech/redis.svg` |
| `prisma` | Prisma | `/icons/tech/prisma.svg` |
| `drizzle` | Drizzle ORM | `/icons/tech/drizzle.svg` |
| `supabase` | Supabase | `/icons/tech/supabase.svg` |
| `docker` | Docker | `/icons/tech/docker.svg` |
| `vercel` | Vercel | `/icons/tech/vercel.svg` |
| `vitest` | Vitest | `/icons/tech/vitest.svg` |
| `playwright` | Playwright | (không icon) |

### 6.7. Seed Guestbook - `scripts/seed.ts`

Chỉ chạy ở môi trường development và preview, không chạy ở Production. Tạo 3 user giả (`github_id` âm để không trùng user thật) và 6 lời nhắn.

**Bảng `users`:**

| `github_id` | `username` | `name` | `avatar_url` |
| :--- | :--- | :--- | :--- |
| -1001 | `seed-linh` | Linh Trần | `https://avatars.githubusercontent.com/u/1?v=4` |
| -1002 | `seed-minh` | Minh Phạm | `https://avatars.githubusercontent.com/u/2?v=4` |
| -1003 | `seed-huy` | Huy Lê | `https://avatars.githubusercontent.com/u/3?v=4` |

**Bảng `guestbook_entries`** (`created_at` tính lùi từ thời điểm chạy seed):

| Tác giả | Nội dung | `created_at` |
| :--- | :--- | :--- |
| `seed-linh` | Giao diện gọn và dễ đọc trên điện thoại. Chúc bạn sớm tìm được công việc phù hợp! | trước 5 ngày |
| `seed-minh` | Command Palette mượt, mục Case Study có phần trade-off rất đáng đọc. | trước 4 ngày |
| `seed-huy` | Mình học được cách làm rate limit từ repo của bạn, cảm ơn nhé. | trước 3 ngày |
| `seed-linh` | Đã tải CV, phần kinh nghiệm thực tập trình bày rõ ràng. | trước 2 ngày |
| `seed-huy` | Component Lab hay quá, phần Tabs dùng phím mũi tên được luôn. | trước 1 ngày |
| `seed-minh` | Thử gửi liên tục và đã bị chặn đúng như mô tả. Làm tốt! | trước 2 giờ |

### 6.8. Danh sách từ khóa chặn - `src/lib/moderation.ts`

Danh sách khởi tạo tập trung vào spam quảng cáo; so khớp không phân biệt hoa thường, sau khi bỏ dấu tiếng Việt:

```ts
export const BLOCKED_KEYWORDS = [
  "casino",
  "ca do",
  "nha cai",
  "lo de",
  "vay tien nhanh",
  "vay online",
  "kiem tien online",
  "tai xiu",
  "bet88",
  "viagra",
  "crypto giveaway",
  "free money",
];
```

Chủ trang bổ sung thêm từ ngữ thô tục theo nhu cầu kiểm duyệt.

### 6.9. Mặc định Component Lab - `src/data/lab-components.ts`

| Component | Prop | Giá trị mặc định | Tập giá trị hợp lệ |
| :--- | :--- | :--- | :--- |
| Button | `variant` | `primary` | `primary`, `secondary`, `ghost`, `danger` |
| Button | `size` | `md` | `sm`, `md`, `lg` |
| Button | `loading` | `false` | `true`, `false` |
| Button | `disabled` | `false` | `true`, `false` |
| Button | `iconLeft` | `false` | `true`, `false` |
| Button | `label` | `Gửi lời nhắn` | Chuỗi 1 đến 24 ký tự |
| Toast | `type` | `success` | `info`, `success`, `warning`, `error` |
| Toast | `title` | `Đã lưu thay đổi` | Chuỗi 1 đến 40 ký tự |
| Toast | `description` | `Cấu hình của bạn đã được cập nhật.` | Chuỗi 0 đến 120 ký tự |
| Toast | `duration` | `4000` | `2000`, `4000`, `8000` |
| Toast | `position` | `bottom-right` | `top-right`, `bottom-right`, `bottom-center` |
| Tabs | `count` | `3` | `2`, `3`, `4`, `5` |
| Tabs | `orientation` | `horizontal` | `horizontal`, `vertical` |
| Tabs | `variant` | `underline` | `underline`, `pill` |

Nhãn tab mẫu: "Tổng quan", "Kiến trúc", "Hiệu năng", "Bảo mật", "Kiểm thử" (lấy theo `count`).

### 6.10. Lệnh Command Palette - `src/components/command-palette/command-items.ts`

| Nhóm | Nhãn | Từ khóa phụ | Hành động |
| :--- | :--- | :--- | :--- |
| Điều hướng | Trang chủ | home, trang chu | `router.push("/")` |
| Điều hướng | Projects | du an, portfolio, case study | `router.push("/projects")` |
| Điều hướng | Component Lab | lab, ui, component | `router.push("/lab")` |
| Điều hướng | Guestbook | so luu niem, loi nhan | `router.push("/guestbook")` |
| Điều hướng | Liên hệ | contact, email, hire | `router.push("/contact")` |
| Dự án | (Tên từng dự án đã publish) | `keywords` trong frontmatter | `router.push("/projects/<slug>")` |
| Giao diện | Giao diện tối | dark, toi | `setTheme("dark")` |
| Giao diện | Giao diện sáng | light, sang | `setTheme("light")` |
| Giao diện | Theo hệ thống | system, auto | `setTheme("system")` |
| Hành động | Sao chép email | copy, email, mail | Ghi `siteConfig.email` vào clipboard |
| Hành động | Tải CV | resume, cv, download | Tải `siteConfig.resumePath` |
| Hành động | Mở GitHub | github, source | Mở `siteConfig.social.github` ở tab mới |
| Hành động | Mở LinkedIn | linkedin | Mở `siteConfig.social.linkedin` ở tab mới |
| Hành động | Xem mã nguồn trang này | repo, source code | Mở `siteConfig.repoUrl` ở tab mới |
