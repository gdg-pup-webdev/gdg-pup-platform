import type { CheckboxVariants } from "./Checkbox.styles";

export interface CheckboxProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    CheckboxVariants {
  /**
   * Label text for the checkbox
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

export type { CheckboxVariants };
