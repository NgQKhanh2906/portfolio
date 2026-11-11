# Design System - Portfolio

## 1. Nguyên tắc thiết kế

| Nguyên tắc | Ý nghĩa áp dụng |
| :--- | :--- |
| Nội dung trước, hiệu ứng sau | Mọi hiệu ứng phải phục vụ việc đọc hoặc phản hồi thao tác; không có animation trang trí chạy liên tục. |
| Kỹ thuật và tinh gọn | Phong cách gần với tài liệu kỹ thuật hiện đại: nền tối trầm, chữ rõ, một màu nhấn duy nhất, dùng font mono cho chi tiết kỹ thuật (phím tắt, commit SHA, số liệu). |
| Bàn phím là công dân hạng nhất | Mọi thành phần tương tác có focus ring rõ ràng và phím tắt hợp lý. |
| Nhất quán bằng token | Không viết mã màu, khoảng cách, bo góc trực tiếp trong component; luôn dùng token. |
| Mobile-first | Thiết kế cho 375px trước, mở rộng dần lên 1440px. |

Ngôn ngữ thiết kế gợi ý: "Engineering notebook" - lưới chấm mờ ở nền Hero, đường kẻ mảnh, nhãn mono nhỏ phía trên tiêu đề section (ví dụ `01 / PROJECTS`).

---

## 2. Bảng màu (Color Palette)

Token được khai báo dưới dạng CSS custom property, theme Light gán trên `:root`, theme Dark gán trên `.dark`. Tailwind ánh xạ token thành class (ví dụ `bg-surface`, `text-muted`).

### 2.1. Màu ngữ nghĩa (Semantic tokens)

| Token | Light | Dark | Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| `--color-bg` | `#FAFAF9` | `#0B0B0C` | Nền trang |
| `--color-surface` | `#FFFFFF` | `#131316` | Nền card, header khi cuộn, dialog |
| `--color-surface-2` | `#F4F4F2` | `#1B1B1F` | Nền hover, mục đang chọn, code block |
| `--color-border` | `#E4E4E0` | `#27272B` | Viền card, đường phân cách |
| `--color-border-strong` | `#C9C9C3` | `#3A3A40` | Viền input, viền khi hover |
| `--color-text` | `#141414` | `#EDEDEF` | Chữ chính |
| `--color-text-muted` | `#5C5C57` | `#A0A0A8` | Chữ phụ, mô tả, thời gian |
| `--color-text-subtle` | `#8A8A84` | `#6E6E76` | Placeholder, nhãn mờ (chỉ dùng cho chữ từ 18px hoặc phần tử không phải nội dung chính) |
| `--color-accent` | `#0B7A5E` | `#2DD4A3` | Màu nhấn: link, nút chính, trạng thái active |
| `--color-accent-hover` | `#08634C` | `#5EE3BB` | Hover của màu nhấn |
| `--color-accent-fg` | `#FFFFFF` | `#04241B` | Chữ trên nền màu nhấn |
| `--color-accent-soft` | `#E3F4EE` | `#0F2E25` | Nền nhạt của badge, chip đang chọn |
| `--color-focus` | `#0B7A5E` | `#2DD4A3` | Focus ring |

### 2.2. Màu trạng thái (Status tokens)

| Token | Light | Dark | Mục đích |
| :--- | :--- | :--- | :--- |
| `--color-success` | `#15803D` | `#4ADE80` | Thành công |
| `--color-success-soft` | `#E7F6EC` | `#10261A` | Nền thông báo thành công |
| `--color-warning` | `#B45309` | `#FBBF24` | Cảnh báo |
| `--color-warning-soft` | `#FDF3E1` | `#2A2010` | Nền cảnh báo |
| `--color-danger` | `#B91C1C` | `#F87171` | Lỗi, hành động nguy hiểm |
| `--color-danger-soft` | `#FBE9E9` | `#2C1414` | Nền lỗi |
| `--color-info` | `#1D4ED8` | `#60A5FA` | Thông tin |
| `--color-info-soft` | `#E8EEFC` | `#111D33` | Nền thông tin |

> **Kiểm chứng tương phản bắt buộc:** Các mã màu trên được chọn hướng tới WCAG AA, nhưng phải kiểm tra lại bằng công cụ (WebAIM Contrast Checker hoặc tab Accessibility của DevTools) trước khi chốt. Yêu cầu: `text` và `text-muted` trên `bg`, `surface`, `surface-2` đạt từ 4.5:1; `accent` dùng làm chữ trên `bg` đạt từ 4.5:1; `accent-fg` trên `accent` đạt từ 4.5:1. Cặp nào không đạt thì điều chỉnh độ sáng và cập nhật lại bảng này.

