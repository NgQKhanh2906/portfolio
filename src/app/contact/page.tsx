import React from "react";
import type { Metadata } from "next";
import { ContactChannels } from "@/components/contact/contact-channels";
import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { createFormToken } from "@/lib/crypto";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Kết nối và trao đổi cơ hội thực tập, hợp tác phát triển Web & Backend với Nguyễn Quốc Khánh.",
  openGraph: {
    title: "Liên hệ | Nguyễn Quốc Khánh",
    description:
      "Kết nối và trao đổi cơ hội thực tập, hợp tác phát triển Web & Backend với Nguyễn Quốc Khánh.",
  },
};

export default function ContactPage() {
  const formToken = createFormToken();

  return (
    <section className="py-12 md:py-20">
      <Container>
        <SectionHeading
          monoLabel="05 / CONTACT"
          title="Liên hệ & Kết nối"
          description="Mình luôn sẵn sàng trao đổi về cơ hội thực tập Backend / Web Developer, các dự án mã nguồn mở hoặc thảo luận kỹ thuật."
        />

        <div className="mt-8 grid gap-6 md:grid-cols-12 items-start">
          <div className="md:col-span-7">
            <ContactForm formToken={formToken} />
          </div>
          <div className="md:col-span-5">
            <ContactChannels />
          </div>
        </div>
      </Container>
    </section>
  );
}
