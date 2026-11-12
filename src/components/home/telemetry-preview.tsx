import React from "react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { TelemetryWidget } from "@/components/telemetry/telemetry-widget";

export function TelemetryPreview() {
  return (
    <section id="live" className="py-16 md:py-24 border-t border-border bg-surface/30">
      <Container>
        <SectionHeading
          monoLabel="05 / LIVE"
          title="Hoạt động trực tiếp"
          description="Dữ liệu đóng góp mã nguồn GitHub và thông số giám sát hạ tầng."
        />

        <TelemetryWidget />
      </Container>
    </section>
  );
}
