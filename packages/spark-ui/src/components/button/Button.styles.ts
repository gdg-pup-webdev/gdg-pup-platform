import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "text-sm font-medium",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "button-gradient-border",
  ],
  {
    variants: {
      variant: {
        default: "button-default rounded-2xl",
        outline: "button-outline rounded-lg",
        stroke: "button-stroke rounded-lg",
        link: "button-link rounded-none",
      },
      size: {
        sm: "h-8 px-3 text-xs gap-1.5",
        md: "h-10 px-4 text-sm gap-2",
        lg: "h-12 px-5 text-base gap-2.5",
      },
      theme: {
        light: "",
        dark: "",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        theme: "light",
        class: "button-default-light text-white",
      },
      {
        variant: "default",
        theme: "dark",
        class: "button-default-dark text-white",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      theme: "light",
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;