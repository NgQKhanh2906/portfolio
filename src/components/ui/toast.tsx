"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "info" | "success" | "warning" | "error" | "danger";
export type ToastPosition = "top-right" | "bottom-right" | "bottom-center";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  toast: (options: ToastOptions) => void;
  dismiss: (id: string) => void;
  position: ToastPosition;
  setPosition: (pos: ToastPosition) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastItemProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

function SingleToast({ item, onDismiss }: ToastItemProps) {
  const duration = item.duration ?? 4000;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const remainingTimeRef = useRef<number>(duration);
  const startTimeRef = useRef<number>(Date.now());
  const isPausedRef = useRef<boolean>(false);

  const startTimer = useCallback(() => {
    if (duration <= 0) return;
    startTimeRef.current = Date.now();
    isPausedRef.current = false;
    timerRef.current = setTimeout(() => {
      onDismiss(item.id);
    }, remainingTimeRef.current);
  }, [duration, item.id, onDismiss]);

  const pauseTimer = useCallback(() => {
    if (duration <= 0 || isPausedRef.current) return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const elapsed = Date.now() - startTimeRef.current;
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    isPausedRef.current = true;
  }, [duration]);

  const resumeTimer = useCallback(() => {
    if (duration <= 0 || !isPausedRef.current || remainingTimeRef.current <= 0) return;
    startTimer();
  }, [duration, startTimer]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startTimer]);

  const normalizedVariant = item.variant === "danger" ? "error" : item.variant || "info";

  const variantConfig = {
    info: {
      border: "border-status-info/30 bg-surface",
      icon: <Info className="h-4 w-4 text-status-info shrink-0" />,
      role: "status",
      ariaLive: "polite" as const,
    },
    success: {
      border: "border-status-success/30 bg-surface",
      icon: <CheckCircle2 className="h-4 w-4 text-status-success shrink-0" />,
      role: "status",
      ariaLive: "polite" as const,
    },
    warning: {
      border: "border-status-warning/30 bg-surface",
      icon: <AlertTriangle className="h-4 w-4 text-status-warning shrink-0" />,
      role: "alert",
      ariaLive: "polite" as const,
    },
    error: {
      border: "border-status-danger/30 bg-surface",
      icon: <AlertOctagon className="h-4 w-4 text-status-danger shrink-0" />,
      role: "alert",
      ariaLive: "assertive" as const,
    },
  };

  const currentConfig = variantConfig[normalizedVariant];

  return (
    <div
      role={currentConfig.role}
      aria-live={currentConfig.ariaLive}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      onFocus={pauseTimer}
      onBlur={resumeTimer}
      tabIndex={0}
      className={cn(
        "pointer-events-auto flex items-start gap-3 rounded-lg border p-3.5 shadow-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-accent animate-in fade-in-0 duration-fast",
        currentConfig.border,
      )}
    >
      <div className="mt-0.5">{currentConfig.icon}</div>
      <div className="flex-1 min-w-0">
        <h6 className="text-xs font-semibold text-text">{item.title}</h6>
        {item.description && (
          <p className="text-xs text-muted mt-0.5 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        aria-label="Đóng thông báo"
        className="text-muted hover:text-text transition-colors p-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ToastProvider({
  children,
  defaultPosition = "bottom-right",
}: {
  children: React.ReactNode;
  defaultPosition?: ToastPosition;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [position, setPosition] = useState<ToastPosition>(defaultPosition);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = "info", duration = 4000 }: ToastOptions) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, title, description, variant, duration };
      setToasts((prev) => [...prev, newToast]);
    },
    [],
  );

  const positionStyles: Record<ToastPosition, string> = {
    "top-right": "top-5 right-5 flex-col",
    "bottom-right": "bottom-5 right-5 flex-col",
    "bottom-center": "bottom-5 left-1/2 -translate-x-1/2 flex-col items-center",
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, position, setPosition }}>
      {children}
      <div
        aria-label="Khu vực thông báo"
        className={cn(
          "fixed z-50 flex gap-2.5 max-w-sm w-full pointer-events-none p-4",
          positionStyles[position],
        )}
      >
        {toasts.map((item) => (
          <SingleToast key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
