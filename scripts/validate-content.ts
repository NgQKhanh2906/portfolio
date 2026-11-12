import fs from "node:fs";
import path from "node:path";
import { parseFrontmatter, validateCaseStudySections } from "../src/lib/mdx";
import { projectFrontmatterSchema } from "../src/lib/validations/project-frontmatter";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

function validateAllProjects() {
  console.log("==> Đang kiểm tra tính toàn vẹn của các tệp Case Study MDX...");

  if (!fs.existsSync(PROJECTS_DIR)) {
    console.error(`[LỖI]: Không tìm thấy thư mục "${PROJECTS_DIR}"`);
    process.exit(1);
  }

  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".mdx"));

  if (files.length === 0) {
    console.error("[LỖI]: Không tìm thấy tệp MDX nào trong content/projects/");
    process.exit(1);
  }

  let hasError = false;

  for (const file of files) {
    const filePath = path.join(PROJECTS_DIR, file);
    const slug = file.replace(/\.mdx$/, "");
    const rawContent = fs.readFileSync(filePath, "utf-8");

    console.log(`\nKiểm tra: [${file}]`);

    // 1. Parse frontmatter
    const { rawFrontmatter, content } = parseFrontmatter(rawContent);

    // 2. Validate frontmatter schema
    const frontmatterResult = projectFrontmatterSchema.safeParse({
      ...rawFrontmatter,
      slug,
    });

    if (!frontmatterResult.success) {
      console.error(`  [X] Lỗi Frontmatter trong ${file}:`);
      for (const issue of frontmatterResult.error.issues) {
        console.error(`      - Đường dẫn: ${issue.path.join(".")} => ${issue.message}`);
      }
      hasError = true;
    } else {
      console.log(`  [✓] Frontmatter hợp lệ (Order: ${frontmatterResult.data.order}, Tech: ${frontmatterResult.data.tech.length})`);
    }

    // 3. Validate 6 required sections
    const sectionValidation = validateCaseStudySections(content);
    if (!sectionValidation.isValid) {
      console.error(`  [X] Thiếu các heading cấp 2 bắt buộc:`);
      for (const missing of sectionValidation.missingSections) {
        console.error(`      - "## ${missing}"`);
      }
      hasError = true;
    } else {
      console.log(`  [✓] Đầy đủ 6/6 heading nghiệp vụ chuẩn Case Study`);
    }
  }

  if (hasError) {
    console.error("\n[THẤT BẠI]: Một hoặc nhiều tệp MDX không vượt qua kiểm tra!");
    process.exit(1);
  } else {
    console.log(`\n[THÀNH CÔNG]: Toàn bộ ${files.length} tệp Case Study MDX đều đạt chuẩn kỹ thuật!`);
    process.exit(0);
  }
}

validateAllProjects();
