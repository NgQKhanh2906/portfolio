"use client";

import React from "react";
import { X, Filter } from "lucide-react";
import { TechBadge } from "./tech-badge";
import { Button } from "@/components/ui/button";

export interface ProjectFilterProps {
  availableTechs: string[];
  selectedTechs: string[];
  onToggleTech: (slug: string) => void;
  onClear: () => void;
  totalCount: number;
  filteredCount: number;
}

export function ProjectFilter({
  availableTechs,
  selectedTechs,
  onToggleTech,
  onClear,
  totalCount,
  filteredCount,
}: ProjectFilterProps) {
  const hasActiveFilters = selectedTechs.length > 0;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 sm:p-5 mb-8">
      {/* Top Header of Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-accent" />
          <span className="font-mono text-xs font-semibold text-text uppercase tracking-wider">
            Bộ lọc công nghệ
          </span>
          {hasActiveFilters && (
            <span className="font-mono text-[11px] text-accent bg-accent/10 px-2 py-0.5 rounded-full">
              {selectedTechs.length} đã chọn
            </span>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          <span className="font-mono text-muted">
            Hiển thị <strong className="text-text">{filteredCount}</strong> / {totalCount} dự án
          </span>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-7 px-2 text-xs text-muted hover:text-status-danger"
              iconRight={<X className="h-3 w-3" />}
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* Chip Badges Container */}
      <div className="flex flex-wrap items-center gap-2">
        {availableTechs.map((slug) => {
          const isSelected = selectedTechs.includes(slug);
          return (
            <TechBadge
              key={slug}
              slug={slug}
              active={isSelected}
              onClick={() => onToggleTech(slug)}
            />
          );
        })}
      </div>
    </div>
  );
}
