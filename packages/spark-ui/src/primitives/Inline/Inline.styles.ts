import { cva, type VariantProps } from "class-variance-authority";

/**
 * Inline - Horizontal layout primitive
 * 
 * Provides consistent horizontal spacing between child elements with optional wrapping.
 * Uses theme spacing tokens for all gap values.
 */
export const inlineVariants = cva(["flex flex-row"], {
  variants: {
    /**
     * Horizontal spacing between children
     */
    gap: {
      none: "gap-0",
      xs: "gap-2",    // 8px
      sm: "gap-3",    // 12px
      md: "gap-4",    // 16px
      lg: "gap-6",    // 24px
      xl: "gap-8",    // 32px
      "2xl": "gap-12", // 48px
    },
    /**
     * Vertical alignment of children
     */
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      baseline: "items-baseline",
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
     * Whether items should wrap to new lines
     */
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
    },
  },
  defaultVariants: {
    gap: "md",
    align: "center",
    justify: "start",
    wrap: false,
  },
});

export type InlineVariants = VariantProps<typeof inlineVariants>;
