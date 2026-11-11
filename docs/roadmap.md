# Roadmap - Lộ trình Thực thi Kỹ thuật Portfolio

Tài liệu này xác định toàn bộ lộ trình triển khai dự án chia thành 7 giai đoạn tuần tự với 26 công việc độc lập (từ `TASK-01` đến `TASK-26`). Mỗi tác vụ đều chỉ rõ tệp tin cần tạo/sửa, yêu cầu kỹ thuật chi tiết và tiêu chí nghiệm thu có thể đo lường chính xác để Agent hoặc kỹ sư lập trình thực thi tuần tự mà không cần đoán định.

---

## Giai đoạn 1: Khởi tạo Dự án, Công cụ Kiểm tra và Nền tảng Giao diện (Phase 1)

### TASK-01: Khởi tạo Dự án Next.js 14+ App Router và Cấu hình Tooling
- **Mục tiêu kỹ thuật:** Thiết lập cấu trúc dự án chuẩn với TypeScript strict mode, ESLint, Prettier, PostCSS, và Vitest.
- **Tệp tin cần tạo / sửa:**
  - `package.json`
  - `tsconfig.json`
  - `eslint.config.mjs`
  - `.prettierrc`
  - `.prettierignore`
  - `.editorconfig`
  - `vitest.config.ts`
  - `tests/setup/vitest.setup.ts`
  - `.gitignore`
- **Yêu cầu kỹ thuật:**
  - Cấu hình TypeScript với `"strict": true`, `"noUncheckedIndexedAccess": true`, đường dẫn alias `@/*` trỏ về `src/*`.
  - Cấu hình ESLint với các rule của Next.js, cấm sử dụng `any`, cấm `console.log`.
  - Cấu hình Prettier tự động sắp xếp class của Tailwind CSS.
  - Cấu hình Vitest với môi trường `jsdom` và `setupFiles` nạp matchers của Testing Library.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Chạy `pnpm lint` kết thúc với mã thoát 0 (không có lỗi hay cảnh báo).
  - Chạy `pnpm typecheck` kết thúc với mã thoát 0.
  - Chạy `pnpm test` thực thi thành công tệp kiểm thử mẫu không phát sinh lỗi.

---

### TASK-02: Thiết lập Design Tokens, Phông chữ và CSS Toàn cục
- **Mục tiêu kỹ thuật:** Triển khai hệ thống Design Tokens hai chế độ Light/Dark và nạp phông chữ Inter và JetBrains Mono theo chuẩn Next.js Font.
- **Tệp tin cần tạo / sửa:**
  - `src/app/globals.css`
  - `src/lib/utils.ts`
  - `src/app/layout.tsx`
- **Yêu cầu kỹ thuật:**
  - Định nghĩa toàn bộ biến CSS custom properties (`--color-bg`, `--color-surface`, `--color-accent`, v.v.) trong `src/app/globals.css` theo đúng bảng màu tại `docs/design-system.md`.
  - Nạp phông chữ `Inter` (weights: 400, 500, 600, 700) và `JetBrains Mono` (weights: 400, 500) qua `next/font/google` với các subset `latin` và `vietnamese`.
  - Viết hàm tiện ích `cn()` kết hợp `clsx` và `tailwind-merge` tại `src/lib/utils.ts`.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Biến CSS tồn tại đầy đủ trên `:root` và `.dark`.
  - Lớp `font-sans` và `font-mono` áp dụng chính xác phông chữ tương ứng trên trình duyệt.
  - Hàm `cn("px-2 py-1", "px-4")` trả về đúng `"py-1 px-4"` mà không bị xung đột class.

---

### TASK-03: Triển khai Cơ chế Chuyển đổi Giao diện (Theme Provider & Script Chống Nháy)
- **Mục tiêu kỹ thuật:** Xây dựng hệ thống quản lý Theme (Dark/Light/System) với script inline chặn hiện tượng nháy giao diện sai màu khi tải trang.
- **Tệp tin cần tạo / sửa:**
  - `src/components/theme/theme-script.tsx`
  - `src/components/theme/theme-provider.tsx`
  - `src/components/theme/theme-toggle.tsx`
  - `src/hooks/use-media-query.ts`
- **Yêu cầu kỹ thuật:**
  - Viết `ThemeScript` chèn thẻ `<script>` đồng bộ vào `<head>` để đọc `localStorage.getItem("theme")` hoặc kiểm tra `window.matchMedia("(prefers-color-scheme: dark)")` trước khi render HTML, gán class `dark` lên thẻ `<html>`.
  - Viết `ThemeProvider` cung cấp context chuyển đổi theme và tự động lắng nghe sự kiện thay đổi của hệ điều hành.
  - Viết component `ThemeToggle` dạng dropdown cho phép chọn 3 chế độ: Dark, Light, System.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Khi tải lại trang ở chế độ Dark, nền trang đen ngay lập tức, hoàn toàn không xuất hiện khung màu trắng nhấp nháy (Zero flash of unstyled theme).
  - Đổi lựa chọn theme trong dropdown làm cập nhật giá trị trong `localStorage` và class của `<html>`.

