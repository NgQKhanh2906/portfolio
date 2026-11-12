"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { MousePointer, LayoutList, Bell } from "lucide-react";
import { LAB_COMPONENTS } from "@/data/lab-components";
import { ComponentPlayground } from "./component-playground";
import { cn } from "@/lib/utils";

export function LabShell() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const componentKeys = Object.keys(LAB_COMPONENTS);

  const [activeComponent, setActiveComponent] = useState<string>(() => {
    const param = searchParams.get("c");
    if (param && componentKeys.includes(param)) {
      return param;
    }
    return "button";
  });

  useEffect(() => {
    const param = searchParams.get("c");
    if (param && componentKeys.includes(param) && param !== activeComponent) {
      setActiveComponent(param);
    }
  }, [searchParams, componentKeys, activeComponent]);

  const handleSelectComponent = useCallback(
    (id: string) => {
      setActiveComponent(id);
      const params = new URLSearchParams(searchParams.toString());
      params.set("c", id);
      const queryString = params.toString();
      router.replace(`${pathname}?${queryString}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const componentIcons: Record<string, React.ReactNode> = {
    button: <MousePointer className="h-4 w-4" />,
    tabs: <LayoutList className="h-4 w-4" />,
    toast: <Bell className="h-4 w-4" />,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Sidebar Navigation */}
      <aside className="lg:col-span-3 space-y-4">
        <div className="rounded-lg border border-border bg-surface p-4">
          <span className="font-mono text-xs font-semibold text-muted uppercase tracking-wider block mb-3">
            Danh mục Component
          </span>
          <nav className="flex flex-col gap-1.5" role="tablist" aria-label="Danh mục linh kiện UI">
            {Object.values(LAB_COMPONENTS).map((item) => {
              const isActive = activeComponent === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleSelectComponent(item.id)}
                  className={cn(
                    "flex items-center justify-between w-full rounded-md px-3 py-2.5 text-xs font-mono font-medium transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    isActive
                      ? "bg-accent/10 text-accent font-semibold border border-accent/30"
                      : "text-muted hover:text-text hover:bg-surface-2",
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    {componentIcons[item.id]}
                    <span>{item.name}</span>
                  </div>
                  <span className="text-[10px] opacity-70">{item.tag.split(" / ")[0]}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Info card */}
        <div className="rounded-lg border border-border bg-surface/50 p-4 text-xs space-y-2">
          <span className="font-mono text-[11px] font-semibold text-accent uppercase">
            Tiêu chuẩn Kỹ thuật
          </span>
          <p className="text-muted leading-relaxed">
            100% Primitive Components được viết tay, không phụ thuộc UI library bên ngoài, tuân thủ WCAG 2.1 AA.
          </p>
        </div>
      </aside>

      {/* Main Playground Area */}
      <main className="lg:col-span-9">
        <ComponentPlayground activeId={activeComponent} />
      </main>
    </div>
  );
}
