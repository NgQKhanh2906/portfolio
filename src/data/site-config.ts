export const siteConfig = {
  name: "Nguyễn Quốc Khánh",
  shortName: "NQK",
  role: "Web Developer",
  tagline:
    "Mình xây dựng web app nhanh, dễ dùng và có kiến trúc rõ ràng - từ giao diện đến database.",
  url: "https://nqkhanh.dev",
  email: "khanh.dev@example.com",
  location: "TP. Hồ Chí Minh, Việt Nam",
  openToWork: true,
  openToWorkLabel: "Đang tìm cơ hội Intern / Fresher Web Developer",
  resumePath: "/resume.pdf",
  resumeFileName: "CV-Nguyen-Quoc-Khanh-WebDeveloper.pdf",
  social: {
    github: "https://github.com/nqkhanh-dev",
    linkedin: "https://www.linkedin.com/in/nqkhanh-dev",
  },
  githubUsername: "nqkhanh-dev",
  repoUrl: "https://github.com/nqkhanh-dev/portfolio",
  timezone: "Asia/Ho_Chi_Minh",
  locale: "vi-VN",
  navItems: [
    { label: "Trang chủ", href: "/" },
    { label: "Dự án", href: "/projects" },
    { label: "Lab", href: "/lab" },
    { label: "Guestbook", href: "/guestbook" },
    { label: "Liên hệ", href: "/contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
