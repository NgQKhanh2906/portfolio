/**
 * Quản lý Rate Limiting cho hệ thống (Guestbook, Contact, Views).
 * Hỗ trợ Upstash Redis REST API và cơ chế fallback bộ nhớ trong (in-memory)
 * cho môi trường phát triển cục bộ và kiểm thử tự động.
 */

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetInSeconds?: number;
}

// In-memory store cho fallback cục bộ / test
const memoryRateLimitStore = new Map<
  string,
  { count: number; resetAt: number }
>();

/**
 * Xóa dữ liệu rate limit bộ nhớ trong (phục vụ test).
 */
export function resetRateLimitStore(): void {
  memoryRateLimitStore.clear();
}

/**
 * Kiểm tra rate limit gửi lời nhắn Guestbook (tối đa 3 lần / 10 phút cho mỗi user).
 *
 * @param userId ID của người dùng cần kiểm tra
 * @returns RateLimitResult với cờ success, số lượt còn lại và thời gian reset
 */
export async function checkGuestbookRateLimit(
  userId: string
): Promise<RateLimitResult> {
  const MAX_ATTEMPTS = 3;
  const WINDOW_SECONDS = 600; // 10 phút = 600s
  const redisKey = `rl:guestbook:${userId}`;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. Nếu có Upstash Redis REST API
  if (url && token) {
    try {
      // Tăng bộ đếm
      const incrRes = await fetch(`${url}/incr/${redisKey}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (incrRes.ok) {
        const incrData = (await incrRes.json()) as { result: number };
        const currentCount = incrData.result;

        // Nếu mới khởi tạo lần đầu trong chu kỳ, đặt TTL 600 giây
        if (currentCount === 1) {
          await fetch(`${url}/expire/${redisKey}/${WINDOW_SECONDS}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          });
        }

        if (currentCount > MAX_ATTEMPTS) {
          return {
            success: false,
            remaining: 0,
            resetInSeconds: WINDOW_SECONDS,
          };
        }

        return {
          success: true,
          remaining: Math.max(0, MAX_ATTEMPTS - currentCount),
        };
      }
    } catch {
      // Khi Upstash gặp lỗi mạng, chuyển sang cơ chế fallback bộ nhớ trong
    }
  }

  // 2. Cơ chế fallback trong bộ nhớ (In-memory Store)
  const now = Date.now();
  const existing = memoryRateLimitStore.get(redisKey);

  if (!existing || now >= existing.resetAt) {
    memoryRateLimitStore.set(redisKey, {
      count: 1,
      resetAt: now + WINDOW_SECONDS * 1000,
    });
    return {
      success: true,
      remaining: MAX_ATTEMPTS - 1,
    };
  }

  existing.count += 1;
  const resetInSeconds = Math.max(0, Math.ceil((existing.resetAt - now) / 1000));

  if (existing.count > MAX_ATTEMPTS) {
    return {
      success: false,
      remaining: 0,
      resetInSeconds,
    };
  }

  return {
    success: true,
    remaining: MAX_ATTEMPTS - existing.count,
    resetInSeconds,
  };
}
