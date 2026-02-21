import * as React from "react";
import { cn } from "../../utils/cn";
import { containerVariants } from "./Container.styles";
import type { ContainerProps } from "./Container.types";

/**
 * Container Component
 *
 * A max-width centered container primitive for main content areas.
 * Automatically centers content horizontally with consistent padding.
 *
 * @example Default container
 * ```tsx
 * <Container>
 *   <h1>Page Title</h1>
 *   <p>Page content that stays within max-width</p>
 * </Container>
 * ```
 *
 * @example Narrow container for reading
 * ```tsx
 * <Container maxWidth="2xl">
 *   <article>
 *     <h1>Blog Post Title</h1>
 *     <p>Narrower width for comfortable reading...</p>
 *   </article>
 * </Container>
 * ```
 *
 * @example Full-width with padding
 * ```tsx
 * <Container maxWidth="full" padding="lg">
 *   <div>Content spans full width with padding</div>
 * </Container>
 * ```
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, maxWidth, padding, as, children, ...props }, ref) => {
    const Component = as || "div";

    return (
      <Component
        ref={ref}
        className={cn(containerVariants({ maxWidth, padding }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Container.displayName = "Container";
