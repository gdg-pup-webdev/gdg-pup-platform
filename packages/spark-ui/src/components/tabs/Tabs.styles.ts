import { cva } from "class-variance-authority";

export const tabsListStyles = cva(
  "inline-flex items-center justify-start gap-1 border-b border-border",
  {
    variants: {
      variant: {
        default: "bg-background",
        pills: "bg-muted rounded-lg p-1 border-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const tabsTriggerStyles = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap px-4 py-2",
    "text-sm font-medium transition-all",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-b-2 border-transparent",
          "data-[state=active]:border-primary data-[state=active]:text-foreground",
          "data-[state=inactive]:text-muted-foreground hover:data-[state=inactive]:text-foreground",
        ],
        pills: [
          "rounded-md",
          "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
          "data-[state=inactive]:text-muted-foreground hover:data-[state=inactive]:text-foreground",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const tabsContentStyles = cva("mt-4 focus-visible:outline-none", {
  variants: {},
  defaultVariants: {},
});
