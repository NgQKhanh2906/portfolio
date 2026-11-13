import React from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BrowserMockupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The URL to display in the mock address bar.
   * @default "localhost:3000"
   */
  url?: string;
  /**
   * Optional custom class for the viewport container wrapping children.
   */
  viewportClassName?: string;
  /**
   * Content to render inside the browser viewport.
   */
  children?: React.ReactNode;
}

/**
 * BrowserMockup provides an authentic browser window container featuring:
 * - 3 macOS traffic light window control dots (red, yellow, green) with shrink-0 aspect-square rounded-full
 * - Monospace address bar with a secure lock indicator
 * - 16:9 aspect-video viewport container (or customizable via viewportClassName)
 * - Engineering Notebook aesthetic with dark surface background and crisp subtle borders
 */
export const BrowserMockup = React.forwardRef<HTMLDivElement, BrowserMockupProps>(
  (
    {
      url = "localhost:3000",
      className,
      viewportClassName,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        data-testid="browser-mockup"
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all duration-base",
          className,
        )}
        {...props}
      >
        {/* Browser Top Chrome / Header */}
        <div
          data-testid="browser-header"
          className="flex h-9 select-none items-center justify-between border-b border-border bg-surface-2/80 px-3.5 backdrop-blur-sm"
        >
          {/* macOS Traffic Light Dots */}
          <div
            data-testid="browser-dots"
            className="flex items-center gap-1.5"
            aria-hidden="true"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 aspect-square rounded-full bg-[#FF5F56] border border-[#E0443E]/40"
              title="Đóng"
            />
            <span
              className="h-2.5 w-2.5 shrink-0 aspect-square rounded-full bg-[#FFBD2E] border border-[#DEA123]/40"
              title="Thu nhỏ"
            />
            <span
              className="h-2.5 w-2.5 shrink-0 aspect-square rounded-full bg-[#27C93F] border border-[#1AAB29]/40"
              title="Mở rộng"
            />
          </div>

          {/* Monospace Address Bar */}
          <div
            data-testid="browser-address-bar"
            className="mx-2 flex min-w-0 max-w-[240px] flex-1 items-center justify-center gap-1.5 rounded-md border border-border/80 bg-surface/90 px-2.5 py-0.5 text-[11px] font-mono text-muted shadow-inner sm:max-w-xs"
          >
            <Lock
              className="h-3 w-3 shrink-0 aspect-square text-accent/80"
              aria-hidden="true"
              data-testid="browser-lock-icon"
            />
            <span className="truncate" title={url}>
              {url}
            </span>
          </div>

          {/* Right Spacer to Balance Left Dots */}
          <div className="w-10 shrink-0" aria-hidden="true" />
        </div>

        {/* Browser Viewport */}
        <div
          data-testid="browser-viewport"
          className={cn(
            "relative w-full aspect-video overflow-hidden bg-surface text-text",
            viewportClassName,
          )}
        >
          {children}
        </div>
      </div>
    );
  },
);

BrowserMockup.displayName = "BrowserMockup";
