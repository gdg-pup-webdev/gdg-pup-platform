import type { InputVariants } from "./Input.styles";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    InputVariants {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** className applied to the outer container div */
  containerClassName?: string;
}

export type { InputVariants };