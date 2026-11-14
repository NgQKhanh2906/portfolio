import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  bigint,
  boolean,
  integer,
  char,
  index,
  uniqueIndex,
  unique,
  primaryKey,
} from "drizzle-orm/pg-core";

// ============================================================================
// 1. Users Table
// ============================================================================
const usersTable = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }),
    emailVerified: timestamp("email_verified", {
      withTimezone: true,
      mode: "date",
    }),
    image: text("image"),
    githubId: bigint("github_id", { mode: "number" }).notNull().unique(),
    username: varchar("username", { length: 100 }).notNull().unique(),
    isAdmin: boolean("is_admin").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("idx_users_github_id").on(table.githubId),
  ]
);

export const users = usersTable as typeof usersTable & {
  email_verified: typeof usersTable.emailVerified;
  github_id: typeof usersTable.githubId;
  is_admin: typeof usersTable.isAdmin;
  created_at: typeof usersTable.createdAt;
  updated_at: typeof usersTable.updatedAt;
};

const usersObj = users as unknown as Record<string, unknown>;
usersObj.email_verified = users.emailVerified;
usersObj.github_id = users.githubId;
usersObj.is_admin = users.isAdmin;
usersObj.created_at = users.createdAt;
usersObj.updated_at = users.updatedAt;

// ============================================================================
// 2. Accounts Table (Auth.js Adapter)
// ============================================================================
const accountsTable = pgTable(
  "accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 50 }).notNull(),
    provider: varchar("provider", { length: 50 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 50 }),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => [
    unique("accounts_provider_provider_account_id_unique").on(
      table.provider,
      table.providerAccountId
    ),
    index("idx_accounts_user_id").on(table.userId),
  ]
);

export const accounts = accountsTable as typeof accountsTable & {
  user_id: typeof accountsTable.userId;
  provider_account_id: typeof accountsTable.providerAccountId;
};

const accountsObj = accounts as unknown as Record<string, unknown>;
accountsObj.user_id = accounts.userId;
accountsObj.provider_account_id = accounts.providerAccountId;

// ============================================================================
// 3. Sessions Table (Auth.js Adapter)
// ============================================================================
const sessionsTable = pgTable(
  "sessions",
  {
    sessionToken: varchar("session_token", { length: 255 }).primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { withTimezone: true, mode: "date" }).notNull(),
  },
  (table) => [
    index("idx_sessions_user_id").on(table.userId),
  ]
);

export const sessions = sessionsTable as typeof sessionsTable & {
  session_token: typeof sessionsTable.sessionToken;
  user_id: typeof sessionsTable.userId;
};

const sessionsObj = sessions as unknown as Record<string, unknown>;
sessionsObj.session_token = sessions.sessionToken;
sessionsObj.user_id = sessions.userId;

// ============================================================================
// 4. Verification Tokens Table (Auth.js Adapter)
// ============================================================================
export const verification_tokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { withTimezone: true, mode: "date" }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.identifier, table.token] }),
  ]
);
export const verificationTokens = verification_tokens;

// ============================================================================
// 5. Guestbook Entries Table
// ============================================================================
const guestbookEntriesTable = pgTable(
  "guestbook_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    content: varchar("content", { length: 280 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    index("idx_guestbook_active_created").on(
      table.deletedAt,
      table.createdAt.desc()
    ),
    index("idx_guestbook_user_active").on(table.userId, table.deletedAt),
  ]
);

export const guestbook_entries = guestbookEntriesTable as typeof guestbookEntriesTable & {
  user_id: typeof guestbookEntriesTable.userId;
  created_at: typeof guestbookEntriesTable.createdAt;
  updated_at: typeof guestbookEntriesTable.updatedAt;
  deleted_at: typeof guestbookEntriesTable.deletedAt;
};

const guestbookObj = guestbook_entries as unknown as Record<string, unknown>;
guestbookObj.user_id = guestbook_entries.userId;
guestbookObj.created_at = guestbook_entries.createdAt;
guestbookObj.updated_at = guestbook_entries.updatedAt;
guestbookObj.deleted_at = guestbook_entries.deletedAt;

export const guestbookEntries = guestbook_entries;

// ============================================================================
// 6. Contact Messages Table
// ============================================================================
const contactMessagesTable = pgTable(
  "contact_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 80 }).notNull(),
    email: varchar("email", { length: 254 }).notNull(),
    subject: varchar("subject", { length: 50 }).notNull(),
    message: text("message").notNull(),
    ipHash: char("ip_hash", { length: 64 }).notNull(),
    emailStatus: varchar("email_status", { length: 20 })
      .default("pending")
      .notNull(),
    errorLog: text("error_log"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_contact_rate_limit").on(table.ipHash, table.createdAt.desc()),
  ]
);

export const contact_messages = contactMessagesTable as typeof contactMessagesTable & {
  ip_hash: typeof contactMessagesTable.ipHash;
  email_status: typeof contactMessagesTable.emailStatus;
  error_log: typeof contactMessagesTable.errorLog;
  created_at: typeof contactMessagesTable.createdAt;
};

const contactObj = contact_messages as unknown as Record<string, unknown>;
contactObj.ip_hash = contact_messages.ipHash;
contactObj.email_status = contact_messages.emailStatus;
contactObj.error_log = contact_messages.errorLog;
contactObj.created_at = contact_messages.createdAt;

export const contactMessages = contact_messages;

// ============================================================================
// Relations
// ============================================================================
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  guestbookEntries: many(guestbook_entries),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const guestbookEntriesRelations = relations(
  guestbook_entries,
  ({ one }) => ({
    user: one(users, {
      fields: [guestbook_entries.userId],
      references: [users.id],
    }),
  })
);

// ============================================================================
// Inferred TypeScript Types
// ============================================================================
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type VerificationToken = typeof verification_tokens.$inferSelect;
export type NewVerificationToken = typeof verification_tokens.$inferInsert;

export type GuestbookEntry = typeof guestbook_entries.$inferSelect;
export type NewGuestbookEntry = typeof guestbook_entries.$inferInsert;

export type ContactMessage = typeof contact_messages.$inferSelect;
export type NewContactMessage = typeof contact_messages.$inferInsert;
