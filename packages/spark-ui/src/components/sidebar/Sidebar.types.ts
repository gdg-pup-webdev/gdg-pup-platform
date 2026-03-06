import { ComponentPropsWithoutRef, ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import { sidebarVariants, sidebarItemVariants, sidebarGroupVariants } from "./Sidebar.styles";

/**
 * Sidebar component props
 */
export interface SidebarProps extends ComponentPropsWithoutRef<"aside">, VariantProps<typeof sidebarVariants> {
  children: ReactNode;
}

/**
 * SidebarItem component props
 */
export interface SidebarItemProps extends ComponentPropsWithoutRef<"button">, VariantProps<typeof sidebarItemVariants> {
  children: ReactNode;
  active?: boolean;
  nested?: boolean;
  href?: string;
  linkComponent?: React.ComponentType<any>;
  onClick?: () => void;
}

/**
 * SidebarGroup component props
 */
export interface SidebarGroupProps extends ComponentPropsWithoutRef<"div">, VariantProps<typeof sidebarGroupVariants> {
  children: ReactNode;
  label: string;
  defaultOpen?: boolean;
}
