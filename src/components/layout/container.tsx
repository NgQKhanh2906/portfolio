import React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "narrow" | "wide";
}

export function Container({
  className,
  size = "default",
  children,
  ...props
}: ContainerProps) {
  const sizeStyles = {
    narrow: "max-w-3xl",
    default: "max-w-5xl", // 1024-1120px
    wide: "max-w-7xl",
  };

  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 md:px-8",
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
