# Product - Portfolio

## 1. Tầm nhìn sản phẩm

Xây dựng một portfolio mà bản thân nó là dự án mạnh nhất trong CV. Người xem không cần tin vào lời giới thiệu; họ tự kiểm chứng kỹ năng bằng cách dùng trang web, mở DevTools và đọc mã nguồn.

**Tuyên bố định vị (Positioning statement):**
Dành cho nhà tuyển dụng và Tech Lead đang sàng lọc ứng viên Web Developer, Portfolio là một Web Application full-stack cho phép kiểm chứng trực tiếp năng lực Frontend, Backend, bảo mật và hiệu năng trong vòng 2 phút, khác với portfolio tĩnh dựng từ template chỉ liệt kê kỹ năng bằng chữ.

---

## 2. Bài toán cần giải quyết

| Vấn đề | Hệ quả | Cách sản phẩm giải quyết |
| :--- | :--- | :--- |
| CV của Fresher/Intern na ná nhau, liệt kê kỹ năng nhưng không có bằng chứng | Nhà tuyển dụng không phân biệt được ai làm thật | Mỗi kỹ năng gắn với một tính năng đang chạy trên trang |
| Portfolio sinh viên phần lớn là template tĩnh | Tech Lead đánh giá thấp, cho rằng không có năng lực backend | Có database, OAuth, Server Actions, rate limit thật |
| Mô tả dự án sơ sài ("Web bán hàng dùng React") | Không thể hiện tư duy giải quyết vấn đề | Case Study có bài toán, kiến trúc, trade-off, số liệu |
| Trang chậm, vỡ layout trên điện thoại | Mất ấn tượng ngay lần mở đầu tiên trên mobile | Mobile-first, mục tiêu Lighthouse mobile từ 95 trở lên |
| Người xem không biết bắt đầu từ đâu | Rời trang sau vài giây | Hero có CTA rõ ràng, Command Palette giúp nhảy nhanh |

---

## 3. Chân dung người dùng (User Personas)

### Persona 1: Chị Linh - HR / Talent Acquisition

| Thuộc tính | Mô tả |
| :--- | :--- |
| Vai trò | Chuyên viên tuyển dụng tại công ty phần mềm 200 nhân sự |
| Bối cảnh sử dụng | Duyệt 50 đến 100 CV mỗi ngày, thường mở link portfolio trên điện thoại hoặc laptop văn phòng |
| Thời gian dành cho một portfolio | 15 đến 30 giây |
| Mục tiêu | Xác định nhanh ứng viên có phù hợp vị trí không, có liên hệ được không |
| Nỗi đau | Trang tải chậm, chữ khó đọc, không tìm thấy email hoặc file CV |
| Hành vi trên trang | Đọc Hero, lướt danh sách kỹ năng, bấm "Tải CV" hoặc sao chép email |
| Tiêu chí hài lòng | Thấy tên, vai trò, kỹ năng chính và nút liên hệ trong màn hình đầu tiên |

### Persona 2: Anh Minh - Senior Tech Lead / Interviewer

| Thuộc tính | Mô tả |
| :--- | :--- |
| Vai trò | Tech Lead, phỏng vấn vòng kỹ thuật |
| Bối cảnh sử dụng | Mở trên desktop trước buổi phỏng vấn, có DevTools và GitHub |
| Thời gian dành cho một portfolio | 3 đến 10 phút |
| Mục tiêu | Đánh giá năng lực thật, tìm chủ đề để hỏi sâu khi phỏng vấn |
| Nỗi đau | Ứng viên copy template, code không có cấu trúc, tính năng hỏng |
| Hành vi trên trang | Bấm `Ctrl + K`, thử Guestbook, đọc Case Study, xem Network tab, chạy Lighthouse, mở repo GitHub |
| Tiêu chí hài lòng | Code có cấu trúc rõ, xử lý lỗi đầy đủ, có test, CI xanh, Case Study có số liệu |

### Persona 3: Bạn Huy - Developer cùng ngành / Cộng đồng

| Thuộc tính | Mô tả |
| :--- | :--- |
| Vai trò | Sinh viên hoặc developer khác ghé qua từ GitHub, LinkedIn, Facebook group |
| Mục tiêu | Tham khảo cách làm, để lại lời nhắn, kết nối |
| Hành vi trên trang | Đăng nhập Guestbook, nghịch Component Lab, xem source |
| Tiêu chí hài lòng | Đăng nhập nhanh, gửi lời nhắn thấy kết quả ngay, mã nguồn có README rõ |

