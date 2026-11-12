"use client";

import { useEffect } from "react";

type KeyCombo = {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
};

export function useKeyboardShortcut(
  combo: KeyCombo,
  callback: (event: KeyboardEvent) => void,
  target: Window | HTMLElement = typeof window !== "undefined" ? window : ({} as any),
): void {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const isKeyMatch = event.key.toLowerCase() === combo.key.toLowerCase();
      const isCtrlOrMeta = combo.ctrlKey ? event.ctrlKey || event.metaKey : true;
      const isShift = combo.shiftKey !== undefined ? event.shiftKey === combo.shiftKey : true;
      const isAlt = combo.altKey !== undefined ? event.altKey === combo.altKey : true;

      if (isKeyMatch && isCtrlOrMeta && isShift && isAlt) {
        callback(event);
      }
    };

    target.addEventListener("keydown", handleKeyDown as EventListener);
    return () => target.removeEventListener("keydown", handleKeyDown as EventListener);
  }, [combo, callback, target]);
}
