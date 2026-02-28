"use client";

import React, { useState } from "react";
import { sidebarGroupVariants } from "./Sidebar.styles";
import { SidebarGroupProps } from "./Sidebar.types";
import { cn } from "../../utils/cn";

/**
 * SidebarGroup component
 * 
 * A collapsible group of sidebar items with a label.
 * 
 * @example
 * ```tsx
 * <SidebarGroup label="Tech Department" defaultOpen>
 *   <SidebarItem nested>Leads</SidebarItem>
 *   <SidebarItem nested>Project Management</SidebarItem>
 *   <SidebarItem nested>Web Development</SidebarItem>
 * </SidebarGroup>
 * ```
 */
export const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ children, className, label, defaultOpen = true, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
      <div
        ref={ref}
        className={cn(sidebarGroupVariants(), className)}
        {...props}
      >
        <button
          className="sidebar-item text-left cursor-pointer text-white text-base font-normal hover:text-white/80 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {label}
        </button>
        {isOpen && (
          <div className="flex flex-col ">
            {children}
          </div>
        )}
      </div>
    );
  }
);

SidebarGroup.displayName = "SidebarGroup";
