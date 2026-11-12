"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log to monitoring service
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-16">
      <Container size="narrow">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-status-danger-soft text-status-danger">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="font-mono text-xs font-semibold uppercase tracking-wider text-status-danger mb-2">
            500 / RUNTIME ERROR
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Đã có lỗi xảy ra
          </h1>
          <p className="mt-2 text-sm text-muted max-w-md mx-auto">
            Hệ thống gặp sự cố không mong muốn trong khi xử lý yêu cầu. Bạn có thể thử tải lại hoặc quay về trang chủ.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              onClick={() => reset()}
              iconLeft={<RotateCcw className="h-4 w-4" />}
            >
              Thử lại
            </Button>
            <Link href="/">
              <Button variant="secondary" iconLeft={<Home className="h-4 w-4" />}>
                Về trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
