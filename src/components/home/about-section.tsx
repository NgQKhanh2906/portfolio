import React from "react";
import Link from "next/link";
import {
  Calendar,
  FolderGit2,
  CheckCircle2,
  Github,
  ArrowRight,
} from "lucide-react";
import { profile } from "@/data/profile";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";

export function AboutSection() {
  const stats = [
    {
      icon: <Calendar className="h-5 w-5 text-accent" />,
      value: "4+",
      label: "Năm học tập CNTT",
      subtext: "Nền tảng kiến trúc phần mềm vững chắc",
    },
    {
      icon: <FolderGit2 className="h-5 w-5 text-accent" />,
      value: "10+",
      label: "Dự án hoàn thành",
      subtext: "Bao gồm 3 Case Studies kỹ thuật chuyên sâu",
    },
    {
      icon: <CheckCircle2 className="h-5 w-5 text-accent" />,
      value: "100%",
      label: "Chuẩn WCAG 2.1 AA",
      subtext: "Test coverage và hiệu năng tối ưu",
    },
    {
      icon: <Github className="h-5 w-5 text-accent" />,
      value: "300+",
      label: "GitHub Contributions",
      subtext: "Hoạt động đóng góp liên tục trên Git",
    },
  ];

  return (
    <section id="about" className="py-16 md:py-24 border-t border-border bg-surface/30">
      <Container>
        <SectionHeading
          monoLabel="01 / ABOUT"
          title="Đôi nét về mình"
          description="Tư duy phát triển phần mềm, học vấn và nguyên tắc kiến trúc hệ thống."
        />

        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Left Column: Bio Content */}
          <div className="lg:col-span-6 space-y-5">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-text">
              Đam mê tạo ra các giải pháp số tinh gọn và hiệu quả
            </h3>

            <div className="space-y-4 text-base text-muted leading-relaxed">
              {profile.about.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-2">
              <Link href="/projects">
                <Button
                  variant="secondary"
                  size="md"
                  iconRight={<ArrowRight className="h-4 w-4" />}
                  className="rounded-xl border-border hover:border-accent hover:text-accent transition-all duration-base"
                >
                  Khám phá các Case Study
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: 2x2 Stat Cards Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-surface p-6 card-interactive shadow-xs group"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 group-hover:bg-accent/20 transition-colors duration-fast mb-4">
                  {stat.icon}
                </div>
                <div className="font-mono text-3xl font-extrabold tracking-tight text-text group-hover:text-accent transition-colors">
                  {stat.value}
                </div>
                <div className="font-sans text-sm font-semibold text-text mt-1">
                  {stat.label}
                </div>
                <div className="text-xs text-muted mt-1 leading-normal">
                  {stat.subtext}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
