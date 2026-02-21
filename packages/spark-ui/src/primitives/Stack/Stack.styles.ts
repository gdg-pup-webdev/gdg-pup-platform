import { cva, type VariantProps } from "class-variance-authority";

/**
 * Stack - Vertical layout primitive
 *
 * Provides consistent vertical spacing between child elements.
 * Uses theme spacing tokens for all gap values.
 */
export const stackVariants = cva(["flex flex-col"], {
  variants: {
    /**
     * Vertical spacing between children
     */
    gap: {
      none: "gap-0",
      xs: "gap-2", // 8px
      sm: "gap-3", // 12px
      md: "gap-4", // 16px
      lg: "gap-6", // 24px
      xl: "gap-8", // 32px
      "2xl": "gap-12", // 48px
    },
    /**
     * Horizontal alignment of children
     */
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
    /**
     * Justification of children along the main axis
     */
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
    },
    /**
     * Width of the stack
     */
    width: {
      auto: "w-auto",
      full: "w-full",
    },
  },
  defaultVariants: {
    gap: "md",
    align: "stretch",
    justify: "start",
    width: "auto",
  },
});

export type StackVariants = VariantProps<typeof stackVariants>;
