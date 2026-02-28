import { cva, type VariantProps } from "class-variance-authority";

/**
 * Card component variants using CVA
 * 
 * Following Figma specifications:
 * - Border radius: 28px
 * - Border: 1px solid white
 * - Background: semi-transparent white (#FFFFFF0D)
 * - Padding: 20px
 * - Gap: 10px
 */
export const cardVariants = cva(
  [
    // Base styles using custom CSS class
    "card-base",
    // Flexbox for gap management
    "flex",
    "flex-col",
    // Text color
    "text-white",
    // Smooth transitions
    "transition-all",
    "duration-300",
  ],
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Card Header - displays title and description
 */
export const cardHeaderVariants = cva([
  "flex",
  "flex-col",
  "gap-3", // 12px gap for header items
]);

/**
 * Card Title - main heading
 */
export const cardTitleVariants = cva([
  "text-2xl",
  "font-semibold",
  "leading-none",
  "tracking-tight",
  "text-white",
]);

/**
 * Card Description - subtitle text
 */
export const cardDescriptionVariants = cva([
  "text-sm",
  "text-gray-400",
  "leading-relaxed",
]);

/**
 * Card Content - main content area
 */
export const cardContentVariants = cva([
  "flex",
  "flex-col",
  "gap-4", // 16px gap for content items
]);

/**
 * Card Footer - action area at bottom
 */
export const cardFooterVariants = cva([
  "flex",
  "items-center",
  "gap-3", // 12px gap for footer items
]);

export type CardVariants = VariantProps<typeof cardVariants>;
