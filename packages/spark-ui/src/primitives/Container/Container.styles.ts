import { cva, type VariantProps } from "class-variance-authority";

/**
 * Container - Max-width centering primitive
 *
 * Provides consistent max-width constraints and horizontal centering.
 * Used for main content areas and sections.
 */
export const containerVariants = cva(["mx-auto w-full"], {
  variants: {
    /**
     * Maximum width of the container
     */
    maxWidth: {
      xs: "max-w-xs", // 320px
      sm: "max-w-sm", // 384px
      md: "max-w-md", // 448px
      lg: "max-w-lg", // 512px
      xl: "max-w-xl", // 576px
      "2xl": "max-w-2xl", // 672px
      "3xl": "max-w-3xl", // 768px
      "4xl": "max-w-4xl", // 896px
      "5xl": "max-w-5xl", // 1024px
      "6xl": "max-w-6xl", // 1152px
      "7xl": "max-w-7xl", // 1280px
      full: "max-w-full",
      screen: "max-w-screen",
    },
    /**
     * Horizontal padding
     */
    padding: {
      none: "px-0",
      sm: "px-4", // 16px
      md: "px-6", // 24px
      lg: "px-8", // 32px
    },
  },
  defaultVariants: {
    maxWidth: "7xl",
    padding: "md",
  },
});

export type ContainerVariants = VariantProps<typeof containerVariants>;
