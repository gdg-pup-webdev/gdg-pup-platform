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
  ({ className, variant, size, as, children, leadingIcon, trailingIcon, ...props }, ref) => {
    const Component = as || "div";
    const defaultIdIcon = (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M12 3 6.5 8.5v7L12 21l5.5-5.5v-7L12 3z" strokeLinejoin="round" />
        <path d="M8.5 12h7" strokeLinecap="round" />
      </svg>
    );
    const resolvedLeadingIcon = leadingIcon ?? (variant === "id" ? defaultIdIcon : null);

    return (
      <Component
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {resolvedLeadingIcon ? <span className="mr-2 inline-flex items-center justify-center">{resolvedLeadingIcon}</span> : null}
        <span>{children}</span>
        {trailingIcon ? <span className="ml-2 inline-flex items-center justify-center">{trailingIcon}</span> : null}
      </Component>
    );
  }
);

Badge.displayName = "Badge";
