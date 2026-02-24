import { ReactNode, ComponentPropsWithoutRef } from "react";
import type {
  DropdownContentVariants,
  DropdownItemVariants,
  DropdownLabelVariants,
} from "./Dropdown.styles";

// Context
export interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  onOpenChange?: (open: boolean) => void;
}

// Main Dropdown Container
export interface DropdownProps {
  children: ReactNode;
  /**
   * Control the open state (controlled mode)
   */
  open?: boolean;
  /**
   * Default open state (uncontrolled mode)
   */
  defaultOpen?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
}

// Trigger
export interface DropdownTriggerProps extends ComponentPropsWithoutRef<"button"> {
  children: ReactNode;
  /**
   * Render as a different element
   */
  asChild?: boolean;
}

// Content
export interface DropdownContentProps 
  extends Omit<ComponentPropsWithoutRef<"div">, "size">,
    DropdownContentVariants {
  children: ReactNode;
  /**
   * Prevent closing when clicking inside content
   */
  preventClose?: boolean;
}

// Item
export interface DropdownItemProps 
  extends Omit<ComponentPropsWithoutRef<"div">, "variant">,
    DropdownItemVariants {
  children: ReactNode;
  /**
   * Href for link items
   */
  href?: string;
  /**
   * Custom link component (Next.js Link, React Router Link, etc.)
   */
  linkComponent?: React.ElementType;
  /**
   * Icon to display before text
   */
  icon?: ReactNode;
  /**
   * Shortcut text to display after text
   */
  shortcut?: string;
  /**
   * Click handler
   */
  onClick?: () => void;
}

// Label
export interface DropdownLabelProps 
  extends ComponentPropsWithoutRef<"div">,
    DropdownLabelVariants {
  children: ReactNode;
}

// Separator
export interface DropdownSeparatorProps extends ComponentPropsWithoutRef<"div"> {
  // No additional props
}

export type {
  DropdownContentVariants,
  DropdownItemVariants,
  DropdownLabelVariants,
};
