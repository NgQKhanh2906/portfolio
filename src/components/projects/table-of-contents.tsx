"use client";

import React, { useState, useEffect } from "react";
import { List, ChevronDown } from "lucide-react";
import { type TocItem } from "@/lib/mdx";
import { cn } from "@/lib/utils";

export interface TableOfContentsProps {
  toc: TocItem[];
  className?: string;
}

export function TableOfContents({ toc, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  useEffect(() => {
    if (toc.length === 0) return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: "-80px 0% -60% 0%",
        threshold: 0.1,
      },
    );

    for (const item of toc) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [toc]);

  if (!toc || toc.length === 0) return null;

  return (
    <>
      {/* Mobile Collapsible TOC (< 1280px) */}
      <div className="xl:hidden my-6 rounded-lg border border-border bg-surface p-4">
        <button
          type="button"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="flex w-full items-center justify-between font-mono text-xs font-semibold text-text uppercase tracking-wider"
          aria-expanded={isOpenMobile}
        >
          <span className="flex items-center gap-2">
            <List className="h-4 w-4 text-accent" />
            Mục lục bài viết ({toc.length})
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted transition-transform duration-fast",
              isOpenMobile && "rotate-180",
            )}
          />
        </button>

        {isOpenMobile && (
          <nav className="mt-4 pt-3 border-t border-border/60">
            <ul className="space-y-1.5 text-xs">
              {toc.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <li
                    key={item.id}
                    className={cn(item.level === 3 ? "pl-3 text-[11px]" : "font-medium")}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={() => setIsOpenMobile(false)}
                      className={cn(
                        "block py-1 transition-colors hover:text-accent",
                        isActive
                          ? "text-accent font-semibold"
                          : "text-muted",
                      )}
                    >
                      {item.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>

      {/* Desktop Sticky TOC (>= 1280px) */}
      <nav
        aria-label="Mục lục bài viết"
        className={cn(
          "hidden xl:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 scrollbar-thin",
          className,
        )}
      >
        <div className="flex items-center gap-2 mb-4 font-mono text-xs font-semibold text-text uppercase tracking-wider border-b border-border/80 pb-2">
          <List className="h-3.5 w-3.5 text-accent" />
          Mục lục
        </div>

        <ul className="space-y-1 border-l border-border pl-3 text-xs">
          {toc.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li
                key={item.id}
                className={cn(
                  "relative transition-all",
                  item.level === 3 ? "pl-3 text-[11px]" : "",
                )}
              >
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "block py-1 leading-snug transition-colors hover:text-accent",
                    isActive
                      ? "text-accent font-semibold -ml-[13px] border-l-2 border-accent pl-2.5"
                      : "text-muted",
                  )}
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
