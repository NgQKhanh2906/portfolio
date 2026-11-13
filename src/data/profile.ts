export interface ProfileStat {
  icon: "Calendar" | "FolderGit2" | "CheckCircle2" | "Github";
  value: string;
  label: string;
  subtext: string;
}

export interface QuickFact {
  icon: string;
  label: string;
  value: string;
}

export const profile = {
  about: [
    "Mình là sinh viên năm cuối ngành Kỹ thuật Phần mềm, tập trung vào phát triển web full-stack với React, Next.js và PostgreSQL.",
    "Mình thích biến một yêu cầu mơ hồ thành sản phẩm chạy được: bắt đầu từ việc hiểu bài toán, thiết kế dữ liệu, rồi mới viết giao diện.",
    "Trang web bạn đang xem cũng là một dự án: nó có database, xác thực GitHub, rate limit và CI/CD. Bạn có thể thử ngay ở Guestbook hoặc nhấn Ctrl + K.",
  ],
  stats: [
    {
      icon: "Calendar",
      value: "4+",
      label: "Năm học tập CNTT",
      subtext: "Nền tảng kiến trúc phần mềm và hệ thống thông tin vững chắc",
    },
    {
      icon: "FolderGit2",
      value: "10+",
      label: "Dự án hoàn thành",
      subtext: "Bao gồm 3 Case Studies kỹ thuật chuyên sâu và sản phẩm thực tế",
    },
    {
      icon: "CheckCircle2",
      value: "100%",
      label: "Chuẩn WCAG 2.1 AA & Test Pass",
      subtext: "Test coverage toàn diện và khả năng tiếp cận tối ưu",
    },
    {
      icon: "Github",
      value: "300+",
      label: "Đóng góp GitHub",
      subtext: "Hoạt động đóng góp và duy trì mã nguồn liên tục trên Git",
    },
  ],
  quickFacts: [
    { icon: "MapPin", label: "Địa điểm", value: "TP. Hồ Chí Minh" },
    { icon: "GraduationCap", label: "Học vấn", value: "Kỹ thuật Phần mềm - Đại học ABC (2022 - 2026)" },
    { icon: "Languages", label: "Ngôn ngữ", value: "Tiếng Việt (bản ngữ), Tiếng Anh (TOEIC 750)" },
  ],
} as const;
