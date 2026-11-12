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
| `TASK-09` | Xây dựng Bộ xử lý Nội dung MDX và Trích xuất Dữ liệu Dự án | `TODO` | - | Chưa bắt đầu |
| `TASK-10` | Xây dựng Trang Danh sách Dự án và Bộ lọc Công nghệ Đa tiêu chí | `TODO` | - | Chưa bắt đầu |
| `TASK-11` | Triển khai Trang Chi tiết Case Study Kỹ thuật và Điều hướng Mục lục | `TODO` | - | Chưa bắt đầu |
| `TASK-12` | Triển khai Bộ đếm Lượt xem Dự án Bằng Upstash Redis | `TODO` | - | Chưa bắt đầu |
| `TASK-13` | Xây dựng Khung Điều khiển và Playground của Component Lab | `TODO` | - | Chưa bắt đầu |
| `TASK-14` | Xây dựng Bản Thử nghiệm Demo Cho Button và Tabs Component | `TODO` | - | Chưa bắt đầu |
| `TASK-15` | Xây dựng Hệ thống Toast Thông báo và Bản Thử nghiệm Toast Demo | `TODO` | - | Chưa bắt đầu |
| `TASK-16` | Cấu hình Kết nối CSDL PostgreSQL với Drizzle ORM và Schema | `TODO` | - | Chưa bắt đầu |
| `TASK-17` | Tích hợp Xác thực Người dùng Auth.js (NextAuth v5) với GitHub OAuth | `TODO` | - | Chưa bắt đầu |
| `TASK-18` | Triển khai Giao diện Sổ lưu niệm và Server Actions có Optimistic UI | `TODO` | - | Chưa bắt đầu |
| `TASK-19` | Triển khai Tính năng Xóa Lời nhắn và Phân quyền Quản trị (Admin Moderation) | `TODO` | - | Chưa bắt đầu |
| `TASK-20` | Xây dựng Biểu mẫu Liên hệ với Cơ chế Chống Bot Đa tầng (Honeypot + HMAC) | `TODO` | - | Chưa bắt đầu |
| `TASK-21` | Tích hợp Dịch vụ Gửi Email Resend và Lưu trữ Tin nhắn Liên hệ | `TODO` | - | Chưa bắt đầu |
| `TASK-22` | Xây dựng Bộ Kiểm thử End-to-End (E2E) với Playwright | `TODO` | - | Chưa bắt đầu |
| `TASK-23` | Tối ưu Hiệu năng Core Web Vitals và Kiểm soát Dung lượng JavaScript | `TODO` | - | Chưa bắt đầu |
| `TASK-24` | Tự động Sinh Ảnh Open Graph Động và Tối ưu Siêu dữ liệu SEO | `TODO` | - | Chưa bắt đầu |
| `TASK-25` | Thiết lập Cấu hình Bảo mật HTTP Security Headers Toàn diện | `TODO` | - | Chưa bắt đầu |
| `TASK-26` | Triển khai Production Lên Vercel và Chạy Kiểm thử Khói Toàn diện | `TODO` | - | Chưa bắt đầu |

---

## 3. Sổ Ghi chép Quyết định và Giải pháp Phát sinh (Incident & Decision Notes)

Khu vực này dùng để ghi lại các giải pháp kỹ thuật cụ thể khi xử lý các vấn đề thực tế phát sinh trong quá trình triển khai các Task:

### Ghi chú Kỹ thuật ngày 12/11/2026:
- **Hoàn thành TASK-06 (Phân rã Server Components trang chủ):** Đã module hóa `src/app/page.tsx` thành 6 Server Components chuyên trách (`hero.tsx`, `about-section.tsx`, `skills-section.tsx`, `skill-group.tsx`, `experience-timeline.tsx`, `timeline-item.tsx`, `featured-projects.tsx`, `telemetry-preview.tsx`). Kết quả First Load JS cho trang chủ đo được sau `next build` chỉ là 94.1 kB, tối ưu sâu so với chỉ tiêu 150 kB.
- **Bổ sung Unit Tests:** Tạo bộ kiểm thử đơn vị cho Primitive UI (`button.test.tsx`, `badge.test.tsx`, `card.test.tsx`, `command-trigger.test.tsx`), toàn bộ 13/13 test cases đều pass 100% trên Vitest jsdom.
- **Hoàn thành TASK-07 (Command Palette):** Tích hợp `cmdk` cùng các nhóm lệnh điều hướng, đổi theme, thao tác sao chép email kèm phản hồi clipboard và phím tắt `Ctrl + K`. Đạt chuẩn accessibility ARIA combobox.
