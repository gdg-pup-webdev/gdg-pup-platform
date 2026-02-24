"use client";

import React from "react";
import { useDropdownContext } from "./Dropdown";
import type { DropdownTriggerProps } from "./Dropdown.types";

/**
 * Dropdown trigger button
 * 
 * @example
 * ```tsx
 * <DropdownTrigger>
 *   <Button>Menu</Button>
 * </DropdownTrigger>
 * ```
 */
export const DropdownTrigger: React.FC<DropdownTriggerProps> = ({
  children,
  asChild = false,
  onClick,
  ...props
}) => {
  const { open, setOpen } = useDropdownContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpen(!open);
    onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(!open);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
    }
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      "aria-expanded": open,
      "aria-haspopup": "true",
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-expanded={open}
      aria-haspopup="true"
      {...props}
    >
      {children}
    </button>
  );
};
