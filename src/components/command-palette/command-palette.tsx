"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, Check } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { commandItems, type CommandAction } from "./command-items";

export interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandPalette({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = isControlled ? (setControlledOpen ?? setInternalOpen) : setInternalOpen;

  const router = useRouter();
  const { setTheme } = useTheme();
  const { isCopied, copy } = useCopyToClipboard();
  const [search, setSearch] = useState("");

  // Shortcut Ctrl + K or Cmd + K
  useKeyboardShortcut({ key: "k", ctrlKey: true }, (event) => {
    event.preventDefault();
    setIsOpen(!isOpen);
  });

  // Close on Escape if handled
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  const handleSelect = (item: CommandAction) => {
    item.perform({
      router,
      setTheme,
      copy,
      close: () => setIsOpen(false),
    });
  };

  const navItems = commandItems.filter((item) => item.group === "navigation");
  const themeItems = commandItems.filter((item) => item.group === "theme");
  const actionItems = commandItems.filter((item) => item.group === "actions");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-bg/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-surface shadow-2xl overflow-hidden z-10 animate-in fade-in-0 zoom-in-95">
        <Command
          label="Bảng lệnh điều khiển"
          value={search}
          onValueChange={setSearch}
          className="w-full flex flex-col"
        >
          {/* Search Input Bar */}
          <div className="flex items-center border-b border-border px-3.5">
            <Search className="h-4 w-4 text-muted shrink-0 mr-2" />
            <Command.Input
              autoFocus
              placeholder="Gõ lệnh hoặc tìm kiếm (ví dụ: tối, dự án, email)..."
              className="h-12 w-full bg-transparent text-sm text-text placeholder:text-muted focus:outline-none"
            />
            {isCopied && (
              <span className="flex items-center gap-1 text-xs text-status-success font-medium bg-status-success-soft px-2 py-0.5 rounded">
                <Check className="h-3 w-3" /> Đã sao chép!
              </span>
            )}
          </div>

          {/* Items List */}
          <Command.List className="max-h-80 overflow-y-auto p-2 scrollbar-thin">
            <Command.Empty className="py-8 text-center text-sm text-muted">
              Không tìm thấy lệnh hoặc kết quả phù hợp.
            </Command.Empty>

            {/* Navigation Group */}
            <Command.Group
              heading="ĐIỀU HƯỚNG"
              className="px-2 py-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-muted"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Command.Item
                    key={item.id}
                    value={`${item.title} ${item.keywords?.join(" ") ?? ""}`}
                    onSelect={() => handleSelect(item)}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-text aria-selected:bg-surface-2 aria-selected:text-accent cursor-pointer transition-colors"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-muted" />
                    <span className="flex-1">{item.title}</span>
                  </Command.Item>
                );
              })}
            </Command.Group>

            {/* Theme Group */}
            <Command.Group
              heading="GIAO DIỆN"
              className="px-2 py-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-muted"
            >
              {themeItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Command.Item
                    key={item.id}
                    value={`${item.title} ${item.keywords?.join(" ") ?? ""}`}
                    onSelect={() => handleSelect(item)}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-text aria-selected:bg-surface-2 aria-selected:text-accent cursor-pointer transition-colors"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-muted" />
                    <span className="flex-1">{item.title}</span>
                  </Command.Item>
                );
              })}
            </Command.Group>

            {/* Actions Group */}
            <Command.Group
              heading="HÀNH ĐỘNG NHANH"
              className="px-2 py-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-muted"
            >
              {actionItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Command.Item
                    key={item.id}
                    value={`${item.title} ${item.keywords?.join(" ") ?? ""}`}
                    onSelect={() => handleSelect(item)}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-text aria-selected:bg-surface-2 aria-selected:text-accent cursor-pointer transition-colors"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-muted" />
                    <span className="flex-1">{item.title}</span>
                  </Command.Item>
                );
              })}
            </Command.Group>
          </Command.List>

          {/* Footer Guide */}
          <div className="flex items-center justify-between border-t border-border bg-surface-2/40 px-3.5 py-2 text-[11px] text-muted font-mono">
            <span>Dùng phím mũi tên ↑ ↓ để chọn</span>
            <span>↵ để thực thi &bull; Esc để đóng</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
