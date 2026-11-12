export interface LabComponentMeta {
  id: "button" | "tabs" | "toast";
  name: string;
  tag: string;
  description: string;
  category: "Primitive" | "Navigation" | "Feedback";
  a11yNotes: {
    role: string;
    keyboard: { key: string; description: string }[];
    notes: string[];
  };
}

export const LAB_COMPONENTS: Record<string, LabComponentMeta> = {
  button: {
    id: "button",
    name: "Button & IconButton",
    tag: "01 / PRIMITIVE",
    description:
      "Nút bấm cơ bản viết tay với 4 biến thể, 3 kích cỡ, trạng thái loading và disabled. Hỗ trợ asChild và chuẩn WAI-ARIA button.",
    category: "Primitive",
    a11yNotes: {
      role: 'role="button" (mặc định thẻ <button>)',
      keyboard: [
        { key: "Tab", description: "Di chuyển focus đến hoặc rời khỏi nút bấm" },
        { key: "Enter / Space", description: "Kích hoạt sự kiện bấm của nút" },
      ],
      notes: [
        "Vùng chạm tối thiểu 44x44px trên thiết bị di động đảm bảo tiêu chuẩn WCAG 2.1 AA.",
        "Trạng thái loading kích hoạt aria-busy='true' và tạm thời khóa tương tác pointer-events.",
        "IconButton bắt buộc yêu cầu prop aria-label để mô tả rõ mục đích hành động cho trình đọc màn hình.",
      ],
    },
  },
  tabs: {
    id: "tabs",
    name: "Tabs Navigation",
    tag: "02 / NAVIGATION",
    description:
      "Thành phần điều hướng phân tầng viết tay tuân thủ chặt chẽ WAI-ARIA Tabs pattern. Hỗ trợ phím mũi tên, Home, End và hai hướng hiển thị.",
    category: "Navigation",
    a11yNotes: {
      role: 'role="tablist", role="tab", role="tabpanel"',
      keyboard: [
        { key: "ArrowLeft / ArrowRight", description: "Chuyển đổi giữa các tab khi ở hướng ngang (Horizontal)" },
        { key: "ArrowUp / ArrowDown", description: "Chuyển đổi giữa các tab khi ở hướng dọc (Vertical)" },
        { key: "Home", description: "Chuyển focus và kích hoạt ngay tab đầu tiên trong danh sách" },
        { key: "End", description: "Chuyển focus và kích hoạt ngay tab cuối cùng trong danh sách" },
      ],
      notes: [
        "Sử dụng kỹ thuật Roving tabindex: Tab đang chọn có tabIndex={0}, các tab còn lại có tabIndex={-1}.",
        "Mỗi thẻ tab được gắn id liên kết 2 chiều với tabpanel tương ứng qua aria-controls và aria-labelledby.",
        "Hỗ trợ cả hai chế độ giao diện: 'pill' dạng khối bo tròn và 'underline' dạng đường kẻ viền.",
      ],
    },
  },
  toast: {
    id: "toast",
    name: "Toast Notifications",
    tag: "03 / FEEDBACK",
    description:
      "Hệ thống thông báo nổi toàn trang viết tay không phụ thuộc thư viện ngoài, hỗ trợ 4 trạng thái, xếp chồng thông minh và tự dừng đếm ngược khi hover.",
    category: "Feedback",
    a11yNotes: {
      role: 'role="status" (thông tin bình thường) hoặc role="alert" (cảnh báo / lỗi)',
      keyboard: [
        { key: "Tab", description: "Di chuyển focus vào nội dung thông báo hoặc nút đóng" },
        { key: "Enter / Space", description: "Nhấn nút đóng để ẩn thông báo ngay lập tức" },
      ],
      notes: [
        "Vùng chứa thông báo thiết lập aria-live='polite' cho info/success và aria-live='assertive' cho error.",
        "Tự động tạm dừng đồng hồ đếm ngược biến mất khi con trỏ chuột hover hoặc khi phần tử nhận focus bàn phím.",
        "Thông báo tự động dismiss sau thời gian định sẵn (2s, 4s, 8s) mà không làm gián đoạn luồng làm việc.",
      ],
    },
  },
};
