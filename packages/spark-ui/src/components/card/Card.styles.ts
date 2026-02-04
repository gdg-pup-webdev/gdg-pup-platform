import { cva, type VariantProps } from "class-variance-authority";

export const cardVariants = cva(
  [
    "rounded-lg border bg-card text-card-foreground shadow-sm",
  ],
  {
    variants: {
      variant: {
        default: "border-border",
        elevated: "shadow-md",
        outlined: "border-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const cardHeaderVariants = cva(["flex flex-col space-y-1.5 p-6"]);

export const cardTitleVariants = cva([
  "text-2xl font-semibold leading-none tracking-tight",
]);

export const cardDescriptionVariants = cva(["text-sm text-muted-foreground"]);

export const cardContentVariants = cva(["p-6 pt-0"]);

export const cardFooterVariants = cva(["flex items-center p-6 pt-0"]);

export type CardVariants = VariantProps<typeof cardVariants>;
