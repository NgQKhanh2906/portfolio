"use client";

import React, { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  type TabsOrientation,
  type TabsVariant,
} from "@/components/ui/tabs";
import { CodePreview } from "../code-preview";

export function TabsDemo() {
  const [tabCount, setTabCount] = useState<number>(3);
  const [orientation, setOrientation] = useState<TabsOrientation>("horizontal");
  const [variant, setVariant] = useState<TabsVariant>("pill");
  const [activeTab, setActiveTab] = useState<string>("tab-1");

  const tabItems = [
    { id: "tab-1", label: "01 / Tổng quan", content: "Nội dung bảng tổng quan kiến trúc hệ thống và luồng dữ liệu chính." },
    { id: "tab-2", label: "02 / Thông số", content: "Chỉ số hiệu năng First Load JS < 150 kB và Lighthouse điểm tuyệt đối 100." },
    { id: "tab-3", label: "03 / Bảo mật", content: "Cơ chế bảo vệ đa lớp: Honeypot chống bot, SHA-256 IP salt và HTTP Security Headers." },
    { id: "tab-4", label: "04 / Giám sát", content: "Nhật ký telemetry tự động đồng bộ đóng góp GitHub và thời gian triển khai thực tế." },
    { id: "tab-5", label: "05 / Triển khai", content: "Quy trình CI/CD tự động kiểm thử toàn diện trước khi phát hành lên môi trường Vercel." },
  ].slice(0, tabCount);

  const generatedCode = `<Tabs
  defaultValue="tab-1"
  orientation="${orientation}"
  variant="${variant}"
>
  <TabsList aria-label="Mục thông tin kiến trúc">
    ${tabItems.map((t) => `<TabsTrigger value="${t.id}">${t.label}</TabsTrigger>`).join("\n    ")}
  </TabsList>
  ${tabItems
    .map(
      (t) => `<TabsContent value="${t.id}">
    <p>${t.content}</p>
  </TabsContent>`,
    )
    .join("\n  ")}
</Tabs>`;

  return (
    <div className="space-y-6">
      {/* Interactive Canvas */}
      <div className="min-h-[260px] rounded-xl border border-border bg-surface p-8 shadow-xs">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          orientation={orientation}
          variant={variant}
          className="w-full"
        >
          <TabsList aria-label="Demo Tabs điều hướng">
            {tabItems.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabItems.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="mt-6 rounded-lg border border-border bg-surface-2 p-5"
            >
              <h5 className="font-mono text-xs font-semibold text-accent uppercase">
                {tab.label}
              </h5>
              <p className="mt-2 text-sm text-text leading-relaxed">{tab.content}</p>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Controls Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-lg border border-border bg-surface-2/60">
        {/* Tab Count */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-muted uppercase">Số lượng thẻ Tab</label>
          <select
            value={tabCount}
            onChange={(e) => {
              const newCount = Number(e.target.value);
              setTabCount(newCount);
              if (Number(activeTab.replace("tab-", "")) > newCount) {
                setActiveTab("tab-1");
              }
            }}
            className="w-full h-9 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <option value={2}>2 tabs</option>
            <option value={3}>3 tabs</option>
            <option value={4}>4 tabs</option>
            <option value={5}>5 tabs</option>
          </select>
        </div>

        {/* Orientation */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-muted uppercase">Hướng hiển thị (Orientation)</label>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as TabsOrientation)}
            className="w-full h-9 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <option value="horizontal">Horizontal (Ngang - Mặc định)</option>
            <option value="vertical">Vertical (Dọc)</option>
          </select>
        </div>

        {/* Variant */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-muted uppercase">Kiểu dáng (Variant)</label>
          <select
            value={variant}
            onChange={(e) => setVariant(e.target.value as TabsVariant)}
            className="w-full h-9 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <option value="pill">Pill (Khối thẻ con nhộng)</option>
            <option value="underline">Underline (Đường kẻ viền chân)</option>
          </select>
        </div>
      </div>

      {/* Code Preview */}
      <CodePreview code={generatedCode} />
    </div>
  );
}
