import React from "react";
import Link from "next/link";
import { Container } from "./container";
import { siteConfig } from "@/data/site-config";
import { GitCommit, Github, Linkedin, Mail } from "lucide-react";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const commitSha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "local";
  const buildDate = process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString().split("T")[0];

  return (
    <footer className="mt-auto border-t border-border bg-surface/50 py-8 text-sm text-muted">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left: Copyright */}
          <div className="flex flex-col gap-1">
            <p className="font-medium text-text">
              © {currentYear} {siteConfig.name}. Bản quyền mã nguồn theo giấy phép MIT.
            </p>
            <p className="text-xs text-muted">
              Xây dựng với Next.js App Router, Tailwind CSS, Drizzle ORM và Supabase.
            </p>
          </div>

          {/* Right: Social links & Telemetry info */}
          <div className="flex flex-col gap-3 md:items-end">
            <div className="flex items-center gap-4">
              <Link
                href={siteConfig.social.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub của Nguyễn Quốc Khánh"
                className="text-muted hover:text-text transition-colors"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn của Nguyễn Quốc Khánh"
                className="text-muted hover:text-text transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href={`mailto:${siteConfig.email}`}
                aria-label={`Gửi email đến ${siteConfig.email}`}
                className="text-muted hover:text-text transition-colors"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>

            {/* Commit & Build telemetry */}
            <div className="flex items-center gap-2 font-mono text-xs text-subtle">
              <GitCommit className="h-3 w-3 text-accent" />
              <span>commit:</span>
              <span className="font-semibold text-text">{commitSha}</span>
              <span>•</span>
              <span>build:</span>
              <span>{buildDate}</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
