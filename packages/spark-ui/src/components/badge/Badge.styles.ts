import { cva, type VariantProps } from "class-variance-authority";

/**
 * Badge - Small status and category indicators
 * 
 * Used for event categories, user roles, status indicators, and tags.
 * Uses theme tokens for all colors and spacing.
 */
export const badgeVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-full",
    "text-xs font-medium",
    "transition-colors",
    "whitespace-nowrap",
  ],
  {
    variants: {
      /**
       * Visual style variant
       */
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-border text-foreground bg-background",
        muted: "bg-muted text-muted-foreground",
      },
      /**
       * Size of the badge
       */
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
