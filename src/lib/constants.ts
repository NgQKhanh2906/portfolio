export interface TechItem {
  slug: string;
  name: string;
  category: "Frontend" | "Backend" | "Database" | "DevOps" | "Language";
}

export const TECH_REGISTRY: Record<string, TechItem> = {
  // Languages
  typescript: { slug: "typescript", name: "TypeScript", category: "Language" },
  javascript: { slug: "javascript", name: "JavaScript", category: "Language" },
  html5: { slug: "html5", name: "HTML5", category: "Language" },
  css3: { slug: "css3", name: "CSS3", category: "Language" },

  // Frontend
  react: { slug: "react", name: "React", category: "Frontend" },
  nextjs: { slug: "nextjs", name: "Next.js", category: "Frontend" },
  tailwindcss: { slug: "tailwindcss", name: "Tailwind CSS", category: "Frontend" },

  // Backend
  nodejs: { slug: "nodejs", name: "Node.js", category: "Backend" },
  express: { slug: "express", name: "Express", category: "Backend" },
  authjs: { slug: "authjs", name: "Auth.js (NextAuth)", category: "Backend" },

  // Database
  postgresql: { slug: "postgresql", name: "PostgreSQL", category: "Database" },
  drizzle: { slug: "drizzle", name: "Drizzle ORM", category: "Database" },
  prisma: { slug: "prisma", name: "Prisma ORM", category: "Database" },
  redis: { slug: "redis", name: "Redis", category: "Database" },

  // DevOps & Tools
  docker: { slug: "docker", name: "Docker", category: "DevOps" },
  vercel: { slug: "vercel", name: "Vercel", category: "DevOps" },
  vitest: { slug: "vitest", name: "Vitest", category: "DevOps" },
  playwright: { slug: "playwright", name: "Playwright", category: "DevOps" },
  git: { slug: "git", name: "Git & GitHub", category: "DevOps" },
};

export const VALID_TECH_SLUGS = Object.keys(TECH_REGISTRY) as [string, ...string[]];

export const REQUIRED_CASE_STUDY_SECTIONS = [
  "Bối cảnh và bài toán",
  "Mục tiêu và ràng buộc",
  "Kiến trúc giải pháp",
  "Quyết định kỹ thuật và trade-off",
  "Thách thức và cách giải quyết",
  "Kết quả và bài học",
] as const;