---

### TASK-04: Xây dựng Thư viện Thành phần UI Cơ bản (Primitive UI Components)
- **Mục tiêu kỹ thuật:** Tự tay xây dựng tập hợp các UI Component gốc phục vụ toàn bộ hệ thống, tuân thủ chuẩn Accessibility WCAG 2.1 AA.
- **Tệp tin cần tạo / sửa:**
  - `src/components/ui/button.tsx`
  - `src/components/ui/icon-button.tsx`
  - `src/components/ui/badge.tsx`
  - `src/components/ui/card.tsx`
  - `src/components/ui/kbd.tsx`
  - `src/components/ui/skeleton.tsx`
  - `src/components/ui/spinner.tsx`
  - `src/components/ui/empty-state.tsx`
  - `src/components/ui/field-error.tsx`
- **Yêu cầu kỹ thuật:**
  - Xây dựng component `Button` hỗ trợ 4 variants (`primary`, `secondary`, `ghost`, `danger`), 3 kích thước (`sm`, `md`, `lg`), trạng thái `loading` (hiển thị spinner và khóa tương tác), `disabled`, và thuộc tính `asChild` để bọc thẻ `<a>`.
  - Component `IconButton` bắt buộc nhận prop `label` và gán vào `aria-label`, đảm bảo vùng bấm tối thiểu 44x44px trên màn hình di động.
  - Sử dụng `:focus-visible` với vòng viền outline 2px rõ nét cho toàn bộ thành phần tương tác.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Viết unit test kiểm tra toàn bộ variants của `Button`.
  - Thử nghiệm điều hướng bằng phím Tab qua các button: focus ring hiển thị đúng màu `accent` và offset 2px.

---

## Giai đoạn 2: Khung Bố cục Toàn trang, Trang chủ và Bảng lệnh (Phase 2)

### TASK-05: Xây dựng Khung Bố cục Chính (Header, Footer, Navigation, Skip Link)
- **Mục tiêu kỹ thuật:** Hoàn thiện khung giao diện cố định của ứng dụng với khả năng thích ứng màn hình di động và hỗ trợ người khiếm thị.
- **Tệp tin cần tạo / sửa:**
  - `src/components/layout/skip-link.tsx`
  - `src/components/layout/site-header.tsx`
  - `src/components/layout/site-footer.tsx`
  - `src/components/layout/mobile-nav.tsx`
  - `src/components/layout/container.tsx`
  - `src/components/layout/section-heading.tsx`
  - `src/app/layout.tsx`
- **Yêu cầu kỹ thuật:**
  - Component `SkipLink` là phần tử đầu tiên nhận focus khi nhấn Tab, trỏ thẳng tới anchor `#main-content`.
  - `SiteHeader` dính cố định (sticky); khi cuộn trang quá 16px sẽ kích hoạt lớp nền `surface` mờ (backdrop-blur) và đường viền dưới.
  - `MobileNav` xuất hiện dạng sheet trượt từ cạnh phải trên màn hình < 768px, đóng được bằng phím `Esc` và tự khóa cuộn trang phía sau khi mở.
  - `SiteFooter` hiển thị năm hiện tại, các liên kết mạng xã hội và thông tin commit SHA rút gọn.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Nhấn Tab khi vừa mở trang: Skip link xuất hiện; nhấn Enter: viewport cuộn tới `#main-content`.
  - Mở menu trên mobile, nhấn `Esc`: menu đóng lại và focus quay về nút mở hamburger.

---

### TASK-06: Xây dựng Các Section Trang chủ (Hero, About, Skills, Journey)
- **Mục tiêu kỹ thuật:** Triển khai toàn bộ nội dung của trang chủ theo cấu trúc Server Components, nạp dữ liệu từ các tệp data tĩnh.
- **Tệp tin cần tạo / sửa:**
  - `src/data/site-config.ts`
  - `src/data/profile.ts`
  - `src/data/skills.ts`
  - `src/data/experience.ts`
  - `src/components/home/hero.tsx`
  - `src/components/home/about-section.tsx`
  - `src/components/home/skills-section.tsx`
  - `src/components/home/skill-group.tsx`
  - `src/components/home/experience-timeline.tsx`
  - `src/components/home/timeline-item.tsx`
  - `src/app/page.tsx`
- **Yêu cầu kỹ thuật:**
  - Hero section hiển thị trọn vẹn trong màn hình đầu tiên trên cả hai độ phân giải 375x667 và 1366x768, gồm tiêu đề, vai trò, badge trạng thái tìm việc, và 2 nút CTA "Xem dự án" và "Tải CV".
  - Skills section phân loại kỹ năng thành 5 nhóm; các kỹ năng có tính năng kiểm chứng trên trang phải hiển thị liên kết "Xem bằng chứng". Tuyệt đối không dùng thanh phần trăm đánh giá kỹ năng.
  - Dòng thời gian kinh nghiệm và học vấn sắp xếp từ mốc thời gian mới nhất đến cũ hơn.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Điểm Google Lighthouse trên trang chủ đạt 100 điểm về SEO và Accessibility.
  - Tải trang chủ ở chế độ 3G mô phỏng trên Chrome DevTools: Hero hiển thị đầy đủ văn bản dưới 1.0 giây.

