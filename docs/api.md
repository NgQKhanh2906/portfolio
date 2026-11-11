# API - Đặc tả Giao diện Lập trình Ứng dụng Portfolio

Tài liệu này đặc tả chi tiết 100% các Server Actions và Route Handlers (REST Endpoints) của hệ thống. Mỗi endpoint và action đều có cấu trúc request, response, cơ chế kiểm tra quyền, mã lỗi và dữ liệu mẫu JSON cụ thể. Tuyệt đối không sử dụng placeholder hoặc cú pháp tóm tắt.

---

## 1. Tiêu chuẩn Thiết kế API (API Design Standards)

Hệ thống kết hợp hai mô hình giao tiếp:
1. **Server Actions (RPC-style):** Sử dụng cho toàn bộ các tác vụ biến đổi dữ liệu (Mutations) từ giao diện người dùng (gửi Guestbook, xóa Guestbook, gửi Contact). Server Actions chạy trực tiếp trên Serverless Node.js runtime của Next.js với cơ chế mã hóa và bảo vệ CSRF tích hợp sẵn.
2. **Route Handlers (RESTful Endpoints):** Sử dụng cho các tác vụ cần giao thức HTTP tiêu chuẩn (OAuth callbacks, bộ đếm lượt xem bằng `fetch`, API đọc telemetry phục vụ cache ISR).

### Cấu trúc Phản hồi Chuẩn của Server Action (`ActionResult<T>`)

Mọi Server Action trong thư mục `src/actions/` bắt buộc phải trả về một đối tượng tuân thủ chặt chẽ kiểu discriminated union sau:

```ts
// Khi thành công
type ActionSuccess<T> = {
  ok: true;
  data: T;
};

// Khi thất bại
type ActionFailure = {
  ok: false;
  code: ErrorCode;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export type ActionResult<T> = ActionSuccess<T> | ActionFailure;
```

---

## 2. Bảng Mã Lỗi Chuẩn (Standard Error Codes)

| Mã lỗi (`code`) | HTTP Status tương đương | Ý nghĩa nghiệp vụ | Thông báo hiển thị mẫu |
| :--- | :--- | :--- | :--- |
| `UNAUTHORIZED` | 401 Unauthorized | Người dùng chưa đăng nhập hoặc phiên làm việc đã hết hạn | "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." |
| `FORBIDDEN` | 403 Forbidden | Người dùng không có quyền thực hiện thao tác trên tài nguyên | "Bạn không có quyền thực hiện thao tác này." |
| `VALIDATION_ERROR` | 400 Bad Request | Dữ liệu đầu vào không vượt qua kiểm tra của Zod schema | "Dữ liệu nhập vào không hợp lệ. Vui lòng kiểm tra lại." |
| `RATE_LIMITED` | 429 Too Many Requests | Người dùng hoặc IP đã vượt quá số lượt thao tác cho phép | "Bạn thao tác quá nhanh. Vui lòng thử lại sau {N} phút." |
| `NOT_FOUND` | 404 Not Found | Bản ghi hoặc tài nguyên yêu cầu không tồn tại | "Không tìm thấy dữ liệu yêu cầu." |
| `BLOCKED_CONTENT` | 422 Unprocessable Entity | Nội dung chứa từ khóa bị chặn trong danh sách kiểm duyệt | "Nội dung không phù hợp với tiêu chuẩn cộng đồng." |
| `BAD_REQUEST` | 400 Bad Request | Tham số URL hoặc payload không đúng định dạng kỹ thuật | "Yêu cầu không hợp lệ." |
| `INTERNAL_ERROR` | 500 Internal Server Error | Lỗi cơ sở dữ liệu, lỗi mạng bên thứ ba hoặc lỗi không lường trước | "Hệ thống đang gặp sự cố. Vui lòng thử lại sau ít phút." |

---

## 3. Đặc tả Chi tiết Server Actions

### 3.1. `guestbook.createEntry`

Tạo một lời nhắn mới trên trang Sổ lưu niệm (`/guestbook`).

- **Tệp nguồn:** `src/actions/guestbook.ts`
- **Quyền truy cập:** Bắt buộc đã đăng nhập (Authenticated User).
- **Quy tắc nghiệp vụ áp dụng:** BR-01 (độ dài 1-280 ký tự), BR-02 (Rate limit 3 lần / 10 phút), BR-03 (Tối đa 20 lời nhắn còn hiệu lực / user), BR-04 (Bộ lọc từ khóa cấm).

