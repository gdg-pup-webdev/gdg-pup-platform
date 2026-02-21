import type { SkeletonVariants } from "./Skeleton.styles";

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>, SkeletonVariants {
  /**
   * Render as a different HTML element
   * @example "span", "div"
   * @default "div"
   */
  as?: React.ElementType;
}

export type { SkeletonVariants };
