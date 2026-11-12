# Hướng dẫn Kỹ thuật và Quy chuẩn Dành cho AI Agents (AGENTS.md)

Tài liệu này quy định các tiêu chuẩn kiến trúc, quy chuẩn thiết kế UI/UX và quy trình kiểm thử bắt buộc cho tất cả các phiên làm việc của Agent trong dự án **Portfolio**.

---

## 1. Kiến trúc Hệ thống và Quy tắc Mã nguồn

1. **Phân tầng kiến trúc:**
   - `src/app/`: Tuyến đường (Routing), Layout, Metadata. Tuyệt đối không viết logic nghiệp vụ phức tạp ở đây.
   - `src/components/ui/`: Primitive UI components viết tay. Không import các thư viện giao diện bên ngoài. Tuân thủ chuẩn WAI-ARIA.
   - `src/components/layout/`: App Shell, Header dính có backdrop blur, MobileNav, Footer, Container, SectionHeading.
   - `src/data/`: Nguồn dữ liệu tĩnh (profile, kỹ năng, kinh nghiệm, site config).
   - `src/actions/`: Server Actions cho các thao tác ghi dữ liệu (Guestbook, Contact). Luôn bắt đầu bằng `"use server";`.
   - `src/lib/`: Logic nghiệp vụ, kết nối CSDL (Drizzle ORM), cache (Upstash Redis), validation (Zod). Mọi file truy cập database hoặc secret phải có `import "server-only";`.
2. **Quy tắc Server Components vs Client Components:**
   - Mặc định toàn bộ component là Server Component.
   - Chỉ thêm `"use client"` khi component cần quản lý state, effects, event listeners hoặc sử dụng API trình duyệt.
   - Đảm bảo First Load JS cho trang chủ luôn dưới 150 KB gzip.
3. **TypeScript & Linter:**
   - `strict: true`, `noUncheckedIndexedAccess: true`.
   - Tuyệt đối không dùng kiểu `any`. Mọi props và dữ liệu phải có kiểu rõ ràng.
   - Tuân thủ quy tắc ESLint và Prettier.

---

## 2. Quy chuẩn Thiết kế UI/UX (`design-taste-frontend` & `impeccable`)

1. **Phong cách Thẩm mỹ:**
   - Phong cách *Sổ tay Kỹ thuật (Engineering Notebook)*: Nền tối sâu (`#0B0B0C`), viền mảnh sắc nét (`#27272B`), nhãn kỹ thuật mono (`00 / HELLO`, `01 / ABOUT`), màu nhấn xanh ngọc lục bảo (`#2DD4A3` Dark / `#0B7A5E` Light).
   - **Chống giao diện AI rập khuôn (Anti-slop):** Không dùng màu tím/lavender bão hòa; không dùng dải màu gradient lòe loẹt; không dùng particle animation gây giật lag; không dùng thanh phần trăm kỹ năng tự chấm điểm; không đưa lời nhận xét hay review giả.
2. **Nguyên tắc "Một Section trên một màn hình":**
   - Hero section phải hiển thị trọn vẹn màn hình đầu tiên trên cả hai độ phân giải 375x667 (mobile) và 1366x768 (desktop) mà không bị ép cuộn trang.
   - Khung nội dung cân đối: Lề trái và phải bằng nhau trên container 1120px; hệ khoảng cách 4/8px.
3. **Khả năng Tiếp cận (Accessibility - WCAG 2.1 AA):**
   - Tỷ lệ tương phản chữ trên nền tối thiểu 4.5:1 (chữ lớn tối thiểu 3:1).
   - Mọi phần tử tương tác phải có vùng chạm tối thiểu 44x44px trên mobile.
   - Toàn bộ nút icon bắt buộc có `aria-label`.
   - Focus ring luôn hiển thị rõ với viền outline 2px và offset 2px khi điều hướng bằng phím Tab.
   - Tôn trọng `prefers-reduced-motion`: Tắt các chuyển động di chuyển khi người dùng bật giảm chuyển động.

---

## 3. Quy tắc Bảo vệ Thư mục Tài liệu Gốc (`@docs`)

1. **Chế độ Bảo vệ Nghiêm ngặt:** Thư mục `docs/` chứa toàn bộ tài liệu kiến trúc, đặc tả và lộ trình gốc của dự án.
2. **Nguyên tắc Thay đổi:**
   - Không được tự ý xóa, làm mất hoặc viết lại tùy tiện nội dung các file trong `docs/`.
   - Mọi thay đổi kỹ thuật lớn cần lập đề xuất ADR (Architecture Decision Record) và cập nhật đồng bộ vào `Decision Log` hoặc `worklog.md`.
   - Khi hoàn thành từng Task, cập nhật trạng thái tương ứng trong `docs/worklog.md` từ `TODO` sang `DONE`.

---

## 4. Quy trình Kiểm thử Bắt buộc Trước khi Bàn giao (Verification)

Trước khi xác nhận hoàn thành bất kỳ tính năng hoặc sửa lỗi nào, Agent bắt buộc phải thực thi chuỗi lệnh kiểm tra:

1. `pnpm typecheck` (hoặc `npx tsc --noEmit`): Đảm bảo 0 lỗi kiểu dữ liệu TypeScript.
2. `pnpm lint`: Đảm bảo 0 lỗi ESLint.
3. `pnpm test`: Toàn bộ unit tests phải pass.
4. `pnpm build`: Bản build production phải thành công với mã thoát 0.
5. Kiểm tra trực quan trên trình duyệt (MCP `chrome-devtools`): Xác nhận không có lỗi JavaScript console (0 errors) và không có request mạng bị lỗi 4xx/5xx.
6. Soạn commit message theo chuẩn Conventional Commits và chờ người dùng xác nhận trước khi commit/push.
