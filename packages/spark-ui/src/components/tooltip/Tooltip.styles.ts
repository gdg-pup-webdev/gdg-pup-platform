import { cva } from "class-variance-authority";

export const tooltipStyles = cva(
  [
    "absolute z-50 px-3 py-1.5 text-sm",
    "bg-popover text-popover-foreground",
    "border border-border rounded-md shadow-md",
    "opacity-0 invisible pointer-events-none",
    "transition-opacity duration-200",
    "whitespace-nowrap",
  ],
  {
    variants: {
      side: {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
      },
    },
    defaultVariants: {
      side: "top",
    },
  },
);

export const tooltipTriggerStyles = cva("relative inline-block");
