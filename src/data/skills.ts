export type SkillItem = {
  name: string;
  icon?: string;
  proof?: string;
};

export type SkillGroup = {
  groupName: string;
  skills: SkillItem[];
};

export const skillGroups: SkillGroup[] = [
  {
    groupName: "Frontend",
    skills: [
      { name: "HTML5 ngữ nghĩa & Accessibility", icon: "html5.svg", proof: "/lab" },
      { name: "CSS, Responsive Design", icon: "css.svg", proof: "/lab" },
      { name: "JavaScript (ES2023+)", icon: "javascript.svg" },
      { name: "TypeScript", icon: "typescript.svg", proof: "/projects/portfolio" },
      { name: "React", icon: "react.svg", proof: "/lab" },
      { name: "Next.js (App Router)", icon: "nextjs.svg", proof: "/projects/portfolio" },
      { name: "Tailwind CSS", icon: "tailwindcss.svg", proof: "/lab" },
    ],
  },
  {
    groupName: "Backend",
    skills: [
      { name: "Node.js", icon: "nodejs.svg" },
      { name: "Express", icon: "express.svg", proof: "/projects/shoplite" },
      { name: "REST API, Server Actions", proof: "/guestbook" },
      { name: "Authentication (OAuth 2.0, JWT)", proof: "/guestbook" },
    ],
  },
  {
    groupName: "Database",
    skills: [
      { name: "PostgreSQL", icon: "postgresql.svg", proof: "/guestbook" },
      { name: "Drizzle ORM", icon: "drizzle.svg", proof: "/projects/portfolio" },
      { name: "Prisma", icon: "prisma.svg", proof: "/projects/taskflow" },
      { name: "Redis", icon: "redis.svg", proof: "/projects/portfolio" },
      { name: "MongoDB", icon: "mongodb.svg" },
    ],
  },
  {
    groupName: "DevOps & Tools",
    skills: [
      { name: "Git, GitHub", icon: "git.svg" },
      { name: "GitHub Actions (CI)", icon: "github-actions.svg" },
      { name: "Docker (cơ bản)", icon: "docker.svg" },
      { name: "Vercel", icon: "vercel.svg" },
      { name: "Vitest, Playwright", icon: "vitest.svg" },
      { name: "Figma (đọc design)", icon: "figma.svg" },
    ],
  },
  {
    groupName: "Kỹ năng mềm",
    skills: [
      { name: "Đọc tài liệu kỹ thuật tiếng Anh" },
      { name: "Viết tài liệu kỹ thuật", proof: "/projects/portfolio" },
      { name: "Làm việc nhóm theo Scrum" },
    ],
  },
];