---

### TASK-07: Triển khai Bảng lệnh Điều khiển Nhanh (Command Palette `Ctrl + K`)
- **Mục tiêu kỹ thuật:** Tích hợp thanh điều khiển bằng bàn phím hỗ trợ tìm kiếm mờ (fuzzy search), chuyển trang, đổi giao diện và sao chép thông tin.
- **Tệp tin cần tạo / sửa:**
  - `src/components/command-palette/command-items.ts`
  - `src/components/command-palette/command-palette.tsx`
  - `src/components/command-palette/command-trigger.tsx`
  - `src/hooks/use-keyboard-shortcut.ts`
  - `src/hooks/use-copy-to-clipboard.ts`
- **Yêu cầu kỹ thuật:**
  - Sử dụng thư viện `cmdk` để đảm bảo chuẩn ARIA combobox và điều khiển bằng phím mũi tên lên/xuống/Enter.
  - Lắng nghe phím tắt `Ctrl + K` (Windows/Linux) và `Cmd + K` (macOS).
  - Nhóm lệnh gồm: Điều hướng, Danh sách dự án đã xuất bản, Chuyển đổi giao diện, và Hành động nhanh (Sao chép email, Tải CV).
  - Tích hợp thông báo Toast khi người dùng chọn lệnh "Sao chép email".
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Nhấn `Ctrl + K`: Bảng lệnh mở ra và ô input tự động nhận focus.
  - Gõ từ khóa "toi": Danh sách lọc ra lệnh "Giao diện tối"; nhấn Enter: giao diện chuyển sang Dark và bảng lệnh đóng lại. Focus quay trở về phần tử trước đó.

---

### TASK-08: Triển khai Widget Giám sát Hoạt động Kỹ thuật (Live Telemetry Widget)
- **Mục tiêu kỹ thuật:** Xây dựng widget hiển thị hoạt động đóng góp mã nguồn GitHub thực tế kết hợp caching ISR để không vi phạm rate limit.
- **Tệp tin cần tạo / sửa:**
  - `src/lib/github.ts`
  - `src/app/api/telemetry/route.ts`
  - `src/components/telemetry/telemetry-widget.tsx`
  - `src/components/telemetry/github-activity-list.tsx`
  - `src/components/telemetry/deploy-info.tsx`
- **Yêu cầu kỹ thuật:**
  - Viết module `src/lib/github.ts` gọi GitHub GraphQL API lấy tổng số contribution 12 tháng và 5 sự kiện công khai gần nhất.
  - Route handler `/api/telemetry` thiết lập `revalidate = 3600` (cache 1 giờ).
  - Component `TelemetryWidget` hiển thị khung Skeleton trong lúc tải và hiển thị liên kết fallback sang GitHub nếu API bị lỗi.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Truy cập `GET /api/telemetry` trả về JSON đúng cấu trúc và header `Cache-Control` chứa `s-maxage=3600`.
  - Khi ngắt kết nối mạng hoặc token GitHub không hợp lệ, widget hiển thị thông báo lỗi thân thiện mà không làm sập giao diện trang chủ.

---

## Giai đoạn 3: Phân hệ Dự án, Trình đọc MDX và Case Studies Chi tiết (Phase 3)

### TASK-09: Xây dựng Bộ xử lý Nội dung MDX và Trích xuất Dữ liệu Dự án
- **Mục tiêu kỹ thuật:** Xây dựng module đọc và parse các tệp MDX cục bộ, validate frontmatter và tự động sinh mục lục (Table of Contents).
- **Tệp tin cần tạo / sửa:**
  - `src/lib/constants.ts`
  - `src/lib/validations/project-frontmatter.ts`
  - `src/lib/mdx.ts`
  - `tests/unit/validations/project-frontmatter.test.ts`
  - `tests/unit/mdx.test.ts`
  - `scripts/validate-content.ts`
- **Yêu cầu kỹ thuật:**
  - Validate frontmatter bằng Zod schema: kiểm tra kiểu dữ liệu, tech slug hợp lệ trong `TECH_REGISTRY`, kiểm tra ảnh cover tồn tại.
  - Trích xuất heading cấp 2 và cấp 3 để tạo danh sách `tocItems`.
  - Kiểm tra bắt buộc đủ 6 heading nghiệp vụ theo chuẩn Case Study tại `docs/spec.md`. Nếu thiếu, build sẽ báo lỗi.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Chạy `pnpm tsx scripts/validate-content.ts` kiểm tra toàn bộ tệp MDX trong thư mục `content/projects/` kết thúc thành công với mã 0.
  - Unit test bao phủ các trường hợp frontmatter sai định dạng hoặc thiếu trường bắt buộc.

