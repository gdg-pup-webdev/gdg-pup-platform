import { cva, type VariantProps } from "class-variance-authority";
import { TEXT_GRADIENTS } from "./Text.tokens";

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
      display: "text-5xl font-bold leading-none tracking-tight", // 48px - Legacy
      "heading-1": "text-[3.5rem] md:text-[4.5rem] font-bold leading-[1.2]", // H1: 56px/72px, 120% lh
      "heading-2": "text-[3rem] md:text-[3.75rem] font-semibold leading-[1.2]", // H2: 48px/60px, 120% lh
      "heading-3": "text-[2.5rem] md:text-[3rem] font-semibold leading-[1.2]", // H3: 40px/48px, 120% lh
      "heading-4": "text-[2rem] md:text-[2.5rem] font-semibold leading-[1.3]", // H4: 32px/40px, 130% lh
      "heading-5": "text-[1.5rem] md:text-[2rem] font-medium leading-[1.4]", // H5: 24px/32px, 140% lh
      "heading-6": "text-[1.25rem] md:text-[1.5rem] font-medium leading-[1.4]", // H6: 20px/24px, 140% lh
      body: "text-base leading-normal", // 16px
      "body-lg": "text-[1.25rem] md:text-[1.5rem] leading-normal", // Text/Large: 20px/24px, 150% lh
      "body-sm": "text-sm leading-normal", // 14px
      caption: "text-xs leading-normal", // 12px
      label: "text-sm font-medium leading-none", // 14px
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
    /**
     * Gradient text effects
     * Uses background-clip to apply gradient colors to text
     */
    gradient: {
      none: "",
      "white-blue":
        "bg-linear-to-b from-white from-[27.56%] to-[#4285F4] to-100% bg-clip-text text-transparent",
      red: "bg-linear-[360deg,#EA4335_0%,#84261E_100%] bg-clip-text text-transparent",
      green:
        "bg-linear-[360deg,#5CDB6D_0%,#31753A_100%] bg-clip-text text-transparent",
      yellow:
        "bg-linear-[360deg,#FFD427_0%,#997F17_100%] bg-clip-text text-transparent",
      blue: "bg-linear-[0deg,#57CAFF_0%,#347999_100%] bg-clip-text text-transparent",
      "white-yellow":
        "bg-linear-to-b from-white from-[28.59%] to-[#F9AB00] to-[99%] bg-clip-text text-transparent",
      "white-green":
        "bg-linear-to-b from-white from-[1.41%] to-[#34A853] to-100% bg-clip-text text-transparent",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "default",
    align: "left",
    clamp: "none",
    gradient: "none",
  },
});

export type TextVariants = VariantProps<typeof textVariants>;
