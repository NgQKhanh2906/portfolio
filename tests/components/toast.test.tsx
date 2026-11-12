import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ToastProvider, useToast } from "@/components/ui/toast";

function TestToastConsumer() {
  const { toast } = useToast();

  return (
    <div>
      <button
        onClick={() =>
          toast({
            title: "Tiêu đề thành công",
            description: "Mô tả chi tiết tác vụ.",
            variant: "success",
            duration: 3000,
          })
        }
      >
        Bắn Toast Success
      </button>

      <button
        onClick={() =>
          toast({
            title: "Lỗi nghiêm trọng",
            variant: "error",
            duration: 5000,
          })
        }
      >
        Bắn Toast Error
      </button>
    </div>
  );
}

describe("Toast Notification System", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("renders toast when triggered", () => {
    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByText("Bắn Toast Success"));
    });

    expect(screen.getByText("Tiêu đề thành công")).toBeInTheDocument();
    expect(screen.getByText("Mô tả chi tiết tác vụ.")).toBeInTheDocument();
  });

  it("renders with alert role and assertive live region for error variant", () => {
    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByText("Bắn Toast Error"));
    });

    const alertToast = screen.getByRole("alert");
    expect(alertToast).toBeInTheDocument();
    expect(alertToast).toHaveAttribute("aria-live", "assertive");
  });

  it("dismisses toast when clicking close button", () => {
    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByText("Bắn Toast Success"));
    });
    expect(screen.getByText("Tiêu đề thành công")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "Đóng thông báo" });
    act(() => {
      fireEvent.click(closeBtn);
    });

    expect(screen.queryByText("Tiêu đề thành công")).not.toBeInTheDocument();
  });

  it("auto dismisses after duration", () => {
    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByText("Bắn Toast Success"));
    });
    expect(screen.getByText("Tiêu đề thành công")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3100);
    });

    expect(screen.queryByText("Tiêu đề thành công")).not.toBeInTheDocument();
  });

  it("pauses countdown on hover and resumes on unhover", () => {
    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByText("Bắn Toast Success"));
    });
    const toastElement = screen.getByText("Tiêu đề thành công").closest("div[tabindex='0']");
    expect(toastElement).toBeInTheDocument();

    // 1 second passes
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Hover to pause
    fireEvent.mouseEnter(toastElement!);

    // 5 seconds pass while hovered
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Toast must still be visible!
    expect(screen.getByText("Tiêu đề thành công")).toBeInTheDocument();

    // Leave hover
    fireEvent.mouseLeave(toastElement!);

    // Advance remaining ~2 seconds
    act(() => {
      vi.advanceTimersByTime(2100);
    });

    // Now it should be dismissed
    expect(screen.queryByText("Tiêu đề thành công")).not.toBeInTheDocument();
  });
});