---

### TASK-10: Xây dựng Trang Danh sách Dự án và Bộ lọc Công nghệ Đa tiêu chí
- **Mục tiêu kỹ thuật:** Triển khai trang `/projects` với khả năng lọc tức thì theo nhiều tag công nghệ và đồng bộ URL query params.
- **Tệp tin cần tạo / sửa:**
  - `src/components/projects/project-card.tsx`
  - `src/components/projects/tech-badge.tsx`
  - `src/components/projects/project-filter.tsx`
  - `src/components/projects/project-grid.tsx`
  - `src/hooks/use-url-state.ts`
  - `src/app/projects/page.tsx`
- **Yêu cầu kỹ thuật:**
  - Hiển thị danh sách card dạng lưới (1 cột trên mobile, 2 cột trên tablet, 3 cột trên desktop).
  - Bộ lọc công nghệ dạng chip cho phép chọn nhiều. Áp dụng logic AND: dự án phải chứa tất cả công nghệ đang được kích hoạt.
  - Đồng bộ trạng thái lọc lên URL query (`/projects?tech=nextjs,postgresql`) thông qua hook `useUrlState`.
  - Hiển thị component `EmptyState` kèm nút "Xóa bộ lọc" khi không có kết quả phù hợp.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Mở URL `/projects?tech=nextjs,postgresql`: bộ lọc tự động kích hoạt 2 chip tương ứng và chỉ render các dự án có cả 2 công nghệ này.
  - Nhấp "Xóa bộ lọc": URL quay về `/projects` và hiển thị lại toàn bộ danh sách.

---

### TASK-11: Triển khai Trang Chi tiết Case Study Kỹ thuật và Điều hướng Mục lục
- **Mục tiêu kỹ thuật:** Xây dựng trang chi tiết dự án `/projects/[slug]` với các component nhúng MDX tùy biến và mục lục tự động cuộn theo vị trí đọc.
- **Tệp tin cần tạo / sửa:**
  - `src/components/mdx/architecture-diagram.tsx`
  - `src/components/mdx/callout.tsx`
  - `src/components/mdx/metric.tsx`
  - `src/components/mdx/code-block.tsx`
  - `src/components/mdx/mdx-components.tsx`
  - `src/components/projects/case-study-header.tsx`
  - `src/components/projects/table-of-contents.tsx`
  - `src/components/projects/project-pager.tsx`
  - `src/app/projects/[slug]/page.tsx`
- **Yêu cầu kỹ thuật:**
  - Cấu hình `generateStaticParams` để sinh HTML tĩnh cho toàn bộ dự án lúc build.
  - Bảng mục lục (Table of Contents) dính ở cột phải trên màn hình >= 1280px; sử dụng `IntersectionObserver` để tự động highlight mục đang nằm trong viewport.
  - Component `CodeBlock` có cú pháp highlight rõ nét và nút sao chép code một chạm.
  - Cuối bài viết có khối `ProjectPager` điều hướng tới dự án trước và dự án kế tiếp.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Truy cập slug không tồn tại (ví dụ `/projects/du-an-la`): Trình duyệt trả về trang 404 chuẩn.
  - Khi cuộn qua các đề mục trong bài, mục tương ứng trên Table of Contents tự động đổi màu sang `accent`.

---

### TASK-12: Triển khai Bộ đếm Lượt xem Dự án Bằng Upstash Redis
- **Mục tiêu kỹ thuật:** Xây dựng hệ thống đếm lượt xem thời gian thực cho từng Case Study có cơ chế chống đếm trùng 24 giờ và rate limit.
- **Tệp tin cần tạo / sửa:**
  - `src/lib/redis.ts`
  - `src/lib/crypto.ts`
  - `src/lib/views.ts`
  - `src/app/api/views/[slug]/route.ts`
  - `src/components/projects/view-counter.tsx`
  - `tests/unit/crypto.test.ts`
- **Yêu cầu kỹ thuật:**
  - Tạo hàm `hashIp(ip, VIEW_SALT)` sử dụng SHA-256 để ẩn danh hóa IP hoàn toàn.
  - Route handler `POST /api/views/[slug]` kiểm tra khóa `view_dedup:<slug>:<ip_hash>` trên Redis với TTL 86400 giây (24h). Nếu chưa tồn tại thì tăng bộ đếm `views:project:<slug>` bằng `INCR`.
  - Trả về số lượt xem đã định dạng theo chuẩn `vi-VN` (ví dụ: "1,248 lượt xem"). Nếu Redis lỗi, component tự động ẩn mà không gây gián đoạn trang.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Gửi request POST lần đầu: số view tăng lên 1 đơn vị.
  - Gửi tiếp request POST từ cùng một IP trong vòng 24 giờ: số view giữ nguyên, không bị đếm trùng.

---

## Giai đoạn 4: Phòng thí nghiệm UI Tương tác (Component Lab) (Phase 4)

