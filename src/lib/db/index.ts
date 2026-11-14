import "server-only";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { PgDatabase } from "drizzle-orm/pg-core";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

/**
 * Global cache to prevent multiple client instances during HMR in development.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

/**
 * Creates and exports the Drizzle ORM database instance.
 * If DATABASE_URL is missing, it provides a safe stub fallback to prevent
 * build time, static analysis, or test environment crashes.
 */
function createDb(): PostgresJsDatabase<typeof schema> {
  if (!connectionString) {
    const stub = Object.create(PgDatabase.prototype);
    const stubHandler: ProxyHandler<object> = {
      get(_target, prop) {
        if (prop === "query") {
          return new Proxy(
            {},
            {
              get(_qTarget, qProp) {
                return () => {
                  throw new Error(
                    `Database query '${String(qProp)}' failed: DATABASE_URL is not configured.`
                  );
                };
              },
            }
          );
        }
        return () => {
          throw new Error(
            `Database operation '${String(prop)}' failed: DATABASE_URL is not configured.`
          );
        };
      },
    };

    return new Proxy(
      stub,
      stubHandler
    ) as unknown as PostgresJsDatabase<typeof schema>;
  }

  const client =
    globalForDb.conn ??
    postgres(connectionString, {
      prepare: false, // Required for Supabase Transaction Pooler (port 6543)
    });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.conn = client;
  }

  return drizzle(client, { schema });
}

export const db = createDb();
