import { cva, type VariantProps } from "class-variance-authority";

/**
 * Avatar - User profile image or initials
 *
 * Displays a circular user image or fallback initials.
 * Uses theme tokens for sizing and colors.
 */
export const avatarVariants = cva(
  [
    "relative",
    "inline-flex",
    "items-center",
    "justify-center",
    "overflow-hidden",
    "rounded-full",
    "bg-muted",
    "text-muted-foreground",
    "font-medium",
    "select-none",
  ],
  {
    variants: {
      /**
       * Size of the avatar
       */
      size: {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const avatarImageVariants = cva([
  "aspect-square",
  "h-full",
  "w-full",
  "object-cover",
]);

export type AvatarVariants = VariantProps<typeof avatarVariants>;
