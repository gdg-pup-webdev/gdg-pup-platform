import type { ButtonVariants } from "./Button.styles";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  asChild?: boolean;
}

export type { ButtonVariants };
