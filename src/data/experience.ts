export type TimelineEntry = {
  type: "work" | "education" | "award";
  period: string;
  title: string;
  organization: string;
  highlights: string[];
};

export const experienceTimeline: TimelineEntry[] = [
  {
    type: "award",
    period: "2024 - 2025",
    title: "Học bổng Khuyến khích Học tập",
    organization: "Học viện Công nghệ Bưu chính Viễn thông (PTIT)",
    highlights: [
      "Đạt thành tích học tập xuất sắc trong năm nhất đại học ngành Công nghệ Thông tin",
      "Rèn luyện tư duy thuật toán, cấu trúc dữ liệu và lập trình hướng đối tượng (OOP) vững chắc",
    ],
  },
  {
    type: "award",
    period: "2024",
    title: "Chứng chỉ Tin học Văn phòng Quốc tế MOS",
    organization: "Certiport",
    highlights: [
      "Chứng chỉ chuyên môn Microsoft Office Specialist (MOS) nội dung Excel và PowerPoint",
      "Thành thạo kỹ năng xử lý bảng tính, trực quan hóa số liệu và trình bày tài liệu kỹ thuật",
    ],
  },
  {
    type: "education",
    period: "2024 - 2029",
    title: "Kỹ sư Công nghệ Thông tin",
    organization: "Học viện Công nghệ Bưu chính Viễn thông (PTIT)",
    highlights: [
      "Chương trình đào tạo Kỹ sư Công nghệ Thông tin chính quy",
      "Định hướng chuyên sâu: Lập trình Backend với Java & Spring Boot, Quản trị CSDL và Kiến trúc dịch vụ Web",
    ],
  },
];
