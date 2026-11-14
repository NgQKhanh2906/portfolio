import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getGuestbookEntries } from "@/lib/db/queries/guestbook";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { GuestbookList } from "@/components/guestbook/guestbook-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sổ lưu niệm",
  description: "Để lại dấu ấn hoặc lời chào khi ghé thăm trang cá nhân.",
};

export default async function GuestbookPage() {
  const session = await auth();
  const entries = await getGuestbookEntries();

  return (
    <Container className="py-12 md:py-20 max-w-4xl">
      <SectionHeading
        monoLabel="04 / GUESTBOOK"
        title="Sổ lưu niệm"
        description="Để lại dấu ấn hoặc lời chào khi ghé thăm trang cá nhân."
      />

      <GuestbookList
        initialEntries={entries}
        currentUser={session?.user ?? null}
      />
    </Container>
  );
}
