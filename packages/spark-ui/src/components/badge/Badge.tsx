import * as React from "react";
import { cn } from "../../utils/cn";
import { badgeVariants } from "./Badge.styles";
import type { BadgeProps } from "./Badge.types";

/**
 * Badge Component
 * 
 * A small label used to display status, categories, or counts.
 * 
 * @example Basic usage
 * ```tsx
 * <Badge>New</Badge>
 * <Badge variant="success">Active</Badge>
 * <Badge variant="warning">Pending</Badge>
 * ```
 * 
 * @example With count
 * ```tsx
 * <Badge variant="destructive">5</Badge>
 * ```
 * 
 * @example Event categories
 * ```tsx
 * <Badge variant="secondary">Workshop</Badge>
 * <Badge variant="default">Conference</Badge>
 * ```
 */
export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, as, children, ...props }, ref) => {
    const Component = as || "div";

    return (
      <Component
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Badge.displayName = "Badge";