### 2.3. Màu cho tech badge

Tech badge không dùng màu thương hiệu của từng công nghệ (tránh lòe loẹt). Tất cả badge dùng nền `surface-2`, viền `border`, chữ `text-muted`; badge đang được chọn trong bộ lọc dùng nền `accent-soft`, chữ `accent`.

---

## 3. Typography

### 3.1. Font

| Vai trò | Font | Nguồn | Ghi chú |
| :--- | :--- | :--- | :--- |
| Sans (nội dung, tiêu đề) | Inter | Google Fonts qua `next/font/google` | Bắt buộc nạp subset `latin` và `vietnamese`; kiểm tra subset khả dụng khi cài đặt |
| Mono (code, phím tắt, số liệu, nhãn section) | JetBrains Mono | Google Fonts qua `next/font/google` | Nạp subset `latin` và `vietnamese` nếu khả dụng |

Cấu hình `display: 'swap'`, khai báo biến CSS `--font-sans` và `--font-mono`. Chỉ nạp các weight dùng thật: Inter 400, 500, 600, 700; JetBrains Mono 400, 500.

### 3.2. Thang chữ (Type scale)

| Token | Mobile (size / line-height) | Desktop từ 1024px | Weight | Dùng cho |
| :--- | :--- | :--- | :--- | :--- |
| `display` | 40px / 44px | 64px / 68px | 700 | Họ tên trong Hero |
| `h1` | 32px / 38px | 44px / 52px | 700 | Tiêu đề trang, tiêu đề Case Study |
| `h2` | 24px / 32px | 32px / 40px | 600 | Tiêu đề section |
| `h3` | 20px / 28px | 22px / 30px | 600 | Tiêu đề card, heading cấp 3 trong bài |
| `body-lg` | 18px / 28px | 18px / 30px | 400 | Câu giá trị Hero, đoạn mở đầu |
| `body` | 16px / 26px | 16px / 26px | 400 | Nội dung chính |
| `body-sm` | 14px / 22px | 14px / 22px | 400 | Mô tả phụ, thời gian, metadata |
| `caption` | 12px / 18px | 12px / 18px | 500 | Nhãn badge, chú thích ảnh |
| `mono-label` | 12px / 16px, letter-spacing 0.08em, uppercase | như mobile | 500 | Nhãn section `01 / PROJECTS` |
| `code` | 14px / 22px | 14px / 22px | 400 | Code inline và code block |

Quy tắc:
- Độ dài dòng của văn bản dài trong Case Study tối đa 72 ký tự (`max-width: 68ch`).
- Tiêu đề dùng `text-wrap: balance`; đoạn văn dùng `text-wrap: pretty` (trình duyệt không hỗ trợ thì bỏ qua).
- Letter-spacing của `display` và `h1`: `-0.02em`.

---

## 4. Khoảng cách, lưới và kích thước

### 4.1. Thang khoảng cách (cơ sở 4px)

| Token | Giá trị | Dùng cho |
| :--- | :--- | :--- |
| `space-1` | 4px | Khoảng cách icon và chữ trong badge |
| `space-2` | 8px | Khoảng cách giữa badge, padding dọc của nút nhỏ |
| `space-3` | 12px | Padding input, khoảng cách trong form |
| `space-4` | 16px | Padding card mobile, gap lưới mobile |
| `space-6` | 24px | Padding card desktop, gap lưới desktop |
| `space-8` | 32px | Khoảng cách giữa tiêu đề section và nội dung |
| `space-12` | 48px | Khoảng cách giữa các section trên mobile |
| `space-16` | 64px | Khoảng cách giữa các khối lớn |
| `space-24` | 96px | Khoảng cách giữa các section trên desktop |

### 4.2. Breakpoint

| Tên | Từ | Ghi chú |
| :--- | :--- | :--- |
| (mặc định) | 0px | Thiết kế gốc cho 375px, phải dùng được ở 320px |
| `sm` | 640px | Lưới dự án 2 cột |
| `md` | 768px | Hiện menu đầy đủ trên Header |
| `lg` | 1024px | Lưới dự án 3 cột, type scale desktop |
| `xl` | 1280px | Mục lục Case Study dính bên phải |

