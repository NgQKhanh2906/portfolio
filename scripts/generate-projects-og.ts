import fs from "node:fs";
import path from "node:path";
import { getAllProjects } from "../src/lib/mdx";

interface ProjectOgMetadata {
  slug: string;
  title: string;
  year: number;
  role: string;
  summary: string;
  tech: string[];
}

const OUTPUT_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "projects-og.json",
);

async function generateProjectsOg() {
  const projects = await getAllProjects();

  const entries: ProjectOgMetadata[] = projects
    .filter((item) => item.frontmatter.published)
    .map((item) => ({
      slug: item.slug,
      title: item.frontmatter.title,
      year: item.frontmatter.year,
      role: item.frontmatter.role,
      summary: item.frontmatter.summary,
      tech: item.frontmatter.tech,
    }));

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(
    OUTPUT_PATH,
    `${JSON.stringify(entries, null, 2)}\n`,
    "utf-8",
  );

  console.log(
    `Generated ${entries.length} project OG metadata entries -> ${OUTPUT_PATH}`,
  );
}

generateProjectsOg().catch((error: unknown) => {
  console.error("Failed to generate src/data/projects-og.json:", error);
  process.exit(1);
});
