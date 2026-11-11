# GitHub Setup - Cấu hình Kho lưu trữ và Tự động hóa CI/CD

Tài liệu này hướng dẫn chi tiết 100% các bước cấu hình kho lưu trữ GitHub, quản lý biến môi trường, cấu hình bảo vệ nhánh, tệp `.gitignore`, quy trình tự động hóa tích hợp liên tục (GitHub Actions CI) và các biểu mẫu Issue/Pull Request tiêu chuẩn.

---

## 1. Cấu hình Kho lưu trữ GitHub (Repository Settings)

- **Tên Repository:** `portfolio`
- **Trạng thái hiển thị (Visibility):** Public (Công khai).
- **Mô tả ngắn (Description):** `Modern full-stack web developer portfolio built with Next.js App Router, TypeScript, Drizzle ORM, Supabase, Upstash Redis, and Auth.js.`
- **Trang web liên kết (Website URL):** Điền domain chính thức hoặc domain Vercel (ví dụ: `https://nqkhanh.dev`).
- **Chủ đề liên quan (Topics/Tags):** `nextjs`, `react`, `typescript`, `tailwindcss`, `postgresql`, `drizzle-orm`, `upstash-redis`, `authjs`, `portfolio`.
- **Nhánh mặc định (Default Branch):** `main`.

---

## 2. Quy tắc Bảo vệ Nhánh `main` (Branch Protection Rules)

Để đảm bảo nhánh `main` không bao giờ bị phá hỏng và luôn duy trì tiêu chuẩn kỹ thuật nghiêm ngặt, cấu hình tại **Settings > Branches > Branch protection rules** cho nhánh `main`:

1. **Bật "Require a pull request before merging":**
   - Không cho phép push code trực tiếp lên `main`.
2. **Bật "Require status checks to pass before merging":**
   - Tích chọn "Require branches to be up to date before merging".
   - Bắt buộc các status check sau từ GitHub Actions CI phải chuyển sang trạng thái xanh (Passed):
     - `lint`
     - `typecheck`
     - `test:unit`
     - `validate:content`
     - `build`
3. **Bật "Do not allow bypassing the above settings":** Áp dụng quy tắc bình đẳng cho cả chủ sở hữu repository (Admin).
4. **Tắt quyền force push:** Không cho phép bất kỳ lệnh `git push --force` nào tác động vào nhánh `main`.
5. **Tắt quyền xóa nhánh:** Không cho phép xóa nhánh `main`.

---

## 3. Quản lý Biến Môi trường và Bí mật (Environment Variables & Secrets)

### 3.1. Danh sách Biến Môi trường Đầy đủ (`.env.example`)

Dưới đây là nội dung toàn bộ tệp `.env.example` đặt tại thư mục gốc. Khi cài đặt trên máy cá nhân, tạo bản sao có tên `.env.local` và điền giá trị thật:

