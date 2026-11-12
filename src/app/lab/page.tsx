import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { LabShell } from "@/components/lab/lab-shell";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Component Lab | Phòng thí nghiệm UI Tương tác",
  description:
    "Không gian thử nghiệm và kiểm chứng trực tiếp các Primitive UI Components viết tay theo chuẩn WAI-ARIA và WCAG 2.1 AA.",
};

function LabFallback() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-3 space-y-3">
        <Skeleton className="h-40 w-full" />
      </div>
      <div className="lg:col-span-9 space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

export default function LabPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        <SectionHeading
          monoLabel="02 / COMPONENT LAB"
          title="Phòng thí nghiệm UI Tương tác"
          description="Tùy biến trực tiếp các thuộc tính của UI Components viết tay, kiểm tra hành vi tương tác bàn phím và sao chép mã nguồn JSX nhanh chóng."
          className="mb-10"
        />

        <Suspense fallback={<LabFallback />}>
          <LabShell />
        </Suspense>
      </Container>
    </div>
  );
}
