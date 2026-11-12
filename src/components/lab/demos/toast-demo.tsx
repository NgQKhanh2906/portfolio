"use client";

import React, { useState } from "react";
import { Bell, Play, Info, CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast, type ToastVariant, type ToastPosition } from "@/components/ui/toast";
import { CodePreview } from "../code-preview";

export function ToastDemo() {
  const { toast, position, setPosition } = useToast();
  const [variant, setVariant] = useState<ToastVariant>("success");
  const [duration, setDuration] = useState<number>(4000);
  const [title, setTitle] = useState("Lưu cấu hình thành công");
  const [description, setDescription] = useState(
    "Các thay đổi về thuộc tính đã được áp dụng toàn cục.",
  );

  const handleTrigger = () => {
    toast({
      title,
      description,
      variant,
      duration,
    });
  };

  const handleQuickTrigger = (v: ToastVariant, t: string, d: string) => {
    toast({
      title: t,
      description: d,
      variant: v,
      duration,
    });
  };

  const generatedCode = `// 1. Sử dụng hook useToast trong component
const { toast } = useToast();

// 2. Kích hoạt thông báo với các tùy chọn
toast({
  title: "${title}",
  description: "${description}",
  variant: "${variant}",
  duration: ${duration}, // Tự động đóng sau ${duration / 1000}s (hoặc dừng khi hover)
});`;

  return (
    <div className="space-y-6">
      {/* Interactive Trigger Canvas */}
      <div className="flex min-h-[220px] flex-col items-center justify-center gap-5 rounded-xl border border-border bg-surface p-8 shadow-xs text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Bell className="h-6 w-6" />
          </div>
          <h4 className="font-sans text-sm font-semibold text-text">
            Bắn thông báo thử nghiệm
          </h4>
          <p className="text-xs text-muted max-w-md">
            Nhấn nút để kích hoạt Toast. Rê chuột (hover) hoặc nhấn Tab focus vào Toast để tạm dừng đếm ngược.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" size="md" onClick={handleTrigger}>
            <Play className="h-4 w-4 mr-2" />
            Hiện Toast theo cấu hình
          </Button>
        </div>

        {/* Quick variant buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-border w-full max-w-lg">
          <button
            type="button"
            onClick={() => handleQuickTrigger("info", "Thông tin hệ thống", "Next.js 14 App Router đang chạy ở chế độ ISR.")}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border border-border bg-surface-2 text-muted hover:text-text transition-colors"
          >
            <Info className="h-3.5 w-3.5 text-status-info" />
            <span>Info</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickTrigger("success", "Thành công", "Đã đồng bộ hóa 100% dữ liệu với GitHub API.")}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border border-border bg-surface-2 text-muted hover:text-text transition-colors"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-status-success" />
            <span>Success</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickTrigger("warning", "Cảnh báo rate limit", "Còn lại 3 lần gửi trước khi bị giới hạn 10 phút.")}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border border-border bg-surface-2 text-muted hover:text-text transition-colors"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-status-warning" />
            <span>Warning</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickTrigger("error", "Lỗi kết nối", "Không thể truy vấn cơ sở dữ liệu Upstash Redis.")}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border border-border bg-surface-2 text-muted hover:text-text transition-colors"
          >
            <AlertOctagon className="h-3.5 w-3.5 text-status-danger" />
            <span>Error</span>
          </button>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-lg border border-border bg-surface-2/60">
        {/* Variant */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-muted uppercase">Trạng thái (Variant)</label>
          <select
            value={variant}
            onChange={(e) => setVariant(e.target.value as ToastVariant)}
            className="w-full h-9 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <option value="info">info (Thông tin)</option>
            <option value="success">success (Thành công)</option>
            <option value="warning">warning (Cảnh báo)</option>
            <option value="error">error (Lỗi nghiêm trọng)</option>
          </select>
        </div>

        {/* Position */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-muted uppercase">Vị trí (Position)</label>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value as ToastPosition)}
            className="w-full h-9 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <option value="bottom-right">Góc dưới phải (Mặc định)</option>
            <option value="top-right">Góc trên phải</option>
            <option value="bottom-center">Ở giữa đáy màn hình</option>
          </select>
        </div>

        {/* Duration */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-muted uppercase">Thời gian hiển thị</label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full h-9 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <option value={2000}>2 giây (Nhanh)</option>
            <option value={4000}>4 giây (Tiêu chuẩn)</option>
            <option value={8000}>8 giây (Lâu hơn)</option>
          </select>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-muted uppercase">Tiêu đề thông báo</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-9 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>
      </div>

      {/* Code Preview */}
      <CodePreview code={generatedCode} />
    </div>
  );
}
