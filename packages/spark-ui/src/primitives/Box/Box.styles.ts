import { cva, type VariantProps } from "class-variance-authority";

/**
 * Box - Generic container primitive
 *
 * A flexible container that accepts spacing, sizing, and display props.
 * Uses theme spacing tokens for all values.
 */
export const boxVariants = cva([], {
  variants: {
    /**
     * Padding inside the box
     */
    padding: {
      none: "p-0",
      xs: "p-2", // 8px
      sm: "p-3", // 12px
      md: "p-4", // 16px
      lg: "p-6", // 24px
      xl: "p-8", // 32px
      "2xl": "p-12", // 48px
    },
    /**
     * Margin outside the box
     */
    margin: {
      none: "m-0",
      xs: "m-2",
      sm: "m-3",
      md: "m-4",
      lg: "m-6",
      xl: "m-8",
      "2xl": "m-12",
    },
    /**
     * Width of the box
     */
    width: {
      auto: "w-auto",
      full: "w-full",
      screen: "w-screen",
    },
    /**
     * Height of the box
     */
    height: {
      auto: "h-auto",
      full: "h-full",
      screen: "h-screen",
      banner: "h-48", // Common banner height
    },
    /**
     * Display type
     */
    display: {
      block: "block",
      inline: "inline",
      "inline-block": "inline-block",
      flex: "flex",
      "inline-flex": "inline-flex",
      grid: "grid",
    },
    /**
     * Position type
     */
    position: {
      static: "static",
      relative: "relative",
      absolute: "absolute",
      fixed: "fixed",
      sticky: "sticky",
    },
  },
  defaultVariants: {
    width: "auto",
    height: "auto",
    display: "block",
    position: "static",
  },
});

export type BoxVariants = VariantProps<typeof boxVariants>;
