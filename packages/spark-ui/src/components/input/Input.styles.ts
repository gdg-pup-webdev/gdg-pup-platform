import { cva, type VariantProps } from "class-variance-authority";

export const inputContainerVariants = cva(
  [
    "flex items-center w-full rounded-md border",
    "bg-background py-2 px-3",
    "text-sm",
    "transition-colors",
    "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
    "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: "border-input",
        error: "border-destructive focus-within:ring-destructive",
      },
      inputSize: {
        sm: "h-8 gap-1.5",
        md: "h-9 gap-2",
        lg: "h-10 gap-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  }
);

export const inputInnerVariants = cva([
  "flex-1 min-w-0",
  "bg-transparent",
  "text-sm",
  "placeholder:text-muted-foreground",
  "focus-visible:outline-none",
  "disabled:cursor-not-allowed",
  "file:border-0 file:bg-transparent file:text-sm file:font-medium",
]);

export type InputVariants = VariantProps<typeof inputContainerVariants>;