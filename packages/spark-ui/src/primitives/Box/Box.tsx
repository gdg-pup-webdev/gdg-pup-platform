import * as React from "react";
import { cn } from "../../utils/cn";
import { boxVariants } from "./Box.styles";
import type { BoxProps } from "./Box.types";

/**
 * Box Component
 *
 * A generic container primitive that provides consistent spacing and sizing.
 * Use Box when you need a simple container with controlled spacing.
 *
 * @example Simple padded box
 * ```tsx
 * <Box padding="lg">
 *   <p>Content with consistent padding</p>
 * </Box>
 * ```
 *
 * @example Full-width section
 * ```tsx
 * <Box as="section" width="full" padding="xl">
 *   <h2>Section Title</h2>
 *   <p>Section content</p>
 * </Box>
 * ```
 *
 * @example Banner height container
 * ```tsx
 * <Box height="banner" className="bg-primary">
 *   <img src="banner.jpg" alt="Banner" />
 * </Box>
 * ```
 */
export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      className,
      padding,
      margin,
      width,
      height,
      display,
      position,
      as,
      children,
      ...props
    },
    ref,
  ) => {
    const Component = as || "div";

    return (
      <Component
        ref={ref}
        className={cn(
          boxVariants({ padding, margin, width, height, display, position }),
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Box.displayName = "Box";
