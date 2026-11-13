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
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
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
                  iconRight={<ArrowUpRight className="h-4 w-4" />}
                  className="rounded-xl shadow-md hover:shadow-accent/25 transition-all duration-base font-semibold"
                >
                  Xem dự án
                </Button>
              </Link>

              <a href={siteConfig.resumePath} download={siteConfig.resumeFileName}>
                <Button
                  variant="secondary"
                  size="lg"
                  iconLeft={<Download className="h-4 w-4" />}
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
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-accent/15 text-[10px] font-bold text-accent">
                      {tech.short}
                    </span>
                    <span>{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Code Card & Visual Halo */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            {/* Glowing circular halo in background */}
            <div
              className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-accent/20 via-accent/5 to-transparent blur-2xl -z-10"
              aria-hidden="true"
            />

            {/* Floating Interactive Code Card */}
            <div className="w-full max-w-md rounded-2xl border border-border bg-surface/90 backdrop-blur-md shadow-2xl overflow-hidden card-interactive animate-float">
              {/* Card Window Header */}
              <div className="flex items-center justify-between border-b border-border bg-surface-2/60 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-accent" />
                  <span className="font-mono text-xs font-semibold text-text">
                    developer.config.ts
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-status-danger/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-status-warning/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-status-success/70" />
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
                    <span className="text-text-muted">name:</span>{" "}
                    <span className="text-accent">&quot;{siteConfig.name}&quot;</span>,
                  </p>
                  <p>
                    <span className="text-text-muted">role:</span>{" "}
                    <span className="text-accent">&quot;{siteConfig.role}&quot;</span>,
                  </p>
                  <p>
                    <span className="text-text-muted">skills:</span> [
                  </p>
                  <p className="pl-4 text-accent">
                    &quot;Next.js&quot;, &quot;React&quot;, &quot;TypeScript&quot;,
                  </p>
                  <p className="pl-4 text-accent">
                    &quot;Tailwind CSS&quot;, &quot;PostgreSQL&quot;
                  </p>
                  <p>],</p>
                  <p>
                    <span className="text-text-muted">architecture:</span>{" "}
                    <span className="text-accent">&quot;Clean & Type-safe&quot;</span>,
                  </p>
                  <p>
                    <span className="text-text-muted">openToWork:</span>{" "}
                    <span className="text-status-success font-semibold">true</span>,
                  </p>
                </div>
                <p className="text-muted">&#125;;</p>
              </div>

              {/* Card Footer Status */}
              <div className="flex items-center justify-between border-t border-border bg-surface-2/40 px-4 py-2.5 text-[11px] font-mono text-muted">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-status-success" />
                  <span className="text-text font-medium">Ready for opportunities</span>
                </div>
                <div className="flex items-center gap-1 text-accent">
                  <Sparkles className="h-3 w-3" />
                  <span>TypeScript Strict</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
