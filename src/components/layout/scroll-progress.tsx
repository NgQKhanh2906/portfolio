"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowUp, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const calculateProgress = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) {
      setProgress(0);
      setIsVisible(false);
      return;
    }
    const currentProgress = Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100)));
    setProgress(currentProgress);
    setIsVisible(scrollTop > 120);
  }, []);

  useEffect(() => {
    calculateProgress();
    window.addEventListener("scroll", calculateProgress, { passive: true });
    window.addEventListener("resize", calculateProgress, { passive: true });
    return () => {
      window.removeEventListener("scroll", calculateProgress);
      window.removeEventListener("resize", calculateProgress);
    };
  }, [calculateProgress]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isCompleted = progress >= 99;

  return (
    <>
      {/* 1. Top Linear Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-[3px] z-50 pointer-events-none bg-transparent"
        aria-hidden="true"
      >
        <div
          className="h-full bg-accent transition-all duration-75 ease-out shadow-[0_0_8px_var(--color-accent)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 2. Floating Circular Progress & Scroll-to-Top Widget */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-40 transition-all duration-base",
          isVisible
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-4 opacity-0 pointer-events-none",
        )}
      >
        <button
          type="button"
          onClick={scrollToTop}
          aria-label={`Tiến độ đọc ${progress}%. Bấm để cuộn lên đầu trang.`}
          title={`Tiến độ trang: ${progress}% - Bấm để cuộn lên đầu`}
          className="group relative flex items-center gap-2 rounded-full border border-border bg-surface/90 backdrop-blur-md px-3 py-1.5 shadow-lg hover:border-accent hover:shadow-accent/20 transition-all duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
        >
          {/* Circular SVG Mini Progress Ring */}
          <div className="relative flex h-5 w-5 items-center justify-center">
            <svg className="h-5 w-5 -rotate-90 transform" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-border"
                fill="none"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray={56.5}
                strokeDashoffset={56.5 - (56.5 * progress) / 100}
                className="text-accent transition-all duration-100 ease-out"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {isCompleted ? (
                <Check className="h-2.5 w-2.5 text-accent stroke-[3]" />
              ) : (
                <ArrowUp className="h-2.5 w-2.5 text-muted group-hover:text-accent transition-colors" />
              )}
            </div>
          </div>

          {/* Text Percentage Indicator */}
          <span className="font-mono text-xs font-semibold text-text group-hover:text-accent transition-colors">
            {progress}%
          </span>
        </button>
      </div>
    </>
  );
}
