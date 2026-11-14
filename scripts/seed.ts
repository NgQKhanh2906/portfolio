import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/lib/db/schema";

async function runSeed() {
  // Safety check: Never run seed in production
  if (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production"
  ) {
    console.error("Error: Seeding is strictly forbidden in production environments.");
    process.exit(1);
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("Error: DATABASE_URL environment variable is required for seeding.");
    process.exit(1);
  }

  console.log("Starting database seeding...");
  const client = postgres(connectionString, { prepare: false });
  const db = drizzle(client, { schema });

  try {
    const seedUsersData = [
      {
        githubId: -1001,
        username: "seed-linh",
        name: "Linh Trần",
        image: "https://avatars.githubusercontent.com/u/1?v=4",
        isAdmin: false,
      },
      {
        githubId: -1002,
        username: "seed-minh",
        name: "Minh Phạm",
        image: "https://avatars.githubusercontent.com/u/2?v=4",
        isAdmin: false,
      },
      {
        githubId: -1003,
        username: "seed-huy",
        name: "Huy Lê",
        image: "https://avatars.githubusercontent.com/u/3?v=4",
        isAdmin: false,
      },
    ];

    const insertedUsers: Record<string, string> = {};

    for (const u of seedUsersData) {
      const [user] = await db
        .insert(schema.users)
        .values(u)
        .onConflictDoUpdate({
          target: schema.users.githubId,
          set: {
            username: u.username,
            name: u.name,
            image: u.image,
            updatedAt: new Date(),
          },
        })
        .returning({ id: schema.users.id, username: schema.users.username });

      if (user) {
        insertedUsers[user.username] = user.id;
      }
    }

    const now = new Date();
    const linhId = insertedUsers["seed-linh"];
    const minhId = insertedUsers["seed-minh"];
    const huyId = insertedUsers["seed-huy"];

    if (!linhId || !minhId || !huyId) {
      throw new Error("Failed to insert or resolve seed users.");
    }

    const guestbookData = [
      {
        userId: linhId,
        content:
          "Giao diện gọn và dễ đọc trên điện thoại. Chúc bạn sớm tìm được công việc phù hợp!",
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        userId: minhId,
        content:
          "Command Palette mượt, mục Case Study có phần trade-off rất đáng đọc.",
        createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      },
      {
        userId: huyId,
        content:
          "Mình học được cách làm rate limit từ repo của bạn, cảm ơn nhé.",
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        userId: linhId,
        content:
          "Đã tải CV, phần kinh nghiệm thực tập trình bày rõ ràng.",
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        userId: huyId,
        content:
          "Component Lab hay quá, phần Tabs dùng phím mũi tên được luôn.",
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        userId: minhId,
        content:
          "Thử gửi liên tục và đã bị chặn đúng như mô tả. Làm tốt!",
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
    ];

    for (const entry of guestbookData) {
      await db.insert(schema.guestbook_entries).values(entry);
    }

    console.log("Database seeded successfully with 3 users and 6 guestbook entries.");
  } finally {
    await client.end();
  }
}

runSeed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