```bash
# ==============================================================================
# Portfolio - ENVIRONMENT VARIABLES TEMPLATE
# Lưu ý: Các biến KHÔNG có tiền tố NEXT_PUBLIC_ là biến bảo mật (Server-only).
# Tuyệt đối không để lộ hoặc commit giá trị thật của các biến này vào Git.
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. CƠ SỞ DỮ LIỆU (SUPABASE POSTGRESQL)
# ------------------------------------------------------------------------------
# Chuỗi kết nối TCP Pooler của Supabase (Transaction mode, Port 6543)
# Định dạng: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
DATABASE_URL="postgresql://postgres.yourprojectref:yourpassword@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

# Chuỗi kết nối trực tiếp (Direct Connection, Port 5432) dùng khi chạy Migration Drizzle
# Định dạng: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
DATABASE_DIRECT_URL="postgresql://postgres:yourpassword@db.yourprojectref.supabase.co:5432/postgres"

# ------------------------------------------------------------------------------
# 2. XÁC THỰC NGƯỜI DÙNG (AUTH.JS / NEXTAUTH V5)
# ------------------------------------------------------------------------------
# Chuỗi khóa bí mật dùng để mã hóa Cookie và JWE Session (sinh bằng: npx auth secret)
AUTH_SECRET="your-32-character-random-auth-secret-string"

# URL gốc của ứng dụng (Local: http://localhost:3000, Production: https://yourdomain.com)
AUTH_URL="http://localhost:3000"

# GitHub OAuth App Credentials (Lấy tại GitHub Developer Settings > OAuth Apps)
AUTH_GITHUB_ID="your_github_oauth_client_id"
AUTH_GITHUB_SECRET="your_github_oauth_client_secret"

# ID số nguyên của tài khoản GitHub của bạn để định danh quyền Admin (Lấy tại: api.github.com/users/<username>)
ADMIN_GITHUB_ID="12345678"

# ------------------------------------------------------------------------------
# 3. BỘ NHỚ ĐỆM & RATE LIMITING (UPSTASH REDIS)
# ------------------------------------------------------------------------------
# URL và Token kết nối REST API của Upstash Redis (Lấy tại Console Upstash)
UPSTASH_REDIS_REST_URL="https://your-database-name.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_upstash_redis_rest_token"

# Chuỗi muối bảo mật dùng để băm địa chỉ IP và chống đếm trùng View (Chuỗi ngẫu nhiên dài 32 ký tự)
HASH_SALT="your-super-secret-salt-for-ip-hashing"
VIEW_SALT="your-super-secret-salt-for-view-counter"

# Khóa bí mật dùng để ký chữ ký số HMAC kiểm tra thời gian điền form liên hệ (Anti-bot)
HMAC_SECRET="your-super-secret-hmac-key-for-form-validation"

# ------------------------------------------------------------------------------
# 4. DỊCH VỤ GỬI EMAIL THÔNG BÁO (RESEND)
# ------------------------------------------------------------------------------
# API Key của Resend (Lấy tại resend.com/api-keys)
RESEND_API_KEY="re_123456789_abcdefghijklmnopqrstuvwxyz"

# Địa chỉ email nhận thông báo khi có người gửi form liên hệ
NOTIFICATION_EMAIL="your-personal-email@example.com"

# ------------------------------------------------------------------------------
# 5. TÍCH HỢP GITHUB TELEMETRY
# ------------------------------------------------------------------------------
# Personal Access Token (PAT) chỉ đọc của GitHub để truy vấn GraphQL (Không cấp quyền ghi)
GITHUB_READ_TOKEN="ghp_yourpersonalaccesstokenwithreadonlypublicscope"

# ------------------------------------------------------------------------------
# 6. BIẾN CÔNG KHAI CLIENT (NEXT_PUBLIC_)
# ------------------------------------------------------------------------------
# Domain công khai của trang web
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3.2. Cấu hình GitHub Repository Secrets

Khi chạy CI trên GitHub Actions, cấu hình các Secret tại **Settings > Secrets and variables > Actions**:
- `TEST_DATABASE_URL`: Chuỗi kết nối CSDL tạm thời phục vụ test (hoặc mock trong test runner).
- `AUTH_SECRET`: Khóa ngẫu nhiên phục vụ kiểm tra khởi tạo Auth.js trong môi trường CI.
- `UPSTASH_REDIS_REST_URL`: URL mock hoặc test instance của Upstash.
- `UPSTASH_REDIS_REST_TOKEN`: Token mock tương ứng.

---

## 4. Tệp Cấu hình Bỏ qua Mã nguồn (`.gitignore`)

Nội dung chuẩn của tệp `.gitignore` tại thư mục gốc của dự án:

```gitignore
# Dependencies
/node_modules
/.pnpm-store

# Next.js Build Output
/.next/
/out/

# Production Build Artifacts
/build
/dist

# Environment Variables
.env
.env*.local
.env.development.local
.env.test.local
.env.production.local
!.env.example

# Debug and Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Testing & Coverage
/coverage/
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/

# Operating System & IDE Files
.DS_Store
*.pem
.idea/
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Drizzle Local Metadata Cache
.drizzle/
```

---

## 5. Cấu hình Tự động hóa CI/CD (`.github/workflows/ci.yml`)

Quy trình CI được kích hoạt tự động mỗi khi có Pull Request mở vào nhánh `main` hoặc có commit được merge trực tiếp vào `main`. Toàn bộ quy trình chạy trên máy ảo `ubuntu-latest`:

```yaml
name: Continuous Integration

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint-and-typecheck:
    name: Lint & Typecheck
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Check code formatting (Prettier)
        run: pnpm prettier --check .

      - name: Run ESLint
        run: pnpm lint

      - name: Run TypeScript typecheck
        run: pnpm typecheck

  test-and-validate:
    name: Unit Tests & Content Validation
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Validate MDX content and frontmatter
        run: pnpm tsx scripts/validate-content.ts

      - name: Run Vitest Unit Tests
        run: pnpm test

  build-verification:
    name: Production Build Verification
    runs-on: ubuntu-latest
    needs: [lint-and-typecheck, test-and-validate]
    env:
      SKIP_ENV_VALIDATION: "false"
      AUTH_SECRET: "mock-secret-for-ci-build-verification-32chars"
      DATABASE_URL: "postgresql://mock:mock@localhost:5432/mock"
      UPSTASH_REDIS_REST_URL: "https://mock.upstash.io"
      UPSTASH_REDIS_REST_TOKEN: "mock-token"
      HASH_SALT: "mock-salt-32chars-for-ci-validation"
      VIEW_SALT: "mock-salt-32chars-for-ci-validation"
      HMAC_SECRET: "mock-secret-32chars-for-ci-validate"
      RESEND_API_KEY: "re_mock_key"
      NOTIFICATION_EMAIL: "mock@example.com"
      GITHUB_READ_TOKEN: "mock_gh_token"
      ADMIN_GITHUB_ID: "12345678"
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Execute Next.js Build
        run: pnpm build
