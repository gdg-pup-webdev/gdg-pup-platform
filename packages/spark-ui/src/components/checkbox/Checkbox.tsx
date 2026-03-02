import * as React from "react";
import { cn } from "../../utils/cn";
import {
  checkboxVariants,
  checkboxLabelVariants,
  checkboxHelperTextVariants,
  checkboxErrorVariants,
} from "./Checkbox.styles";
import type { CheckboxProps } from "./Checkbox.types";

/**
 * Checkbox Component
 * 
 * A form checkbox input with label and error state support.
 * 
 * @example Basic checkbox
 * ```tsx
 * <Checkbox label="Accept terms and conditions" />
 * ```
 * 
 * @example With helper text
 * ```tsx
 * <Checkbox
 *   label="Subscribe to newsletter"
 *   helperText="We'll send you updates once a week"
 * />
 * ```
 * 
 * @example With error
 * ```tsx
 * <Checkbox
 *   label="Required checkbox"
 *   error
 *   errorMessage="You must accept to continue"
 * />
 * ```
 * 
 * @example Different sizes
 * ```tsx
 * <Checkbox label="Small" size="sm" />
 * <Checkbox label="Medium" size="md" />
 * <Checkbox label="Large" size="lg" />
 * ```
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      size,
      label,
      helperText,
      error,
      errorMessage,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            className={cn(checkboxVariants({ size }), className)}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={
              error && errorMessage
                ? `${checkboxId}-error`
                : helperText
                  ? `${checkboxId}-helper`
                  : undefined
            }
            {...props}
          />
          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(checkboxLabelVariants())}
            >
              {label}
            </label>
          )}
        </div>
        {helperText && !error && (
          <p
            id={`${checkboxId}-helper`}
            className={cn(checkboxHelperTextVariants())}
          >
            {helperText}
          </p>
        )}
        {error && errorMessage && (
          <p
            id={`${checkboxId}-error`}
            className={cn(checkboxErrorVariants())}
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
