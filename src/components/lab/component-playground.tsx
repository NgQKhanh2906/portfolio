"use client";

import React from "react";
import { LAB_COMPONENTS, type LabComponentMeta } from "@/data/lab-components";
import { ButtonDemo } from "./demos/button-demo";
import { TabsDemo } from "./demos/tabs-demo";
import { ToastDemo } from "./demos/toast-demo";
import { A11yNotes } from "./a11y-notes";

interface ComponentPlaygroundProps {
  activeId: string;
}

export function ComponentPlayground({ activeId }: ComponentPlaygroundProps) {
  const meta: LabComponentMeta = LAB_COMPONENTS[activeId] ?? LAB_COMPONENTS.button!;

  const renderDemo = () => {
    switch (meta.id) {
      case "button":
        return <ButtonDemo />;
      case "tabs":
        return <TabsDemo />;
      case "toast":
        return <ToastDemo />;
      default:
        return <ButtonDemo />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Component Header Information */}
      <div className="border-b border-border pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider">
            {meta.tag}
          </span>
          <span className="h-3 w-px bg-border" />
          <span className="rounded-full bg-surface-2 px-2.5 py-0.5 font-mono text-[11px] text-muted border border-border">
            {meta.category}
          </span>
        </div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-text">
          {meta.name}
        </h2>
        <p className="mt-2 text-sm text-muted leading-relaxed max-w-2xl">
          {meta.description}
        </p>
      </div>

      {/* Demo Section */}
      <div>{renderDemo()}</div>

      {/* Accessibility Documentation Section */}
      <div className="pt-4">
        <A11yNotes meta={meta} />
      </div>
    </div>
  );
}
