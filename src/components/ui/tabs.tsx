"use client";

import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

export type TabsOrientation = "horizontal" | "vertical";
export type TabsVariant = "pill" | "underline";

interface TabsContextType {
  value: string;
  onChange: (value: string) => void;
  orientation: TabsOrientation;
  variant: TabsVariant;
  registerTrigger: (value: string, element: HTMLButtonElement | null) => void;
  triggerOrder: string[];
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: TabsOrientation;
  variant?: TabsVariant;
  children: React.ReactNode;
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  orientation = "horizontal",
  variant = "pill",
  children,
  className,
  ...props
}: TabsProps) {
  const [internalValue, setInternalValue] = useState<string>(defaultValue || "");
  const triggersMap = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [triggerOrder, setTriggerOrder] = useState<string[]>([]);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleChange = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange],
  );

  const registerTrigger = useCallback(
    (val: string, element: HTMLButtonElement | null) => {
      if (element) {
        triggersMap.current.set(val, element);
        setTriggerOrder((prev) => (prev.includes(val) ? prev : [...prev, val]));
      } else {
        triggersMap.current.delete(val);
      }
    },
    [],
  );

  return (
    <TabsContext.Provider
      value={{
        value: currentValue,
        onChange: handleChange,
        orientation,
        variant,
        registerTrigger,
        triggerOrder,
      }}
    >
      <div
        className={cn(
          "flex",
          orientation === "vertical" ? "flex-row gap-6 items-start" : "flex-col",
          className,
        )}
        data-orientation={orientation}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  "aria-label"?: string;
}

export function TabsList({
  className,
  children,
  "aria-label": ariaLabel,
  ...props
}: TabsListProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsList must be used within a Tabs component");
  }

  const { orientation, variant } = context;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const triggers = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'),
    );
    if (!triggers.length) return;

    const currentIndex = triggers.findIndex((el) => el === document.activeElement);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;

    if (orientation === "horizontal") {
      if (e.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % triggers.length;
      } else if (e.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
      }
    } else {
      if (e.key === "ArrowDown") {
        nextIndex = (currentIndex + 1) % triggers.length;
      } else if (e.key === "ArrowUp") {
        nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
      }
    }

    if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = triggers.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      const targetTrigger = triggers[nextIndex];
      if (targetTrigger) {
        targetTrigger.focus();
        targetTrigger.click();
      }
    }
  };

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex items-center select-none",
        orientation === "vertical"
          ? "flex-col items-stretch space-y-1 w-48 shrink-0"
          : "flex-row",
        variant === "pill"
          ? "rounded-lg bg-surface-2 p-1 text-muted border border-border"
          : orientation === "horizontal"
            ? "border-b border-border gap-6"
            : "border-r border-border pr-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({
  value,
  className,
  children,
  ...props
}: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger must be used within a Tabs component");
  }

  const isSelected = context.value === value;
  const { orientation, variant } = context;

  const tabId = `tab-${value}`;
  const panelId = `panel-${value}`;

  return (
    <button
      id={tabId}
      type="button"
      role="tab"
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      onClick={() => context.onChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap text-xs font-mono font-medium transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50",
        variant === "pill"
          ? cn(
              "rounded-md px-3 py-1.5",
              isSelected
                ? "bg-surface text-accent font-semibold shadow-xs border border-border"
                : "text-muted hover:text-text hover:bg-surface/50",
            )
          : cn(
              "relative px-1 py-2 font-sans text-sm",
              orientation === "horizontal" ? "border-b-2 -mb-px" : "border-r-2 -mr-2.5",
              isSelected
                ? "border-accent text-accent font-semibold"
                : "border-transparent text-muted hover:text-text hover:border-border",
            ),
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({
  value,
  className,
  children,
  ...props
}: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsContent must be used within a Tabs component");
  }

  if (context.value !== value) {
    return null;
  }

  const tabId = `tab-${value}`;
  const panelId = `panel-${value}`;

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={tabId}
      tabIndex={0}
      className={cn(
        "flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md animate-in fade-in-50",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
