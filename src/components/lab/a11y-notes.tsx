import React from "react";
import { ShieldCheck, Keyboard } from "lucide-react";
import { Kbd } from "@/components/ui/kbd";
import type { LabComponentMeta } from "@/data/lab-components";

interface A11yNotesProps {
  meta: LabComponentMeta;
}

export function A11yNotes({ meta }: A11yNotesProps) {
  const { a11yNotes } = meta;

  return (
    <div className="space-y-4 rounded-lg border border-border bg-surface p-5 text-sm">
      <div className="flex items-center gap-2 font-mono text-xs font-semibold text-accent uppercase tracking-wider">
        <ShieldCheck className="h-4 w-4" />
        <span>Ghi chú Tiêu chuẩn Accessibility (WCAG 2.1 AA)</span>
      </div>

      <div className="space-y-1">
        <span className="font-mono text-xs text-muted">ARIA Roles:</span>
        <p className="font-mono text-xs text-text bg-surface-2 p-2 rounded border border-border">
          {a11yNotes.role}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1.5 font-mono text-xs text-muted">
          <Keyboard className="h-3.5 w-3.5" />
          <span>Hỗ trợ Phím tắt:</span>
        </div>
        <div className="divide-y divide-border rounded border border-border bg-surface-2/50">
          {a11yNotes.keyboard.map((kb) => (
            <div
              key={kb.key}
              className="flex items-center justify-between gap-4 p-2.5 text-xs"
            >
              <div className="flex items-center gap-1 shrink-0">
                {kb.key.split(" / ").map((k) => (
                  <Kbd key={k}>{k}</Kbd>
                ))}
              </div>
              <span className="text-muted text-right">{kb.description}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1.5 pt-2 border-t border-border">
        <span className="font-mono text-xs text-muted">Nguyên tắc Thiết kế & Triển khai:</span>
        <ul className="space-y-1.5 list-disc list-inside text-xs text-muted leading-relaxed">
          {a11yNotes.notes.map((note, idx) => (
            <li key={idx} className="marker:text-accent">
              <span className="text-text">{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
