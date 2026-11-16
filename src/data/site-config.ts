export const siteConfig = {
  name: "Nguyễn Quốc Khánh",
  shortName: "NQK",
  role: "Web Developer",
  tagline:
    "Sinh viên CNTT tại PTIT định hướng Backend & Web Developer với Java, Spring Boot và xây dựng hệ thống phần mềm chuẩn kiến trúc.",
  url: "https://nqkhanh.dev",
  email: "nguyenqkhanhlc2006@gmail.com",
  location: "Hà Nội, Việt Nam",
  openToWork: true,
  openToWorkLabel: "Đang tìm cơ hội Intern Web / Backend Developer",
  resumePath: "/resume.pdf",
  resumeFileName: "CV-Nguyen-Quoc-Khanh-Intern.pdf",
  social: {
    github: "https://github.com/NgQKhanh2906",
    linkedin: "https://www.linkedin.com/in/nguy%E1%BB%85n-qu%E1%BB%91c-kh%C3%A1nh-6a77bb414/",
  },
  githubUsername: "NgQKhanh2906",
  repoUrl: "https://github.com/NgQKhanh2906/portfolio",
  timezone: "Asia/Ho_Chi_Minh",
  locale: "vi-VN",
  navItems: [
    { label: "Trang chủ", href: "/" },
    { label: "Dự án", href: "/projects" },
    { label: "Liên hệ", href: "/contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
