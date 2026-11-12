import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  message?: string;
}

export function FieldError({ className, message, ...props }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className={cn(
        "mt-1.5 flex items-center gap-1.5 text-xs font-medium text-status-danger",
        className,
      )}
      {...props}
    >
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}