#### Tham số Đầu vào (Input)
```ts
export type CreateGuestbookInput = {
  content: string;
};
```

#### Quy trình Xử lý (Step-by-Step Logic)
1. Đọc session hiện tại thông qua `auth()`. Nếu không tồn tại session hoặc không có `session.user.id`, trả về lỗi `UNAUTHORIZED`.
2. Kiểm tra Zod schema: `trim()` chuỗi `content`, kiểm tra độ dài tối thiểu 1 ký tự, tối đa 280 ký tự. Nếu lỗi, trả về `VALIDATION_ERROR` kèm chi tiết lỗi của trường `content`.
3. Kiểm tra từ khóa cấm bằng `containsBlockedKeyword(content)` từ `src/lib/moderation.ts`. Nếu phát hiện từ khóa cấm, trả về lỗi `BLOCKED_CONTENT`.
4. Kiểm tra tổng số lời nhắn còn hiệu lực của user trong database: `countActiveEntriesByUser(userId)`. Nếu `>= 20`, trả về lỗi `BAD_REQUEST` ("Bạn đã đạt giới hạn tối đa 20 lời nhắn").
5. Kiểm tra Rate Limit phân tán qua Upstash Redis: `checkRateLimit(guestbookLimiter, userId)`. Nếu bị chặn, trả về `RATE_LIMITED` kèm thời gian chờ tính theo phút.
6. Thao tác ghi database: Thêm bản ghi vào bảng `guestbook_entries` với `user_id = session.user.id`, `content = sanitizedContent`.
7. Kích hoạt xóa cache: Gọi `revalidateTag("guestbook")` để làm mới danh sách hiển thị cho toàn bộ người xem.
8. Trả về kết quả thành công chứa bản ghi mới tạo kèm thông tin người dùng.

#### Phản hồi Mẫu (Responses)

**Thành công (Success):**
```json
{
  "ok": true,
  "data": {
    "id": "e9b1c7a4-3a52-4f10-9b88-123456789abc",
    "content": "Website rất ấn tượng, chúc bạn sớm tìm được công việc như ý!",
    "createdAt": "2026-11-11T17:40:00.000Z",
    "user": {
      "id": "a1b2c3d4-e5f6-7a8b-9c0d-ef1234567890",
      "name": "Minh Pham",
      "username": "minhpham-dev",
      "image": "https://avatars.githubusercontent.com/u/1234567?v=4",
      "isAdmin": false
    }
  }
}
```

**Thất bại do Rate Limit (Failure - Rate Limited):**
```json
{
  "ok": false,
  "code": "RATE_LIMITED",
  "message": "Bạn gửi quá nhanh. Vui lòng thử lại sau 8 phút."
}
```

**Thất bại do Dữ liệu Rỗng (Failure - Validation Error):**
```json
{
  "ok": false,
  "code": "VALIDATION_ERROR",
  "message": "Dữ liệu nhập vào không hợp lệ.",
  "fieldErrors": {
    "content": ["Nội dung lời nhắn không được để trống."]
  }
}
```

---

### 3.2. `guestbook.deleteEntry`

Thực hiện xóa mềm một lời nhắn trong Sổ lưu niệm.

- **Tệp nguồn:** `src/actions/guestbook.ts`
- **Quyền truy cập:** Tác giả của lời nhắn (`entry.user_id === session.user.id`) HOẶC Chủ trang (`isAdmin === true`).
- **Quy tắc nghiệp vụ áp dụng:** BR-05 (Quyền xóa), BR-08 (Xóa mềm bằng `deleted_at`).

#### Tham số Đầu vào (Input)
```ts
export type DeleteGuestbookInput = {
  id: string; // UUID của entry
};
```

#### Quy trình Xử lý (Step-by-Step Logic)
1. Kiểm tra session hiện tại qua `auth()`. Nếu chưa đăng nhập, trả về lỗi `UNAUTHORIZED`.
2. Kiểm tra định dạng `id` bằng Zod (`z.string().uuid()`). Nếu sai, trả về `VALIDATION_ERROR`.
3. Truy vấn bản ghi từ bảng `guestbook_entries` theo `id`. Nếu không thấy hoặc bản ghi đã có `deleted_at IS NOT NULL`, trả về lỗi `NOT_FOUND`.
4. Kiểm tra phân quyền:
   - Nếu `session.user.id !== entry.user_id` VÀ `session.user.isAdmin !== true`, lập tức trả về lỗi `FORBIDDEN`.
