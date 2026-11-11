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
| `TASK-01` | Khởi tạo Dự án Next.js 14+ App Router và Cấu hình Tooling | `TODO` | - | Chưa bắt đầu |
| `TASK-02` | Thiết lập Design Tokens, Phông chữ và CSS Toàn cục | `TODO` | - | Chưa bắt đầu |
| `TASK-03` | Triển khai Cơ chế Chuyển đổi Giao diện (Theme Provider & Script Chống Nháy) | `TODO` | - | Chưa bắt đầu |
| `TASK-04` | Xây dựng Thư viện Thành phần UI Cơ bản (Primitive UI Components) | `TODO` | - | Chưa bắt đầu |
| `TASK-05` | Xây dựng Khung Bố cục Chính (Header, Footer, Navigation, Skip Link) | `TODO` | - | Chưa bắt đầu |
| `TASK-06` | Xây dựng Các Section Trang chủ (Hero, About, Skills, Journey) | `TODO` | - | Chưa bắt đầu |
| `TASK-07` | Triển khai Bảng lệnh Điều khiển Nhanh (Command Palette `Ctrl + K`) | `TODO` | - | Chưa bắt đầu |
| `TASK-08` | Triển khai Widget Giám sát Hoạt động Kỹ thuật (Live Telemetry Widget) | `TODO` | - | Chưa bắt đầu |
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

*(Hiện tại chưa có ghi chú phát sinh. Sẽ được cập nhật khi bắt đầu thực thi `TASK-01`)*
