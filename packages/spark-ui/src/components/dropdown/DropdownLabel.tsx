"use client";

import React from "react";
import { dropdownLabelVariants } from "./Dropdown.styles";
import type { DropdownLabelProps } from "./Dropdown.types";

/**
 * Dropdown section label
 * 
 * @example
 * ```tsx
 * <DropdownLabel>Account</DropdownLabel>
 * ```
 */
export const DropdownLabel: React.FC<DropdownLabelProps> = ({
  children,
  variant,
  className,
  ...props
}) => {
  return (
    <div
      role="presentation"
      className={dropdownLabelVariants({ variant, className })}
      {...props}
    >
      {children}
    </div>
  );
};
