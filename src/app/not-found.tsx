import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-16">
      <Container size="narrow">
        <div className="text-center">
          <div className="font-mono text-sm font-semibold uppercase tracking-wider text-accent mb-3">
            404 / NOT FOUND
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
            Không tìm thấy trang
          </h1>
          <p className="mt-3 text-sm text-muted sm:text-base max-w-md mx-auto">
            Đường dẫn bạn yêu cầu không tồn tại hoặc đã được di chuyển. Bạn có thể sử dụng phím tắt{" "}
            <Kbd>Ctrl K</Kbd> để mở bảng lệnh hoặc quay về trang chủ.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/">
              <Button iconLeft={<Home className="h-4 w-4" />}>
                Về trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
