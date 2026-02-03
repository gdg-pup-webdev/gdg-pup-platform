import type { InputVariants } from "./Input.styles";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    InputVariants {}

export type { InputVariants };
