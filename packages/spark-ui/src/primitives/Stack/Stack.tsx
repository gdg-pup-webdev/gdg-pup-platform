import * as React from "react";
import { cn } from "../../utils/cn";
import { stackVariants } from "./Stack.styles";
import type { StackProps } from "./Stack.types";

/**
 * Stack Component
 *
 * A vertical layout primitive that provides consistent spacing between children.
 *
 * @example
 * ```tsx
 * <Stack gap="md">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Stack>
 * ```
 *
 * @example With alignment
 * ```tsx
 * <Stack gap="lg" align="center">
 *   <Button>Centered Button 1</Button>
 *   <Button>Centered Button 2</Button>
 * </Stack>
 * ```
 */
export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, gap, align, justify, width, as, children, ...props }, ref) => {
    const Component = as || "div";

    return (
      <Component
        ref={ref}
        className={cn(stackVariants({ gap, align, justify, width }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Stack.displayName = "Stack";
