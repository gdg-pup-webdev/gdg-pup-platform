import type { ButtonVariants } from "./Button.styles";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  asChild?: boolean;
  iconLeft?: React.ReactNode | boolean;
  iconRight?: React.ReactNode | boolean;
  theme?: "light" | "dark";
}

export type { ButtonVariants };
