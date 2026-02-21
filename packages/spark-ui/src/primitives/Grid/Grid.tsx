import * as React from "react";
import { cn } from "../../utils/cn";
import { gridVariants } from "./Grid.styles";
import type { GridProps } from "./Grid.types";

/**
 * Grid Component
 *
 * A grid layout primitive that provides consistent spacing and responsive columns.
 *
 * @example Simple grid
 * ```tsx
 * <Grid columns={3} gap="lg">
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </Grid>
 * ```
 *
 * @example Responsive grid with Tailwind classes
 * ```tsx
 * <Grid gap="md" className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </Grid>
 * ```
 */
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    { className, columns, gap, align, justify, as, children, ...props },
    ref,
  ) => {
    const Component = as || "div";

    return (
      <Component
        ref={ref}
        className={cn(
          gridVariants({ columns, gap, align, justify }),
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Grid.displayName = "Grid";
