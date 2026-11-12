import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function FeaturedProjects() {
  return (
    <section id="projects" className="py-16 md:py-24 border-t border-border bg-surface/30">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 md:mb-12">
          <SectionHeading
            monoLabel="03 / PROJECTS"
            title="Dự án tiêu biểu"
            description="Các sản phẩm phần mềm có kiến trúc, mã nguồn và đo lường thực tế."
            className="mb-0"
          />
          <Link href="/projects" className="mt-4 sm:mt-0">
            <Button variant="ghost" size="sm" iconRight={<ArrowRight className="h-4 w-4" />}>
              Xem tất cả dự án
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Portfolio Case Study Card */}
          <Card interactive className="flex flex-col justify-between">
            <div>
              <div className="h-44 w-full rounded-md bg-surface-2 flex items-center justify-center font-mono text-xs text-muted mb-4 border border-border">
                16:9 Cover Image
              </div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="accent">2026</Badge>
                <span className="text-xs font-mono text-muted">Full-stack</span>
              </div>
              <h3 className="text-lg font-bold text-text mb-2">
                Portfolio Web Application
              </h3>
              <p className="text-sm text-muted line-clamp-2">
                Portfolio full-stack có database PostgreSQL, xác thực GitHub OAuth, rate limit và đo lường hiệu năng.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="neutral">Next.js</Badge>
                <Badge variant="neutral">Drizzle</Badge>
                <Badge variant="neutral">PostgreSQL</Badge>
              </div>
              <Link
                href="/projects/portfolio"
                className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
              >
                Chi tiết
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </Card>

          {/* TaskFlow Card Placeholder */}
          <Card interactive className="flex flex-col justify-between">
            <div>
              <div className="h-44 w-full rounded-md bg-surface-2 flex items-center justify-center font-mono text-xs text-muted mb-4 border border-border">
                16:9 Cover Image
              </div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="neutral">2025</Badge>
                <span className="text-xs font-mono text-muted">Web App</span>
              </div>
              <h3 className="text-lg font-bold text-text mb-2">
                TaskFlow - Kanban Board
              </h3>
              <p className="text-sm text-muted line-clamp-2">
                Ứng dụng quản lý công việc kéo thả theo thời gian thực với phân quyền thành viên và thông báo tự động.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="neutral">React</Badge>
                <Badge variant="neutral">Prisma</Badge>
              </div>
              <Link
                href="/projects"
                className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
              >
                Chi tiết
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </Card>

          {/* ShopLite Card Placeholder */}
          <Card interactive className="flex flex-col justify-between">
            <div>
              <div className="h-44 w-full rounded-md bg-surface-2 flex items-center justify-center font-mono text-xs text-muted mb-4 border border-border">
                16:9 Cover Image
              </div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="neutral">2025</Badge>
                <span className="text-xs font-mono text-muted">E-commerce</span>
              </div>
              <h3 className="text-lg font-bold text-text mb-2">
                ShopLite - Micro Storefront
              </h3>
              <p className="text-sm text-muted line-clamp-2">
                Cửa hàng trực tuyến tối giản với luồng thanh toán và quản lý đơn hàng backend bằng Node.js & Express.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="neutral">TypeScript</Badge>
                <Badge variant="neutral">Express</Badge>
              </div>
              <Link
                href="/projects"
                className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
              >
                Chi tiết
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
