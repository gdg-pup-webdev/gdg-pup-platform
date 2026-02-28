"use client";

import React from "react";
import { dropdownSeparatorVariants } from "./Dropdown.styles";
import type { DropdownSeparatorProps } from "./Dropdown.types";

/**
 * Dropdown separator line
 * 
 * @example
 * ```tsx
 * <DropdownSeparator />
 * ```
 */
export const DropdownSeparator: React.FC<DropdownSeparatorProps> = ({
  className,
  ...props
}) => {
  return (
    <div
      role="separator"
      className={dropdownSeparatorVariants({ className })}
      {...props}
    />
  );
};
