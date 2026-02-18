import { cva, type VariantProps } from "class-variance-authority";

/**
 * Grid - Responsive grid layout primitive
 * 
 * Provides consistent grid layouts with responsive column counts.
 * Uses theme spacing tokens for all gap values.
 */
export const gridVariants = cva(["grid"], {
  variants: {
    /**
     * Number of columns (responsive)
     */
    columns: {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    },
    /**
     * Gap between grid items
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
     * Alignment of items within grid cells
     */
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
    /**
     * Justification of items within grid cells
     */
    justify: {
      start: "justify-items-start",
      center: "justify-items-center",
      end: "justify-items-end",
      stretch: "justify-items-stretch",
    },
  },
  defaultVariants: {
    columns: 1,
    gap: "md",
    align: "stretch",
    justify: "stretch",
  },
});

export type GridVariants = VariantProps<typeof gridVariants>;
