import { cva, type VariantProps } from "class-variance-authority";

/**
 * Text - Typography primitive
 * 
 * Provides consistent text styling with semantic variants.
 * Uses theme typography tokens for all values.
 */
export const textVariants = cva([], {
  variants: {
    /**
     * Semantic text variant
     */
    variant: {
      "display": "text-5xl font-bold leading-none tracking-tight",     // 48px
      "heading-1": "text-4xl font-bold leading-tight",                  // 36px
      "heading-2": "text-3xl font-semibold leading-tight",              // 30px
      "heading-3": "text-2xl font-semibold leading-snug",               // 24px
      "heading-4": "text-xl font-semibold leading-snug",                // 20px
      "heading-5": "text-lg font-medium leading-normal",                // 18px
      "body": "text-base leading-normal",                               // 16px
      "body-lg": "text-lg leading-relaxed",                             // 18px
      "body-sm": "text-sm leading-normal",                              // 14px
      "caption": "text-xs leading-normal",                              // 12px
      "label": "text-sm font-medium leading-none",                      // 14px
    },
    /**
     * Text color
     */
    color: {
      default: "text-gray-900",
      primary: "text-primary",
      secondary: "text-gray-600",
      muted: "text-gray-500",
      success: "text-success",
      warning: "text-warning",
      error: "text-destructive",
      "on-primary": "text-primary-foreground",
      "on-secondary": "text-secondary-foreground",
    },
    /**
     * Text alignment
     */
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    /**
     * Font weight override
     */
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    /**
     * Text truncation
     */
    truncate: {
      true: "truncate",
      false: "",
    },
    /**
     * Line clamping (number of lines before truncation)
     */
    clamp: {
      1: "line-clamp-1",
      2: "line-clamp-2",
      3: "line-clamp-3",
      4: "line-clamp-4",
      none: "",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "default",
    align: "left",
    clamp: "none",
  },
});

export type TextVariants = VariantProps<typeof textVariants>;
