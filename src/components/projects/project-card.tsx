import React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { type ProjectFrontmatter } from "@/lib/validations/project-frontmatter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TechBadge } from "./tech-badge";

export interface ProjectCardProps {
  project: ProjectFrontmatter;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const maxVisibleTech = 4;
  const visibleTech = project.tech.slice(0, maxVisibleTech);
  const remainingCount = project.tech.length - maxVisibleTech;

  return (
    <Card interactive className="flex flex-col justify-between h-full p-5">
      <div>
        {/* Aspect Ratio 16:9 Cover Box */}
        <div className="aspect-video w-full rounded-md bg-surface-2 border border-border flex items-center justify-center font-mono text-xs text-muted mb-4 relative overflow-hidden group">
          <span className="text-muted/80">16:9 Cover Image</span>
          {project.featured && (
            <span className="absolute top-2.5 right-2.5">
              <Badge variant="accent" className="text-[10px] py-0.5">
                Tiêu biểu
              </Badge>
            </span>
          )}
        </div>

        {/* Metadata Bar */}
        <div className="flex items-center justify-between mb-2">
          <Badge variant="accent" className="font-mono text-xs">
            {project.year}
          </Badge>
          <span className="font-mono text-xs text-muted">
            {project.role}
          </span>
        </div>

        {/* Project Title */}
        <h3 className="text-lg font-bold text-text tracking-tight mb-2 group-hover:text-accent transition-colors">
          <Link href={`/projects/${project.slug}`} className="hover:underline">
            {project.title}
          </Link>
        </h3>

        {/* Summary Description (2 lines clamp) */}
        <p className="text-sm text-muted line-clamp-2 mb-4 leading-relaxed">
          {project.summary}
        </p>
      </div>

      <div>
        {/* Tech Badges List */}
        <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-border">
          {visibleTech.map((slug) => (
            <TechBadge key={slug} slug={slug} />
          ))}
          {remainingCount > 0 && (
            <Badge variant="neutral" className="font-mono text-[11px] px-2 py-0.5">
              +{remainingCount}
            </Badge>
          )}
        </div>

        {/* Links Footer */}
        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
          <Link
            href={`/projects/${project.slug}`}
            className="font-medium text-accent hover:underline flex items-center gap-1"
          >
            Chi tiết Case Study
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <div className="flex items-center gap-2">
            {project.links?.source && (
              <Link
                href={project.links.source}
                target="_blank"
                rel="noreferrer"
                aria-label={`Mã nguồn dự án ${project.title} trên GitHub`}
                className="text-muted hover:text-text transition-colors p-1"
              >
                <Github className="h-4 w-4" />
              </Link>
            )}
            {project.links?.demo && (
              <Link
                href={project.links.demo}
                target="_blank"
                rel="noreferrer"
                aria-label={`Trải nghiệm dự án ${project.title}`}
                className="text-muted hover:text-text transition-colors p-1"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