### 4.3. Container

- Chiều rộng tối đa nội dung: 1120px, căn giữa.
- Padding ngang: 16px (mobile), 24px (từ `md`), 32px (từ `lg`).
- Trang Case Study: cột nội dung tối đa 720px; từ `xl` có thêm cột mục lục 240px, khoảng cách 48px.

### 4.4. Bo góc, viền, đổ bóng

| Token | Giá trị | Dùng cho |
| :--- | :--- | :--- |
| `radius-sm` | 6px | Badge, kbd, chip |
| `radius-md` | 10px | Nút, input, textarea |
| `radius-lg` | 14px | Card, code block |
| `radius-xl` | 20px | Dialog, Command Palette |
| `radius-full` | 9999px | Avatar, nút icon tròn |
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.06)` | Card ở theme Light |
| `shadow-lg` | `0 16px 48px rgba(0,0,0,0.18)` | Dialog, Command Palette, Toast |
| Viền mặc định | 1px solid `--color-border` | Card, input |

Ở theme Dark, card không dùng bóng; phân tách bằng viền và chênh lệch màu nền.

### 4.5. Vùng chạm

Mọi phần tử tương tác có vùng chạm tối thiểu 44x44px trên mobile (có thể dùng padding hoặc pseudo-element mở rộng vùng chạm).

---

## 5. Chuyển động (Motion)

| Token | Giá trị | Dùng cho |
| :--- | :--- | :--- |
| `duration-fast` | 120ms | Hover, đổi màu nút |
| `duration-base` | 200ms | Mở dropdown, chuyển tab |
| `duration-slow` | 320ms | Mở dialog, sheet, fade-in section |
| `ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Phần tử xuất hiện |
| `ease-in` | `cubic-bezier(0.7, 0, 0.84, 0)` | Phần tử biến mất |

Quy tắc:
- Chỉ animate `transform` và `opacity` để tránh reflow.
- Section fade-in: từ `opacity: 0; translateY(8px)` đến `opacity: 1; translateY(0)`, `duration-slow`, chỉ 1 lần.
- Với `prefers-reduced-motion: reduce`: bỏ `translate`, chỉ giữ opacity tối đa 150ms; Toast không trượt.

---

## 6. Focus và trạng thái tương tác

| Trạng thái | Quy tắc |
| :--- | :--- |
| Focus (bàn phím) | Dùng `:focus-visible`: outline 2px `--color-focus`, offset 2px. Không bao giờ dùng `outline: none` mà không có thay thế. |
| Hover | Nút chính đổi sang `accent-hover`; card đổi viền sang `border-strong`; link gạch chân. |
| Active (nhấn) | `transform: scale(0.98)` trên nút, `duration-fast`. |
| Disabled | Opacity 50%, `cursor: not-allowed`, có thuộc tính `disabled` hoặc `aria-disabled="true"`. |
| Loading | Spinner thay icon trái, nhãn giữ nguyên, `aria-busy="true"`, nút không bấm được. |

---

## 7. Danh sách Component

### 7.1. Primitive UI (`src/components/ui/`)

