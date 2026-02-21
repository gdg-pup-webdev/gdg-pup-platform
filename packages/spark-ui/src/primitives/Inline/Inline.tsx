import * as React from "react";
import { cn } from "../../utils/cn";
import { inlineVariants } from "./Inline.styles";
import type { InlineProps } from "./Inline.types";

/**
 * Inline Component
 *
 * A horizontal layout primitive that provides consistent spacing between children.
 * Supports wrapping for responsive layouts.
 *
 * @example
 * ```tsx
 * <Inline gap="sm">
 *   <Button>Action 1</Button>
 *   <Button>Action 2</Button>
 *   <Button>Action 3</Button>
 * </Inline>
 * ```
 *
 * @example With wrapping
 * ```tsx
 * <Inline gap="md" wrap={true}>
 *   <Badge>Tag 1</Badge>
 *   <Badge>Tag 2</Badge>
 *   <Badge>Tag 3</Badge>
 * </Inline>
 * ```
 */
export const Inline = React.forwardRef<HTMLDivElement, InlineProps>(
  ({ className, gap, align, justify, wrap, as, children, ...props }, ref) => {
    const Component = as || "div";

    return (
      <Component
        ref={ref}
        className={cn(inlineVariants({ gap, align, justify, wrap }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Inline.displayName = "Inline";
