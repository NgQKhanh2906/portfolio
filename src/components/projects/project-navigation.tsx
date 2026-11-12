import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface ProjectNavTarget {
  slug: string;
  title: string;
}

export interface ProjectNavigationProps {
  prevProject?: ProjectNavTarget | null;
  nextProject?: ProjectNavTarget | null;
}

export function ProjectNavigation({
  prevProject,
  nextProject,
}: ProjectNavigationProps) {
  if (!prevProject && !nextProject) return null;

  return (
    <nav
      aria-label="Điều hướng các dự án khác"
      className="mt-16 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {/* Previous Project */}
      {prevProject ? (
        <Link href={`/projects/${prevProject.slug}`} className="group">
          <Card interactive className="p-4 h-full flex flex-col justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-muted uppercase tracking-wider mb-1">
              <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
              Dự án trước
            </span>
            <span className="text-sm font-semibold text-text group-hover:text-accent transition-colors truncate block">
              {prevProject.title}
            </span>
          </Card>
        </Link>
      ) : (
        <div />
      )}

      {/* Next Project */}
      {nextProject ? (
        <Link href={`/projects/${nextProject.slug}`} className="group">
          <Card interactive className="p-4 h-full flex flex-col justify-between text-right">
            <span className="flex items-center justify-end gap-1.5 text-[11px] font-mono text-muted uppercase tracking-wider mb-1">
              Dự án sau
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-sm font-semibold text-text group-hover:text-accent transition-colors truncate block">
              {nextProject.title}
            </span>
          </Card>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
