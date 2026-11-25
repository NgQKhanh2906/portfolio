import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site-config";

export const runtime = "edge";
export const alt = `${siteConfig.name} | ${siteConfig.role}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const fontData = await fetch(
    new URL("../assets/fonts/SegoeUI-Bold.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0B0B0C",
          color: "#F4F4F6",
          padding: "56px",
          fontFamily: "Segoe UI",
        }}
      >
        {/* Inner Engineering Notebook Frame */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#111019",
            border: "1px solid #27272B",
            borderRadius: "20px",
            padding: "48px 52px",
          }}
        >
          {/* Top Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "12px",
                  height: "12px",
                  borderRadius: "9999px",
                  backgroundColor: "#2DD4A3",
                }}
              />
              <div
                style={{
                  display: "flex",
                  fontSize: "20px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "#2DD4A3",
                }}
              >
                00 / PORTFOLIO
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 18px",
                borderRadius: "9999px",
                backgroundColor: "#0B0B0C",
                border: "1px solid #27272B",
                fontSize: "18px",
                color: "#A1A1AA",
              }}
            >
              nqkhanh.dev
            </div>
          </div>

          {/* Center Main Identity */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "62px",
                fontWeight: 700,
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
                color: "#F4F4F6",
              }}
            >
              {siteConfig.name}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: "30px",
                fontWeight: 700,
                color: "#8B5CF6",
              }}
            >
              {siteConfig.role}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: "24px",
                lineHeight: 1.45,
                color: "#A1A1AA",
                maxWidth: "960px",
              }}
            >
              {siteConfig.tagline}
            </div>
          </div>

          {/* Footer Strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid #27272B",
              paddingTop: "24px",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {[
                "Next.js",
                "TypeScript",
                "Java",
                "Spring Boot",
                "PostgreSQL",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    backgroundColor: "#0B0B0C",
                    border: "1px solid #27272B",
                    fontSize: "16px",
                    color: "#D4D4D8",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: "18px",
                color: "#2DD4A3",
              }}
            >
              Engineering Notebook
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Segoe UI",
          data: fontData,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
