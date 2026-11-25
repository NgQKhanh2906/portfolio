import "server-only";
import crypto from "node:crypto";

const DEFAULT_IP_SALT = "portfolio-salt-secure-dev";
const DEFAULT_HMAC_SECRET = "portfolio-hmac-dev-secret";

export type FormTokenFailureReason =
  | "malformed"
  | "invalid_signature"
  | "too_fast"
  | "expired";

export type VerifyFormTokenResult = {
  valid: boolean;
  reason?: FormTokenFailureReason;
  elapsedMs?: number;
};

function getHmacSecret(): string {
  return process.env.HMAC_SECRET || DEFAULT_HMAC_SECRET;
}

/**
 * Hashes a client IP address with SHA-256 and a configurable salt.
 */
export function hashIp(ip: string, salt?: string): string {
  const resolvedSalt =
    salt ?? (process.env.HASH_SALT || process.env.VIEW_SALT || DEFAULT_IP_SALT);

  return crypto
    .createHash("sha256")
    .update(`${ip}:${resolvedSalt}`)
    .digest("hex");
}

/**
 * Creates a timestamped HMAC-SHA256 token for form render timing verification.
 */
export function createFormToken(timestamp: number = Date.now()): string {
  const tsStr = String(timestamp);
  const hmacHex = crypto
    .createHmac("sha256", getHmacSecret())
    .update(tsStr)
    .digest("hex");

  return `${tsStr}.${hmacHex}`;
}

/**
 * Verifies an HMAC-SHA256 form token for structural validity, signature,
 * minimum interaction duration, and maximum age.
 */
export function verifyFormToken(
  token: string,
  now: number = Date.now(),
  minElapsedMs: number = 3000,
  maxAgeMs: number = 3600_000,
): VerifyFormTokenResult {
  if (!token || typeof token !== "string") {
    return { valid: false, reason: "malformed" };
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return { valid: false, reason: "malformed" };
  }

  const tsStr = parts[0];
  const sigHex = parts[1];

  if (!tsStr || !sigHex || !/^\d+$/.test(tsStr)) {
    return { valid: false, reason: "malformed" };
  }

  const timestamp = Number(tsStr);
  if (!Number.isSafeInteger(timestamp)) {
    return { valid: false, reason: "malformed" };
  }

  const expectedHex = crypto
    .createHmac("sha256", getHmacSecret())
    .update(tsStr)
    .digest("hex");

  if (sigHex.length !== expectedHex.length || !/^[a-f0-9]+$/i.test(sigHex)) {
    return { valid: false, reason: "invalid_signature" };
  }

  const expectedBuf = Buffer.from(expectedHex, "hex");
  const actualBuf = Buffer.from(sigHex, "hex");

  if (
    expectedBuf.length !== actualBuf.length ||
    !crypto.timingSafeEqual(expectedBuf, actualBuf)
  ) {
    return { valid: false, reason: "invalid_signature" };
  }

  const elapsedMs = now - timestamp;
  if (elapsedMs < minElapsedMs) {
    return { valid: false, reason: "too_fast", elapsedMs };
  }

  if (elapsedMs > maxAgeMs) {
    return { valid: false, reason: "expired", elapsedMs };
  }

  return { valid: true, elapsedMs };
}
