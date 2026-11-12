import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, Calendar, User, Users, Clock } from "lucide-react";
import { type ProjectFrontmatter } from "@/lib/validations/project-frontmatter";
import { Button } from "@/components/ui/button";
import { TechBadge } from "./tech-badge";

export interface ProjectHeaderProps {
  project: ProjectFrontmatter;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <header className="border-b border-border pb-10 mb-10">
      {/* Back button */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text font-mono mb-6 transition-colors group"
      >
        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <span>Quay lại tất cả dự án</span>
      </Link>

      {/* Monospace section indicator */}
      <div className="font-mono text-xs font-semibold uppercase tracking-wider text-accent mb-2">
        CASE STUDY / {project.year}
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text mb-4 text-balance">
        {project.title}
      </h1>

      {/* Summary */}
      <p className="text-base sm:text-lg text-muted max-w-3xl leading-relaxed mb-8 text-pretty">
        {project.summary}
      </p>

      {/* Meta Specifications Box */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-lg border border-border bg-surface p-4 mb-6">
        <div className="flex items-start gap-2.5">
          <Calendar className="h-4 w-4 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="block text-[11px] font-mono text-muted uppercase">Năm</span>
            <span className="font-mono text-xs font-semibold text-text">{project.year}</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <User className="h-4 w-4 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="block text-[11px] font-mono text-muted uppercase">Vai trò</span>
            <span className="text-xs font-semibold text-text truncate block">{project.role}</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Users className="h-4 w-4 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="block text-[11px] font-mono text-muted uppercase">Quy mô</span>
            <span className="text-xs font-semibold text-text">{project.teamSize}</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Clock className="h-4 w-4 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="block text-[11px] font-mono text-muted uppercase">Thời gian</span>
            <span className="font-mono text-xs font-semibold text-text">{project.period}</span>
          </div>
        </div>
      </div>

      {/* Technologies & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono text-muted mr-1">Stack:</span>
          {project.tech.map((slug) => (
            <TechBadge key={slug} slug={slug} />
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {project.links?.source && (
            <Link
              href={project.links.source}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                variant="secondary"
                size="sm"
                iconLeft={<Github className="h-3.5 w-3.5" />}
              >
                Mã nguồn
              </Button>
            </Link>
          )}

          {project.links?.demo && (
            <Link
              href={project.links.demo}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                size="sm"
                iconRight={<ExternalLink className="h-3.5 w-3.5" />}
              >
                Trải nghiệm
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
