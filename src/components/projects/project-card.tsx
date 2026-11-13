import React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Github, Laptop, Layers, Cpu } from "lucide-react";
import { type ProjectFrontmatter } from "@/lib/validations/project-frontmatter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrowserMockup } from "@/components/ui/browser-mockup";
import { TechBadge } from "./tech-badge";

export interface ProjectCardProps {
  project: ProjectFrontmatter;
}

/**
 * Clean URL formatting for BrowserMockup address bar
 */
export function getProjectMockupUrl(slug: string, demoLink?: string): string {
  switch (slug) {
    case "portfolio":
      return "nqkhanh.dev";
    case "taskflow":
      return "taskflow.dev/board";
    case "shoplite":
      return "shoplite.store";
    default:
      if (demoLink) {
        try {
          const parsed = new URL(demoLink);
          return parsed.host;
        } catch {
          return demoLink.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
        }
      }
      return `${slug}.dev`;
  }
}

/**
 * Portfolio Preview: Dark code editor with live telemetry bar and metrics
 */
export function PortfolioMockupViewport() {
  return (
    <div
      data-testid="mockup-portfolio"
      className="relative flex h-full w-full flex-col justify-between bg-[#0B0C10] text-[#E0E2EC] font-mono text-[9px] select-none p-2 sm:p-2.5 overflow-hidden"
    >
      {/* Editor Main Content: Sidebar + Code Editor */}
      <div className="grid grid-cols-12 gap-2 h-[calc(100%-22px)] overflow-hidden">
        {/* Mini Explorer / File Tree */}
        <div className="col-span-4 border-r border-[#1F222E]/80 pr-1 flex flex-col gap-1 text-[8px] text-[#8A8F9E]">
          <div className="flex items-center justify-between text-[7px] uppercase tracking-wider text-[#5A5F70] font-semibold pb-1 border-b border-[#1F222E]">
            <span>Explorer</span>
            <span>RSC</span>
          </div>
          <div className="flex items-center gap-1 text-[#5A5F70]">
            <span>▾</span> <span>src/app</span>
          </div>
          <div className="flex items-center gap-1 pl-2 text-[#5A5F70]">
            <span>page.tsx</span>
          </div>
          <div className="flex items-center gap-1 text-[#5A5F70]">
            <span>▾</span> <span>src/lib</span>
          </div>
          <div className="flex items-center gap-1 pl-1 text-accent font-medium bg-accent/10 rounded px-1 py-0.5 border border-accent/20">
            <span className="h-1.5 w-1.5 shrink-0 aspect-square rounded-full bg-accent" />
            <span className="truncate">telemetry.ts</span>
          </div>
        </div>

        {/* Code Editor Pane */}
        <div className="col-span-8 flex flex-col justify-between overflow-hidden">
          {/* File Tab */}
          <div className="flex items-center gap-1.5 pb-1 border-b border-[#1F222E] text-[8px] text-[#A0A5B5]">
            <span className="text-accent">●</span>
            <span className="font-semibold text-white">telemetry.ts</span>
            <span className="text-[7px] text-[#5A5F70] ml-auto">TypeScript</span>
          </div>

          {/* Code Lines with Syntax Highlighting */}
          <div className="flex flex-col gap-0.5 text-[8.5px] leading-relaxed pt-1 overflow-hidden font-mono">
            <div className="flex gap-1.5">
              <span className="text-[#3F4455] w-2.5 text-right shrink-0">1</span>
              <span className="text-[#5A5F70] truncate">{"// Live Edge Telemetry"}</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-[#3F4455] w-2.5 text-right shrink-0">2</span>
              <span className="truncate">
                <span className="text-[#C792EA]">export const</span> <span className="text-[#82AAFF]">runtime</span> = <span className="text-[#C3E88D]">&quot;edge&quot;</span>;
              </span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-[#3F4455] w-2.5 text-right shrink-0">3</span>
              <span className="truncate">
                <span className="text-[#C792EA]">const</span> stats = <span className="text-[#C792EA]">await</span> db.<span className="text-[#82AAFF]">metrics</span>();
              </span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-[#3F4455] w-2.5 text-right shrink-0">4</span>
              <span className="truncate">
                telemetry.<span className="text-[#82AAFF]">record</span>({`{ p99: `}<span className="text-[#F78C6C]">&quot;42ms&quot;</span>{` }`});
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry Status Strip at Bottom */}
      <div className="h-5 -mx-2 -mb-2 sm:-mx-2.5 sm:-mb-2.5 px-2 bg-[#08090D] border-t border-[#1F222E] flex items-center justify-between text-[8px] text-[#A0A5B5]">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 shrink-0 aspect-square rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-emerald-400 tracking-wider">ONLINE 100%</span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span>P99: <span className="text-accent font-semibold">42ms</span></span>
          <span className="hidden xs:inline">TTFB: <span className="text-accent font-semibold">18ms</span></span>
          <div className="flex items-end gap-0.5 h-2.5">
            <span className="w-0.5 h-1 bg-emerald-500/70 rounded-xs" />
            <span className="w-0.5 h-1.5 bg-emerald-500/80 rounded-xs" />
            <span className="w-0.5 h-2.5 bg-emerald-400 rounded-xs" />
            <span className="w-0.5 h-2 bg-emerald-500/80 rounded-xs" />
            <span className="w-0.5 h-2.5 bg-accent rounded-xs" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * TaskFlow Preview: Kanban board with columns (To Do, In Progress, Done)
 */
export function TaskFlowMockupViewport() {
  return (
    <div
      data-testid="mockup-taskflow"
      className="relative flex h-full w-full flex-col justify-between bg-[#0C0D14] text-[#E0E2EC] p-2 sm:p-2.5 font-sans select-none overflow-hidden"
    >
      {/* Board Mini Header */}
      <div className="flex items-center justify-between pb-1 border-b border-[#1F2232] text-[8px]">
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-bold text-white text-[9px] tracking-tight">TaskFlow Board</span>
          <span className="bg-accent/15 text-accent border border-accent/30 font-mono text-[7px] px-1 py-0.2 rounded-full">
            Sprint 14
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <span className="h-3 w-3 shrink-0 aspect-square rounded-full bg-indigo-500 border border-[#0C0D14] text-[6px] text-white flex items-center justify-center font-bold">K</span>
            <span className="h-3 w-3 shrink-0 aspect-square rounded-full bg-emerald-500 border border-[#0C0D14] text-[6px] text-white flex items-center justify-center font-bold">T</span>
            <span className="h-3 w-3 shrink-0 aspect-square rounded-full bg-amber-500 border border-[#0C0D14] text-[6px] text-white flex items-center justify-center font-bold">A</span>
          </div>
        </div>
      </div>

      {/* 3 Kanban Columns */}
      <div className="grid grid-cols-3 gap-1 pt-1 h-[calc(100%-18px)] overflow-hidden">
        {/* Column 1: To Do */}
        <div className="bg-[#121420] border border-[#1F2232] rounded p-1 flex flex-col gap-1 overflow-hidden">
          <div className="flex items-center justify-between text-[7.5px] font-mono text-[#8C92A4] pb-0.5 border-b border-[#1F2232]">
            <span className="font-semibold uppercase">To Do</span>
            <span className="bg-[#1B1E30] text-[#A0A5B5] px-1 rounded-full text-[6.5px]">3</span>
          </div>
          <div className="bg-[#181B2B] border border-[#272B40] rounded p-1 flex flex-col gap-0.5 shadow-xs">
            <span className="text-[7.5px] font-medium text-white truncate">OAuth GitHub Flow</span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-[6.5px] font-mono bg-indigo-500/20 text-indigo-300 px-1 rounded">Auth</span>
              <span className="h-1 w-1 shrink-0 aspect-square rounded-full bg-amber-400" />
            </div>
          </div>
          <div className="bg-[#181B2B] border border-[#272B40] rounded p-1 flex flex-col gap-0.5 opacity-70">
            <span className="text-[7.5px] font-medium text-[#C0C4D0] truncate">Drizzle Schema</span>
          </div>
        </div>

        {/* Column 2: In Progress */}
        <div className="bg-[#121420] border border-accent/30 rounded p-1 flex flex-col gap-1 overflow-hidden">
          <div className="flex items-center justify-between text-[7.5px] font-mono text-accent pb-0.5 border-b border-accent/20">
            <span className="font-semibold uppercase">In Progress</span>
            <span className="bg-accent/20 text-accent px-1 rounded-full text-[6.5px] font-bold">2</span>
          </div>
          <div className="bg-[#1A1D30] border border-accent/50 rounded p-1 flex flex-col gap-0.5 shadow-xs shadow-accent/10">
            <span className="text-[7.5px] font-medium text-white truncate">Kanban Drag & Drop</span>
            <div className="w-full bg-[#272B40] h-0.5 rounded-full mt-0.5 overflow-hidden">
              <div className="bg-accent h-full w-4/5 rounded-full" />
            </div>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-[6.5px] font-mono bg-accent/20 text-accent px-1 rounded">UI Craft</span>
              <span className="h-1 w-1 shrink-0 aspect-square rounded-full bg-accent animate-pulse" />
            </div>
          </div>
        </div>

        {/* Column 3: Done */}
        <div className="bg-[#121420] border border-[#1F2232] rounded p-1 flex flex-col gap-1 overflow-hidden">
          <div className="flex items-center justify-between text-[7.5px] font-mono text-emerald-400 pb-0.5 border-b border-[#1F2232]">
            <span className="font-semibold uppercase">Done</span>
            <span className="bg-emerald-500/20 text-emerald-400 px-1 rounded-full text-[6.5px] font-bold">4</span>
          </div>
          <div className="bg-[#181B2B] border border-emerald-500/20 rounded p-1 flex flex-col gap-0.5">
            <span className="text-[7.5px] font-medium text-white truncate">PostgreSQL Setup</span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-[6.5px] font-mono bg-emerald-500/20 text-emerald-300 px-1 rounded">Passed</span>
              <span className="h-1 w-1 shrink-0 aspect-square rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ShopLite Preview: Storefront UI with product cards
 */
export function ShopLiteMockupViewport() {
  return (
    <div
      data-testid="mockup-shoplite"
      className="relative flex h-full w-full flex-col justify-between bg-[#0B0C12] text-[#E0E2EC] p-2 sm:p-2.5 font-sans select-none overflow-hidden"
    >
      {/* Storefront Mini Navbar */}
      <div className="flex items-center justify-between pb-1 border-b border-[#1F2230] text-[8px]">
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-bold text-accent text-[9px] tracking-tight">SHOPLITE</span>
          <span className="text-[7px] text-[#5A6075] font-mono hidden xs:inline">Storefront</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#161824] border border-[#25283A] rounded px-1.5 py-0.5 text-[6.5px] text-[#80869B] font-mono flex items-center gap-1">
            <span>Search...</span>
          </div>
          <div className="flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full px-1.5 py-0.2 text-[7px] font-mono">
            <span className="h-1 w-1 shrink-0 aspect-square rounded-full bg-emerald-400" />
            <span>Cart (2)</span>
          </div>
        </div>
      </div>

      {/* 3 Product Cards Grid */}
      <div className="grid grid-cols-3 gap-1 pt-1 h-[calc(100%-18px)] overflow-hidden">
        {/* Product Card 1 */}
        <div className="bg-[#131522] border border-[#23273A] rounded p-1 flex flex-col justify-between">
          <div className="bg-[#1B1E30] rounded border border-[#2C3148] h-7 flex items-center justify-center text-accent/80">
            <Laptop className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </div>
          <div className="mt-0.5 flex flex-col">
            <span className="text-[7px] font-semibold text-white truncate">Mech Key 75%</span>
            <span className="text-[6.5px] font-mono text-accent font-bold">$129</span>
          </div>
          <div className="mt-0.5 w-full bg-accent/20 text-accent border border-accent/30 rounded py-0.2 text-[6px] font-medium font-mono text-center">
            Add
          </div>
        </div>

        {/* Product Card 2 */}
        <div className="bg-[#131522] border border-[#23273A] rounded p-1 flex flex-col justify-between">
          <div className="bg-[#1B1E30] rounded border border-[#2C3148] h-7 flex items-center justify-center text-accent/80">
            <Layers className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </div>
          <div className="mt-0.5 flex flex-col">
            <span className="text-[7px] font-semibold text-white truncate">Desk Mat Pro</span>
            <span className="text-[6.5px] font-mono text-accent font-bold">$35</span>
          </div>
          <div className="mt-0.5 w-full bg-accent/20 text-accent border border-accent/30 rounded py-0.2 text-[6px] font-medium font-mono text-center">
            Add
          </div>
        </div>

        {/* Product Card 3 */}
        <div className="bg-[#131522] border border-[#23273A] rounded p-1 flex flex-col justify-between">
          <div className="bg-[#1B1E30] rounded border border-[#2C3148] h-7 flex items-center justify-center text-accent/80">
            <Cpu className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </div>
          <div className="mt-0.5 flex flex-col">
            <span className="text-[7px] font-semibold text-white truncate">USB-C Hub</span>
            <span className="text-[6.5px] font-mono text-accent font-bold">$59</span>
          </div>
          <div className="mt-0.5 w-full bg-accent/20 text-accent border border-accent/30 rounded py-0.2 text-[6px] font-medium font-mono text-center">
            Add
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Fallback Preview for other project slugs
 */
export function DefaultMockupViewport({ title }: { title?: string }) {
  return (
    <div
      data-testid="mockup-default"
      className="relative flex h-full w-full flex-col justify-between bg-[#0B0C10] text-[#E0E2EC] p-2.5 font-mono select-none overflow-hidden"
    >
      <div className="flex items-center justify-between pb-1 border-b border-[#1F2230] text-[8px]">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 shrink-0 aspect-square rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold tracking-wider">LIVE SYSTEM</span>
        </div>
        <span className="text-[#6C7286] text-[7.5px]">v2.4.0</span>
      </div>
      <div className="my-auto flex flex-col items-center justify-center text-center p-2">
        <span className="text-[11px] font-bold text-white mb-0.5 tracking-tight truncate max-w-full">
          {title ? `${title} Preview` : "Production System"}
        </span>
        <span className="text-[7.5px] text-muted font-mono">Architecture & Performance Verified</span>
      </div>
      <div className="pt-1 border-t border-[#1F2230] flex items-center justify-between text-[7.5px] text-[#8A90A2]">
        <span>WCAG AA: 100%</span>
        <span>LATENCY: 24ms</span>
      </div>
    </div>
  );
}

/**
 * Mockup Viewport Router based on project slug
 */
export function ProjectMockupViewport({ slug, title }: { slug: string; title?: string }) {
  switch (slug) {
    case "portfolio":
      return <PortfolioMockupViewport />;
    case "taskflow":
      return <TaskFlowMockupViewport />;
    case "shoplite":
      return <ShopLiteMockupViewport />;
    default:
      return <DefaultMockupViewport title={title} />;
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const maxVisibleTech = 4;
  const visibleTech = project.tech.slice(0, maxVisibleTech);
  const remainingCount = project.tech.length - maxVisibleTech;
  const mockupUrl = getProjectMockupUrl(project.slug, project.links?.demo);

  return (
    <Card
      interactive
      className="group flex flex-col justify-between h-full p-5 transition-all duration-300 hover:scale-[1.02] hover:border-accent hover:shadow-xl hover:shadow-accent/20"
    >
      <div>
        {/* Browser Mockup Showcase */}
        <div className="relative mb-4">
          <BrowserMockup
            url={mockupUrl}
            className="w-full transition-all duration-300 group-hover:border-accent/60"
          >
            <ProjectMockupViewport slug={project.slug} title={project.title} />
          </BrowserMockup>
          {project.featured && (
            <span className="absolute top-11 right-2.5 z-10 pointer-events-none">
              <Badge variant="accent" className="text-[10px] py-0.5 shadow-sm">
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
