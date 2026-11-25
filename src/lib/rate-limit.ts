import "server-only";
import crypto from "node:crypto";

const CONTACT_RATE_LIMIT_MAX = 3;
const CONTACT_WINDOW_SECONDS = 3600;
const CONTACT_WINDOW_MS = CONTACT_WINDOW_SECONDS * 1000;

export type RateLimitResult = {
  allowed: boolean;
  retryAfterMinutes?: number;
};

type UpstashPipelineItem = {
  result?: unknown;
  error?: string;
};

const memoryContactStore = new Map<string, number[]>();

function computeRetryAfterMinutes(oldestTimestampMs: number, now: number): number {
  const retryAfterMs = Math.max(1000, oldestTimestampMs + CONTACT_WINDOW_MS - now);
  return Math.max(1, Math.ceil(retryAfterMs / 60_000));
}

function checkMemoryRateLimit(ipHash: string, now: number): RateLimitResult {
  const windowStart = now - CONTACT_WINDOW_MS;
  const existing = memoryContactStore.get(ipHash) ?? [];
  const recent = existing.filter((ts) => ts > windowStart);

  if (recent.length >= CONTACT_RATE_LIMIT_MAX) {
    memoryContactStore.set(ipHash, recent);
    const oldest = recent[0] ?? now;
    return {
      allowed: false,
      retryAfterMinutes: computeRetryAfterMinutes(oldest, now),
    };
  }

  recent.push(now);
  memoryContactStore.set(ipHash, recent);

  if (memoryContactStore.size > 1000) {
    memoryContactStore.forEach((timestamps, key) => {
      const active = timestamps.filter((ts) => ts > windowStart);
      if (active.length === 0) {
        memoryContactStore.delete(key);
      } else {
        memoryContactStore.set(key, active);
      }
    });
  }

  return { allowed: true };
}

async function checkUpstashRateLimit(
  url: string,
  token: string,
  ipHash: string,
  now: number,
): Promise<RateLimitResult | null> {
  const baseUrl = url.replace(/\/+$/, "");
  const key = `rl:contact:${ipHash}`;
  const windowStart = now - CONTACT_WINDOW_MS;

  const inspectRes = await fetch(`${baseUrl}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["ZREMRANGEBYSCORE", key, 0, windowStart],
      ["ZRANGE", key, 0, -1, "WITHSCORES"],
    ]),
    cache: "no-store",
  });

  if (!inspectRes.ok) {
    return null;
  }

  const inspectData = (await inspectRes.json()) as unknown;
  if (!Array.isArray(inspectData) || inspectData.length < 2) {
    return null;
  }

  const rangeItem = inspectData[1] as UpstashPipelineItem | undefined;
  if (!rangeItem || rangeItem.error || !Array.isArray(rangeItem.result)) {
    return null;
  }

  const entries = rangeItem.result;
  const activeCount = Math.floor(entries.length / 2);

  if (activeCount >= CONTACT_RATE_LIMIT_MAX) {
    const oldestScoreRaw = entries[1];
    const oldestScore = Number(oldestScoreRaw);
    const resolvedOldest = Number.isFinite(oldestScore) ? oldestScore : now;
    return {
      allowed: false,
      retryAfterMinutes: computeRetryAfterMinutes(resolvedOldest, now),
    };
  }

  const member = `${now}-${crypto.randomUUID()}`;
  const recordRes = await fetch(`${baseUrl}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["ZADD", key, now, member],
      ["EXPIRE", key, CONTACT_WINDOW_SECONDS],
    ]),
    cache: "no-store",
  });

  if (!recordRes.ok) {
    return null;
  }

  return { allowed: true };
}

/**
 * Enforces a sliding-window limit of 3 contact submissions per hour per IP hash.
 * Uses Upstash Redis REST API when configured and falls back to an in-memory Map.
 */
export async function checkContactRateLimit(ipHash: string): Promise<RateLimitResult> {
  const now = Date.now();
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      const redisResult = await checkUpstashRateLimit(url, token, ipHash, now);
      if (redisResult !== null) {
        return redisResult;
      }
    } catch {
      // Fall back to in-memory limiter if Upstash is unreachable.
    }
  }

  return checkMemoryRateLimit(ipHash, now);
}

/**
 * Clears the in-memory contact rate limit store (intended for tests).
 */
export function resetContactRateLimitStore(): void {
  memoryContactStore.clear();
}
