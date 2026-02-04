import type { SpinnerVariants } from "./Spinner.styles";

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    SpinnerVariants {
  label?: string;
}

export type { SpinnerVariants };
