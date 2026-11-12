"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FolderSearch } from "lucide-react";
import { type ProjectFrontmatter } from "@/lib/validations/project-frontmatter";
import { ProjectCard } from "./project-card";
import { ProjectFilter } from "./project-filter";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export interface ProjectGridProps {
  initialProjects: ProjectFrontmatter[];
}

export function ProjectGrid({ initialProjects }: ProjectGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract all unique technologies from published projects
  const availableTechs = useMemo(() => {
    const set = new Set<string>();
    for (const p of initialProjects) {
      for (const t of p.tech) {
        set.add(t);
      }
    }
    return Array.from(set).sort();
  }, [initialProjects]);

  // Read selected technologies from URL search params
  const [selectedTechs, setSelectedTechs] = useState<string[]>(() => {
    const techParam = searchParams.get("tech");
    if (!techParam) return [];
    return techParam
      .split(",")
      .map((t) => t.trim())
      .filter((t) => availableTechs.includes(t));
  });

  // Sync state when URL search params change externally
  useEffect(() => {
    const techParam = searchParams.get("tech");
    if (!techParam) {
      setSelectedTechs([]);
      return;
    }
    const fromUrl = techParam
      .split(",")
      .map((t) => t.trim())
      .filter((t) => availableTechs.includes(t));
    setSelectedTechs(fromUrl);
  }, [searchParams, availableTechs]);

  // Update URL search params
  const updateUrl = useCallback(
    (newTechs: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newTechs.length > 0) {
        params.set("tech", newTechs.join(","));
      } else {
        params.delete("tech");
      }
      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(targetUrl, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  // Toggle tech selection
  const handleToggleTech = (slug: string) => {
    const nextTechs = selectedTechs.includes(slug)
      ? selectedTechs.filter((t) => t !== slug)
      : [...selectedTechs, slug];

    setSelectedTechs(nextTechs);
    updateUrl(nextTechs);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedTechs([]);
    updateUrl([]);
  };

  // Filter projects by AND logic (project must contain all selected technologies)
  const filteredProjects = useMemo(() => {
    if (selectedTechs.length === 0) return initialProjects;
    return initialProjects.filter((project) =>
      selectedTechs.every((tech) => project.tech.includes(tech)),
    );
  }, [initialProjects, selectedTechs]);

  return (
    <div className="flex flex-col">
      {/* Filter Bar */}
      <ProjectFilter
        availableTechs={availableTechs}
        selectedTechs={selectedTechs}
        onToggleTech={handleToggleTech}
        onClear={handleClearFilters}
        totalCount={initialProjects.length}
        filteredCount={filteredProjects.length}
      />

      {/* Projects Grid or Empty State */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={<FolderSearch className="h-6 w-6" />}
          title="Không tìm thấy dự án phù hợp"
          description="Không có dự án nào sử dụng đồng thời toàn bộ các công nghệ bạn đã chọn trong bộ lọc."
          action={
            <Button variant="secondary" size="sm" onClick={handleClearFilters}>
              Xóa bộ lọc để xem tất cả
            </Button>
          }
          className="my-8 py-16"
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
