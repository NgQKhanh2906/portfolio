import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import projectsOgData from "@/data/projects-og.json";
import {
  runtime as rootOgRuntime,
  size as rootOgSize,
  contentType as rootOgContentType,
  alt as rootOgAlt,
} from "@/app/opengraph-image";
import {
  runtime as projectOgRuntime,
  size as projectOgSize,
  contentType as projectOgContentType,
  alt as projectOgAlt,
} from "@/app/projects/[slug]/opengraph-image";
import { siteConfig } from "@/data/site-config";

function hasTtfCodePoints(fontBuffer: Buffer, codePoints: number[]): boolean {
  const numTables = fontBuffer.readUInt16BE(4);
  let cmapOffset = -1;

  for (let i = 0; i < numTables; i++) {
    const entryOffset = 12 + i * 16;
    const tag = fontBuffer.subarray(entryOffset, entryOffset + 4).toString("ascii");
    if (tag === "cmap") {
      cmapOffset = fontBuffer.readUInt32BE(entryOffset + 8);
      break;
    }
  }

  if (cmapOffset < 0) return false;

  const numSubtables = fontBuffer.readUInt16BE(cmapOffset + 2);
  let unicodeSubtableOffset = -1;

  for (let i = 0; i < numSubtables; i++) {
    const recOffset = cmapOffset + 4 + i * 8;
    const platformId = fontBuffer.readUInt16BE(recOffset);
    const encodingId = fontBuffer.readUInt16BE(recOffset + 2);
    const relOffset = fontBuffer.readUInt32BE(recOffset + 4);

    if (
      (platformId === 3 && (encodingId === 10 || encodingId === 1)) ||
      platformId === 0
    ) {
      const candidate = cmapOffset + relOffset;
      const format = fontBuffer.readUInt16BE(candidate);
      if (format === 4 || format === 12) {
        unicodeSubtableOffset = candidate;
        if (format === 12 || (platformId === 3 && encodingId === 10)) break;
      }
    }
  }

  if (unicodeSubtableOffset < 0) return false;

  const format = fontBuffer.readUInt16BE(unicodeSubtableOffset);

  if (format === 12) {
    const numGroups = fontBuffer.readUInt32BE(unicodeSubtableOffset + 12);
    return codePoints.every((cp) => {
      for (let i = 0; i < numGroups; i++) {
        const g = unicodeSubtableOffset + 16 + i * 12;
        const start = fontBuffer.readUInt32BE(g);
        const end = fontBuffer.readUInt32BE(g + 4);
        if (cp >= start && cp <= end) return true;
      }
      return false;
    });
  }

  if (format === 4) {
    const segCount = fontBuffer.readUInt16BE(unicodeSubtableOffset + 6) / 2;
    const endCodesStart = unicodeSubtableOffset + 14;
    const startCodesStart = endCodesStart + segCount * 2 + 2;

    return codePoints.every((cp) => {
      for (let i = 0; i < segCount; i++) {
        const endCode = fontBuffer.readUInt16BE(endCodesStart + i * 2);
        const startCode = fontBuffer.readUInt16BE(startCodesStart + i * 2);
        if (endCode === 0xffff && startCode === 0xffff) continue;
        if (cp >= startCode && cp <= endCode) return true;
      }
      return false;
    });
  }

  return false;
}

describe("SEO Routes (sitemap.ts & robots.ts)", () => {
  it("sitemap() includes core routes and published projects without /lab or /guestbook", async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);
    const paths = entries.map((entry) => new URL(entry.url).pathname);

    expect(paths).toContain("/");
    expect(paths).toContain("/projects");
    expect(paths).toContain("/contact");
    expect(paths).toContain("/projects/portfolio");
    expect(paths).toContain("/projects/backend-services");

    expect(paths).not.toContain("/lab");
    expect(paths).not.toContain("/guestbook");

    for (const entry of entries) {
      expect(entry.url.startsWith(siteConfig.url)).toBe(true);
      expect(entry.lastModified).toBeDefined();
    }
    expect(urls.length).toBeGreaterThanOrEqual(5);
  });

  it("robots() allows root crawling, disallows /api/, and references sitemap.xml", () => {
    const config = robots();
    const primaryRule = Array.isArray(config.rules)
      ? config.rules[0]
      : config.rules;

    expect(primaryRule).toBeDefined();
    expect(primaryRule?.userAgent).toBe("*");
    expect(primaryRule?.allow).toBe("/");
    expect(primaryRule?.disallow).toBe("/api/");
    expect(config.sitemap).toBe(`${siteConfig.url}/sitemap.xml`);
  });
});

describe("OG Image Font & Metadata Configuration", () => {
  it("includes a valid static TTF font at src/assets/fonts/SegoeUI-Bold.ttf with Vietnamese glyphs", () => {
    const fontPath = path.join(
      process.cwd(),
      "src/assets/fonts/SegoeUI-Bold.ttf",
    );
    expect(fs.existsSync(fontPath)).toBe(true);

    const buf = fs.readFileSync(fontPath);
    expect(buf.length).toBeGreaterThan(100_000);
    const headerHex = buf.subarray(0, 4).toString("hex").toUpperCase();
    expect(["00010000", "4F54544F"]).toContain(headerHex);

    // Check Vietnamese diacritic code points: ễ, ố, á, Đ, đ, ư, ơ, ệ, ả
    const vietnameseChars = Array.from("ễốáĐđươệả").map(
      (ch) => ch.codePointAt(0) ?? 0,
    );
    expect(hasTtfCodePoints(buf, vietnameseChars)).toBe(true);
  });

  it("exports valid Edge runtime 1200x630 PNG OG metadata and generated projects-og.json", () => {
    expect(rootOgRuntime).toBe("edge");
    expect(rootOgSize).toEqual({ width: 1200, height: 630 });
    expect(rootOgContentType).toBe("image/png");
    expect(rootOgAlt).toContain(siteConfig.name);

    expect(projectOgRuntime).toBe("edge");
    expect(projectOgSize).toEqual({ width: 1200, height: 630 });
    expect(projectOgContentType).toBe("image/png");
    expect(projectOgAlt).toContain(siteConfig.name);

    const slugs = projectsOgData.map((item) => item.slug);
    expect(slugs).toContain("portfolio");
    expect(slugs).toContain("backend-services");
  });
});