| Component | Variant / Props chính | Ghi chú Accessibility |
| :--- | :--- | :--- |
| `Button` | `variant`: primary, secondary, ghost, danger; `size`: sm (32px), md (40px), lg (48px); `loading`; `disabled`; `iconLeft`; `iconRight`; `asChild` để render thành link | Nút chỉ có icon bắt buộc `aria-label` |
| `IconButton` | `size`: sm, md; `label` (bắt buộc, gán vào `aria-label`) | Vùng chạm 44px trên mobile |
| `Input` | `invalid`, `describedBy` | Gắn `aria-invalid`, `aria-describedby` |
| `Textarea` | `maxLength`, `showCounter`, `invalid` | Bộ đếm có `aria-live="polite"` khi còn dưới 20 ký tự |
| `Select` | Dùng thẻ `<select>` gốc được tạo kiểu | Native nên tự đạt chuẩn bàn phím |
| `Label` | `required` | Hiển thị dấu `*` kèm text ẩn "bắt buộc" cho screen reader |
| `FieldError` | `id`, `message` | `role="alert"` |
| `Badge` | `variant`: neutral, accent, success, warning, danger | Chỉ hiển thị |
| `Chip` | `selected`, `onToggle` | Dùng `<button aria-pressed>` |
| `Card` | `interactive` (có hover) | Card có link: toàn bộ card bấm được nhưng chỉ tiêu đề là thẻ `<a>` (dùng pseudo-element phủ) |
| `Dialog` | `open`, `onOpenChange`, `title`, `description` | Dùng thẻ `<dialog>` gốc hoặc focus trap tự viết; `aria-labelledby`, `aria-describedby`; trả focus khi đóng |
| `Sheet` | `side`: right | Như Dialog |
| `DropdownMenu` | `items`, `align` | Mẫu ARIA menu button, phím mũi tên |
| `Tabs` | `orientation`, `variant`: underline, pill | Mẫu WAI-ARIA Tabs: `role="tablist"`, `tab`, `tabpanel`, phím mũi tên, `Home`, `End` |
| `Toast` / `Toaster` | `type`: info, success, warning, error; `title`; `description`; `duration`; `position` | Vùng chứa `aria-live="polite"` (error dùng `assertive`); tạm dừng đếm giờ khi hover hoặc focus |
| `Tooltip` | `content`, `side` | Hiện khi hover và khi focus; `aria-describedby` |
| `Skeleton` | `width`, `height`, `radius` | `aria-hidden="true"`; vùng cha có `aria-busy="true"` |
| `Kbd` | `keys: string[]` | Dùng thẻ `<kbd>`, font mono |
| `Avatar` | `src`, `alt`, `size`: 32, 40, 96, 160 | Fallback chữ cái đầu khi ảnh lỗi |
| `Spinner` | `size` | `role="status"` kèm text ẩn "Đang tải" |
| `EmptyState` | `icon`, `title`, `description`, `action` | |
| `ErrorState` | `title`, `description`, `onRetry` | |
| `CopyButton` | `value`, `label` | Toast phản hồi; đổi icon thành dấu check 2 giây |

### 7.2. Component tính năng

| Nhóm | Component |
| :--- | :--- |
| Layout | `SiteHeader`, `SiteFooter`, `MobileNav`, `SkipLink`, `SectionHeading` (nhãn mono + h2 + mô tả), `Container` |
| Trang chủ | `Hero`, `AboutSection`, `SkillsSection`, `SkillGroup`, `FeaturedProjects`, `ExperienceTimeline`, `TimelineItem` |
| Dự án | `ProjectCard`, `ProjectGrid`, `ProjectFilter`, `CaseStudyHeader`, `TableOfContents`, `ProjectPager`, `TechBadge`, `ViewCounter` |
| MDX | `ArchitectureDiagram`, `Callout`, `Metric`, `CodeBlock`, `MdxImage` |
| Command Palette | `CommandPalette`, `CommandTrigger` |
| Theme | `ThemeProvider`, `ThemeToggle`, `ThemeScript` |
| Guestbook | `GuestbookForm`, `GuestbookList`, `GuestbookEntry`, `SignInButton`, `SignOutButton`, `DeleteEntryDialog` |
| Contact | `ContactForm`, `ContactChannels` |
| Lab | `ComponentPlayground`, `PropsPanel`, `CodePreview`, `ButtonDemo`, `ToastDemo`, `TabsDemo`, `A11yNotes` |
| Telemetry | `TelemetryWidget`, `GithubActivityList`, `DeployInfo` |

---

## 8. Mô tả bố cục màn hình

### 8.1. Trang chủ (mobile 375px)

```
+-----------------------------------+
| [NQK]            [Ctrl K] [o] [=] |  Header
+-----------------------------------+
| 00 / HELLO                        |  mono-label
| Xin chào, mình là                 |
| Nguyễn Quốc Khánh                 |  display
| Web Developer                     |  h2, màu accent
| Câu giá trị 1-2 dòng ...          |  body-lg, text-muted
| [Đang tìm cơ hội Intern/Fresher]  |  Badge success
| [ Xem dự án ]  [ Tải CV ]         |  Button primary + secondary
+-----------------------------------+
| 01 / ABOUT          ...           |
| 02 / SKILLS         ...           |
| 03 / PROJECTS       3 card dọc    |
| 04 / JOURNEY        timeline      |
| 05 / LIVE           telemetry     |
+-----------------------------------+
| Footer: (c) 2026 | GH | IN | Mail |
| deployed a1b2c3d - build 11/11    |  mono, text-subtle
+-----------------------------------+
```

### 8.2. Trang Case Study (desktop 1280px)

