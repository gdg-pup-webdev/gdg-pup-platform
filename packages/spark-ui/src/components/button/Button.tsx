import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "../../utils/cn";
import { buttonVariants } from "./Button.styles";
import type { ButtonProps } from "./Button.types";

/**
 * A flexible button component that supports multiple variants, sizes, and icon placement.
 *
 * @component
 * @example
 * ```tsx
 * <Button variant="default" size="md">
 *   Click me
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * <Button variant="colored" subVariant="dark-blue" size="lg" iconLeft={<IconComponent />}>
 *   Button with icon
 * </Button>
 * ```
 *
 * @param props - The button component props
 * @param props.className - Additional CSS class names to apply
 * @param props.variant - Visual style variant of the button
 * @param props.subVariant - Sub-variant styling option
 * @param props.size - The size of the button ("sm" | "md" | "lg")
 * @param props.iconLeft - Left icon element or true for default icon
 * @param props.iconRight - Right icon element or true for default icon
 * @param props.asChild - If true, renders as a Slot component for composition (default: false)
 * @param props.children - The button content
 * @param ref - Forward reference to the underlying HTMLButtonElement
 *
 * @returns A button element with optional icons and flexible styling
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      subVariant,
      size,
      iconLeft,
      iconRight,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // Render left icon if provided
    const renderLeftIcon = () => {
      if (!iconLeft) return null;
      return (
        <span
          className={cn(
            "button-icon",
            size === "sm" && "button-icon-sm",
            size === "md" && "button-icon-md",
            size === "lg" && "button-icon-lg"
          )}
        >
          {iconLeft === true ? (
            // Default icon if true is passed - could be replaced with a default icon
            <svg
              width={"16px"}
              height={"16px"}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
          ) : (
            iconLeft
          )}
        </span>
      );
    };

    // Render right icon if provided
    const renderRightIcon = () => {
      if (!iconRight) return null;
      return (
        <span
          className={cn(
            "button-icon",
            size === "sm" && "button-icon-sm",
            size === "md" && "button-icon-md",
            size === "lg" && "button-icon-lg"
          )}
        >
          {iconRight === true ? (
            // Default icon if true is passed - could be replaced with a default icon
            <svg
              width={"16px"}
              height={"16px"}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
          ) : (
            iconRight
          )}
        </span>
      );
    };

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, subVariant, size }), className)}
        {...props}
      >
        {renderLeftIcon()}
        {children}
        {renderRightIcon()}
      </Comp>
    );
  }
);

Button.displayName = "Button";