### Persona 4: Chủ trang (Owner / Admin)

| Thuộc tính | Mô tả |
| :--- | :--- |
| Vai trò | Chính bạn, người duy trì nội dung |
| Mục tiêu | Thêm dự án mới nhanh, kiểm duyệt Guestbook, nhận tin nhắn liên hệ |
| Hành vi | Viết file MDX mới rồi push lên GitHub; đăng nhập bằng GitHub để xóa lời nhắn vi phạm |
| Tiêu chí hài lòng | Thêm một dự án mới mất dưới 30 phút, không cần sửa code giao diện |

---

## 4. Giá trị cốt lõi (USP)

1. **Bằng chứng sống thay cho lời tự giới thiệu:** Guestbook với OAuth và rate limit là bằng chứng backend; Command Palette và Component Lab là bằng chứng frontend; điểm Lighthouse là bằng chứng hiệu năng.
2. **Case Study theo tư duy kỹ sư:** Mỗi dự án trình bày như một tài liệu kỹ thuật thu nhỏ, cung cấp sẵn chủ đề để Tech Lead hỏi và để bạn trả lời tự tin.
3. **Minh bạch kỹ thuật:** Footer hiển thị commit đang chạy production và liên kết thẳng đến commit đó trên GitHub. Người xem có thể đối chiếu code với sản phẩm.
4. **Tiếp cận dễ dàng:** Không yêu cầu cài đặt, không bắt đăng nhập để xem nội dung, chạy tốt trên mobile, điều khiển được hoàn toàn bằng bàn phím.
5. **Chi phí vận hành bằng 0:** Toàn bộ hạ tầng dùng gói miễn phí, phù hợp để duy trì lâu dài trong suốt quá trình tìm việc.

---

## 5. Bản đồ Kỹ năng - Tính năng chứng minh

| Kỹ năng ghi trên CV | Tính năng chứng minh | Nơi kiểm chứng |
| :--- | :--- | :--- |
| HTML ngữ nghĩa, Accessibility | Landmark, skip link, focus ring, ARIA cho Command Palette | Lighthouse Accessibility, điều hướng bằng Tab |
| CSS, Responsive, Design System | Design token, dark/light theme, layout mobile-first | Thu nhỏ trình duyệt, đổi theme |
| React, TypeScript | Component Lab, Command Palette, form có optimistic UI | Source code, React DevTools |
| Next.js App Router | Server Components, Server Actions, ISR, Route Handlers, OG image động | Network tab, source code |
| State management | Trạng thái props trong Component Lab, theme, palette | Component Lab |
| Database, ORM, SQL | Guestbook lưu PostgreSQL qua Drizzle, migration có version | Thư mục `drizzle/`, `schema.ts` |
| Authentication, Authorization | GitHub OAuth, chỉ tác giả hoặc admin được xóa lời nhắn | Thử xóa lời nhắn của người khác |
| Bảo mật web | Zod validation, escape output, honeypot, rate limit, security headers | Gửi spam liên tục, response header |
| Caching, Redis | Rate limit, đếm lượt xem có chống đếm trùng | Tải lại trang Case Study nhiều lần |
| Tích hợp API bên thứ ba | GitHub GraphQL API, Resend | Telemetry widget, Contact form |
| Performance, SEO | SSG/ISR, `next/image`, `next/font`, sitemap, OG image | Lighthouse, PageSpeed Insights |
| Testing | Unit test cho validation và rate limit, E2E cho luồng chính | Thư mục `tests/`, badge CI |
| CI/CD, Git | GitHub Actions, Vercel Preview, Conventional Commits | Tab Actions, lịch sử commit |

---

## 6. Phạm vi MVP

### 6.1. Trong phạm vi (In scope)

| Mã | Tính năng | Mức ưu tiên |
| :--- | :--- | :--- |
| F01 | Layout chung: Header, Footer, Mobile Nav, Skip link | Must |
| F02 | Trang chủ: Hero, About, Skills, Featured Projects, Experience Timeline | Must |
| F03 | Danh sách dự án có bộ lọc theo công nghệ | Must |
| F04 | Trang Case Study từ MDX, kèm sơ đồ kiến trúc | Must |
| F05 | Bộ đếm lượt xem Case Study (Redis, chống đếm trùng 24 giờ) | Should |
| F06 | Command Palette | Must |
| F07 | Theme Dark / Light / System | Must |
| F08 | Guestbook: đăng nhập GitHub, tạo, xóa, kiểm duyệt | Must |
| F09 | Contact form gửi email, honeypot, rate limit | Must |
| F10 | Component Lab với 3 component: Button, Toast, Tabs | Should |
| F11 | Live Telemetry: hoạt động GitHub, commit đang deploy, thời điểm build | Should |
| F12 | SEO: metadata, OG image động, sitemap, robots | Must |
| F13 | Trang 404 và trang lỗi tùy biến | Must |
| F14 | Tải CV dạng PDF | Must |

