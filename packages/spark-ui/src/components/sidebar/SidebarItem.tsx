"use client";

import React from "react";
import { sidebarItemVariants } from "./Sidebar.styles";
import { SidebarItemProps } from "./Sidebar.types";
import { cn } from "../../utils/cn";

/**
 * SidebarItem component
 * 
 * An individual item in the sidebar navigation.
 * 
 * @example
 * ```tsx
 * <SidebarItem active>Administrative</SidebarItem>
 * <SidebarItem onClick={() => console.log('clicked')}>Marketing</SidebarItem>
 * <SidebarItem nested>Web Development</SidebarItem>
 * ```
 */
export const SidebarItem = React.forwardRef<HTMLButtonElement, SidebarItemProps>(
  ({ children, className, active, nested, href, linkComponent: LinkComponent, onClick, ...props }, ref) => {
    const itemClasses = cn(sidebarItemVariants({ active, nested }), className);

    // If href is provided, render as a link
    if (href && LinkComponent) {
      return (
        <LinkComponent href={href} className={itemClasses}>
          <button
            ref={ref}
            className="w-full text-left"
            onClick={onClick}
            {...props}
          >
            {children}
          </button>
        </LinkComponent>
      );
    }

    // If href but no LinkComponent, render as anchor
    if (href) {
      return (
        <a href={href} className={itemClasses}>
          <button
            ref={ref}
            className="w-full text-left"
            onClick={onClick}
            {...props}
          >
            {children}
          </button>
        </a>
      );
    }

    // Otherwise render as button
    return (
      <button
        ref={ref}
        className={itemClasses}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

SidebarItem.displayName = "SidebarItem";
