import { cva, type VariantProps } from "class-variance-authority";

export const alertVariants = cva(
  [
    "relative w-full rounded-lg border p-4",
    "[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px]",
    "[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
    "[&>svg]:text-foreground",
  ],
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        success: "border-green-500/50 text-green-900 dark:text-green-100 bg-green-50 dark:bg-green-950/30",
        warning: "border-yellow-500/50 text-yellow-900 dark:text-yellow-100 bg-yellow-50 dark:bg-yellow-950/30",
        error: "border-destructive/50 text-destructive dark:border-destructive bg-destructive/10",
        info: "border-blue-500/50 text-blue-900 dark:text-blue-100 bg-blue-50 dark:bg-blue-950/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const alertTitleVariants = cva([
  "mb-1 font-medium leading-none tracking-tight",
]);

export const alertDescriptionVariants = cva(["text-sm [&_p]:leading-relaxed"]);

export type AlertVariants = VariantProps<typeof alertVariants>;
