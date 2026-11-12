"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface CodePreviewProps {
  code: string;
}

export function CodePreview({ code }: CodePreviewProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "Đã sao chép mã nguồn",
        description: "Mã JSX đã được lưu vào bộ nhớ tạm.",
        variant: "success",
        duration: 2500,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Không thể sao chép",
        description: "Vui lòng chọn mã và sao chép thủ công.",
        variant: "error",
      });
    }
  };

  return (
    <div className="relative rounded-lg border border-border bg-surface-2 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface/50 text-xs font-mono text-muted">
        <span>JSX Preview</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Sao chép mã nguồn"
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface hover:bg-surface-2 text-text transition-colors border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-accent" />
              <span className="text-accent font-medium">Đã chép</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Sao chép</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-text">
        <code>{code}</code>
      </pre>
    </div>
  );
}
