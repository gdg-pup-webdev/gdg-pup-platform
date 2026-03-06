"use client";

import React from "react";
import { sidebarVariants } from "./Sidebar.styles";
import { SidebarProps } from "./Sidebar.types";
import { cn } from "../../utils/cn";

/**
 * Sidebar component
 * 
 * A navigation sidebar with gradient border and glass-morphism effect.
 * 
 * @example
 * ```tsx
 * <Sidebar>
 *   <SidebarItem active>Administrative</SidebarItem>
 *   <SidebarItem>Marketing</SidebarItem>
 *   <SidebarGroup label="Tech Department">
 *     <SidebarItem nested>Leads</SidebarItem>
 *     <SidebarItem nested>Web Development</SidebarItem>
 *   </SidebarGroup>
 * </Sidebar>
 * ```
 */
export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ children, className, width, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(sidebarVariants({ width }), className)}
        {...props}
      >
        {children}
      </aside>
    );
  }
);

Sidebar.displayName = "Sidebar";
