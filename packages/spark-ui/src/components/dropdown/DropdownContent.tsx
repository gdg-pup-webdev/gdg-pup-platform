"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useDropdownContext } from "./Dropdown";
import { dropdownContentVariants } from "./Dropdown.styles";
import type { DropdownContentProps } from "./Dropdown.types";

/**
 * Dropdown content container
 * 
 * @example
 * ```tsx
 * <DropdownContent>
 *   <DropdownItem>Item 1</DropdownItem>
 *   <DropdownItem>Item 2</DropdownItem>
 * </DropdownContent>
 * ```
 */
export const DropdownContent: React.FC<DropdownContentProps> = ({
  children,
  variant,
  size,
  position,
  animation,
  preventClose = false,
  className,
  ...props
}) => {
  const { open, setOpen } = useDropdownContext();
  const contentRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is outside the dropdown content
      if (contentRef.current && !contentRef.current.contains(target)) {
        // Also check if click is not on the trigger
        const trigger = contentRef.current.parentElement?.querySelector('[aria-haspopup="true"]');
        if (trigger && !trigger.contains(target)) {
          setOpen(false);
        }
      }
    };

    // Small delay to prevent immediate close on trigger click
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  const handleContentClick = (e: React.MouseEvent) => {
    if (preventClose) {
      e.stopPropagation();
    }
  };

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      role="menu"
      data-state={open ? "open" : "closed"}
      className={dropdownContentVariants({ variant, size, position, animation, className })}
      onClick={handleContentClick}
      {...props}
    >
      {children}
    </div>
  );
};
