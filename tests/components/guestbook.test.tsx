import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next-auth và next-auth/react trước các import khác
vi.mock("next-auth", () => ({
  default: vi.fn(() => ({
    handlers: { GET: vi.fn(), POST: vi.fn() },
    auth: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
  })),
}));

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  useSession: vi.fn(() => ({ data: null, status: "unauthenticated" })),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock("@/actions/guestbook", () => ({
  createGuestbookEntry: vi.fn().mockResolvedValue({
    ok: true,
    data: {
      id: "entry-new",
      userId: "user-1",
      content: "Nội dung mới",
      createdAt: new Date().toISOString(),
      user: {
        name: "Nguyen Van A",
        username: "nguyenvana",
        image: null,
        isAdmin: false,
      },
    },
  }),
  deleteGuestbookEntry: vi.fn().mockResolvedValue({
    ok: true,
    data: { id: "entry-1" },
  }),
}));

import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { ToastProvider } from "@/components/ui/toast";
import { GuestbookList } from "@/components/guestbook/guestbook-list";
import { GuestbookEntry } from "@/components/guestbook/guestbook-entry";
import { GuestbookForm } from "@/components/guestbook/guestbook-form";
import { DeleteEntryDialog } from "@/components/guestbook/delete-entry-dialog";
import type { GuestbookEntryItem, GuestbookUser } from "@/types/guestbook";

const mockRegularUser: GuestbookUser = {
  id: "user-1",
  name: "Nguyen Van A",
  username: "nguyenvana",
  image: "https://example.com/avatar1.png",
  isAdmin: false,
};

const mockAdminUser: GuestbookUser = {
  id: "admin-1",
  name: "Admin Khanh",
  username: "khanhadmin",
  image: "https://example.com/admin.png",
  isAdmin: true,
};

const mockOtherUser: GuestbookUser = {
  id: "user-2",
  name: "Tran Van B",
  username: "tranvanb",
  image: null,
  isAdmin: false,
};

const mockEntries: GuestbookEntryItem[] = [
  {
    id: "entry-1",
    userId: "user-1",
    content: "Xin chao, trang web duoc thiet ke rat dep va chuyen nghiep!",
    createdAt: "2026-11-14T10:30:00.000Z",
    user: mockRegularUser,
  },
  {
    id: "entry-2",
    userId: "admin-1",
    content: "Cam on ban rat nhieu vi da ghe tham va de lai loi nhan!",
    createdAt: "2026-11-14T11:00:00.000Z",
    user: mockAdminUser,
  },
];

function renderWithToast(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}

