import { describe, expect, it } from "vitest";
import {
  CONTACT_SUBJECTS,
  CONTACT_SUBJECT_LABELS,
  contactSchema,
} from "@/lib/validations/contact";

describe("Contact Validation Schema", () => {
  const validPayload = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    subject: "job" as const,
    message: "Mình muốn trao đổi về cơ hội thực tập Backend Developer tại công ty.",
    token: "1700000000000.abcdef",
  };

  it("validates a complete valid contact payload and defaults website to empty string", () => {
    for (const subject of CONTACT_SUBJECTS) {
      expect(CONTACT_SUBJECT_LABELS[subject]).toBeTruthy();

      const result = contactSchema.safeParse({
        ...validPayload,
        subject,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.website).toBe("");
      }
    }
  });

  it("trims whitespace around name, email, and message before enforcing length rules", () => {
    const result = contactSchema.safeParse({
      ...validPayload,
      name: "   An   ",
      email: "  an@example.com  ",
      message: "   12345678901234567890   ",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("An");
      expect(result.data.email).toBe("an@example.com");
      expect(result.data.message).toBe("12345678901234567890");
    }
  });

  it("fails when name is shorter than 2 characters or longer than 80 characters", () => {
    const tooShort = contactSchema.safeParse({ ...validPayload, name: " A " });
    expect(tooShort.success).toBe(false);

    const tooLong = contactSchema.safeParse({
      ...validPayload,
      name: "A".repeat(81),
    });
    expect(tooLong.success).toBe(false);
  });

  it("fails when email format is invalid or exceeds 254 characters", () => {
    const badFormat = contactSchema.safeParse({
      ...validPayload,
      email: "invalid-email-address",
    });
    expect(badFormat.success).toBe(false);

    const tooLong = contactSchema.safeParse({
      ...validPayload,
      email: `${"a".repeat(245)}@example.com`,
    });
    expect(tooLong.success).toBe(false);
  });

  it("fails when subject is not in the allowed enum", () => {
    const result = contactSchema.safeParse({
      ...validPayload,
      subject: "advertisement",
    });
    expect(result.success).toBe(false);
  });

  it("fails when message is shorter than 20 characters or longer than 2000 characters", () => {
    const tooShort = contactSchema.safeParse({
      ...validPayload,
      message: "Quá ngắn",
    });
    expect(tooShort.success).toBe(false);

    const tooLong = contactSchema.safeParse({
      ...validPayload,
      message: "x".repeat(2001),
    });
    expect(tooLong.success).toBe(false);
  });

  it("fails when form token is empty", () => {
    const result = contactSchema.safeParse({
      ...validPayload,
      token: "",
    });
    expect(result.success).toBe(false);
  });
});
