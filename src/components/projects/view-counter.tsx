"use client";

import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface ViewCounterProps {
  slug: string;
  className?: string;
}

export function ViewCounter({ slug, className }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function recordView() {
      try {
        setLoading(true);
        const res = await fetch(`/api/views/${slug}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const data = (await res.json()) as { views: number | null };
          if (isMounted) {
            setViews(data.views);
          }
        }
      } catch {
        if (isMounted) {
          setViews(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    recordView();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return <Skeleton className="h-4 w-24 rounded" />;
  }

  // Nếu Redis bị lỗi hoặc trả về null, ẩn phần tử mà không làm sập giao diện (FR-05-04)
  if (views === null) {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-xs text-muted",
        className,
      )}
      aria-label={`${views} lượt xem`}
    >
      <Eye className="h-3.5 w-3.5 text-accent shrink-0" />
      <span>{new Intl.NumberFormat("vi-VN").format(views)} lượt xem</span>
    </span>
  );
}
