import { ImageResponse } from "next/og";
import projectsOgData from "@/data/projects-og.json";
import { TECH_REGISTRY } from "@/lib/constants";
import { siteConfig } from "@/data/site-config";

export const runtime = "edge";
export const alt = `Case Study Kỹ thuật | ${siteConfig.name}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface ProjectOgEntry {
  slug: string;
  title: string;
  year: number;
  role: string;
  summary: string;
  tech: string[];
}

export interface ProjectOpenGraphProps {
  params: {
    slug: string;
  };
}

const projects: readonly ProjectOgEntry[] = projectsOgData;

export default async function ProjectOpenGraphImage({
  params,
}: ProjectOpenGraphProps) {
  const fontData = await fetch(
    new URL("../../../assets/fonts/SegoeUI-Bold.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  const project = projects.find((item) => item.slug === params.slug);

  const title = project ? project.title : "Case Study Kỹ thuật";
  const year = project ? String(project.year) : String(new Date().getFullYear());
  const role = project ? project.role : siteConfig.role;
  const rawSummary = project ? project.summary : siteConfig.tagline;
  const summary =
    rawSummary.length > 160 ? `${rawSummary.slice(0, 157)}...` : rawSummary;

  const techNames = project
    ? project.tech.slice(0, 5).map((slug) => TECH_REGISTRY[slug]?.name ?? slug)
    : ["Next.js", "TypeScript", "PostgreSQL"];

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
          {/* Header Metadata */}
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
                  letterSpacing: "0.12em",
                  color: "#2DD4A3",
                }}
              >
                {`CASE STUDY / ${year}`}
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
                color: "#8B5CF6",
              }}
            >
              {role}
            </div>
          </div>

          {/* Project Title & Summary */}
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
                fontSize: "48px",
                fontWeight: 700,
                lineHeight: 1.18,
                letterSpacing: "-0.02em",
                color: "#F4F4F6",
              }}
            >
              {title}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: "22px",
                lineHeight: 1.48,
                color: "#A1A1AA",
                maxWidth: "980px",
              }}
            >
              {summary}
            </div>
          </div>

          {/* Tech Stack + Author Footer */}
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
                gap: "10px",
              }}
            >
              {techNames.map((name) => (
                <div
                  key={name}
                  style={{
                    display: "flex",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    backgroundColor: "#0B0B0C",
                    border: "1px solid #27272B",
                    fontSize: "16px",
                    color: "#2DD4A3",
                  }}
                >
                  {name}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "18px",
                color: "#D4D4D8",
              }}
            >
              <div style={{ display: "flex", color: "#F4F4F6" }}>
                {siteConfig.name}
              </div>
              <div style={{ display: "flex", color: "#52525B" }}>/</div>
              <div style={{ display: "flex", color: "#A1A1AA" }}>
                nqkhanh.dev
              </div>
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
