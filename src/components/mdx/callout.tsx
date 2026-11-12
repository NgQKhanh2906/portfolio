import React from "react";
import { Info, AlertTriangle, CheckCircle2, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CalloutProps {
  type?: "info" | "warning" | "success" | "danger";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Callout({
  type = "info",
  title,
  children,
  className,
}: CalloutProps) {
  const styles = {
    info: {
      container: "border-status-info/30 bg-status-info-soft/40 text-text",
      icon: <Info className="h-4 w-4 text-status-info shrink-0 mt-0.5" />,
      titleColor: "text-status-info",
    },
    warning: {
      container: "border-status-warning/30 bg-status-warning-soft/40 text-text",
      icon: <AlertTriangle className="h-4 w-4 text-status-warning shrink-0 mt-0.5" />,
      titleColor: "text-status-warning",
    },
    success: {
      container: "border-status-success/30 bg-status-success-soft/40 text-text",
      icon: <CheckCircle2 className="h-4 w-4 text-status-success shrink-0 mt-0.5" />,
      titleColor: "text-status-success",
    },
    danger: {
      container: "border-status-danger/30 bg-status-danger-soft/40 text-text",
      icon: <AlertOctagon className="h-4 w-4 text-status-danger shrink-0 mt-0.5" />,
      titleColor: "text-status-danger",
    },
  };

  const current = styles[type];

  return (
    <div
      className={cn(
        "my-6 flex gap-3 rounded-lg border p-4 text-sm leading-relaxed",
        current.container,
        className,
      )}
    >
      {current.icon}
      <div className="flex-1 min-w-0">
        {title && (
          <h5 className={cn("font-semibold mb-1 text-xs uppercase tracking-wider font-mono", current.titleColor)}>
            {title}
          </h5>
        )}
        <div className="text-muted leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
          {children}
        </div>
      </div>
    </div>
  );
}
