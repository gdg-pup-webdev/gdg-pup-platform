import * as React from "react";
import { cn } from "../../utils/cn";
import { textVariants } from "./Text.styles";
import type { TextProps } from "./Text.types";

/**
 * Text Component
 *
 * A typography primitive that provides consistent text styling across the application.
 * Use Text for all text content to ensure design system compliance.
 *
 * @example Heading
 * ```tsx
 * <Text variant="heading-1">Page Title</Text>
 * <Text variant="heading-2">Section Title</Text>
 * ```
 *
 * @example Body text with colors
 * ```tsx
 * <Text variant="body">Default body text</Text>
 * <Text variant="body" color="muted">Secondary information</Text>
 * <Text variant="body" color="error">Error message</Text>
 * ```
 *
 * @example Truncated text
 * ```tsx
 * <Text variant="body" clamp={2}>
 *   Long text that will be truncated after 2 lines...
 * </Text>
 * ```
 *
 * @example As different elements
 * ```tsx
 * <Text as="h1" variant="heading-1">Semantic H1</Text>
 * <Text as="label" variant="label">Form Label</Text>
 * <Text as="span" variant="caption">Inline caption</Text>
 * ```
 */
export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      className,
      variant,
      color,
      align,
      weight,
      truncate,
      clamp,
      gradient,
      as,
      children,
      ...props
    },
    ref,
  ) => {
    // Default element based on variant
    const defaultElement = (() => {
      switch (variant) {
        case "display":
        case "heading-1":
          return "h1";
        case "heading-2":
          return "h2";
        case "heading-3":
          return "h3";
        case "heading-4":
          return "h4";
        case "heading-5":
          return "h5";
        case "heading-6":
          return "h6";
        case "label":
          return "label";
        case "caption":
          return "span";
        default:
          return "p";
      }
    })();

    const Component = as || defaultElement;

    return (
      <Component
        ref={ref as any}
        className={cn(
          textVariants({
            variant,
            color,
            align,
            weight,
            truncate,
            clamp,
            gradient,
          }),
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Text.displayName = "Text";
