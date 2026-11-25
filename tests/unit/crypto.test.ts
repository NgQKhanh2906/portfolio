import { afterEach, describe, expect, it, vi } from "vitest";
import { createFormToken, hashIp, verifyFormToken } from "@/lib/crypto";

describe("Crypto utilities (hashIp & HMAC form tokens)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("hashIp", () => {
    it("produces a deterministic 64-char hex SHA-256 hash", () => {
      const hash1 = hashIp("203.0.113.10", "test-salt");
      const hash2 = hashIp("203.0.113.10", "test-salt");
      const hash3 = hashIp("203.0.113.11", "test-salt");

      expect(hash1).toMatch(/^[a-f0-9]{64}$/);
      expect(hash1).toBe(hash2);
      expect(hash1).not.toBe(hash3);
    });

    it("produces different hashes for different salts", () => {
      const hashA = hashIp("127.0.0.1", "salt-a");
      const hashB = hashIp("127.0.0.1", "salt-b");

      expect(hashA).not.toBe(hashB);
    });

    it("prefers HASH_SALT, then VIEW_SALT, then default fallback when salt is omitted", () => {
      vi.stubEnv("HASH_SALT", "custom-hash-salt");
      vi.stubEnv("VIEW_SALT", "custom-view-salt");
      expect(hashIp("10.0.0.1")).toBe(hashIp("10.0.0.1", "custom-hash-salt"));

      vi.stubEnv("HASH_SALT", "");
      expect(hashIp("10.0.0.1")).toBe(hashIp("10.0.0.1", "custom-view-salt"));

      vi.stubEnv("VIEW_SALT", "");
      expect(hashIp("10.0.0.1")).toBe(hashIp("10.0.0.1", "portfolio-salt-secure-dev"));
    });
  });

  describe("createFormToken & verifyFormToken", () => {
    it("verifies a valid token when elapsed time is at least 3000ms", () => {
      const issuedAt = 1_700_000_000_000;
      const token = createFormToken(issuedAt);

      expect(token).toMatch(/^\d+\.[a-f0-9]{64}$/);

      const exactBoundary = verifyFormToken(token, issuedAt + 3000);
      expect(exactBoundary).toEqual({ valid: true, elapsedMs: 3000 });

      const normalUser = verifyFormToken(token, issuedAt + 12_500);
      expect(normalUser).toEqual({ valid: true, elapsedMs: 12_500 });
    });

    it("rejects submissions faster than 3000ms as too_fast", () => {
      const issuedAt = 1_700_000_000_000;
      const token = createFormToken(issuedAt);

      expect(verifyFormToken(token, issuedAt + 500)).toEqual({
        valid: false,
        reason: "too_fast",
        elapsedMs: 500,
      });

      expect(verifyFormToken(token, issuedAt + 2999)).toEqual({
        valid: false,
        reason: "too_fast",
        elapsedMs: 2999,
      });

      expect(verifyFormToken(token, issuedAt - 1000)).toEqual({
        valid: false,
        reason: "too_fast",
        elapsedMs: -1000,
      });
    });

    it("rejects tokens older than maxAgeMs as expired", () => {
      const issuedAt = 1_700_000_000_000;
      const token = createFormToken(issuedAt);

      expect(verifyFormToken(token, issuedAt + 3_600_001)).toEqual({
        valid: false,
        reason: "expired",
        elapsedMs: 3_600_001,
      });
    });

    it("rejects tampered signatures or wrong HMAC secrets as invalid_signature", () => {
      const issuedAt = 1_700_000_000_000;
      const token = createFormToken(issuedAt);
      const lastChar = token.slice(-1);
      const flippedChar = lastChar === "a" ? "b" : "a";
      const tampered = `${token.slice(0, -1)}${flippedChar}`;

      expect(verifyFormToken(tampered, issuedAt + 5000)).toEqual({
        valid: false,
        reason: "invalid_signature",
      });

      expect(verifyFormToken(`${issuedAt}.deadbeef`, issuedAt + 5000)).toEqual({
        valid: false,
        reason: "invalid_signature",
      });

      vi.stubEnv("HMAC_SECRET", "different-secret");
      expect(verifyFormToken(token, issuedAt + 5000)).toEqual({
        valid: false,
        reason: "invalid_signature",
      });
    });

    it("rejects structurally invalid tokens as malformed", () => {
      const now = 1_700_000_010_000;

      expect(verifyFormToken("", now)).toEqual({ valid: false, reason: "malformed" });
      expect(verifyFormToken("no-dot", now)).toEqual({ valid: false, reason: "malformed" });
      expect(verifyFormToken("123.abc.def", now)).toEqual({ valid: false, reason: "malformed" });
      expect(verifyFormToken("notanumber.abcdef", now)).toEqual({
        valid: false,
        reason: "malformed",
      });
      expect(verifyFormToken("1700000000000.", now)).toEqual({
        valid: false,
        reason: "malformed",
      });
    });
  });
});
