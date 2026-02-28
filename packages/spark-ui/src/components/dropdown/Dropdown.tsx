"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import type { DropdownProps, DropdownContextValue } from "./Dropdown.types";

const DropdownContext = createContext<DropdownContextValue | undefined>(undefined);

export const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("Dropdown components must be used within a Dropdown");
  }
  return context;
};

/**
 * Dropdown component with compound pattern
 * 
 * @example
 * ```tsx
 * <Dropdown>
 *   <DropdownTrigger>
 *     <Button>Menu</Button>
 *   </DropdownTrigger>
 *   <DropdownContent>
 *     <DropdownItem>Profile</DropdownItem>
 *     <DropdownItem>Settings</DropdownItem>
 *   </DropdownContent>
 * </Dropdown>
 * ```
 */
export const Dropdown: React.FC<DropdownProps> = ({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  const value: DropdownContextValue = {
    open,
    setOpen,
    onOpenChange,
  };

  return (
    <DropdownContext.Provider value={value}>
      <div className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  );
};