5. Thực hiện cập nhật trong database: `UPDATE guestbook_entries SET deleted_at = NOW(), updated_at = NOW() WHERE id = :id`.
6. Gọi `revalidateTag("guestbook")`.
7. Trả về kết quả thành công chứa ID của lời nhắn đã xóa.

#### Phản hồi Mẫu (Responses)

**Thành công (Success):**
```json
{
  "ok": true,
  "data": {
    "id": "e9b1c7a4-3a52-4f10-9b88-123456789abc"
  }
}
```

**Thất bại do Không có quyền (Failure - Forbidden):**
```json
{
  "ok": false,
  "code": "FORBIDDEN",
  "message": "Bạn không có quyền xóa lời nhắn của người khác."
}
```

---

### 3.3. `guestbook.loadMoreEntries`

Tải thêm các lời nhắn cũ hơn phục vụ phân trang cuộn (Pagination by Cursor).

- **Tệp nguồn:** `src/actions/guestbook.ts`
- **Quyền truy cập:** Công khai (Public).

#### Tham số Đầu vào (Input)
```ts
export type LoadMoreEntriesInput = {
  cursor?: {
    createdAt: string; // ISO string của bản ghi cuối cùng hiện tại
    id: string;        // UUID của bản ghi cuối cùng
  };
  limit?: number;      // Mặc định là 20, tối đa 50
};
```

#### Quy trình Xử lý (Step-by-Step Logic)
1. Validate tham số đầu vào qua Zod. Giới hạn `limit` trong khoảng từ 1 đến 50 (mặc định 20).
2. Thực hiện truy vấn database qua Drizzle:
   ```sql
   SELECT e.id, e.content, e.created_at, u.id as user_id, u.name, u.username, u.image, u.is_admin
   FROM guestbook_entries e
   JOIN users u ON e.user_id = u.id
   WHERE e.deleted_at IS NULL
     AND (e.created_at, e.id) < (:cursorCreatedAt, :cursorId) -- Nếu có cursor
   ORDER BY e.created_at DESC, e.id DESC
   LIMIT :limit + 1;
   ```
3. Nếu số bản ghi trả về bằng `limit + 1`, lấy `hasMore = true`, ngược lại `hasMore = false`. Loại bỏ bản ghi thứ `limit + 1` khỏi danh sách trả về.
4. Trả về danh sách chuẩn hóa kèm cờ `hasMore` và thông tin `nextCursor`.

#### Phản hồi Mẫu (Responses)

**Thành công (Success):**
```json
{
  "ok": true,
  "data": {
    "entries": [
      {
        "id": "b2c3d4e5-f6a7-8b9c-0d1e-234567890abc",
        "content": "Một sản phẩm portfolio rất đáng học hỏi!",
        "createdAt": "2026-11-10T14:20:00.000Z",
        "user": {
          "id": "c3d4e5f6-a7b8-9c0d-1e2f-34567890abcd",
          "name": "Linh Tran",
          "username": "linhtran-hr",
          "image": "https://avatars.githubusercontent.com/u/7654321?v=4",
          "isAdmin": false
        }
      }
    ],
    "hasMore": false,
    "nextCursor": null
  }
}
```

---

### 3.4. `contact.sendContactMessage`

Gửi tin nhắn liên hệ từ khách truy cập và chuyển tiếp tới email của chủ trang.

- **Tệp nguồn:** `src/actions/contact.ts`
- **Quyền truy cập:** Công khai (Public).
- **Quy tắc nghiệp vụ áp dụng:** BR-06 (Format và độ dài), BR-07 (Rate limit 3 lần / giờ theo IP), BR-08 (Honeypot anti-bot), BR-09 (Thời gian submit anti-bot).

#### Tham số Đầu vào (Input)
```ts
export type SendContactInput = {
  name: string;
  email: string;
  subject: "job" | "project" | "feedback" | "other";
  message: string;
  website?: string;    // Trường ẩn Honeypot
  token: string;       // Chuỗi payload chứa renderTimestamp và chữ ký HMAC
};
```

