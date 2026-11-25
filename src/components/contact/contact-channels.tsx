"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  FolderGit2,
  Github,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/data/site-config";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export function ContactChannels() {
  const { isCopied, copy } = useCopyToClipboard(2000);

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6">
        {siteConfig.openToWork && (
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="accent">
              <span className="h-1.5 w-1.5 shrink-0 aspect-square rounded-full bg-accent animate-pulse" />
              <span>{siteConfig.openToWorkLabel}</span>
            </Badge>
          </div>
        )}

        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
          02 / DIRECT_CHANNELS
        </p>
        <h3 className="mt-1 text-base font-bold text-text">Kênh liên hệ trực tiếp</h3>
        <p className="mt-1 text-sm text-muted leading-relaxed">
          Bạn có thể gửi email trực tiếp hoặc tải CV để xem chi tiết kinh nghiệm và dự án.
        </p>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface-2/50 p-3.5 transition-colors hover:border-accent">
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-3 min-w-0 flex-1 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-md"
            >
              <span className="flex h-10 w-10 shrink-0 aspect-square items-center justify-center rounded-lg bg-accent/15 text-accent border border-accent/30">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-mono text-muted uppercase tracking-wider">Email</p>
                <p className="text-sm font-mono font-semibold text-text truncate group-hover:text-accent transition-colors">
                  {siteConfig.email}
                </p>
              </div>
            </a>

            <button
              type="button"
              onClick={() => void copy(siteConfig.email)}
              aria-label={isCopied ? "Đã sao chép địa chỉ email" : "Sao chép địa chỉ email"}
              className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 text-xs font-mono text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              {isCopied ? (
                <>
                  <Check className="h-4 w-4 text-status-success" aria-hidden="true" />
                  <span className="text-status-success">Đã chép</span>
                </>
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-2/30 p-3.5">
            <span className="flex h-10 w-10 shrink-0 aspect-square items-center justify-center rounded-lg bg-surface-2 text-muted border border-border">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-mono text-muted uppercase tracking-wider">Khu vực</p>
              <p className="text-sm font-medium text-text">
                {siteConfig.location} ({siteConfig.timezone})
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <a
            href={siteConfig.resumePath}
            download={siteConfig.resumeFileName}
            className="block"
          >
            <Button
              variant="secondary"
              className="w-full min-h-[44px]"
              iconLeft={<Download className="h-4 w-4" aria-hidden="true" />}
            >
              Tải CV (PDF)
            </Button>
          </a>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-base font-bold text-text mb-2">Mạng xã hội &amp; Mã nguồn</h3>
        <p className="text-sm text-muted mb-4">
          Theo dõi các dự án cá nhân và hồ sơ chuyên môn của mình tại:
        </p>
        <div className="space-y-3">
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-[44px] items-center justify-between rounded-lg border border-border bg-surface-2/40 px-4 py-3 text-sm font-medium text-text hover:border-accent hover:text-accent transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <Github className="h-4 w-4 text-accent" aria-hidden="true" />
              <span>GitHub (@{siteConfig.githubUsername})</span>
            </span>
            <ArrowUpRight className="h-4 w-4 text-muted" aria-hidden="true" />
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-[44px] items-center justify-between rounded-lg border border-border bg-surface-2/40 px-4 py-3 text-sm font-medium text-text hover:border-accent hover:text-accent transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <Linkedin className="h-4 w-4 text-accent" aria-hidden="true" />
              <span>LinkedIn ({siteConfig.name})</span>
            </span>
            <ArrowUpRight className="h-4 w-4 text-muted" aria-hidden="true" />
          </a>
        </div>
      </Card>

      <Card className="p-6 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-base font-bold text-text mb-2">
            Dự án &amp; Case Study Kỹ thuật
          </h3>
          <p className="text-sm text-muted leading-relaxed mb-4">
            Khám phá chi tiết kiến trúc hệ thống, thiết kế cơ sở dữ liệu và các quyết định kỹ thuật trong những dự án thực tế của mình.
          </p>
        </div>
        <Link href="/projects">
          <Button
            variant="secondary"
            className="w-full min-h-[44px]"
            iconLeft={<FolderGit2 className="h-4 w-4" aria-hidden="true" />}
          >
            Xem các Dự án tiêu biểu
          </Button>
        </Link>
      </Card>
    </div>
  );
}
