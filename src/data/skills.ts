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
    groupName: "Backend",
    skills: [
      { name: "Java (OOP, Core Java)", proof: "/projects/backend-services" },
      { name: "Spring Boot", proof: "/projects/backend-services" },
      { name: "RESTful API Design", proof: "/projects/backend-services" },
      { name: "Transaction & Concurrency Control", proof: "/projects/backend-services" },
    ],
  },
  {
    groupName: "Database",
    skills: [
      { name: "PostgreSQL", proof: "/projects/portfolio" },
      { name: "MySQL", proof: "/projects/backend-services" },
      { name: "Drizzle ORM", proof: "/projects/portfolio" },
      { name: "Redis Caching", proof: "/projects/portfolio" },
    ],
  },
  {
    groupName: "DevOps & Công cụ",
    skills: [
      { name: "Git, GitHub (Version Control)" },
      { name: "Docker (Containerization cơ bản)" },
      { name: "Postman (API Testing & Docs)" },
      { name: "Vercel & CI/CD" },
    ],
  },
  {
    groupName: "Frontend & Web cơ bản",
    skills: [
      { name: "HTML5 ngữ nghĩa & Accessibility", proof: "/projects/portfolio" },
      { name: "CSS, Tailwind CSS Responsive", proof: "/projects/portfolio" },
      { name: "JavaScript / TypeScript", proof: "/projects/portfolio" },
      { name: "React, Next.js (App Router)", proof: "/projects/portfolio" },
    ],
  },
  {
    groupName: "Kỹ năng bổ trợ",
    skills: [
      { name: "Đọc hiểu tài liệu kỹ thuật tiếng Anh" },
      { name: "Tin học văn phòng MOS (Excel, PowerPoint)" },
      { name: "Viết tài liệu kỹ thuật & Case Study", proof: "/projects/portfolio" },
    ],
  },
];
