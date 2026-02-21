import { cva, type VariantProps } from "class-variance-authority";

/**
 * Skeleton - Loading placeholder
 *
 * Animated placeholder for content that is loading.
 * Uses theme tokens for colors and consistent animation.
 */
export const skeletonVariants = cva(
  ["animate-pulse", "rounded-md", "bg-muted"],
  {
    variants: {
      /**
       * Shape variant
       */
      variant: {
        default: "rounded-md",
        circle: "rounded-full",
        text: "h-4 rounded",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type SkeletonVariants = VariantProps<typeof skeletonVariants>;