#### Quy trình Xử lý (Step-by-Step Logic)
1. **Kiểm tra Honeypot (BR-08):** Nếu trường `website` được điền (khác chuỗi rỗng), kết luận là bot gửi tự động. Lập tức trả về `{ ok: true, data: { status: "received" } }` mà không lưu database hay gửi email.
2. **Kiểm tra thời gian tương tác (BR-09):** Giải mã và kiểm tra chữ ký HMAC của `token`. Trích xuất `renderTimestamp`. Nếu thời gian submit `Date.now() - renderTimestamp < 3000` (dưới 3 giây) hoặc chữ ký không hợp lệ, lập tức trả về `{ ok: true, data: { status: "received" } }` để đánh lừa bot.
3. **Trích xuất và Băm IP:** Lấy IP từ headers (`x-forwarded-for` hoặc `x-real-ip`). Tính `ipHash = SHA256(clientIp + HASH_SALT)`.
4. **Kiểm tra Rate Limit (BR-07):** Gọi `checkRateLimit(contactLimiter, ipHash)`. Nếu vượt quá 3 lần / giờ, trả về mã lỗi `RATE_LIMITED`.
5. **Validate Zod Schema (BR-06):**
   - `name`: 2 - 80 ký tự.
   - `email`: email chuẩn, tối đa 254 ký tự.
   - `subject`: thuộc tập cho phép.
   - `message`: 20 - 2000 ký tự.
   Nếu lỗi, trả về `VALIDATION_ERROR` kèm chi tiết các trường lỗi.
6. **Lưu trữ vào Cơ sở dữ liệu:**
   - Tạo bản ghi mới trong bảng `contact_messages` với trạng thái `email_status = 'pending'`.
7. **Gửi Email qua Resend:**
   - Gửi email tới `siteConfig.email`, tiêu đề: `[Portfolio Contact] <subject>: <name>`.
   - Cấu hình header `Reply-To` trỏ về chính email của người gửi (`input.email`) để chủ trang bấm trả lời trực tiếp.
   - Nội dung email định dạng thuần túy, thoát toàn bộ ký tự HTML để phòng chống HTML Injection.
   - Nếu gửi thành công: cập nhật `email_status = 'sent'`.
   - Nếu gửi thất bại: cập nhật `email_status = 'failed'` kèm `error_log`, không ném exception làm gián đoạn response.
8. Trả về kết quả thành công cho người dùng.

#### Phản hồi Mẫu (Responses)

**Thành công (Success):**
```json
{
  "ok": true,
  "data": {
    "status": "received",
    "message": "Cảm ơn bạn đã liên hệ! Mình đã nhận được tin nhắn và sẽ phản hồi sớm nhất có thể."
  }
}
```

**Thất bại do Thiếu Nội dung (Failure - Validation Error):**
```json
{
  "ok": false,
  "code": "VALIDATION_ERROR",
  "message": "Dữ liệu nhập vào không hợp lệ.",
  "fieldErrors": {
    "message": ["Nội dung tin nhắn phải có độ dài tối thiểu 20 ký tự."]
  }
}
```

---

## 4. Đặc tả Chi tiết Route Handlers (REST Endpoints)

### 4.1. `GET /api/views/[slug]`

Lấy tổng số lượt xem hiện tại của một Case Study dự án.

- **Phương thức:** `GET`
- **Quyền truy cập:** Công khai (Public).
- **URL Parameters:**
  - `slug` (string, bắt buộc): Định danh bài viết Case Study (ví dụ: `portfolio`).

#### Phản hồi Mẫu (Responses)

**200 OK:**
```json
{
  "slug": "portfolio",
  "views": 1248
}
```

**404 Not Found (Slug không hợp lệ):**
```json
{
  "error": "Project not found"
}
```

---

### 4.2. `POST /api/views/[slug]`

Ghi nhận một lượt xem mới cho Case Study và trả về số lượt xem cập nhật. Có cơ chế chống đếm trùng 24 giờ và rate limit.

- **Phương thức:** `POST`
- **Quyền truy cập:** Công khai (Public).
- **Headers yêu cầu:** Không yêu cầu payload body.
- **Quy tắc nghiệp vụ áp dụng:** BR-10 (Chống đếm trùng 24h), BR-11 (Validate slug hợp lệ), BR-12 (Rate limit 30 req / phút).

#### Quy trình Xử lý (Logic)
1. Kiểm tra `slug`: Phải nằm trong danh sách các dự án có `published: true` đọc từ `getAllProjects()`. Nếu không tồn tại, trả về status `404 Not Found`.
2. Trích xuất IP từ request headers và tính `ipHash = SHA256(ip + VIEW_SALT)`.
3. Kiểm tra Rate Limit trên Redis: `checkRateLimit(viewLimiter, ipHash)`. Nếu vượt quá 30 req / phút, trả về status `429 Too Many Requests`.
4. Kiểm tra khóa chống đếm trùng trên Redis:
   - Key: `view_dedup:<slug>:<ipHash>`.
   - Nếu key chưa tồn tại:
     - Thực thi lệnh: `SET view_dedup:<slug>:<ipHash> 1 EX 86400`.
     - Thực thi lệnh: `INCR views:project:<slug>`.
   - Nếu key đã tồn tại (đã xem trong vòng 24 giờ): Bỏ qua lệnh tăng.
