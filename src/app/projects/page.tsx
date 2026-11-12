import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getAllProjects } from "@/lib/mdx";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { ProjectGrid } from "@/components/projects/project-grid";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Dự án tiêu biểu & Case Studies",
  description:
    "Danh sách các dự án kỹ thuật phần mềm, ứng dụng full-stack và công cụ phát triển do Nguyễn Quốc Khánh xây dựng.",
  openGraph: {
    title: "Dự án tiêu biểu & Case Studies | Nguyễn Quốc Khánh",
    description:
      "Danh sách các dự án kỹ thuật phần mềm, ứng dụng full-stack và công cụ phát triển do Nguyễn Quốc Khánh xây dựng.",
  },
};

export default async function ProjectsPage() {
  const rawProjects = await getAllProjects();
  const projects = rawProjects.map((p) => p.frontmatter);

  return (
    <div className="py-12 md:py-20">
      <Container>
        <SectionHeading
          monoLabel="01 / PROJECTS"
          title="Dự án kỹ thuật & Case Studies"
          description="Các sản phẩm phần mềm có phân tích kiến trúc, trade-off giải pháp và số liệu đo lường thực tế."
        />

        <Suspense
          fallback={
            <div className="space-y-6">
              <Skeleton className="h-28 w-full" />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-80 w-full" />
                <Skeleton className="h-80 w-full" />
                <Skeleton className="h-80 w-full" />
              </div>
            </div>
          }
        >
          <ProjectGrid initialProjects={projects} />
        </Suspense>
      </Container>
    </div>
  );
}
