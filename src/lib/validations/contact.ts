import { z } from "zod";

export const CONTACT_SUBJECTS = ["job", "project", "feedback", "other"] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

export const CONTACT_SUBJECT_LABELS: Record<ContactSubject, string> = {
  job: "Cơ hội việc làm / Thực tập",
  project: "Hợp tác dự án",
  feedback: "Góp ý kỹ thuật",
  other: "Khác",
};

export const contactFieldsSchema = z.object({
  name: z
    .string({ required_error: "Vui lòng nhập họ và tên." })
    .trim()
    .min(2, "Họ và tên phải có tối thiểu 2 ký tự.")
    .max(80, "Họ và tên không được vượt quá 80 ký tự."),
  email: z
    .string({ required_error: "Vui lòng nhập địa chỉ email." })
    .trim()
    .min(1, "Vui lòng nhập địa chỉ email.")
    .max(254, "Địa chỉ email không được vượt quá 254 ký tự.")
    .email("Email không hợp lệ."),
  subject: z.enum(CONTACT_SUBJECTS, {
    errorMap: () => ({ message: "Vui lòng chọn chủ đề liên hệ hợp lệ." }),
  }),
  message: z
    .string({ required_error: "Vui lòng nhập nội dung tin nhắn." })
    .trim()
    .min(20, "Nội dung tin nhắn phải có độ dài tối thiểu 20 ký tự.")
    .max(2000, "Nội dung tin nhắn không được vượt quá 2000 ký tự."),
});

export const contactSchema = contactFieldsSchema.extend({
  website: z.string().optional().default(""),
  token: z
    .string({ required_error: "Thiếu mã xác thực biểu mẫu." })
    .min(1, "Thiếu mã xác thực biểu mẫu."),
});

export type ContactFieldsInput = z.infer<typeof contactFieldsSchema>;

export type SendContactInput = {
  name: string;
  email: string;
  subject: ContactSubject;
  message: string;
  website?: string;
  token: string;
};
