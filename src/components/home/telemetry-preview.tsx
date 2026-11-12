import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { siteConfig } from "@/data/site-config";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function TelemetryPreview() {
  return (
    <section id="live" className="py-16 md:py-24 border-t border-border bg-surface/30">
      <Container>
        <SectionHeading
          monoLabel="05 / LIVE"
          title="Hoạt động trực tiếp"
          description="Dữ liệu đóng góp GitHub công khai gần đây và trạng thái triển khai."
        />

        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-text">
                GitHub Contribution Activity
              </h3>
              <p className="text-sm text-muted mt-1">
                Đồng bộ tự động qua GitHub GraphQL API với cơ chế ISR 3600 giây.
              </p>
            </div>
            <Link
              href={siteConfig.social.github}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="secondary" size="sm" iconRight={<ExternalLink className="h-3.5 w-3.5" />}>
                Xem GitHub Profile
              </Button>
            </Link>
          </div>
        </Card>
      </Container>
    </section>
  );
}
