"use client";

import { useState, useCallback } from "react";

export function useCopyToClipboard(timeout: number = 2000): {
  isCopied: boolean;
  copy: (text: string) => Promise<boolean>;
} {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copy = useCallback(
    async (text: string) => {
      if (!navigator?.clipboard) {
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), timeout);
        return true;
      } catch {
        setIsCopied(false);
        return false;
      }
    },
    [timeout],
  );

  return { isCopied, copy };
}
