import { cva, type VariantProps } from "class-variance-authority";

/**
 * Radio - Form radio input
 * 
 * Styled radio input with label and error state support.
 * Uses theme tokens for all colors.
 */
export const radioVariants = cva(
  [
    "peer",
    "h-4 w-4",
    "shrink-0",
    "rounded-full",
    "border border-primary",
    "ring-offset-background",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "checked:bg-primary checked:text-primary-foreground",
  ],
  {
    variants: {
      /**
       * Size of the radio button
       */
      size: {
        sm: "h-3.5 w-3.5",
        md: "h-4 w-4",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export const radioLabelVariants = cva([
  "text-sm font-medium leading-none",
  "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
]);

export const radioHelperTextVariants = cva(["text-sm text-muted-foreground"]);

export const radioErrorVariants = cva(["text-sm text-destructive"]);

export type RadioVariants = VariantProps<typeof radioVariants>;
