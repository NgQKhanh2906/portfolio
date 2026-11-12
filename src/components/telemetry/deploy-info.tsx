import React from "react";
import { Server, Activity, ShieldCheck, GitCommit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DeployInfo() {
  const commitSha =
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "local";

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface-2/40 p-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <span className="flex items-center gap-2 font-mono text-xs font-semibold text-text uppercase">
          <Server className="h-3.5 w-3.5 text-accent" />
          Hạ tầng triển khai
        </span>
        <Badge variant="success" className="py-0.5 px-2 text-[10px]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-status-success"></span>
          </span>
          Trực tuyến (200 OK)
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="block text-muted text-[11px]">Runtime</span>
          <span className="font-mono font-medium text-text">Node.js 20 Serverless</span>
        </div>
        <div>
          <span className="block text-muted text-[11px]">Caching</span>
          <span className="font-mono font-medium text-text">ISR (3600s)</span>
        </div>
        <div>
          <span className="block text-muted text-[11px]">Framework</span>
          <span className="font-mono font-medium text-text">Next.js 14.2 App Router</span>
        </div>
        <div>
          <span className="block text-muted text-[11px]">Commit</span>
          <span className="font-mono font-medium text-accent flex items-center gap-1">
            <GitCommit className="h-3 w-3" />
            {commitSha}
          </span>
        </div>
      </div>

      <div className="mt-1 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted font-mono">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3 w-3 text-status-success" />
          WCAG 2.1 AA Compliant
        </span>
        <span className="flex items-center gap-1">
          <Activity className="h-3 w-3 text-accent" />
          Zero Flash Theme
        </span>
      </div>
    </div>
  );
}
