import { describe, it, expect } from "vitest";
import { getTableName } from "drizzle-orm";
import { getTableConfig } from "drizzle-orm/pg-core";
import {
  users,
  accounts,
  sessions,
  verification_tokens,
  verificationTokens,
  guestbook_entries,
  guestbookEntries,
  contact_messages,
  contactMessages,
} from "@/lib/db/schema";
import { db } from "@/lib/db";

describe("Database Schema Specification (TASK-16)", () => {
  describe("1. Table Names in snake_case", () => {
    it("should match exact snake_case table names as specified in docs/database.md", () => {
      expect(getTableName(users)).toBe("users");
      expect(getTableName(accounts)).toBe("accounts");
      expect(getTableName(sessions)).toBe("sessions");
      expect(getTableName(verification_tokens)).toBe("verification_tokens");
      expect(getTableName(verificationTokens)).toBe("verification_tokens");
      expect(getTableName(guestbook_entries)).toBe("guestbook_entries");
      expect(getTableName(guestbookEntries)).toBe("guestbook_entries");
      expect(getTableName(contact_messages)).toBe("contact_messages");
      expect(getTableName(contactMessages)).toBe("contact_messages");
    });
  });

  describe("2. Primary Keys", () => {
    it("should have uuid primary keys for users, accounts, guestbook_entries, contact_messages", () => {
      expect(users.id.primary).toBe(true);
      expect(users.id.dataType).toBe("string");
      expect(users.id.default).toBeDefined();

      expect(accounts.id.primary).toBe(true);
      expect(accounts.id.dataType).toBe("string");

      expect(guestbook_entries.id.primary).toBe(true);
      expect(guestbook_entries.id.dataType).toBe("string");

      expect(contact_messages.id.primary).toBe(true);
      expect(contact_messages.id.dataType).toBe("string");
    });

    it("should have varchar primary key for sessions", () => {
      expect(sessions.session_token.primary).toBe(true);
      expect(sessions.session_token.dataType).toBe("string");
    });

    it("should have composite primary key for verification_tokens", () => {
      const config = getTableConfig(verification_tokens);
      expect(config.primaryKeys.length).toBe(1);
      const pk = config.primaryKeys[0];
      const columnNames = pk?.columns.map((c) => c.name);
      expect(columnNames).toContain("identifier");
      expect(columnNames).toContain("token");
    });
  });

  describe("3. Required (NOT NULL) Fields", () => {
    it("users table requires github_id, username, is_admin, created_at, updated_at", () => {
      expect(users.github_id.notNull).toBe(true);
      expect(users.username.notNull).toBe(true);
      expect(users.is_admin.notNull).toBe(true);
      expect(users.is_admin.default).toBe(false);
      expect(users.created_at.notNull).toBe(true);
      expect(users.updated_at.notNull).toBe(true);
    });

    it("accounts table requires user_id, type, provider, provider_account_id", () => {
      expect(accounts.user_id.notNull).toBe(true);
      expect(accounts.type.notNull).toBe(true);
      expect(accounts.provider.notNull).toBe(true);
      expect(accounts.provider_account_id.notNull).toBe(true);
    });

    it("sessions table requires user_id and expires", () => {
      expect(sessions.user_id.notNull).toBe(true);
      expect(sessions.expires.notNull).toBe(true);
    });

    it("verification_tokens requires identifier, token, expires", () => {
      expect(verification_tokens.identifier.notNull).toBe(true);
      expect(verification_tokens.token.notNull).toBe(true);
      expect(verification_tokens.expires.notNull).toBe(true);
    });

    it("guestbook_entries requires user_id, content, created_at, updated_at, with nullable deleted_at", () => {
      expect(guestbook_entries.user_id.notNull).toBe(true);
      expect(guestbook_entries.content.notNull).toBe(true);
      expect(guestbook_entries.created_at.notNull).toBe(true);
      expect(guestbook_entries.updated_at.notNull).toBe(true);
      expect(guestbook_entries.deleted_at.notNull).toBe(false);
    });

    it("contact_messages requires name, email, subject, message, ip_hash, email_status, created_at", () => {
      expect(contact_messages.name.notNull).toBe(true);
      expect(contact_messages.email.notNull).toBe(true);
      expect(contact_messages.subject.notNull).toBe(true);
      expect(contact_messages.message.notNull).toBe(true);
      expect(contact_messages.ip_hash.notNull).toBe(true);
      expect(contact_messages.email_status.notNull).toBe(true);
      expect(contact_messages.email_status.default).toBe("pending");
      expect(contact_messages.created_at.notNull).toBe(true);
      expect(contact_messages.error_log.notNull).toBe(false);
    });
  });

  describe("4. Indexes and Constraints", () => {
    it("users has idx_users_github_id unique index", () => {
      const config = getTableConfig(users);
      const indexNames = config.indexes.map((idx) => idx.config.name);
      expect(indexNames).toContain("idx_users_github_id");
      const ghIndex = config.indexes.find((i) => i.config.name === "idx_users_github_id");
      expect(ghIndex?.config.unique).toBe(true);
    });

    it("accounts has idx_accounts_user_id and composite unique constraint", () => {
      const config = getTableConfig(accounts);
      const indexNames = config.indexes.map((idx) => idx.config.name);
      expect(indexNames).toContain("idx_accounts_user_id");

      const uniqueNames = config.uniqueConstraints.map((uc) => uc.name);
      expect(uniqueNames).toContain("accounts_provider_provider_account_id_unique");
    });

    it("sessions has idx_sessions_user_id index", () => {
      const config = getTableConfig(sessions);
      const indexNames = config.indexes.map((idx) => idx.config.name);
      expect(indexNames).toContain("idx_sessions_user_id");
    });

    it("guestbook_entries has idx_guestbook_active_created and idx_guestbook_user_active", () => {
      const config = getTableConfig(guestbook_entries);
      const indexNames = config.indexes.map((idx) => idx.config.name);
      expect(indexNames).toContain("idx_guestbook_active_created");
      expect(indexNames).toContain("idx_guestbook_user_active");
    });

    it("contact_messages has idx_contact_rate_limit index", () => {
      const config = getTableConfig(contact_messages);
      const indexNames = config.indexes.map((idx) => idx.config.name);
      expect(indexNames).toContain("idx_contact_rate_limit");
    });
  });

  describe("5. Foreign Keys", () => {
    it("accounts references users with cascade delete", () => {
      const config = getTableConfig(accounts);
      expect(config.foreignKeys.length).toBeGreaterThan(0);
      const fk = config.foreignKeys[0];
      expect(fk?.onDelete).toBe("cascade");
    });

    it("sessions references users with cascade delete", () => {
      const config = getTableConfig(sessions);
      expect(config.foreignKeys.length).toBeGreaterThan(0);
      const fk = config.foreignKeys[0];
      expect(fk?.onDelete).toBe("cascade");
    });

    it("guestbook_entries references users with restrict delete", () => {
      const config = getTableConfig(guestbook_entries);
      expect(config.foreignKeys.length).toBeGreaterThan(0);
      const fk = config.foreignKeys[0];
      expect(fk?.onDelete).toBe("restrict");
    });
  });

  describe("6. Database Client Instance Stub Fallback", () => {
    it("should export db without throwing when DATABASE_URL is not provided", () => {
      expect(db).toBeDefined();
    });

    it("should throw a helpful error when attempting an operation on unconfigured db", () => {
      if (!process.env.DATABASE_URL) {
        expect(() => (db as any).select()).toThrowError(/DATABASE_URL is not configured/);
      }
    });
  });
});
