import { expect, test } from "@playwright/test";

test.describe("SEO Metadata, Open Graph Images, and HTTP Security Headers", () => {
  test("serves valid sitemap.xml and robots.txt for the 3-route architecture", async ({
    request,
  }) => {
    const sitemapRes = await request.get("/sitemap.xml");
    expect(sitemapRes.status()).toBe(200);
    const sitemapBody = await sitemapRes.text();
    expect(sitemapBody).toContain("/projects/portfolio");
    expect(sitemapBody).toContain("/projects/backend-services");
    expect(sitemapBody).toContain("/contact");
    expect(sitemapBody).not.toContain("/lab");
    expect(sitemapBody).not.toContain("/guestbook");

    const robotsRes = await request.get("/robots.txt");
    expect(robotsRes.status()).toBe(200);
    const robotsBody = await robotsRes.text();
    expect(robotsBody).toContain("Disallow: /api/");
    expect(robotsBody).toContain("sitemap.xml");
  });

  test("renders dynamic Open Graph PNG images for home and project detail", async ({
    request,
  }) => {
    for (const path of ["/opengraph-image", "/projects/portfolio/opengraph-image"]) {
      const res = await request.get(path);
      expect(res.status(), `Expected 200 for ${path}`).toBe(200);
      const contentType = res.headers()["content-type"] ?? "";
      expect(contentType).toContain("image/png");

      const body = await res.body();
      expect(body.subarray(0, 4).toString("hex")).toBe("89504e47");
    }
  });

  test("returns hardened HTTP security headers and removes X-Powered-By", async ({
    request,
  }) => {
    const res = await request.get("/");
    expect(res.status()).toBe(200);
    const headers = res.headers();

    expect(headers["content-security-policy"]).toBeTruthy();
    expect(headers["strict-transport-security"]).toContain("max-age=63072000");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toContain("camera=()");
    expect(headers["x-powered-by"]).toBeUndefined();
  });
});
