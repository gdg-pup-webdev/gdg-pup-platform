import { cva, type VariantProps } from "class-variance-authority";

/**
 * Textarea - Multi-line text input
 *
 * Styled textarea input with label, helper text, and error state support.
 * Uses theme tokens for all colors and spacing.
 */
export const textareaVariants = cva(
  [
    "flex",
    "min-h-[80px]",
    "w-full",
    "rounded-md",
    "border",
    "border-input",
    "bg-background",
    "px-3",
    "py-2",
    "text-sm",
    "ring-offset-background",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-ring",
    "focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
    "resize-y",
  ],
  {
    variants: {
      /**
       * Size variant
       */
      textareaSize: {
        sm: "min-h-[60px] text-xs",
        md: "min-h-[80px] text-sm",
        lg: "min-h-[120px] text-base",
      },
      /**
       * Error state
       */
      error: {
        true: "border-destructive focus-visible:ring-destructive",
      },
    },
    defaultVariants: {
      textareaSize: "md",
    },
  },
);

export const textareaLabelVariants = cva(["text-sm font-medium leading-none"]);

export const textareaHelperTextVariants = cva([
  "text-sm text-muted-foreground",
]);

export const textareaErrorVariants = cva(["text-sm text-destructive"]);

export const textareaCountVariants = cva(["text-xs text-muted-foreground"]);

export type TextareaVariants = VariantProps<typeof textareaVariants>;
