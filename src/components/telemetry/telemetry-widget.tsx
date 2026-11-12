"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Github,
  GitPullRequest,
  BookMarked,
  Users,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { type GitHubTelemetryData } from "@/lib/github";
import { siteConfig } from "@/data/site-config";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GitHubActivityList } from "./github-activity-list";
import { DeployInfo } from "./deploy-info";

export function TelemetryWidget() {
  const [data, setData] = useState<GitHubTelemetryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchTelemetry() {
      try {
        setLoading(true);
        const res = await fetch("/api/telemetry");
        if (!res.ok) throw new Error("Network response was not ok");
        const json = (await res.json()) as GitHubTelemetryData;
        if (isMounted) {
          setData(json);
          setError(false);
        }
      } catch {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchTelemetry();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Card className="p-6">
      {/* Top Bar: Stats & Live Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-text">
              GitHub & System Telemetry
            </h3>
            {data?.isFallback ? (
              <Badge variant="warning" className="text-[10px] py-0.5">
                Chế độ Offline / Fallback
              </Badge>
            ) : (
              <Badge variant="accent" className="text-[10px] py-0.5">
                <span className="relative flex h-1.5 w-1.5 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
                </span>
                Đồng bộ GitHub API
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted">
            Dữ liệu hoạt động công khai được cache tự động theo chu kỳ 3600 giây (ISR).
          </p>
        </div>

        {/* Quick Numbers */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2/60 px-2.5 py-1 text-xs">
            <BookMarked className="h-3.5 w-3.5 text-accent" />
            <span className="font-mono font-bold text-text">
              {loading ? "--" : data?.publicRepos ?? 14}
            </span>
            <span className="text-muted text-[11px]">repos</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2/60 px-2.5 py-1 text-xs">
            <GitPullRequest className="h-3.5 w-3.5 text-accent" />
            <span className="font-mono font-bold text-text">
              {loading ? "--" : data?.totalContributions ?? 348}
            </span>
            <span className="text-muted text-[11px]">contribs</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2/60 px-2.5 py-1 text-xs">
            <Users className="h-3.5 w-3.5 text-accent" />
            <span className="font-mono font-bold text-text">
              {loading ? "--" : data?.followers ?? 8}
            </span>
            <span className="text-muted text-[11px]">followers</span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-3 space-y-3">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
          <div className="md:col-span-2">
            <Skeleton className="h-44 w-full" />
          </div>
        </div>
      ) : error && !data ? (
        <div className="py-8 text-center text-sm text-muted">
          <p>Không thể kết nối đến GitHub API vào lúc này.</p>
          <Link
            href={siteConfig.social.github}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs text-accent hover:underline"
          >
            Xem hoạt động trực tiếp tại GitHub
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-5 items-start">
          {/* Left: GitHub Activity (3 cols) */}
          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-semibold text-muted uppercase tracking-wider">
                Hoạt động gần nhất
              </span>
              <span className="font-mono text-[11px] text-muted flex items-center gap-1">
                <RefreshCw className="h-3 w-3" />
                Mỗi giờ một lần
              </span>
            </div>
            <GitHubActivityList events={data?.recentEvents ?? []} />
          </div>

          {/* Right: Deploy Info (2 cols) */}
          <div className="md:col-span-2">
            <div className="mb-3">
              <span className="font-mono text-xs font-semibold text-muted uppercase tracking-wider">
                Trạng thái hệ thống
              </span>
            </div>
            <DeployInfo />
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <span className="text-xs text-muted font-mono">
          Cập nhật lúc:{" "}
          {data?.updatedAt
            ? new Date(data.updatedAt).toLocaleTimeString("vi-VN")
            : "Vừa xong"}
        </span>
        <Link
          href={siteConfig.social.github}
          target="_blank"
          rel="noreferrer"
        >
          <Button
            variant="secondary"
            size="sm"
            iconLeft={<Github className="h-3.5 w-3.5" />}
            iconRight={<ExternalLink className="h-3.5 w-3.5" />}
          >
            Trang cá nhân GitHub
          </Button>
        </Link>
      </div>
    </Card>
  );
}
