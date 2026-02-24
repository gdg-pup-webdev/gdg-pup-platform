"use client";

import React from "react";
import { useDropdownContext } from "./Dropdown";
import { dropdownItemVariants } from "./Dropdown.styles";
import type { DropdownItemProps } from "./Dropdown.types";

/**
 * Dropdown menu item
 * 
 * @example
 * ```tsx
 * <DropdownItem onClick={() => console.log('clicked')}>
 *   Profile
 * </DropdownItem>
 * 
 * <DropdownItem href="/settings" linkComponent={Link}>
 *   Settings
 * </DropdownItem>
 * ```
 */
export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  href,
  linkComponent: LinkComponent,
  icon,
  shortcut,
  variant,
  disabled,
  onClick,
  className,
  ...props
}) => {
  const { setOpen } = useDropdownContext();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    onClick?.();
    
    // Close dropdown after clicking item (unless it's a link, which will navigate)
    if (!href) {
      setOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(e as any);
    }
  };

  const content = (
    <>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="flex-1">{children}</span>
      {shortcut && (
        <span className="ml-auto text-xs text-gray-500 pl-4">
          {shortcut}
        </span>
      )}
    </>
  );

  const baseClasses = dropdownItemVariants({ variant, disabled, className });

  // Render as link if href is provided
  if (href && LinkComponent) {
    return (
      <LinkComponent
        href={href}
        className={baseClasses}
        onClick={() => {
          onClick?.();
          setOpen(false);
        }}
        role="menuitem"
      >
        {content}
      </LinkComponent>
    );
  }

  if (href && !LinkComponent) {
    return (
      <a
        href={href}
        className={baseClasses}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
            return;
          }
          onClick?.();
          setOpen(false);
        }}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
      >
        {content}
      </a>
    );
  }

  // Render as div for action items
  return (
    <div
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      className={baseClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-disabled={disabled || undefined}
      {...props}
    >
      {content}
    </div>
  );
};
