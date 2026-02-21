import React, { createContext, useContext, useState } from "react";
import { cn } from "../../utils/cn";
import {
  tabsListStyles,
  tabsTriggerStyles,
  tabsContentStyles,
} from "./Tabs.styles";
import type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from "./Tabs.types";

interface TabsContextValue {
  activeValue: string;
  onValueChange: (value: string) => void;
  variant?: "default" | "pills";
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
};

/**
 * A tabs component for organizing content into switchable panels.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="tab1">
 *   <TabsList>
 *     <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *     <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">Content 1</TabsContent>
 *   <TabsContent value="tab2">Content 2</TabsContent>
 * </Tabs>
 * ```
 */
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      defaultValue = "",
      value: controlledValue,
      onValueChange,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const activeValue = isControlled ? controlledValue : internalValue;

    const handleValueChange = (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    return (
      <TabsContext.Provider
        value={{ activeValue, onValueChange: handleValueChange }}
      >
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  },
);

Tabs.displayName = "Tabs";

/**
 * Container for tab triggers.
 *
 * @example
 * ```tsx
 * <TabsList variant="pills">
 *   <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 * </TabsList>
 * ```
 */
export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ variant, className, children, ...props }, ref) => {
    const context = useTabsContext();

    // Store variant in a way child TabsTriggers can access it
    const childrenWithVariant = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { variant } as any);
      }
      return child;
    });

    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(tabsListStyles({ variant }), className)}
        {...props}
      >
        {childrenWithVariant}
      </div>
    );
  },
);

TabsList.displayName = "TabsList";

/**
 * A tab trigger button.
 *
 * @example
 * ```tsx
 * <TabsTrigger value="overview">Overview</TabsTrigger>
 * ```
 */
export const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  TabsTriggerProps
>(({ value, variant, className, children, ...props }, ref) => {
  const { activeValue, onValueChange } = useTabsContext();
  const isActive = activeValue === value;

  return (
    <button
      ref={ref}
      role="tab"
      type="button"
      data-state={isActive ? "active" : "inactive"}
      aria-selected={isActive}
      className={cn(tabsTriggerStyles({ variant }), className)}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  );
});

TabsTrigger.displayName = "TabsTrigger";

/**
 * Content panel for a tab.
 *
 * @example
 * ```tsx
 * <TabsContent value="overview">
 *   <p>Overview content</p>
 * </TabsContent>
 * ```
 */
export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className, children, ...props }, ref) => {
    const { activeValue } = useTabsContext();
    const isActive = activeValue === value;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        tabIndex={0}
        className={cn(tabsContentStyles(), className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

TabsContent.displayName = "TabsContent";
