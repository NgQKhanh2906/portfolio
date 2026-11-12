import crypto from "node:crypto";

const VIEW_SALT = process.env.VIEW_SALT || "portfolio-salt-secure-dev";

// Bộ đệm trong bộ nhớ cho môi trường phát triển cục bộ khi chưa có Upstash credentials
const localMemoryStore = new Map<string, { value: number; expiresAt?: number }>();
const localDedupStore = new Set<string>();

export function hashIp(ip: string): string {
  return crypto
    .createHash("sha256")
    .update(`${ip}:${VIEW_SALT}`)
    .digest("hex");
}

export async function incrementProjectViews(
  slug: string,
  ip: string,
): Promise<number | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const ipHash = hashIp(ip);
  const dedupKey = `view_dedup:${slug}:${ipHash}`;
  const viewsKey = `views:project:${slug}`;

  // 1. Nếu có cấu hình Upstash Redis REST
  if (url && token) {
    try {
      // Kiểm tra khóa chống trùng
      const checkDedupRes = await fetch(`${url}/get/${dedupKey}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (checkDedupRes.ok) {
        const checkData = (await checkDedupRes.json()) as { result: string | null };
        if (checkData.result !== null) {
          // IP này đã xem dự án trong vòng 24 giờ, đọc số view hiện tại
          const currentViewsRes = await fetch(`${url}/get/${viewsKey}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          });
          if (currentViewsRes.ok) {
            const currentData = (await currentViewsRes.json()) as { result: string | number | null };
            return Number(currentData.result) || 1;
          }
        }
      }

      // Đặt khóa chống trùng TTL 24 giờ (86400s) và tăng số view
      await fetch(`${url}/set/${dedupKey}/1/ex/86400`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const incrRes = await fetch(`${url}/incr/${viewsKey}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (incrRes.ok) {
        const incrData = (await incrRes.json()) as { result: number };
        return incrData.result;
      }
    } catch {
      // Khi Redis lỗi mạng, trả về null để UI tự ẩn nhẹ nhàng (graceful degradation)
      return null;
    }
  }

  // 2. Fallback bộ nhớ cục bộ (Local / Test Mode)
  if (!localDedupStore.has(dedupKey)) {
    localDedupStore.add(dedupKey);
    const prev = localMemoryStore.get(viewsKey)?.value || 42;
    const next = prev + 1;
    localMemoryStore.set(viewsKey, { value: next });
    return next;
  }

  return localMemoryStore.get(viewsKey)?.value || 42;
}

export async function getProjectViews(slug: string): Promise<number | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const viewsKey = `views:project:${slug}`;

  if (url && token) {
    try {
      const res = await fetch(`${url}/get/${viewsKey}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (res.ok) {
        const data = (await res.json()) as { result: string | number | null };
        return data.result !== null ? Number(data.result) : null;
      }
    } catch {
      return null;
    }
  }

  return localMemoryStore.get(viewsKey)?.value || 42;
}
