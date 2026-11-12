export type TimelineEntry = {
  type: "work" | "education" | "award";
  period: string;
  title: string;
  organization: string;
  highlights: string[];
};

export const experienceTimeline: TimelineEntry[] = [
  {
    type: "work",
    period: "06/2025 - 09/2025",
    title: "Thực tập sinh Frontend Developer",
    organization: "Công ty TNHH Phần mềm XYZ",
    highlights: [
      "Xây dựng 12 màn hình quản trị bằng React và TypeScript theo thiết kế Figma",
      "Giảm thời gian tải trang danh sách đơn hàng từ 3.2s xuống 1.1s bằng phân trang phía server và memo hóa component",
      "Viết 40 unit test với Vitest cho các hàm định dạng dữ liệu",
    ],
  },
  {
    type: "award",
    period: "11/2024",
    title: "Giải Nhì Hackathon sinh viên",
    organization: "Đại học ABC",
    highlights: [
      "Xây dựng ứng dụng chia sẻ đồ dùng học tập trong 36 giờ cùng team 4 người",
      "Phụ trách API và thiết kế database PostgreSQL",
    ],
  },
  {
    type: "education",
    period: "09/2022 - 06/2026",
    title: "Kỹ sư Kỹ thuật Phần mềm",
    organization: "Đại học ABC",
    highlights: [
      "GPA: 3.4 / 4.0",
      "Đồ án môn học: Hệ thống quản lý thư viện dùng Next.js và PostgreSQL",
    ],
  },
];
