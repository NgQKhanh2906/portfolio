import { z } from "zod";
import { TECH_REGISTRY } from "@/lib/constants";

export const projectFrontmatterSchema = z.object({
  title: z
    .string({ required_error: "Tiêu đề dự án không được để trống" })
    .min(3, "Tiêu đề phải có tối thiểu 3 ký tự"),
  slug: z
    .string({ required_error: "Slug dự án không được để trống" })
    .regex(/^[a-z0-9-]+$/, "Slug chỉ được chứa chữ thường, số và dấu gạch ngang"),
  summary: z
    .string({ required_error: "Tóm tắt dự án không được để trống" })
    .min(10, "Tóm tắt phải có tối thiểu 10 ký tự")
    .max(300, "Tóm tắt không được vượt quá 300 ký tự"),
  coverImage: z
    .string({ required_error: "Ảnh cover không được để trống" }),
  year: z.coerce.number().int().min(2020).max(2030),
  role: z.string().min(2, "Vai trò không được để trống"),
  teamSize: z.string().min(1, "Quy mô nhóm không được để trống"),
  period: z.string().min(3, "Thời gian thực hiện không được để trống"),
  tech: z
    .array(z.string())
    .min(1, "Dự án phải có ít nhất 1 công nghệ")
    .refine(
      (slugs) => slugs.every((slug) => slug in TECH_REGISTRY),
      (slugs) => {
        const invalid = slugs.filter((slug) => !(slug in TECH_REGISTRY));
        return {
          message: `Công nghệ không hợp lệ trong TECH_REGISTRY: ${invalid.join(", ")}`,
        };
      },
    ),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  order: z.coerce.number().int().default(100),
  links: z
    .object({
      demo: z.string().url("Link Demo phải là URL hợp lệ").optional().or(z.literal("")),
      source: z.string().url("Link Source phải là URL hợp lệ").optional().or(z.literal("")),
    })
    .optional()
    .default({}),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
