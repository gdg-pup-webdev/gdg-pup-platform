import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "../../utils/cn";
import { buttonVariants } from "./Button.styles";
import type { ButtonProps } from "./Button.types";

/**
 * Button component with Google-style gradient borders and multiple variants.
 * 
 * @component
 * @example
 * ```tsx
 * // Default button
 * <Button variant="default" size="md">Click me</Button>
 * 
 * // Outline button with icon
 * <Button variant="outline" iconLeft={<Icon />}>Submit</Button>
 * 
 * // Dark themed button
 * <Button variant="default" theme="dark" size="lg">Get Started</Button>
 * ```
 * 
 * @param {Object} props - Component props
 * @param {"default" | "outline" | "stroke" | "link"} [props.variant="default"] - Visual variant of the button
 * @param {"sm" | "md" | "lg"} [props.size="md"] - Size of the button
 * @param {"light" | "dark"} [props.theme="light"] - Theme for default variant (only applies to default)
 * @param {React.ReactNode | boolean} [props.iconLeft] - Icon to display on the left side
 * @param {React.ReactNode | boolean} [props.iconRight] - Icon to display on the right side
 * @param {boolean} [props.asChild=false] - Render as child element using Radix Slot
 * @param {React.ReactNode} props.children - Button content/text
 * 
 * @returns {React.ForwardRefExoticComponent} Button component
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      theme,
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
        className={cn(buttonVariants({ variant, size, theme }), className)}
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
