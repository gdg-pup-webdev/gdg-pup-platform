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
        {/* CSS grid trick: animating grid-template-rows 0fr→1fr gives a
            smooth height transition without needing to measure the element. */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: isOpen ? "1fr" : "0fr",
            transition: "grid-template-rows 300ms ease",
          }}
        >
          <div className="overflow-hidden flex flex-col">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

SidebarGroup.displayName = "SidebarGroup";