### TASK-13: Xây dựng Khung Điều khiển và Playground của Component Lab
- **Mục tiêu kỹ thuật:** Tạo trang `/lab` cho phép người dùng tùy biến trực tiếp các props của component và xem trước giao diện kèm mã nguồn sinh tự động.
- **Tệp tin cần tạo / sửa:**
  - `src/data/lab-components.ts`
  - `src/components/lab/component-playground.tsx`
  - `src/components/lab/props-panel.tsx`
  - `src/components/lab/code-preview.tsx`
  - `src/components/lab/a11y-notes.tsx`
  - `src/app/lab/page.tsx`
- **Yêu cầu kỹ thuật:**
  - Khung Playground chia thành 3 khu vực: Khung hiển thị tương tác (Preview), Bảng điều khiển Props (Props Panel), và Khung xem code JSX (Code Preview).
  - Đồng bộ component đang chọn và các giá trị props lên URL query params (`/lab?c=button&variant=primary&loading=false`).
  - Nút sao chép mã JSX có phản hồi Toast trực quan.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Mở `/lab?c=button&size=lg`: Bảng điều khiển tự động chọn size "lg" và nút trong khung preview hiển thị đúng kích thước lớn.
  - Nhấp sao chép code: Clipboard lưu chuỗi `<Button size="lg">...</Button>`.

---

### TASK-14: Xây dựng Bản Thử nghiệm Demo Cho Button và Tabs Component
- **Mục tiêu kỹ thuật:** Tích hợp bản demo chi tiết cho component Button và component Tabs vào Lab, chứng minh tuân thủ chuẩn ARIA.
- **Tệp tin cần tạo / sửa:**
  - `src/components/ui/tabs.tsx`
  - `src/components/lab/demos/button-demo.tsx`
  - `src/components/lab/demos/tabs-demo.tsx`
- **Yêu cầu kỹ thuật:**
  - Xây dựng component `Tabs` tự viết theo chuẩn WAI-ARIA Tabs pattern: hỗ trợ chuyển tab bằng phím mũi tên trái/phải, phím `Home` nhảy về tab đầu, phím `End` nhảy về tab cuối.
  - Props Panel của Tabs cho phép thay đổi: số lượng tab (2 đến 5), hướng hiển thị (`horizontal`, `vertical`), và kiểu dáng (`underline`, `pill`).
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Sử dụng bàn phím điều hướng qua Tabs trong khung preview: phím mũi tên chuyển tab mượt mà, nội dung tab panel tương ứng thay đổi tức thì.
  - Mục ghi chú Accessibility liệt kê đầy đủ các phím tắt và thuộc tính ARIA được áp dụng.

---

### TASK-15: Xây dựng Hệ thống Toast Thông báo và Bản Thử nghiệm Toast Demo
- **Mục tiêu kỹ thuật:** Tự xây dựng hệ thống thông báo Toast độc lập không dùng thư viện ngoài, hỗ trợ xếp chồng và tự động biến mất.
- **Tệp tin cần tạo / sửa:**
  - `src/components/ui/toast.tsx`
  - `src/components/lab/demos/toast-demo.tsx`
  - `src/app/layout.tsx`
- **Yêu cầu kỹ thuật:**
  - Xây dựng context và hook `useToast` hỗ trợ 4 loại: `info`, `success`, `warning`, `error`.
  - Cho phép cấu hình vị trí hiển thị (`top-right`, `bottom-right`, `bottom-center`) và thời gian hiển thị (2s, 4s, 8s).
  - Tạm dừng đếm ngược thời gian ẩn khi người dùng di chuột (hover) hoặc focus vào thông báo Toast.
  - Vùng chứa Toast có thuộc tính `aria-live="polite"` (và `assertive` đối với thông báo lỗi).
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Nhấn nút "Hiện Toast" trong Demo: Toast xuất hiện với animation trượt mượt mà.
  - Di chuột vào Toast: thông báo không bị đóng sau thời gian timeout cho đến khi chuột rời đi.

---

## Giai đoạn 5: Tích hợp Toàn diện Full-stack: Database, Auth và Guestbook (Phase 5)

### TASK-16: Cấu hình Kết nối CSDL PostgreSQL với Drizzle ORM và Schema
- **Mục tiêu kỹ thuật:** Thiết lập tầng kết nối cơ sở dữ liệu Supabase thông qua Pooler PgBouncer và định nghĩa toàn bộ bảng dữ liệu.
- **Tệp tin cần tạo / sửa:**
  - `drizzle.config.ts`
  - `src/lib/db/schema.ts`
  - `src/lib/db/index.ts`
  - `scripts/seed.ts`