```
+--------------------------------------------------------------+
| Header                                                       |
+--------------------------------------------------------------+
| < Tất cả dự án                                               |
| Tiêu đề dự án (h1)                                           |
| Tóm tắt                                                      |
| Vai trò | Thời gian | Team | 1,234 lượt xem                  |
| [Next.js] [PostgreSQL] [Redis] ...    [Demo] [Source]        |
| [ Ảnh cover 16:9 ]                                           |
+----------------------------------------+---------------------+
| ## Bối cảnh và bài toán                | MỤC LỤC             |
| ...                                    | - Bối cảnh  (active)|
| ## Kiến trúc giải pháp                 | - Mục tiêu          |
| [ ArchitectureDiagram ]                | - Kiến trúc         |
| ...                                    | - Quyết định        |
|                                        | - Thách thức        |
|                                        | - Kết quả           |
+----------------------------------------+---------------------+
| [< Dự án trước]                          [Dự án sau >]       |
+--------------------------------------------------------------+
```

### 8.3. Command Palette

```
+---------------------------------------------+
| [kính lúp] Gõ lệnh hoặc tìm kiếm...    Esc  |
+---------------------------------------------+
| ĐIỀU HƯỚNG                                  |
| > Trang chủ                                 |  mục đang chọn: surface-2
|   Projects                                  |
|   Guestbook                                 |
| DỰ ÁN                                       |
|   Tên dự án 1                               |
| GIAO DIỆN                                   |
|   Dark  /  Light  /  System                 |
| HÀNH ĐỘNG                                   |
|   Sao chép email                     Ctrl C |
+---------------------------------------------+
| [mũi tên] di chuyển   Enter chọn   Esc đóng |
+---------------------------------------------+
```

Kích thước: rộng tối đa 640px, cách đỉnh màn hình 15vh; trên mobile rộng 100% trừ lề 16px. Nền phủ `rgba(0,0,0,0.5)` có backdrop blur 4px.

---

## 9. Trạng thái màn hình (Screen States)

| Khu vực | Loading | Empty | Error |
| :--- | :--- | :--- | :--- |
| Danh sách Guestbook | 5 Skeleton dạng (avatar tròn 40px + 2 dòng chữ) | Icon tin nhắn, "Chưa có lời nhắn nào. Hãy là người đầu tiên." | ErrorState "Không tải được lời nhắn" + nút "Thử lại" |
| Nút "Xem thêm" Guestbook | Spinner trong nút, nhãn "Đang tải..." | Ẩn nút khi hết dữ liệu, hiện text "Đã hiển thị tất cả lời nhắn" | Toast lỗi, nút trở lại trạng thái bình thường |
| Form Guestbook | Nút Gửi loading, textarea khóa | Không áp dụng | Lỗi dưới textarea (FieldError) |
| Lưới dự án sau khi lọc | Không áp dụng (lọc phía client tức thì) | EmptyState + nút "Xóa bộ lọc" | Không áp dụng |
| Bộ đếm lượt xem | Skeleton rộng 80px cao 16px | Hiển thị "1 lượt xem" khi lần đầu | Ẩn hoàn toàn phần tử |
| Telemetry widget | 5 Skeleton dòng | "Chưa có hoạt động công khai gần đây" | "Không tải được hoạt động GitHub" + link profile |
| Contact form | Nút Gửi loading, toàn bộ trường khóa | Không áp dụng | Thông báo lỗi trong hộp `danger-soft` phía trên nút Gửi, giữ nguyên dữ liệu |
| Trang (chuyển route) | `loading.tsx`: Skeleton theo bố cục trang | Không áp dụng | `error.tsx` (FR-13-02) |
| Ảnh | Nền `surface-2` cùng kích thước (không layout shift); placeholder blur cho ảnh cover | Không áp dụng | Ảnh lỗi: giữ khung nền `surface-2` và `alt` |

---

## 10. Giọng văn giao diện (UX Writing)

- Xưng "mình", gọi người xem là "bạn": thân thiện nhưng chuyên nghiệp.
- Nhãn nút là động từ: "Gửi", "Xóa", "Tải CV", "Xem dự án". Không dùng "OK", "Submit".
- Thông báo lỗi nói rõ chuyện gì xảy ra và cách xử lý; không đổ lỗi cho người dùng; không hiển thị mã lỗi kỹ thuật.
- Thuật ngữ kỹ thuật giữ tiếng Anh (Server Actions, OAuth, Rate limit).
- Không dùng emoji trong giao diện.
