"use client";

import React, { useState } from "react";
import { ArrowRight, Send, Star, Trash2 } from "lucide-react";
import { Button, type ButtonVariant, type ButtonSize } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { CodePreview } from "../code-preview";

export function ButtonDemo() {
  const [variant, setVariant] = useState<ButtonVariant>("primary");
  const [size, setSize] = useState<ButtonSize>("md");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [buttonText, setButtonText] = useState("Thực thi Tác vụ");
  const [showIcon, setShowIcon] = useState(true);

  const generatedCode = `<Button
  variant="${variant}"
  size="${size}"${isLoading ? "\n  loading" : ""}${isDisabled ? "\n  disabled" : ""}
>
  ${showIcon ? '<Send className="h-4 w-4 mr-2" />\n  ' : ""}${buttonText}
</Button>`;

  return (
    <div className="space-y-6">
      {/* Interactive Preview Canvas */}
      <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-xl border border-border bg-surface p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            variant={variant}
            size={size}
            loading={isLoading}
            disabled={isDisabled}
            onClick={() => {}}
          >
            {showIcon && <Send className="h-4 w-4 mr-2" />}
            {buttonText}
          </Button>

          <IconButton
            variant="secondary"
            size={size === "lg" ? "md" : size}
            disabled={isDisabled}
            label="Thêm vào danh sách yêu thích"
          >
            <Star className="h-4 w-4" />
          </IconButton>

          <IconButton
            variant="outline"
            size={size === "lg" ? "md" : size}
            disabled={isDisabled}
            label="Xóa phần tử"
          >
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </div>

        <p className="font-mono text-xs text-muted mt-2">
          Focus ring: nhấn Tab để kiểm tra viền outline 2px chuẩn accessibility
        </p>
      </div>

      {/* Controls Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-lg border border-border bg-surface-2/60">
        {/* Variant */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-muted uppercase">Biến thể (Variant)</label>
          <select
            value={variant}
            onChange={(e) => setVariant(e.target.value as ButtonVariant)}
            className="w-full h-9 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <option value="primary">primary (Nổi bật)</option>
            <option value="secondary">secondary (Thứ cấp)</option>
            <option value="ghost">ghost (Trong suốt)</option>
            <option value="danger">danger (Nguy hiểm)</option>
          </select>
        </div>

        {/* Size */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-muted uppercase">Kích cỡ (Size)</label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value as ButtonSize)}
            className="w-full h-9 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <option value="sm">sm (Nhỏ - 32px)</option>
            <option value="md">md (Chuẩn - 40px)</option>
            <option value="lg">lg (Lớn - 48px)</option>
          </select>
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-muted uppercase">Nội dung nút</label>
          <input
            type="text"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            className="w-full h-9 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>

        {/* Toggles */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-muted uppercase">Trạng thái (State)</label>
          <div className="flex items-center gap-3 pt-1.5 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-text">
              <input
                type="checkbox"
                checked={isLoading}
                onChange={(e) => setIsLoading(e.target.checked)}
                className="rounded border-border text-accent focus:ring-accent"
              />
              <span>Loading</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-text">
              <input
                type="checkbox"
                checked={isDisabled}
                onChange={(e) => setIsDisabled(e.target.checked)}
                className="rounded border-border text-accent focus:ring-accent"
              />
              <span>Disabled</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-text">
              <input
                type="checkbox"
                checked={showIcon}
                onChange={(e) => setShowIcon(e.target.checked)}
                className="rounded border-border text-accent focus:ring-accent"
              />
              <span>Icon</span>
            </label>
          </div>
        </div>
      </div>

      {/* Code Preview */}
      <CodePreview code={generatedCode} />
    </div>
  );
}
