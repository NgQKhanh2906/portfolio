import fs from "node:fs";
import path from "node:path";
import {
  projectFrontmatterSchema,
  type ProjectFrontmatter,
} from "./validations/project-frontmatter";
import { REQUIRED_CASE_STUDY_SECTIONS } from "./constants";

export interface TocItem {
  level: 2 | 3;
  title: string;
  id: string;
}

export interface ParsedProject {
  frontmatter: ProjectFrontmatter;
  content: string;
  toc: TocItem[];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Trình phân tích frontmatter YAML thủ công, an toàn và độc lập
 */
export function parseFrontmatter(fileContent: string): {
  rawFrontmatter: Record<string, unknown>;
  content: string;
} {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match || !match[1]) {
    return { rawFrontmatter: {}, content: fileContent.trim() };
  }

  const yamlBlock = match[1];
  const content = (match[2] || "").trim();
  const raw: Record<string, unknown> = {};

  const lines = yamlBlock.split(/\r?\n/);
  let currentKey = "";
  let currentList: string[] | null = null;
  let currentNestedObj: Record<string, string> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line || line.trim().startsWith("#")) continue;

    // Check array item: "  - item"
    const listItemMatch = line.match(/^\s{2,}-\s+(.*)$/);
    if (listItemMatch && currentKey && currentList) {
      const val = listItemMatch[1]?.trim().replace(/^["']|["']$/g, "") || "";
      currentList.push(val);
      continue;
    }

    // Check nested key-value: "  demo: url"
    const nestedMatch = line.match(/^\s{2,}([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (nestedMatch && currentKey && currentNestedObj) {
      const subKey = nestedMatch[1];
      const subVal = (nestedMatch[2] || "").trim().replace(/^["']|["']$/g, "");
      if (subKey) {
        currentNestedObj[subKey] = subVal;
      }
      continue;
    }

    // Top level key: "key: value"
    const topMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (topMatch && topMatch[1]) {
      currentKey = topMatch[1];
      const rawVal = (topMatch[2] || "").trim();

      if (rawVal === "") {
        // Có thể là mở đầu của list hoặc nested object
        currentList = [];
        currentNestedObj = {};
        raw[currentKey] = currentList;
      } else if (rawVal.startsWith("[") && rawVal.endsWith("]")) {
        // Inline array: [nextjs, react]
        const items = rawVal
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean);
        raw[currentKey] = items;
        currentList = null;
        currentNestedObj = null;
      } else {
        currentList = null;
        currentNestedObj = null;
        let parsedVal: unknown = rawVal.replace(/^["']|["']$/g, "");
        if (rawVal === "true") parsedVal = true;
        else if (rawVal === "false") parsedVal = false;
        else if (/^\d+$/.test(rawVal)) parsedVal = Number(rawVal);
        raw[currentKey] = parsedVal;
      }
    }
  }

  // Thu dọn nested obj nếu có
  for (const [k, v] of Object.entries(raw)) {
    if (Array.isArray(v) && v.length === 0 && currentNestedObj && Object.keys(currentNestedObj).length > 0 && k === currentKey) {
      raw[k] = currentNestedObj;
    }
  }

  return { rawFrontmatter: raw, content };
}

/**
 * Trích xuất mục lục (Table of Contents) từ Markdown
 */
export function extractTableOfContents(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const hashes = match[1];
    const text = match[2]?.trim() || "";
    if (!hashes || !text) continue;

    const level = hashes.length as 2 | 3;
    items.push({
      level,
      title: text,
      id: slugify(text),
    });
  }

  return items;
}

/**
 * Kiểm tra bắt buộc đủ 6 phần heading cấp 2 theo chuẩn Case Study tại docs/spec.md
 */
export function validateCaseStudySections(content: string): {
  isValid: boolean;
  missingSections: string[];
  actualSections: string[];
} {
  const h2Regex = /^##\s+(.+)$/gm;
  const actualSections: string[] = [];
  let match;

  while ((match = h2Regex.exec(content)) !== null) {
    if (match[1]) {
      actualSections.push(match[1].trim());
    }
  }

  const missingSections = REQUIRED_CASE_STUDY_SECTIONS.filter(
    (requiredTitle) =>
      !actualSections.some((actual) =>
        actual.toLowerCase().includes(requiredTitle.toLowerCase()),
      ),
  );

  return {
    isValid: missingSections.length === 0,
    missingSections,
    actualSections,
  };
}

const PROJECTS_DIRECTORY = path.join(process.cwd(), "content", "projects");

export async function getProjectBySlug(slug: string): Promise<ParsedProject | null> {
  const filePath = path.join(PROJECTS_DIRECTORY, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { rawFrontmatter, content } = parseFrontmatter(fileContent);

  const parsedFrontmatter = projectFrontmatterSchema.parse({
    ...rawFrontmatter,
    slug,
  });

  const sectionValidation = validateCaseStudySections(content);
  if (!sectionValidation.isValid) {
    throw new Error(
      `Case study "${slug}" thiếu các phần bắt buộc: ${sectionValidation.missingSections.join(", ")}`,
    );
  }

  const toc = extractTableOfContents(content);

  return {
    frontmatter: parsedFrontmatter,
    content,
    toc,
  };
}

export async function getAllProjects(): Promise<Array<{ frontmatter: ProjectFrontmatter; slug: string }>> {
  if (!fs.existsSync(PROJECTS_DIRECTORY)) {
    return [];
  }

  const fileNames = fs.readdirSync(PROJECTS_DIRECTORY).filter((file) => file.endsWith(".mdx"));
  const projects: Array<{ frontmatter: ProjectFrontmatter; slug: string }> = [];

  for (const fileName of fileNames) {
    const slug = fileName.replace(/\.mdx$/, "");
    try {
      const project = await getProjectBySlug(slug);
      if (project && project.frontmatter.published) {
        projects.push({
          frontmatter: project.frontmatter,
          slug,
        });
      }
    } catch (err) {
      console.warn(`Lỗi khi đọc file MDX "${fileName}":`, err);
    }
  }

  // Sắp xếp theo order tăng dần
  return projects.sort((a, b) => a.frontmatter.order - b.frontmatter.order);
}
