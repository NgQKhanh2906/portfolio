import React from "react";
import { cn } from "@/lib/utils";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: "sm" | "md";
  variant?: "ghost" | "secondary" | "outline";
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, label, size = "md", variant = "ghost", children, ...props }, ref) => {
    const baseStyles =
      "relative inline-flex items-center justify-center rounded-md transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 after:content-[''] after:absolute after:inset-[-4px] md:after:inset-0";

    const sizeStyles = {
      sm: "h-8 w-8 text-xs min-h-[36px] min-w-[36px] md:min-h-[32px] md:min-w-[32px]",
      md: "h-10 w-10 text-sm min-h-[44px] min-w-[44px] md:min-h-[40px] md:min-w-[40px]",
    };

    const variantStyles = {
      ghost: "text-text hover:bg-surface-2",
      secondary: "bg-surface-2 text-text hover:bg-border/60",
      outline: "border border-border text-text hover:bg-surface-2 hover:border-border-strong",
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";
