import type { RadioVariants } from "./Radio.styles";

export interface RadioProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    RadioVariants {
  /**
   * Label text for the radio button
   */
  label?: string;

  /**
   * Helper text displayed below the label
   */
  helperText?: string;

  /**
   * Error state
   */
  error?: boolean;

  /**
   * Error message displayed when error is true
   */
  errorMessage?: string;
}

export type { RadioVariants };
