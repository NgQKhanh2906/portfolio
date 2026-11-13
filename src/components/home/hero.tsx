import React from "react";
import Link from "next/link";
import { ArrowUpRight, Download, Sparkles, Terminal } from "lucide-react";
import { siteConfig } from "@/data/site-config";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export function Hero() {
  const techStack = [
    { name: "Next.js", short: "N" },
    { name: "React", short: "Re" },
    { name: "TypeScript", short: "TS" },
    { name: "Tailwind", short: "TW" },
    { name: "PostgreSQL", short: "PG" },
    { name: "Node.js", short: "No" },
    { name: "Git", short: "Git" },
  ];

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-center overflow-hidden py-12 md:py-20 hero-grid-pattern">
      {/* Background Ambient Glow */}
      <div
        className="pointer-events-none absolute -top-24 right-0 h-[450px] w-[450px] rounded-full bg-accent/15 blur-[120px] -z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-[350px] w-[350px] rounded-full bg-accent/10 blur-[100px] -z-10"
        aria-hidden="true"
      />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Introduction & Call to Actions */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3.5 py-1 text-xs font-mono font-medium text-accent mb-6 shadow-xs">
              <span className="flex h-2 w-2 shrink-0 aspect-square rounded-full bg-accent animate-pulse" />
              <span>I&apos;M A WEB DEVELOPER</span>
            </div>

            {/* Greeting & Main Titles */}
            <h1 className="text-4xl font-extrabold tracking-tight text-text sm:text-5xl md:text-6xl text-balance leading-[1.1]">
              Xin chào, mình là{" "}
              <span className="text-accent underline decoration-accent/30 underline-offset-8">
                {siteConfig.name}
              </span>
            </h1>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-text sm:text-3xl md:text-4xl text-balance">
              Mình xây dựng sản phẩm chất lượng cao cho Web.
            </h2>

            {/* Tagline */}
            <p className="mt-4 text-base sm:text-lg text-muted max-w-xl text-pretty leading-relaxed">
              {siteConfig.tagline}
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link href="/projects">
                <Button
                  size="lg"
                  iconRight={<ArrowUpRight className="h-4 w-4 shrink-0 aspect-square" />}
                  className="rounded-xl shadow-md hover:shadow-accent/25 transition-all duration-base font-semibold"
                >
                  Xem dự án
                </Button>
              </Link>

              <a href={siteConfig.resumePath} download={siteConfig.resumeFileName}>
                <Button
                  variant="secondary"
                  size="lg"
                  iconLeft={<Download className="h-4 w-4 shrink-0 aspect-square" />}
                  className="rounded-xl border-border hover:border-accent hover:text-accent transition-all duration-base"
                >
                  Tải CV (PDF)
                </Button>
              </a>
            </div>

            {/* Technologies I Work With */}
            <div className="mt-10 pt-6 border-t border-border/70 w-full max-w-lg">
              <span className="font-mono text-[11px] font-semibold text-muted uppercase tracking-wider block mb-3">
                Công nghệ thực chiến
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {techStack.map((tech) => (
                  <div
                    key={tech.name}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-mono font-medium text-text hover:border-accent hover:text-accent hover:bg-surface-2 transition-all duration-fast cursor-default shadow-xs"
                  >
                    <span className="flex h-4 w-4 shrink-0 aspect-square items-center justify-center rounded bg-accent/15 text-[10px] font-bold text-accent">
                      {tech.short}
                    </span>
                    <span>{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Studio Portrait Representation & Floating Code Card */}
          <div className="lg:col-span-5 relative flex flex-col items-center lg:items-end justify-center">
            {/* Background Soft Neon Violet Circular Halo */}
            <div
              className="pointer-events-none absolute -top-12 -right-8 h-[380px] w-[380px] rounded-full bg-accent/20 blur-[110px] -z-10"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-8 -left-6 h-[300px] w-[300px] rounded-full bg-accent/15 blur-[90px] -z-10"
              aria-hidden="true"
            />

            <div className="relative w-full max-w-md flex flex-col gap-5">
              {/* Studio Portrait representation / avatar */}
              <div className="w-full flex items-center justify-between gap-4 rounded-2xl border border-border/80 bg-surface/85 p-4 sm:p-5 backdrop-blur-md shadow-lg transition-all duration-base hover:border-accent">
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Studio Portrait Frame */}
                  <div className="relative">
                    <div
                      className="pointer-events-none absolute -inset-1.5 rounded-full bg-accent/40 blur-md -z-10"
                      aria-hidden="true"
                    />
                    <div className="relative h-14 w-14 shrink-0 aspect-square rounded-full border-2 border-accent/60 overflow-hidden bg-gradient-to-b from-accent/20 via-surface-2 to-surface shadow-md flex items-center justify-center">
                      <svg
                        viewBox="0 0 120 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-full w-full object-cover"
                        aria-label="Ảnh đại diện phong cách studio của Nguyễn Quốc Khánh"
                        role="img"
                      >
                        <defs>
                          <linearGradient id="avatar-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-surface-2)" />
                            <stop offset="100%" stopColor="var(--color-surface)" />
                          </linearGradient>
                          <linearGradient id="neon-rim" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.85" />
                            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.25" />
                          </linearGradient>
                          <radialGradient id="studio-light" cx="60%" cy="30%" r="70%">
                            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="transparent" />
                          </radialGradient>
                        </defs>

                        {/* Background & Studio Ambient Lighting */}
                        <rect width="120" height="120" fill="url(#avatar-bg)" />
                        <circle cx="70" cy="40" r="50" fill="url(#studio-light)" />

                        {/* Shoulders / Torso with studio rim light */}
                        <path
                          d="M20 120 C20 95, 36 82, 60 82 C84 82, 100 95, 100 120 Z"
                          fill="currentColor"
                          className="text-surface-2"
                        />
                        <path
                          d="M22 120 C22 97, 37 84, 60 84 C83 84, 98 97, 98 120"
                          stroke="url(#neon-rim)"
                          strokeWidth="2"
                        />

                        {/* Head / Face */}
                        <ellipse cx="60" cy="52" rx="20" ry="24" fill="currentColor" className="text-border" />

                        {/* Hair with studio gradient */}
                        <path
                          d="M38 48 C38 32, 48 24, 60 24 C72 24, 82 32, 82 48 C80 44, 74 38, 60 38 C46 38, 40 44, 38 48 Z"
                          fill="currentColor"
                          className="text-text"
                        />

                        {/* Studio Rim Light on head */}
                        <path
                          d="M40 50 C40 33, 49 26, 60 26 C71 26, 80 33, 80 50"
                          stroke="url(#neon-rim)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />

                        {/* Minimalist Glasses with Neon Accent */}
                        <rect x="46" y="48" width="11" height="8" rx="2" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" />
                        <rect x="63" y="48" width="11" height="8" rx="2" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" />
                        <line x1="57" y1="52" x2="63" y2="52" stroke="var(--color-accent)" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <span
                      className="absolute bottom-0 right-0 h-3.5 w-3.5 shrink-0 aspect-square rounded-full bg-status-success ring-2 ring-surface"
                      title="Sẵn sàng nhận dự án"
                    />
                  </div>

                  {/* Developer Identity Details */}
                  <div className="flex flex-col min-w-0 gap-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-bold text-text truncate">
                        {siteConfig.name}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-mono font-medium text-accent shrink-0">
                        {siteConfig.shortName}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-accent">
                      {siteConfig.role}
                    </span>
                    <span className="text-[11px] text-muted truncate">
                      {siteConfig.location}
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex shrink-0 flex-col items-end text-right font-mono text-[10px] pl-4 border-l border-border/60">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-status-success/15 px-2.5 py-1 text-[10px] font-bold text-status-success border border-status-success/30">
                    <span className="h-1.5 w-1.5 shrink-0 aspect-square rounded-full bg-status-success animate-pulse" />
                    ONLINE
                  </span>
                  <span className="mt-1 text-muted text-[10px]">{siteConfig.timezone}</span>
                </div>
              </div>

              {/* Floating Interactive Code Card */}
              <div className="w-full rounded-2xl border border-border bg-surface/90 backdrop-blur-md shadow-2xl overflow-hidden card-interactive animate-float">
                {/* Card Window Header */}
                <div className="flex items-center justify-between border-b border-border bg-surface-2/60 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 shrink-0 aspect-square text-accent" />
                    <span className="font-mono text-xs font-semibold text-text">
                      developer.config.ts
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 shrink-0 aspect-square rounded-full bg-status-danger/70" />
                    <span className="h-2.5 w-2.5 shrink-0 aspect-square rounded-full bg-status-warning/70" />
                    <span className="h-2.5 w-2.5 shrink-0 aspect-square rounded-full bg-status-success/70" />
                  </div>
                </div>

                {/* Code Snippet Content */}
                <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto selection:bg-accent/30 selection:text-accent">
                  <p className="text-muted">
                    <span className="text-accent font-semibold">const</span>{" "}
                    <span className="text-text font-bold">developer</span> = &#123;
                  </p>
                  <div className="pl-4 space-y-1 my-1">
                    <p>
                      <span className="text-muted">name:</span>{" "}
                      <span className="text-accent font-medium">&quot;{siteConfig.name}&quot;</span>,
                    </p>
                    <p>
                      <span className="text-muted">role:</span>{" "}
                      <span className="text-accent font-medium">&quot;{siteConfig.role}&quot;</span>,
                    </p>
                    <p>
                      <span className="text-muted">skills:</span> [
                    </p>
                    <p className="pl-4 text-accent">
                      &quot;Next.js&quot;, &quot;React&quot;, &quot;TypeScript&quot;,
                    </p>
                    <p className="pl-4 text-accent">
                      &quot;Tailwind CSS&quot;, &quot;PostgreSQL&quot;
                    </p>
                    <p className="text-muted">],</p>
                    <p>
                      <span className="text-muted">architecture:</span>{" "}
                      <span className="text-accent font-medium">&quot;Clean & Type-safe&quot;</span>,
                    </p>
                    <p>
                      <span className="text-muted">openToWork:</span>{" "}
                      <span className="text-status-success font-semibold">true</span>,
                    </p>
                  </div>
                  <p className="text-muted">&#125;;</p>
                </div>

                {/* Card Footer Status */}
                <div className="flex items-center justify-between border-t border-border bg-surface-2/40 px-4 py-2.5 text-[11px] font-mono text-muted">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 aspect-square rounded-full bg-status-success" />
                    <span className="text-text font-medium">Ready for opportunities</span>
                  </div>
                  <div className="flex items-center gap-1 text-accent">
                    <Sparkles className="h-3 w-3 shrink-0 aspect-square" />
                    <span>TypeScript Strict</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
