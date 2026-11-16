export interface ProfileStat {
  icon: "Calendar" | "FolderGit2" | "CheckCircle2" | "Github";
  value: string;
  label: string;
  subtext: string;
}

export const profile = {
  about: [
    "Mình là sinh viên ngành Công nghệ Thông tin tại Học viện Công nghệ Bưu chính Viễn thông (PTIT), định hướng phát triển Backend và Web Application.",
    "Thế mạnh của mình tập trung vào Java, Spring Boot, thiết kế cơ sở dữ liệu quan hệ (PostgreSQL, MySQL) và xây dựng RESTful API kết hợp đóng gói Docker.",
    "Trang web bạn đang xem là dự án thực hành kiểm chứng năng lực Full-stack: kiến trúc Next.js App Router, tích hợp GitHub Telemetry, bộ đếm lượt xem Redis và kiểm thử tự động 100%.",
  ],
  stats: [
    {
      icon: "Calendar",
      value: "2024+",
      label: "Sinh viên CNTT (PTIT)",
      subtext: "Đạt Học bổng Khuyến khích Học tập năm nhất đại học",
    },
    {
      icon: "FolderGit2",
      value: "2+",
      label: "Sản phẩm Web & Backend",
      subtext: "Bao gồm Portfolio Full-stack và hệ thống dịch vụ Backend Java",
    },
    {
      icon: "CheckCircle2",
      value: "100%",
      label: "Chuẩn WCAG 2.1 AA & Test Pass",
      subtext: "Kiểm thử tự động toàn diện với Vitest & Testing Library",
    },
    {
      icon: "Github",
      value: "Git",
      label: "Quản lý mã nguồn chuẩn",
      subtext: "Quy trình Git Flow, Conventional Commits và kiểm thử với Postman",
    },
  ],
} as const;
