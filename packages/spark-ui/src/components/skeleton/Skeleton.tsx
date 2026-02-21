import * as React from "react";
import { cn } from "../../utils/cn";
import { skeletonVariants } from "./Skeleton.styles";
import type { SkeletonProps } from "./Skeleton.types";

/**
 * Skeleton Component
 *
 * A loading placeholder that animates while content is being fetched.
 *
 * @example Basic skeleton
 * ```tsx
 * <Skeleton className="h-12 w-12" />
 * <Skeleton className="h-4 w-[250px]" />
 * ```
 *
 * @example Circle skeleton (avatar)
 * ```tsx
 * <Skeleton variant="circle" className="h-12 w-12" />
 * ```
 *
 * @example Card skeleton
 * ```tsx
 * <Card>
 *   <Stack gap="md">
 *     <Skeleton className="h-48 w-full" />
 *     <Skeleton variant="text" className="w-3/4" />
 *     <Skeleton variant="text" className="w-1/2" />
 *   </Stack>
 * </Card>
 * ```
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, as, ...props }, ref) => {
    const Component = as || "div";

    return (
      <Component
        ref={ref}
        className={cn(skeletonVariants({ variant }), className)}
        {...props}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";
