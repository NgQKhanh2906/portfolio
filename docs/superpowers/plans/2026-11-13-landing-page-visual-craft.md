# Kế hoạch Thực thi: Nâng cấp Landing Page "The Visual Craft Showcase"

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hiện thực hóa giao diện Landing Page theo Phương án 1 ("The Visual Craft Showcase") với bố cục Hero 2 cột, Code Card lơ lửng, Browser Mockups chân thực cho dự án, lưới 4 Stat Cards chỉn chu và hệ thống micro-interactions mượt mà.

**Architecture:** Sử dụng Next.js 14 Server Components bóc tách theo nguyên tắc đơn nhiệm; xây dựng component khung trình duyệt `BrowserMockup` độc lập không phụ thuộc thư viện bên ngoài; tích hợp hệ thống design tokens kép (Light: Emerald / Dark: Neon Violet) với các utility classes Tailwind CSS tối ưu.

**Tech Stack:** Next.js 14.2 (App Router), React 18, TypeScript 5.7 strict, Tailwind CSS 3.4, Lucide React, Vitest jsdom.

**Spec:** [docs/superpowers/specs/2026-11-13-landing-page-visual-craft-design.md](file:///d:/Khanh/Portfolio/docs/superpowers/specs/2026-11-13-landing-page-visual-craft-design.md)

## Global Constraints

- First Load JS của trang chủ `/` phải duy trì dưới 150 kB gzip (chuẩn AGENTS.md).
- Chuẩn tiếp cận WCAG 2.1 AA: Độ tương phản màu chữ/nền tối thiểu 4.5:1; vùng chạm di động tối thiểu 44x44px; toàn bộ icon button có `aria-label`.
- Mọi icon hình tròn bao quanh bắt buộc có `shrink-0 aspect-square rounded-full` để chống méo khi chữ xuống dòng.
- Không dùng thanh phần trăm kỹ năng tự chấm điểm; không dùng nhận xét giả.
- 100% mã nguồn TypeScript strict mode (`strict: true`, `noUncheckedIndexedAccess: true`), không dùng kiểu `any`.

## Review Focus

1. **Co dãn co ép icon trên màn hình nhỏ:** Khi hiển thị trên màn hình hẹp (375px), icon tròn không bị dẹp thành hình bầu dục khi chữ dài rớt dòng.
2. **Hiển thị khung BrowserMockup không vỡ layout:** Khung trình duyệt co dãn mượt mà theo tỷ lệ 16:9 trên cả mobile và desktop.
3. **Độ tương phản màu tím neon ở Dark Mode:** Đảm bảo chữ trên nền tím neon hoặc nền tối sâu có độ tương phản đạt tối thiểu 4.5:1.
4. **Không phát sinh layout shift khi chuyển theme:** ThemeToggle một chạm hoạt động mượt mà không nháy giao diện.
5. **Hiệu năng animation trên thiết bị bật Reduce Motion:** Tôn trọng cài đặt `prefers-reduced-motion` của hệ điều hành.

---

### Task 1: Xây dựng Component `BrowserMockup` Tái sử dụng

**Files:**
- Create: `src/components/ui/browser-mockup.tsx`
- Test: `tests/components/browser-mockup.test.tsx`

**Interfaces:**
- Produces: `BrowserMockup({ url, title, className, children }: BrowserMockupProps) -> JSX.Element`

- [ ] **Step 1: Viết test cho component `BrowserMockup`**

```tsx
// tests/components/browser-mockup.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserMockup } from "@/components/ui/browser-mockup";

describe("BrowserMockup Component", () => {
  it("renders browser window chrome with title and controls", () => {
    render(
      <BrowserMockup url="https://taskflow.dev" title="TaskFlow App">
        <div>App Content</div>
      </BrowserMockup>,
    );

    expect(screen.getByText("https://taskflow.dev")).toBeInTheDocument();
    expect(screen.getByText("App Content")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận thất bại (TDD)**

Run: `npx vitest run tests/components/browser-mockup.test.tsx`
Expected: FAIL do chưa tạo file `browser-mockup.tsx`.

- [ ] **Step 3: Triển khai component `BrowserMockup` tại `src/components/ui/browser-mockup.tsx`**

Xây dựng component khung cửa sổ trình duyệt macOS/Chrome:
- Header bar: 3 nút tròn điều khiển (đỏ, vàng, xanh) có `shrink-0 aspect-square rounded-full`.
- Thanh địa chỉ URL giả lập hiển thị link dự án với font mono tinh xảo.
- Thân cửa sổ (viewport canvas) hiển thị nội dung/giao diện sản phẩm với tỷ lệ 16:9.

- [ ] **Step 4: Chạy test để xác nhận vượt qua**

Run: `npx vitest run tests/components/browser-mockup.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit Git**

```bash
git add src/components/ui/browser-mockup.tsx tests/components/browser-mockup.test.tsx
git commit -m "feat(ui): implement reusable BrowserMockup component with macOS chrome"
```

---

### Task 2: Nâng cấp Khung Hiển thị Dự án với Browser Mockup Chân thực

**Files:**
- Modify: `src/components/home/featured-projects.tsx`
- Modify: `src/components/projects/project-card.tsx`

**Interfaces:**
- Consumes: `BrowserMockup` từ `src/components/ui/browser-mockup.tsx`
- Consumes: `ProjectFrontmatter` từ `src/lib/validations/project-frontmatter.ts`

- [ ] **Step 1: Cập nhật `src/components/home/featured-projects.tsx`**

Thay thế các khối placeholder xám `16:9 Cover Image` đơn điệu bằng `BrowserMockup`:
- Dự án Portfolio: Hiển thị preview giao diện dark mode với code editor và telemetry widget.
- Dự án TaskFlow: Hiển thị preview giao diện bảng Kanban với 3 cột (To Do, In Progress, Done).
- Dự án ShopLite: Hiển thị preview giao diện storefront với giỏ hàng và danh mục sản phẩm.
- Tích hợp hiệu ứng hover nâng card và viền sáng tím neon.

- [ ] **Step 2: Cập nhật `src/components/projects/project-card.tsx`**

Đưa `BrowserMockup` vào phần đầu của mỗi thẻ `ProjectCard`, đảm bảo badge "Tiêu biểu" và năm thực hiện hiển thị hài hòa.

- [ ] **Step 3: Chạy test kiểm tra hồi quy**

Run: `npx vitest run tests/components/project-card.test.tsx`
Expected: PASS.

- [ ] **Step 4: Commit Git**

```bash
git add src/components/home/featured-projects.tsx src/components/projects/project-card.tsx
git commit -m "feat(projects): upgrade project cards with realistic browser window mockups"
```

---

### Task 3: Tinh chỉnh Hero Section theo Chuẩn "The Visual Craft Showcase"

**Files:**
- Modify: `src/components/home/hero.tsx`

**Interfaces:**
- Consumes: `siteConfig` từ `src/data/site-config.ts`
- Consumes: `Button` từ `src/components/ui/button.tsx`

- [ ] **Step 1: Hoàn thiện chi tiết thị giác cột phải Hero**

Trong `src/components/home/hero.tsx`:
- Bổ sung khung ảnh chân dung / avatar đại diện tinh tế kết hợp vầng sáng tròn tím neon (`accent/20 blur-3xl`).
- Tinh chỉnh thẻ Code Card `developer.config.ts`: Căn chỉnh padding, màu cú pháp TypeScript (key màu tím nhạt, string màu tím neon, boolean màu xanh lá).
- Thêm hiệu ứng lơ lửng êm ái `animate-float` và vệt sáng phản quang khi di chuột (`card-interactive`).

- [ ] **Step 2: Hoàn thiện chi tiết cột trái Hero**

- Kiểm tra pill badge `I'M A WEB DEVELOPER` có đèn hiệu nhấp nháy `shrink-0 aspect-square rounded-full`.
- Tinh chỉnh danh sách chip công nghệ thực chiến: Hover có hiệu ứng sáng viền màu accent và icon nổi.

- [ ] **Step 3: Chạy toàn bộ unit tests**

Run: `npx vitest run`
Expected: 100% tests PASS.

- [ ] **Step 4: Commit Git**

```bash
git add src/components/home/hero.tsx
git commit -m "feat(hero): polish 2-column layout with studio portrait, neon halo and code card"
```

---

### Task 4: Nâng cấp About Section với Lưới 4 Thẻ Chỉ số (Stat Cards 2x2)

**Files:**
- Modify: `src/components/home/about-section.tsx`
- Modify: `src/data/profile.ts`

**Interfaces:**
- Consumes: `profile` từ `src/data/profile.ts`
- Consumes: `Button` từ `src/components/ui/button.tsx`

- [ ] **Step 1: Đồng bộ dữ liệu chỉ số trong `src/data/profile.ts`**

Bổ sung cấu trúc dữ liệu chỉ số chuẩn xác:
- 4+ Năm học tập & thực hành CNTT.
- 10+ Dự án & Case Studies kỹ thuật.
- 100% Chuẩn WCAG 2.1 AA & Test Pass.
- 300+ Đóng góp mã nguồn trên GitHub.

- [ ] **Step 2: Hoàn thiện giao diện lưới 2x2 Stat Cards trong `src/components/home/about-section.tsx`**

- Định dạng số đo lớn font mono đậm nét, icon nằm trong khung tròn có viền phát sáng mờ.
- Rê chuột vào từng thẻ có hiệu ứng nâng nhẹ 3px và đổi màu viền sang tím neon.

- [ ] **Step 3: Chạy test và typecheck**

Run: `npx tsc --noEmit && npx vitest run`
Expected: 0 lỗi type, 100% tests PASS.

- [ ] **Step 4: Commit Git**

```bash
git add src/data/profile.ts src/components/home/about-section.tsx
git commit -m "feat(about): enhance about section with 2x2 interactive stat cards grid"
```

---

### Task 5: Kiểm thử Toàn diện, Build Production và Nghiệm thu

**Files:**
- Test all: `tests/**/*.test.ts`, `tests/**/*.test.tsx`
- Build: `.next/`

- [ ] **Step 1: Chạy kiểm tra TypeScript typecheck**

Run: `npx tsc --noEmit`
Expected: Mã thoát 0, 0 lỗi.

- [ ] **Step 2: Chạy kiểm tra Next.js ESLint**

Run: `npx next lint`
Expected: `✔ No ESLint warnings or errors`.

- [ ] **Step 3: Chạy toàn bộ Unit Tests**

Run: `npx vitest run`
Expected: Toàn bộ test files và test cases đều PASS 100%.

- [ ] **Step 4: Chạy kiểm thử Production Build**

Run: `npx next build` (BypassSandbox: true)
Expected: Build thành công, 11/11 static pages, First Load JS < 150 kB.

- [ ] **Step 5: Đẩy nhánh lên GitHub và tạo Pull Request về `main`**

```bash
git push origin feature/ui-ux-refinement
gh pr create --title "feat(ui): complete visual craft showcase layout, browser mockups and stat cards"
gh pr merge <PR_NUMBER> --merge
git checkout main && git pull origin main
```