```

---

## 6. Mẫu Biểu mẫu Quản lý Mã nguồn (Templates)

### 6.1. Biểu mẫu Báo lỗi (`.github/ISSUE_TEMPLATE/bug_report.md`)

```markdown
---
name: Bug Report
about: Tạo báo cáo lỗi để giúp hệ thống hoạt động ổn định và chính xác hơn
title: "fix: [Mô tả ngắn gọn về lỗi]"
labels: ["bug"]
assignees: ""
---

### Mô tả lỗi
Mô tả rõ ràng và ngắn gọn về sự cố phát sinh.

### Các bước tái hiện lỗi (Steps to Reproduce)
1. Truy cập vào trang '...'
2. Nhấn vào nút '...'
3. Điền dữ liệu '...'
4. Quan sát lỗi phát sinh

### Hành vi mong đợi (Expected Behavior)
Mô tả hành vi đúng của tính năng theo tài liệu đặc tả.

### Ảnh chụp màn hình hoặc Video minh họa (nếu có)
Kéo thả ảnh chụp DevTools Console hoặc giao diện lỗi vào đây.

### Môi trường phát sinh lỗi
- Thiết bị: [ví dụ: Desktop PC, iPhone 14]
- Hệ điều hành: [ví dụ: Windows 11, iOS 17]
- Trình duyệt: [ví dụ: Chrome 124, Safari 17]
```

### 6.2. Biểu mẫu Đề xuất Tính năng (`.github/ISSUE_TEMPLATE/feature_request.md`)

```markdown
---
name: Feature Request
about: Đề xuất một tính năng mới hoặc một cải tiến kỹ thuật cho Portfolio
title: "feat: [Tên tính năng hoặc cải tiến]"
labels: ["enhancement"]
assignees: ""
---

### Vấn đề cần giải quyết
Mô tả chi tiết bài toán hoặc điểm hạn chế hiện tại thúc đẩy bạn đề xuất tính năng này.

### Giải pháp đề xuất
Mô tả chi tiết giải pháp kỹ thuật và cách tính năng sẽ hoạt động.

### Tiêu chí nghiệm thu (Acceptance Criteria)
- [ ] Tiêu chí 1: ...
- [ ] Tiêu chí 2: ...

### Các giải pháp thay thế đã cân nhắc
Mô tả ngắn các phương án khác bạn đã xem xét và lý do không chọn.
```

### 6.3. Biểu mẫu Pull Request (`.github/pull_request_template.md`)

```markdown
## Mã Task Liên quan
Liên kết Task trong Roadmap: Fixes/Refs #... (hoặc ghi rõ TASK-xx)

## Tóm tắt Thay đổi
Mô tả ngắn gọn danh sách các thay đổi chính trong Pull Request này:
- Thay đổi 1
- Thay đổi 2

## Bằng chứng Kiểm thử (Verification Proof)
Đánh dấu chọn các hạng mục đã hoàn thành kiểm tra:
- [ ] Mã nguồn đã được format bằng Prettier (`pnpm prettier --check .`)
- [ ] Đã chạy linter và không phát sinh lỗi hoặc cảnh báo (`pnpm lint`)
- [ ] Đã chạy kiểm tra kiểu dữ liệu TypeScript (`pnpm typecheck`)
- [ ] Toàn bộ Unit tests đã vượt qua (`pnpm test`)
- [ ] Đã kiểm tra tính năng trên màn hình Mobile (kích thước 375px) và Desktop
- [ ] Đã kiểm tra khả năng tương tác bằng bàn phím (Tab navigation, Focus rings)

## Ảnh chụp Giao diện (Trước và Sau thay đổi)
Chèn ảnh chụp màn hình minh họa giao diện mới hoặc sửa lỗi tại đây.
```
