import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";

export type CreateContactMessageData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  ipHash: string;
};

/**
 * Inserts a new contact message with pending email status.
 * Returns null gracefully when DATABASE_URL is missing or the DB throws.
 */
export async function createContactMessage(
  data: CreateContactMessageData,
): Promise<{ id: string } | null> {
  try {
    const rows = await db
      .insert(contactMessages)
      .values({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        ipHash: data.ipHash,
        emailStatus: "pending",
      })
      .returning({ id: contactMessages.id });

    const inserted = rows[0];
    return inserted ? { id: inserted.id } : null;
  } catch (error) {
    if (process.env.DATABASE_URL) {
      console.error("[contact] Failed to persist contact message:", error);
    }
    return null;
  }
}

/**
 * Updates the email delivery status (and optional error log) for a contact message.
 * Never throws so user-facing response is never disrupted.
 */
export async function updateContactEmailStatus(
  id: string,
  status: "sent" | "failed",
  errorLog?: string,
): Promise<void> {
  try {
    await db
      .update(contactMessages)
      .set({
        emailStatus: status,
        errorLog: errorLog ?? null,
      })
      .where(eq(contactMessages.id, id));
  } catch (error) {
    if (process.env.DATABASE_URL) {
      console.error("[contact] Failed to update contact email status:", error);
    }
  }
}