5. Đọc giá trị hiện tại của `views:project:<slug>` từ Redis (mặc định trả về `0` nếu chưa có).
6. Trả về JSON chứa `slug` và số lượt xem hiện tại.

#### Phản hồi Mẫu (Responses)

**200 OK (Thành công):**
```json
{
  "slug": "portfolio",
  "views": 1249
}
```

**429 Too Many Requests:**
```json
{
  "error": "Too many requests. Please slow down."
}
```

---

### 4.3. `GET /api/telemetry`

Lấy thông tin hoạt động kỹ thuật gần nhất từ GitHub API (5 sự kiện công khai và tổng contribution 12 tháng).

- **Phương thức:** `GET`
- **Quyền truy cập:** Công khai (Public).
- **Cơ chế Caching:** Cấu hình ISR cấp endpoint với thời gian sống 1 giờ (`export const revalidate = 3600`).
- **Response Headers:** `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`.

#### Quy trình Xử lý (Logic)
1. Kiểm tra cache trên Redis với key `cache:telemetry:github`. Nếu có dữ liệu hợp lệ, trả về ngay.
2. Nếu cache miss: Gửi request HTTPS POST tới `https://api.github.com/graphql` kèm header `Authorization: Bearer GITHUB_READ_TOKEN`.
3. Truy vấn GraphQL lấy:
   - `viewer.contributionsCollection.contributionCalendar.totalContributions`: Tổng số commit/PR trong 12 tháng.
   - `viewer.repositoriesContributedTo`: Danh sách hoạt động gần nhất.
4. Xử lý chuẩn hóa dữ liệu thành mảng phẳng gồm tối đa 5 sự kiện gần nhất (loại sự kiện, tên repository, thời gian ISO).
5. Ghi kết quả vào Redis với TTL = 3600 giây.
6. Trường hợp GitHub API bị lỗi hoặc vượt hạn mức (Rate limit): Trả về dữ liệu rỗng an toàn kèm trạng thái 200 có fallback flag: `{ ok: false, fallback: true, totalContributions: 0, recentEvents: [] }` để giao diện không bị sập.

#### Phản hồi Mẫu (Responses)

**200 OK:**
```json
{
  "ok": true,
  "data": {
    "totalContributions": 486,
    "recentEvents": [
      {
        "id": "evt_01",
        "type": "push",
        "repo": "nqkhanh-dev/portfolio",
        "message": "feat: implement rate limiting with upstash redis",
        "createdAt": "2026-11-11T16:30:00.000Z"
      },
      {
        "id": "evt_02",
        "type": "pull_request",
        "repo": "nqkhanh-dev/portfolio",
        "message": "fix: correct mobile layout overflow in hero section",
        "createdAt": "2026-11-10T09:15:00.000Z"
      }
    ]
  }
}
```

---

### 4.4. `GET /api/auth/[...nextauth]` và `POST /api/auth/[...nextauth]`

Điểm cuối xử lý toàn bộ vòng đời xác thực OAuth của thư viện Auth.js (NextAuth v5).

- **Phương thức:** `GET`, `POST`
- **Xử lý bởi:** `handlers.GET` và `handlers.POST` được khởi tạo và export từ `src/lib/auth.ts`.
- **Các tuyến đường con tự động xử lý:**
  - `GET /api/auth/signin`: Hiển thị trang hoặc điều hướng đăng nhập.
  - `POST /api/auth/signin/github`: Khởi tạo luồng xác thực GitHub OAuth, sinh mã `state` chống CSRF và chuyển hướng sang trang cấp quyền của GitHub.
  - `GET /api/auth/callback/github`: Tiếp nhận `code` ủy quyền từ GitHub, đổi lấy Access Token, truy vấn thông tin user GitHub, tự động cập nhật bản ghi trong bảng `users` và `accounts`, sau đó sinh phiên làm việc và gắn cookie `authjs.session-token`.
  - `POST /api/auth/signout`: Hủy phiên làm việc hiện tại, xóa session trong database và xóa session cookie trên trình duyệt.
  - `GET /api/auth/session`: Trả về thông tin session JSON của người dùng hiện tại phục vụ kiểm tra trạng thái đăng nhập.
