import React from "react";
import Link from "next/link";
import { GitCommit, ExternalLink, GitBranch } from "lucide-react";
import { type GitHubEventItem } from "@/lib/github";

export interface GitHubActivityListProps {
  events: GitHubEventItem[];
}

export function GitHubActivityList({ events }: GitHubActivityListProps) {
  if (!events || events.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-muted font-mono">
        Không có hoạt động commit nào gần đây.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {events.map((event) => {
        const isPush = event.type === "PushEvent";
        const dateStr = new Date(event.createdAt).toLocaleDateString("vi-VN", {
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <li
            key={event.id}
            className="flex items-start justify-between gap-3 rounded-md border border-border/60 bg-surface p-3 transition-colors hover:border-border-strong hover:bg-surface-2/60"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="mt-0.5 rounded bg-surface-2 p-1 text-accent shrink-0">
                {isPush ? (
                  <GitCommit className="h-3.5 w-3.5" />
                ) : (
                  <GitBranch className="h-3.5 w-3.5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-xs font-bold text-accent">
                    {event.repoName}
                  </span>
                  <span className="font-mono text-[10px] text-muted">
                    {dateStr}
                  </span>
                </div>
                <p className="text-xs text-text truncate" title={event.message}>
                  {event.message}
                </p>
              </div>
            </div>

            <Link
              href={event.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Xem repository ${event.repoName} trên GitHub`}
              className="text-muted hover:text-accent p-1 shrink-0 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
