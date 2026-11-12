import React from "react";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { siteConfig } from "@/data/site-config";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-center overflow-hidden py-12 md:py-20 hero-grid-pattern">
      <Container>
        <div className="flex flex-col items-start max-w-3xl">
          {/* Monospace intro label */}
          <div className="font-mono text-xs font-semibold uppercase tracking-wider text-accent mb-3">
            00 / HELLO
          </div>

          {/* Greeting & Name */}
          <p className="text-base font-medium text-muted mb-1">
            Xin chào, mình là
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-text sm:text-5xl md:text-6xl text-balance">
            {siteConfig.name}
          </h1>

          {/* Role */}
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-accent sm:text-3xl md:text-4xl">
            {siteConfig.role}
          </h2>

          {/* Tagline */}
          <p className="mt-4 text-base sm:text-lg text-muted max-w-2xl text-pretty leading-relaxed">
            {siteConfig.tagline}
          </p>

          {/* Open to Work Badge */}
          {siteConfig.openToWork && (
            <div className="mt-6">
              <Badge variant="success" className="py-1 px-3 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success"></span>
                </span>
                {siteConfig.openToWorkLabel}
              </Badge>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/projects">
              <Button size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
                Xem dự án
              </Button>
            </Link>
            <a href={siteConfig.resumePath} download={siteConfig.resumeFileName}>
              <Button
                variant="secondary"
                size="lg"
                iconLeft={<Download className="h-4 w-4" />}
              >
                Tải CV
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