- **Yêu cầu kỹ thuật:**
  - Định nghĩa chính xác 100% các bảng: `users`, `accounts`, `sessions`, `verification_tokens`, `guestbook_entries`, `contact_messages` theo đúng đặc tả tại `docs/database.md`.
  - Cấu hình instance Drizzle ORM sử dụng connection string pooler qua port `6543` với `prepare: false` phù hợp cho môi trường Serverless.
  - Viết kịch bản `scripts/seed.ts` nạp 3 user và 6 lời nhắn mẫu, tự động chặn không chạy trên production.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Chạy `pnpm db:generate` sinh ra tệp SQL migration đầy đủ các bảng và chỉ mục.
  - Chạy `pnpm db:migrate` áp dụng thành công lên cơ sở dữ liệu Supabase mà không báo lỗi cú pháp.

---

### TASK-17: Tích hợp Xác thực Người dùng Auth.js (NextAuth v5) với GitHub OAuth
- **Mục tiêu kỹ thuật:** Thiết lập luồng đăng nhập an toàn bằng tài khoản GitHub, lưu phiên vào cơ sở dữ liệu và phân quyền Admin.
- **Tệp tin cần tạo / sửa:**
  - `src/types/next-auth.d.ts`
  - `src/lib/auth.ts`
  - `src/app/api/auth/[...nextauth]/route.ts`
  - `src/components/guestbook/sign-in-button.tsx`
  - `src/components/guestbook/sign-out-button.tsx`
- **Yêu cầu kỹ thuật:**
  - Cấu hình Auth.js với GitHub Provider và Drizzle Adapter.
  - Callback session tự động gán `user.id`, `user.githubId`, `user.username`, và cờ `user.isAdmin` (kiểm tra so khớp với `ADMIN_GITHUB_ID`).
  - Thiết lập cookie với đầy đủ cờ bảo mật `HttpOnly`, `Secure`, `SameSite=Lax`.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Nhấp "Đăng nhập bằng GitHub": chuyển hướng thành công sang GitHub, sau khi cấp quyền chuyển hướng về `/guestbook` và hiển thị avatar người dùng.
  - Kiểm tra DevTools Application Tab: cookie phiên có cờ `HttpOnly` và không thể truy cập từ JavaScript client.

---

### TASK-18: Triển khai Giao diện Sổ lưu niệm và Server Actions có Optimistic UI
- **Mục tiêu kỹ thuật:** Hoàn thiện tính năng gửi và hiển thị lời nhắn Guestbook thời gian thực với trải nghiệm phản hồi tức thì bằng `useOptimistic`.
- **Tệp tin cần tạo / sửa:**
  - `src/lib/validations/guestbook.ts`
  - `src/lib/moderation.ts`
  - `src/lib/rate-limit.ts`
  - `src/lib/db/queries/guestbook.ts`
  - `src/actions/guestbook.ts`
  - `src/components/guestbook/guestbook-form.tsx`
  - `src/components/guestbook/guestbook-list.tsx`
  - `src/components/guestbook/guestbook-entry.tsx`
  - `src/app/guestbook/page.tsx`
  - `src/app/guestbook/loading.tsx`
- **Yêu cầu kỹ thuật:**
  - Server Action `createEntry` thực hiện kiểm tra đa tầng: Session -> Zod -> Từ khóa cấm -> Rate limit Upstash (3 lần / 10 phút) -> Ghi CSDL -> `revalidateTag("guestbook")`.
  - Form sử dụng React `useOptimistic`: hiển thị lời nhắn tạm thời ngay lập tức với độ mờ 60%; nếu server trả về lỗi thì rollback và hiển thị thông báo.
  - Nội dung lời nhắn hiển thị dạng văn bản thuần túy, tuyệt đối không render HTML để triệt tiêu nguy cơ XSS.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Nhập lời nhắn và nhấn Gửi: nội dung xuất hiện ngay trên danh sách trong vòng 0.1 giây.
  - Thử gửi spam liên tục 4 lần: lần thứ 4 nhận thông báo lỗi rate limit và thời gian cần chờ.

---

### TASK-19: Triển khai Tính năng Xóa Lời nhắn và Phân quyền Quản trị (Admin Moderation)
- **Mục tiêu kỹ thuật:** Cho phép tác giả tự xóa lời nhắn của mình và cho phép Admin có quyền xóa bất kỳ lời nhắn vi phạm nào.
- **Tệp tin cần tạo / sửa:**
  - `src/components/guestbook/delete-entry-dialog.tsx`
  - `src/actions/guestbook.ts` (cập nhật hàm `deleteEntry`)
  - `tests/unit/validations/guestbook.test.ts`
- **Yêu cầu kỹ thuật:**
  - Nút "Xóa" chỉ hiển thị đối với chủ sở hữu của lời nhắn hoặc khi người đăng nhập là Admin.
  - Khi bấm Xóa, mở hộp thoại xác nhận (Confirm Dialog).
  - Thao tác xóa là xóa mềm (Soft delete: cập nhật `deleted_at = NOW()`), không xóa cứng bản ghi khỏi cơ sở dữ liệu.
  - Kiểm tra phân quyền chặt chẽ trong Server Action: người dùng giả mạo request không thể xóa lời nhắn của người khác.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Người dùng A không nhìn thấy nút xóa trên bình luận của Người dùng B.
  - Tài khoản Admin nhìn thấy nút xóa trên tất cả bình luận; khi Admin xóa, lời nhắn biến mất khỏi giao diện ngay lập tức.

