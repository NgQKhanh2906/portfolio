# Thiết kế Kỹ thuật: Nâng cấp Landing Page theo Phong cách "The Visual Craft Showcase"

- **Ngày lập:** 13/11/2026
- **Tác giả:** Senior Tech Lead
- **Người phê duyệt:** Nguyễn Quốc Khánh
- **Trạng thái:** Chờ phê duyệt (Pending Approval)

---

## 1. Bối cảnh và Mục tiêu (Intent & The Why)

Trang chủ (Landing page) hiện tại của portfolio đã đáp ứng đầy đủ các tiêu chuẩn kỹ thuật (Server Components phân rã, First Load JS < 110 kB, chuẩn tiếp cận WCAG 2.1 AA). Tuy nhiên, về mặt thị giác, giao diện vẫn đang dừng lại ở các khung mẫu placeholder xám đơn điệu, chưa toát lên gu thẩm mỹ cao cấp (taste) và sự chỉn chu tỉ mỉ (craftsmanship) mà tác giả mong muốn truyền tải tới nhà tuyển dụng.

**Mục tiêu chính:** Nâng cấp toàn diện giao diện trang Landing page theo phong cách "The Visual Craft Showcase", tập trung vào hình ảnh chân thực, bố cục 2 cột ấn tượng, các thẻ card tương tác cao cấp (code card, stat cards, browser mockups) và hệ thống chuyển động vi mô (micro-interactions) tinh tế.

---

## 2. Tiêu chí và Giới hạn (Goals, Non-Goals, Anti-Goals)

### Goals:
1. **Hero Section 2 cột có điểm nhấn mạnh mẽ:** Cột trái thể hiện thông điệp định vị và stack công nghệ; Cột phải kết hợp khung ảnh chân dung kèm vầng hào quang tím neon và thẻ Code Card tương tác `developer.config.ts` lơ lửng (`animate-float`).
2. **Thay thế toàn bộ ảnh placeholder trong Featured Projects:** Thay khung xám `16:9 Cover Image` bằng các bản mockup giao diện trình duyệt thực tế (Realistic Browser/Device Frames) cho cả 3 dự án: Portfolio, TaskFlow, và ShopLite.
3. **Lưới 4 Thẻ Chỉ số (Stat Cards 2x2) trong phần About:** Hiển thị 4 chỉ số kỹ thuật thực tế (Năm học tập/kinh nghiệm, Số dự án, Chuẩn chất lượng code, GitHub contributions) có hiệu ứng rê chuột phản quang viền và nhấc nhẹ.
4. **Sửa dứt điểm lỗi icon tròn bị móp:** Áp dụng `shrink-0 aspect-square rounded-full` trên toàn bộ danh mục kỹ năng và các icon toàn trang.
5. **Duy trì hiệu năng và accessibility:** First Load JS toàn trang tiếp tục < 150 kB, 0 lỗi TypeScript, 0 lỗi ESLint, 100% unit tests pass.

### Non-Goals:
- Không can thiệp vào các API routes backend (`/api/telemetry`, `/api/views/[slug]`) hay cơ chế ISR.
- Không thay đổi cấu trúc URL routing hay logic lọc của trang `/projects`.

### Anti-Goals:
- Không lạm dụng animation quá đà gây giật lag (stutter) trên thiết bị cấu hình thấp.
- Không sử dụng thanh % kỹ năng tự chấm hoặc lời nhận xét giả (fake testimonials) làm suy giảm tính chuyên nghiệp của portfolio.

---

## 3. Các Phương án Đã Cân nhắc (Approaches)

### Phương án 1: "The Visual Craft Showcase" (Phương án Được Chọn)
- **Mô tả:** Phong cách cao cấp theo chuẩn thiết kế của các sản phẩm công nghệ hàng đầu (Linear, Vercel, Raycast). Chú trọng vào sự tinh tế của typography, vầng sáng neon tím mờ, khung code card sắc nét, mockup trình duyệt chân thực cho dự án và chuyển động vi mô êm ái.
- **Ưu điểm:** Cân bằng hoàn hảo giữa thị giác bắt mắt, hình ảnh phong phú với sự chỉn chu, đĩnh đạc của một kỹ sư phần mềm.
- **Nhược điểm:** Đòi hỏi dựng mockup trình duyệt chi tiết bằng CSS/SVG để không làm tăng dung lượng tải trang.

### Phương án 2: "The Interactive Digital Studio" (Bị loại)
- **Mô tả:** Phong cách Creative Studio / Web3 với dải marquee vô tận, avatar 3D holographic, card nghiêng isometric 3D.
- **Lý do không chọn:** Người dùng đã đánh giá trực quan cả 2 ảnh mẫu và chính thức lựa chọn Phương án 1 vì sự sang trọng, tinh tế và tính thực tế cao hơn cho hồ sơ tuyển dụng.

---

## 4. Chi tiết Kiến trúc & Triển khai Kỹ thuật (The How)

### 4.1. Cập nhật Thư viện Component & Assets
1. **Mockup Trình duyệt cho Dự án (`ProjectBrowserFrame`):**
   - Xây dựng component khung trình duyệt web tối giản (macOS titlebar với 3 chấm tròn, thanh URL giả lập, bo góc 12px, nền tối sâu).
   - Render hình ảnh/giao diện UI thực tế của từng dự án (Portfolio, TaskFlow Kanban, ShopLite Storefront) bên trong khung trình duyệt.
   - Thêm hiệu ứng hover: Ảnh zoom nhẹ 1.02x, thanh công cụ sáng viền màu tím neon.
2. **Hero Section 2 Cột (`Hero`):**
   - Cột trái: Pill badge `I'M A WEB DEVELOPER`, tiêu đề chữ lớn có điểm nhấn gạch chân màu accent, 2 nút CTA kích thước chuẩn, danh sách chip công nghệ thực chiến.
   - Cột phải: Khung ảnh đại diện chân dung phong cách studio kết hợp vầng sáng tròn tím neon (`accent/20 blur-3xl`), đặt cạnh thẻ `developer.config.ts` hiệu ứng bồng bềnh (`animate-float`).
3. **Thẻ Kỹ năng (`SkillGroup`):**
   - Đảm bảo 100% icon trạng thái sử dụng `shrink-0 aspect-square rounded-full min-w-0` để triệt tiêu vĩnh viễn lỗi méo hình khi văn bản xuống dòng.
4. **Stat Cards trong About (`AboutSection`):**
   - Lưới 2x2 gồm 4 card chỉ số kỹ thuật có icon riêng, font mono kích thước lớn và hiệu ứng `card-interactive`.

### 4.2. Kế hoạch Kiểm chứng (Verification)
- Chạy `npx tsc --noEmit` đạt 0 lỗi type.
- Chạy `npx next lint` đạt 0 lỗi/cảnh báo.
- Chạy `npx vitest run` đảm bảo 51/51 tests pass.
- Chạy `npx next build` xác nhận First Load JS < 150 kB.
- Kiểm tra trực quan trên localhost:3000 ở cả hai chế độ Sáng và Tối.

---

## 5. Phần Việc Dành Cho Kỹ sư Triển khai (What's Left to the Builder)

Kỹ sư triển khai chịu trách nhiệm:
1. Tạo component `BrowserMockup` tại `src/components/ui/browser-mockup.tsx` tái sử dụng được cho cả trang chủ lẫn trang danh sách dự án.
2. Hoàn thiện giao diện Hero và About Section theo đúng tỷ lệ và màu sắc của ảnh mẫu Phương án 1.
3. Chạy toàn bộ chuỗi kiểm thử và tạo Pull Request về `main`.
