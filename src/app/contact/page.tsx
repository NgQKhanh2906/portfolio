import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Github, Linkedin, Download, FolderGit2, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/site-config";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Kết nối và trao đổi cơ hội thực tập, hợp tác phát triển Web & Backend với Nguyễn Quốc Khánh.",
};

export default function ContactPage() {
  return (
    <section className="py-12 md:py-20">
      <Container>
        <SectionHeading
          monoLabel="05 / CONTACT"
          title="Liên hệ & Kết nối"
          description="Mình luôn sẵn sàng trao đổi về cơ hội thực tập Backend / Web Developer, các dự án mã nguồn mở hoặc thảo luận kỹ thuật."
        />

        <div className="mt-8 grid gap-6 md:grid-cols-12">
          {/* Primary Contact Info */}
          <Card className="md:col-span-7 flex flex-col justify-between p-6 sm:p-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="accent">
                  <span className="h-1.5 w-1.5 shrink-0 aspect-square rounded-full bg-accent animate-pulse" />
                  <span>{siteConfig.openToWorkLabel}</span>
                </Badge>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-text tracking-tight mb-3">
                Gửi tin nhắn trực tiếp
              </h2>
              <p className="text-sm sm:text-base text-muted leading-relaxed mb-6">
                Cách nhanh nhất để liên hệ với mình là qua email cá nhân hoặc kết nối trên LinkedIn và GitHub. Mình thường phản hồi trong vòng 24 giờ.
              </p>

              <div className="space-y-4">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface-2/50 p-4 transition-colors hover:border-accent group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-10 w-10 shrink-0 aspect-square items-center justify-center rounded-lg bg-accent/15 text-accent border border-accent/30">
                      <Mail className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-mono text-muted uppercase tracking-wider">Email</p>
                      <p className="text-sm sm:text-base font-mono font-semibold text-text truncate group-hover:text-accent transition-colors">
                        {siteConfig.email}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted group-hover:text-accent transition-colors" />
                </a>

                <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-2/30 p-4">
                  <span className="flex h-10 w-10 shrink-0 aspect-square items-center justify-center rounded-lg bg-surface-2 text-muted border border-border">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-mono text-muted uppercase tracking-wider">Khu vực</p>
                    <p className="text-sm sm:text-base font-medium text-text">
                      {siteConfig.location} ({siteConfig.timezone})
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center gap-3">
              <a href={`mailto:${siteConfig.email}`}>
                <Button iconLeft={<Mail className="h-4 w-4" />}>
                  Soạn Email ngay
                </Button>
              </a>
              <a href={siteConfig.resumePath} download={siteConfig.resumeFileName}>
                <Button variant="secondary" iconLeft={<Download className="h-4 w-4" />}>
                  Tải CV (PDF)
                </Button>
              </a>
            </div>
          </Card>

          {/* Social & Case Studies Channels */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <Card className="p-6">
              <h3 className="text-base font-bold text-text mb-2">Mạng xã hội & Mã nguồn</h3>
              <p className="text-sm text-muted mb-4">
                Theo dõi các dự án cá nhân và hồ sơ chuyên môn của mình tại:
              </p>
              <div className="space-y-3">
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-lg border border-border bg-surface-2/40 px-4 py-3 text-sm font-medium text-text hover:border-accent hover:text-accent transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Github className="h-4 w-4 text-accent" />
                    <span>GitHub (@{siteConfig.githubUsername})</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted" />
                </a>
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-lg border border-border bg-surface-2/40 px-4 py-3 text-sm font-medium text-text hover:border-accent hover:text-accent transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Linkedin className="h-4 w-4 text-accent" />
                    <span>LinkedIn ({siteConfig.name})</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted" />
                </a>
              </div>
            </Card>

            <Card className="p-6 flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-base font-bold text-text mb-2">Dự án & Case Study Kỹ thuật</h3>
                <p className="text-sm text-muted leading-relaxed mb-4">
                  Khám phá chi tiết kiến trúc hệ thống, thiết kế cơ sở dữ liệu và các quyết định kỹ thuật trong những dự án thực tế của mình.
                </p>
              </div>
              <Link href="/projects">
                <Button variant="secondary" className="w-full" iconLeft={<FolderGit2 className="h-4 w-4" />}>
                  Xem các Dự án tiêu biểu
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}