---

## Giai đoạn 6: Biểu mẫu Liên hệ, Tích hợp Email và Phòng chống Bot (Phase 6)

### TASK-20: Xây dựng Biểu mẫu Liên hệ với Cơ chế Chống Bot Đa tầng (Honeypot + HMAC)
- **Mục tiêu kỹ thuật:** Xây dựng trang `/contact` có khả năng phòng thủ tự động trước các công cụ spam bot mà không làm phiền người dùng bằng captcha khó chịu.
- **Tệp tin cần tạo / sửa:**
  - `src/lib/validations/contact.ts`
  - `src/lib/crypto.ts`
  - `src/components/contact/contact-form.tsx`
  - `src/components/contact/contact-channels.tsx`
  - `src/app/contact/page.tsx`
  - `tests/unit/crypto.test.ts`
- **Yêu cầu kỹ thuật:**
  - Thêm trường input ẩn `website` (Honeypot) bị ẩn bằng CSS và có `tabIndex={-1}`, `aria-hidden="true"`.
  - Sinh chuỗi token chứa timestamp render trang kèm chữ ký số HMAC từ server.
  - Kiểm tra thời gian tương tác: nếu thời gian submit form dưới 3 giây hoặc trường honeypot bị điền, hệ thống coi là bot và trả về kết quả thành công giả lập (không gửi email).
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Thử dùng script tự động điền form và gửi trong vòng 0.5 giây: server trả về 200 OK nhưng cơ sở dữ liệu không ghi nhận bản ghi spam.
  - Người dùng thật điền form bình thường sau 5 giây: dữ liệu được xử lý hợp lệ.

---

### TASK-21: Tích hợp Dịch vụ Gửi Email Resend và Lưu trữ Tin nhắn Liên hệ
- **Mục tiêu kỹ thuật:** Lưu trữ tin nhắn vào PostgreSQL và chuyển tiếp thông báo tới email cá nhân của chủ trang thông qua API của Resend.
- **Tệp tin cần tạo / sửa:**
  - `src/lib/email.ts`
  - `src/lib/db/queries/contact.ts`
  - `src/actions/contact.ts`
  - `tests/unit/validations/contact.test.ts`
- **Yêu cầu kỹ thuật:**
  - Lưu tin nhắn vào bảng `contact_messages` với trạng thái `email_status = 'pending'`.
  - Gửi email qua Resend SDK với tiêu đề rõ ràng, header `Reply-To` trỏ về email của người gửi.
  - Nếu gửi email thành công, cập nhật trạng thái sang `sent`. Nếu Resend gặp sự cố, cập nhật sang `failed` kèm nhật ký lỗi mà không làm gián đoạn thông báo thành công tới người dùng.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Gửi thử một form liên hệ hợp lệ: Hộp thư cá nhân nhận được email thông báo trong vòng 10 giây.
  - Bấm nút "Reply" trên email nhận được: Trình duyệt mail tự động điền địa chỉ người gửi vào ô "To".

---

### TASK-22: Xây dựng Bộ Kiểm thử End-to-End (E2E) với Playwright
- **Mục tiêu kỹ thuật:** Tự động hóa kiểm tra toàn bộ các luồng trải nghiệm người dùng cốt lõi của hệ thống để phòng ngừa lỗi hồi quy.
- **Tệp tin cần tạo / sửa:**
  - `playwright.config.ts`
  - `tests/e2e/navigation.spec.ts`
  - `tests/e2e/command-palette.spec.ts`
  - `tests/e2e/projects-filter.spec.ts`
  - `tests/e2e/contact.spec.ts`
  - `tests/e2e/guestbook.spec.ts`
- **Yêu cầu kỹ thuật:**
  - Cấu hình Playwright tự động chạy build và khởi động web server cục bộ trước khi test.
  - Kiểm thử 5 luồng chính: Điều hướng qua menu và skip link, Mở và chọn lệnh trên Command Palette, Lọc dự án và kiểm tra đồng bộ URL, Gửi form liên hệ và kiểm tra thông báo lỗi, Xem danh sách Guestbook ở trạng thái chưa đăng nhập.
  - Chạy kiểm thử trên cả hai kích thước màn hình: Desktop (1280x720) và Mobile (iPhone 14 - 390x844).
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Chạy `pnpm test:e2e` thực thi thành công 100% các kịch bản kiểm thử trên cả Chromium và Mobile WebKit.

---

## Giai đoạn 7: Tối ưu Hiệu năng, SEO, Hình ảnh Động và Phát hành Production (Phase 7)

### TASK-23: Tối ưu Hiệu năng Core Web Vitals và Kiểm soát Dung lượng JavaScript
- **Mục tiêu kỹ thuật:** Tối ưu hóa First Contentful Paint (FCP), Largest Contentful Paint (LCP) và kiểm soát First Load JS dưới 150 KB.
- **Tệp tin cần tạo / sửa:**
  - `next.config.ts`
  - `src/app/globals.css`
  - Rà soát toàn bộ các component có khai báo `"use client"`
