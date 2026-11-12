import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjects } from "@/lib/mdx";
import { Container } from "@/components/layout/container";
import { ProjectHeader } from "@/components/projects/project-header";
import { TableOfContents } from "@/components/projects/table-of-contents";
import { MDXContent } from "@/components/mdx/mdx-content";
import { ProjectNavigation } from "@/components/projects/project-navigation";

export interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);

  if (!project || !project.frontmatter.published) {
    return {
      title: "Dự án không tồn tại",
    };
  }

  const { title, summary, year } = project.frontmatter;

  return {
    title: `${title} (${year}) - Case Study Kỹ thuật`,
    description: summary,
    openGraph: {
      title: `${title} - Case Study Kỹ thuật`,
      description: summary,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug);

  if (!project || !project.frontmatter.published) {
    notFound();
  }

  // Find previous and next project for bottom navigation
  const allProjects = await getAllProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === params.slug);

  const prevProject =
    currentIndex > 0
      ? {
          slug: allProjects[currentIndex - 1]?.slug || "",
          title: allProjects[currentIndex - 1]?.frontmatter.title || "",
        }
      : null;

  const nextProject =
    currentIndex >= 0 && currentIndex < allProjects.length - 1
      ? {
          slug: allProjects[currentIndex + 1]?.slug || "",
          title: allProjects[currentIndex + 1]?.frontmatter.title || "",
        }
      : null;

  return (
    <div className="py-12 md:py-20">
      <Container>
        {/* Project Header */}
        <ProjectHeader project={project.frontmatter} />

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Article Content */}
          <article className="xl:col-span-8 min-w-0">
            {/* Mobile Table of Contents */}
            <TableOfContents toc={project.toc} />

            {/* Markdown Case Study Body */}
            <MDXContent content={project.content} />

            {/* Bottom Project Navigation */}
            <ProjectNavigation
              prevProject={prevProject}
              nextProject={nextProject}
            />
          </article>

          {/* Desktop Sticky Table of Contents Sidebar */}
          <aside className="hidden xl:block xl:col-span-4 sticky top-24">
            <TableOfContents toc={project.toc} />
          </aside>
        </div>
      </Container>
    </div>
  );
}