### 6.2. Ngoài phạm vi MVP (để Phase sau)

| Tính năng | Lý do hoãn |
| :--- | :--- |
| Song ngữ vi/en (i18n) | Tăng gấp đôi khối lượng nội dung và độ phức tạp routing |
| Blog / ghi chú kỹ thuật | Cần thời gian viết nội dung đều đặn; Case Study đã đủ thể hiện tư duy |
| Spotify "Now Playing" | Mang tính trang trí, không chứng minh thêm kỹ năng cốt lõi |
| Cập nhật Guestbook thời gian thực qua WebSocket | MVP dùng optimistic UI + revalidate, đủ trải nghiệm; realtime làm phức tạp phần xác thực |
| Trang Admin riêng (dashboard) | Kiểm duyệt trực tiếp trên trang Guestbook là đủ cho 1 người |
| AI chatbot giới thiệu bản thân | Rủi ro chi phí API và trả lời sai; cân nhắc sau khi MVP ổn định |
| Analytics tự xây | Dùng Vercel Analytics có sẵn |

### 6.3. Không làm (Anti-goals)

- Không dùng template portfolio có sẵn hoặc copy nguyên khối UI kit.
- Không thêm hiệu ứng 3D, particle, hay animation nặng làm giảm điểm Performance.
- Không bắt người xem đăng nhập để đọc bất kỳ nội dung nào.
- Không đưa lên tính năng còn lỗi; tính năng chưa xong thì ẩn hoàn toàn.

---

## 7. Chỉ số thành công (Success Metrics)

| Chỉ số | Mục tiêu | Cách đo |
| :--- | :--- | :--- |
| Lighthouse mobile - Performance | Từ 95 trở lên | PageSpeed Insights trên trang chủ và 1 trang Case Study |
| Lighthouse - Accessibility, Best Practices, SEO | Từ 95 trở lên mỗi hạng mục | PageSpeed Insights |
| Largest Contentful Paint (LCP) | Dưới 2.5 giây (mobile, 4G mô phỏng) | PageSpeed Insights |
| Cumulative Layout Shift (CLS) | Dưới 0.1 | PageSpeed Insights |
| Interaction to Next Paint (INP) | Dưới 200 ms | Vercel Speed Insights |
| Lỗi JavaScript trên console production | 0 lỗi ở mọi trang | Mở DevTools từng trang |
| Thời gian thêm 1 dự án mới | Dưới 30 phút (không tính viết nội dung) | Thực hiện thử |
| CI | 100% Pull Request vào `main` phải pass lint, typecheck, test, build | GitHub Actions |
| Uptime các tính năng có backend | Guestbook và Contact hoạt động khi kiểm tra ngẫu nhiên 10 lần trong 1 tuần | Kiểm tra thủ công |

---

## 8. Rủi ro sản phẩm

| Rủi ro | Mức độ | Phương án giảm thiểu |
| :--- | :--- | :--- |
| Supabase Free tier tạm dừng project khi không có hoạt động trong một thời gian | Cao | Kiểm tra chính sách hiện hành khi deploy; cấu hình job ping định kỳ (chi tiết ở `deploy.md`) |
| Guestbook bị spam nội dung xấu | Trung bình | Rate limit theo user, giới hạn độ dài, quyền xóa của admin, bộ lọc từ khóa cơ bản |
| Nội dung Case Study sơ sài | Cao | Dùng template Case Study cố định trong `assets.md`, bắt buộc đủ 6 phần |
| Phạm vi phình to, không kịp hoàn thành | Trung bình | Bám đúng bảng Must/Should; Should chỉ làm sau khi toàn bộ Must xong |
| Hết hạn mức Free tier của Resend hoặc Upstash | Thấp | Rate limit chặt ở tầng ứng dụng; kiểm tra hạn mức hiện hành trên trang chính thức khi đăng ký |
