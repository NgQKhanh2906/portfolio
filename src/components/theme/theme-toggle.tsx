"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "./theme-provider";
import type { Theme } from "@/types";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Sáng", icon: <Sun className="h-4 w-4" /> },
    { value: "dark", label: "Tối", icon: <Moon className="h-4 w-4" /> },
    { value: "system", label: "Hệ thống", icon: <Monitor className="h-4 w-4" /> },
  ];

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Đổi giao diện"
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-text hover:border-border-strong hover:bg-surface-2 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {resolvedTheme === "dark" ? (
          <Moon className="h-4 w-4 text-accent" />
        ) : (
          <Sun className="h-4 w-4 text-accent" />
        )}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-36 origin-top-right rounded-md border border-border bg-surface py-1 shadow-lg ring-1 ring-black/5 z-50 focus:outline-none"
        >
          {themes.map((t) => (
            <button
              key={t.value}
              type="button"
              role="menuitem"
              onClick={() => {
                setTheme(t.value);
                setIsOpen(false);
              }}
              className="flex w-full items-center justify-between px-3 py-2 text-sm text-text hover:bg-surface-2 transition-colors duration-fast"
            >
              <span className="flex items-center gap-2">
                {t.icon}
                {t.label}
              </span>
              {theme === t.value && (
                <Check className="h-4 w-4 text-accent" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