describe("Guestbook Frontend Components", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("1. Render Form & Auth State", () => {
    it("hiển thị thông báo đăng nhập và SignInButton khi chưa đăng nhập", () => {
      renderWithToast(
        <GuestbookList initialEntries={mockEntries} currentUser={null} />
      );

      expect(
        screen.getByText("Đăng nhập để để lại lời nhắn")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /đăng nhập bằng github/i })
      ).toBeInTheDocument();
      expect(
        screen.queryByPlaceholderText(/để lại lời chào/i)
      ).not.toBeInTheDocument();
    });

    it("hiển thị profile người dùng và form nhập khi đã đăng nhập", () => {
      renderWithToast(
        <GuestbookList
          initialEntries={mockEntries}
          currentUser={mockRegularUser}
        />
      );

      const userNames = screen.getAllByText("Nguyen Van A");
      expect(userNames.length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("@nguyenvana").length).toBeGreaterThanOrEqual(1);
      expect(
        screen.getByRole("button", { name: /đăng xuất/i })
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/để lại lời chào/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /gửi lời nhắn/i })
      ).toBeInTheDocument();
    });
  });

  describe("2. Render Danh sách Entries & Badges", () => {
    it("render danh sách entries, hiển thị text thuần túy và format thời gian", () => {
      renderWithToast(
        <GuestbookList initialEntries={mockEntries} currentUser={null} />
      );

      expect(
        screen.getByText(
          "Xin chao, trang web duoc thiet ke rat dep va chuyen nghiep!"
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Cam on ban rat nhieu vi da ghe tham va de lai loi nhan!"
        )
      ).toBeInTheDocument();

      // Kiểm tra nhãn đếm tổng số lời nhắn
      expect(screen.getByText("2 lời nhắn")).toBeInTheDocument();

      // Kiểm tra hiển thị format ngày tháng
      expect(screen.getAllByText(/14\/11\/2026/)).toHaveLength(2);
    });

    it("hiển thị badge Admin cho bài viết của tài khoản quản trị", () => {
      renderWithToast(
        <GuestbookList initialEntries={mockEntries} currentUser={null} />
      );

      const adminBadges = screen.getAllByText("Admin");
      expect(adminBadges.length).toBeGreaterThanOrEqual(1);
    });

    it("hiển thị badge Tác giả cho bài viết của chính người dùng hiện tại", () => {
      renderWithToast(
        <GuestbookList
          initialEntries={mockEntries}
          currentUser={mockRegularUser}
        />
      );

      expect(screen.getByText("Tác giả")).toBeInTheDocument();
    });
  });

  describe("3. Phân quyền hiển thị Nút Xóa (Role-based Delete Visibility)", () => {
    it("ẩn nút xóa với người xem vãng lai chưa đăng nhập", () => {
      renderWithToast(
        <GuestbookList initialEntries={mockEntries} currentUser={null} />
      );

      expect(screen.queryByLabelText(/xóa lời nhắn/i)).not.toBeInTheDocument();
    });

    it("chỉ hiển thị nút xóa trên bài viết của chính mình đối với người dùng thông thường", () => {
      renderWithToast(
        <GuestbookList
          initialEntries={mockEntries}
          currentUser={mockRegularUser}
        />
      );

      // Có nút xóa trên bài của chính mình (entry-1 của nguyenvana)
      expect(
        screen.getByLabelText("Xóa lời nhắn của @nguyenvana")
      ).toBeInTheDocument();

      // Không có nút xóa trên bài của admin (entry-2 của khanhadmin)
      expect(
        screen.queryByLabelText("Xóa lời nhắn của @khanhadmin")
      ).not.toBeInTheDocument();
    });

    it("hiển thị nút xóa trên TẤT CẢ bài viết đối với tài khoản Admin", () => {
      renderWithToast(
        <GuestbookList
          initialEntries={mockEntries}
          currentUser={mockAdminUser}
        />
      );

      expect(
        screen.getByLabelText("Xóa lời nhắn của @nguyenvana")
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Xóa lời nhắn của @khanhadmin")
      ).toBeInTheDocument();
    });

    it("ẩn nút xóa đối với người dùng khác không phải chủ bài viết và không phải Admin", () => {
      renderWithToast(
        <GuestbookList
          initialEntries={mockEntries}
          currentUser={mockOtherUser}
        />
      );

      expect(screen.queryByLabelText(/xóa lời nhắn/i)).not.toBeInTheDocument();
    });
  });

  describe("4. Xử lý Empty State", () => {
    it("hiển thị component EmptyState khi danh sách lời nhắn rỗng", () => {
      renderWithToast(
        <GuestbookList initialEntries={[]} currentUser={mockRegularUser} />
      );

      expect(screen.getByText("Chưa có lời nhắn nào")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Hãy là người đầu tiên để lại lời chào hoặc góp ý kỹ thuật."
        )
      ).toBeInTheDocument();
      expect(screen.getByText("0 lời nhắn")).toBeInTheDocument();
    });
  });

  describe("5. GuestbookForm & Bộ đếm ký tự", () => {
    it("cập nhật bộ đếm ký tự khi người dùng nhập nội dung", () => {
      const mockSubmit = vi.fn().mockResolvedValue(true);
      render(<GuestbookForm onSubmit={mockSubmit} />);

      const textarea = screen.getByPlaceholderText(/để lại lời chào/i);
      const submitBtn = screen.getByRole("button", { name: /gửi lời nhắn/i });

      // Ban đầu: rỗng và nút gửi bị vô hiệu hóa
      expect(screen.getByText("0/280")).toBeInTheDocument();
      expect(submitBtn).toBeDisabled();

      // Nhập nội dung
      fireEvent.change(textarea, { target: { value: "Hello World" } });

      expect(screen.getByText("11/280")).toBeInTheDocument();
      expect(submitBtn).toBeEnabled();
    });

    it("hỗ trợ gửi form bằng tổ hợp phím tắt Ctrl+Enter", async () => {
      const mockSubmit = vi.fn().mockResolvedValue(true);
      render(<GuestbookForm onSubmit={mockSubmit} />);

      const textarea = screen.getByPlaceholderText(/để lại lời chào/i);
      fireEvent.change(textarea, {
        target: { value: "Gửi bằng phím tắt Ctrl+Enter" },
      });

      fireEvent.keyDown(textarea, { key: "Enter", ctrlKey: true });

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith("Gửi bằng phím tắt Ctrl+Enter");
      });
    });
  });

  describe("6. DeleteEntryDialog WAI-ARIA & Tương tác", () => {
    it("tuân thủ thuộc tính WAI-ARIA cho modal dialog", () => {
      render(
        <DeleteEntryDialog
          isOpen={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          authorUsername="nguyenvana"
        />
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-labelledby", "delete-dialog-title");
      expect(dialog).toHaveAttribute("aria-describedby", "delete-dialog-desc");
      expect(
        screen.getByText(/bạn có chắc chắn muốn xóa lời nhắn của @nguyenvana\?/i)
      ).toBeInTheDocument();
    });

    it("kích hoạt onClose khi bấm phím Escape", () => {
      const onClose = vi.fn();
      render(
        <DeleteEntryDialog
          isOpen={true}
          onClose={onClose}
          onConfirm={vi.fn()}
        />
      );

      fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("kích hoạt onConfirm khi bấm nút Xác nhận xóa", () => {
      const onConfirm = vi.fn();
      render(
        <DeleteEntryDialog
          isOpen={true}
          onClose={vi.fn()}
          onConfirm={onConfirm}
        />
      );

      fireEvent.click(screen.getByRole("button", { name: /xác nhận xóa/i }));
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe("7. Optimistic UI Thêm và Xóa", () => {
    it("hiển thị tức thì lời nhắn mới trên danh sách với độ mờ và rollback khi action thất bại", async () => {
      const mockFailingCreate = vi.fn().mockResolvedValue({
        ok: false,
        code: "RATE_LIMITED",
        message: "Bạn đã vượt quá giới hạn gửi tin.",
      });

      renderWithToast(
        <GuestbookList
          initialEntries={mockEntries}
          currentUser={mockRegularUser}
          createAction={mockFailingCreate}
        />
      );

      const textarea = screen.getByPlaceholderText(/để lại lời chào/i);
      fireEvent.change(textarea, {
        target: { value: "Tin nhan lac quan moi" },
      });

      const submitBtn = screen.getByRole("button", { name: /gửi lời nhắn/i });
      await act(async () => {
        fireEvent.click(submitBtn);
      });

      // Thấy lời nhắn tạm thời xuất hiện trên danh sách
      const optimisticItems = screen.getAllByText("Tin nhan lac quan moi");
      expect(optimisticItems.length).toBeGreaterThanOrEqual(1);

      // Sau khi action thất bại -> rollback và thông báo lỗi qua toast
      await waitFor(() => {
        expect(
          screen.getByText("Không thể gửi lời nhắn")
        ).toBeInTheDocument();
      });
    });

    it("ẩn ngay lập tức lời nhắn khi xác nhận xóa và rollback nếu xóa thất bại", async () => {
      const mockFailingDelete = vi.fn().mockResolvedValue({
        ok: false,
        code: "INTERNAL_ERROR",
        message: "Lỗi kết nối database.",
      });

      renderWithToast(
        <GuestbookList
          initialEntries={mockEntries}
          currentUser={mockAdminUser}
          deleteAction={mockFailingDelete}
        />
      );

      // Bấm nút xóa trên bài của nguyenvana
      const deleteBtn = screen.getByLabelText("Xóa lời nhắn của @nguyenvana");
      fireEvent.click(deleteBtn);

      // Mở dialog xác nhận
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Bấm xác nhận xóa trong dialog
      const confirmBtn = screen.getByRole("button", { name: /xác nhận xóa/i });
      await act(async () => {
        fireEvent.click(confirmBtn);
      });

      // Dialog đóng và bài viết tạm thời biến mất
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      // Sau khi action trả về lỗi -> rollback bài viết trở lại và hiển thị toast
      await waitFor(() => {
        expect(
          screen.getByText("Không thể xóa lời nhắn")
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            "Xin chao, trang web duoc thiet ke rat dep va chuyen nghiep!"
          )
        ).toBeInTheDocument();
      });
    });
  });
});