- **Yêu cầu kỹ thuật:**
  - Cấu hình chuyển đổi ảnh tự động sang định dạng WebP và AVIF trong `next.config.ts`.
  - Tối ưu hóa kích thước phông chữ và chỉ định kích thước cố định cho toàn bộ ảnh để triệt tiêu hoàn toàn hiện tượng xê dịch bố cục (CLS = 0).
  - Tách các tương tác client nặng thành các dynamic imports có loading fallback nếu cần thiết.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Chạy `pnpm build`: First Load JS của trang chủ được báo cáo dưới 150 KB (gzip).
  - Điểm số Cumulative Layout Shift (CLS) đo bằng DevTools đạt dưới 0.05.

---

### TASK-24: Tự động Sinh Ảnh Open Graph Động và Tối ưu Siêu dữ liệu SEO
- **Mục tiêu kỹ thuật:** Tự động tạo ảnh chia sẻ mạng xã hội (OG Image) chất lượng cao cho trang chủ và từng Case Study dự án bằng `@vercel/og`.
- **Tệp tin cần tạo / sửa:**
  - `src/app/opengraph-image.tsx`
  - `src/app/projects/[slug]/opengraph-image.tsx`
  - `src/app/sitemap.ts`
  - `src/app/robots.ts`
  - `src/assets/fonts/Inter-Bold.ttf`
- **Yêu cầu kỹ thuật:**
  - Sinh ảnh OG động kích thước 1200x630 hiển thị tên dự án, danh sách công nghệ và phong cách giao diện tối đồng nhất.
  - Tệp `sitemap.ts` tự động đọc toàn bộ dự án từ MDX để tạo danh mục URL kèm thời gian cập nhật `lastModified`.
  - Tệp `robots.ts` cho phép toàn bộ công cụ tìm kiếm thu thập dữ liệu và chặn các đường dẫn `/api/`.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Mở URL `http://localhost:3000/projects/portfolio/opengraph-image`: Trình duyệt trả về một bức ảnh PNG sắc nét chứa đúng tiêu đề dự án tiếng Việt có dấu.
  - Truy cập `/sitemap.xml`: Trình duyệt hiển thị danh sách URL chuẩn XML hợp lệ.

---

### TASK-25: Thiết lập Cấu hình Bảo mật HTTP Security Headers Toàn diện
- **Mục tiêu kỹ thuật:** Cấu hình Content Security Policy (CSP) và các tiêu chuẩn bảo mật HTTP chống lại các hình thức tấn công web phổ biến.
- **Tệp tin cần tạo / sửa:**
  - `next.config.ts`
  - `src/app/not-found.tsx`
  - `src/app/error.tsx`
  - `src/app/global-error.tsx`
- **Yêu cầu kỹ thuật:**
  - Thiết lập HTTP response headers trong `next.config.ts`:
    - `Content-Security-Policy`
    - `X-Frame-Options: DENY`
    - `X-Content-Type-Options: nosniff`
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Permissions-Policy`
  - Hoàn thiện trang 404 và Error Boundary tùy biến thân thiện với người dùng.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Kiểm tra Response Headers của trang chủ bằng `curl -I`: Toàn bộ các header bảo mật trên xuất hiện đầy đủ trong kết quả trả về.
  - Đánh giá trang web trên công cụ SecurityHeaders.com đạt điểm A hoặc A+.

---

### TASK-26: Triển khai Production Lên Vercel và Chạy Kiểm thử Khói Toàn diện
- **Mục tiêu kỹ thuật:** Đưa toàn bộ hệ thống lên môi trường đám mây thực tế, kết nối tên miền chính thức và xác thực sự hoạt động của các dịch vụ.
- **Tệp tin cần tạo / sửa:**
  - `.github/workflows/ci.yml`
  - `.github/workflows/keepalive.yml`
  - `docs/worklog.md`
- **Yêu cầu kỹ thuật:**
  - Cấu hình đầy đủ biến môi trường trên Vercel Dashboard theo đúng hướng dẫn tại `docs/deploy.md`.
  - Thiết lập GitHub Actions `keepalive.yml` ping định kỳ 3 ngày/lần để chống tạm dừng cơ sở dữ liệu Supabase Free-tier.
  - Thực hiện toàn bộ 8 bước kiểm tra khói (Smoke Testing) trên môi trường Production.
- **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - Trang web Production tải thành công trên domain chính thức với chứng chỉ SSL hợp lệ.
  - Điểm Google Lighthouse trên trang web Production (kiểm tra trên thiết bị Mobile mô phỏng) đạt tối thiểu 95 điểm ở cả 4 tiêu chí: Performance, Accessibility, Best Practices, và SEO.
  - Đăng nhập bằng GitHub, gửi lời nhắn trên Guestbook và gửi tin nhắn qua Contact Form hoạt động trơn tru 100%.
