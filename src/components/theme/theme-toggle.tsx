"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? "Chuyển sang giao diện Sáng" : "Chuyển sang giao diện Tối"}
      title={isDark ? "Chuyển sang giao diện Sáng" : "Chuyển sang giao diện Tối"}
      className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-text hover:border-accent hover:text-accent hover:bg-surface-2 transition-all duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
    >
      <Sun
        className={`h-4 w-4 transition-all duration-base ${
          isDark
            ? "rotate-0 scale-100 text-accent"
            : "-rotate-90 scale-0 opacity-0 absolute"
        }`}
      />
      <Moon
        className={`h-4 w-4 transition-all duration-base ${
          !isDark
            ? "rotate-0 scale-100 text-accent"
            : "rotate-90 scale-0 opacity-0 absolute"
        }`}
      />
    </button>
  );
}
