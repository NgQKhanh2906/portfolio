"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ArrowUpRight, Code2 } from "lucide-react";
import { siteConfig } from "@/data/site-config";
import { Container } from "./container";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { MobileNav } from "./mobile-nav";
import { CommandTrigger } from "@/components/command-palette/command-trigger";
import { CommandPalette } from "@/components/command-palette/command-palette";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 16);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-base",
          isScrolled
            ? "border-b border-border bg-surface/85 backdrop-blur-md shadow-sm"
            : "bg-transparent",
        )}
      >
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-mono text-base font-bold tracking-tight text-text hover:text-accent transition-colors group"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent border border-accent/30 group-hover:bg-accent group-hover:text-accent-fg transition-all duration-base">
                <Code2 className="h-4 w-4" />
              </span>
              <span className="font-mono text-sm font-bold tracking-tight">
                {siteConfig.name}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {siteConfig.navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-fast",
                      isActive
                        ? "bg-accent/10 text-accent font-semibold"
                        : "text-muted hover:text-text hover:bg-surface-2",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Command Palette Trigger */}
              <CommandTrigger
                onClick={() => setIsCommandPaletteOpen(true)}
                className="hidden sm:flex"
              />

              {/* Theme Toggle (1-click Light/Dark) */}
              <ThemeToggle />

              {/* Desktop CTA Button */}
              <Link href="/contact" className="hidden lg:inline-flex ml-1">
                <Button
                  variant="primary"
                  size="sm"
                  iconRight={<ArrowUpRight className="h-3.5 w-3.5" />}
                  className="rounded-lg shadow-sm font-mono text-xs"
                >
                  Liên hệ
                </Button>
              </Link>

              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                aria-label="Mở menu"
                className="flex md:hidden h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-muted hover:text-text hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Container>

        {/* Mobile drawer */}
        <MobileNav
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
        />
      </header>

      {/* Global Command Palette */}
      <CommandPalette
        open={isCommandPaletteOpen}
        onOpenChange={setIsCommandPaletteOpen}
      />
    </>
  );
}
