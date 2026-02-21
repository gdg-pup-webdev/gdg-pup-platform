import type { TextareaVariants } from "./Textarea.styles";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, TextareaVariants {
  /**
   * Label text for the textarea
   */
  label?: string;

  /**
   * Helper text displayed below the textarea
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

  /**
   * Character count display
   */
  maxLength?: number;

  /**
   * Show character count
   */
  showCount?: boolean;
}

export type { TextareaVariants };
