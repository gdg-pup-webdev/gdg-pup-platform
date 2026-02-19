import { cva } from "class-variance-authority";

export const toastViewportStyles = cva(
  "fixed z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:flex-col md:max-w-[420px]",
  {
    variants: {
      position: {
        "top-left": "top-0 left-0",
        "top-center": "top-0 left-1/2 -translate-x-1/2",
        "top-right": "top-0 right-0",
        "bottom-left": "bottom-0 left-0",
        "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
        "bottom-right": "bottom-0 right-0",
      },
    },
    defaultVariants: {
      position: "bottom-right",
    },
  }
);

export const toastStyles = cva(
  [
    "group pointer-events-auto relative flex w-full items-center justify-between",
    "space-x-4 overflow-hidden rounded-md border border-border p-4 shadow-lg",
    "transition-all",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-80 data-[state=open]:fade-in-0",
    "data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full",
  ],
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        success: "bg-success text-success-foreground border-success",
        warning: "bg-warning text-warning-foreground border-warning",
        destructive: "bg-destructive text-destructive-foreground border-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const toastTitleStyles = cva("text-sm font-semibold");

export const toastDescriptionStyles = cva("text-sm opacity-90");

export const toastActionStyles = cva(
  [
    "inline-flex h-8 shrink-0 items-center justify-center rounded-md",
    "border border-current px-3 text-sm font-medium",
    "transition-colors hover:bg-secondary",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  ]
);

export const toastCloseStyles = cva(
  [
    "absolute right-2 top-2 rounded-md p-1",
    "text-foreground/50 opacity-0 transition-opacity",
    "hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2",
    "group-hover:opacity-100",
  ]
);
