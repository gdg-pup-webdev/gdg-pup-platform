import * as React from "react";
import { cn } from "../../utils/cn";
import {
  radioVariants,
  radioLabelVariants,
  radioHelperTextVariants,
  radioErrorVariants,
} from "./Radio.styles";
import type { RadioProps } from "./Radio.types";

/**
 * Radio Component
 * 
 * A form radio input with label and error state support.
 * 
 * @example Basic radio
 * ```tsx
 * <Radio name="option" value="1" label="Option 1" />
 * <Radio name="option" value="2" label="Option 2" />
 * ```
 * 
 * @example With helper text
 * ```tsx
 * <Radio
 *   name="plan"
 *   value="free"
 *   label="Free Plan"
 *   helperText="Limited features"
 * />
 * ```
 * 
 * @example With error
 * ```tsx
 * <Radio
 *   name="required"
 *   value="yes"
 *   label="Required option"
 *   error
 *   errorMessage="You must select an option"
 * />
 * ```
 * 
 * @example Different sizes
 * ```tsx
 * <Radio label="Small" size="sm" name="size" value="sm" />
 * <Radio label="Medium" size="md" name="size" value="md" />
 * <Radio label="Large" size="lg" name="size" value="lg" />
 * ```
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
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
    const radioId = id || generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id={radioId}
            ref={ref}
            className={cn(radioVariants({ size }), className)}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={
              error && errorMessage
                ? `${radioId}-error`
                : helperText
                  ? `${radioId}-helper`
                  : undefined
            }
            {...props}
          />
          {label && (
            <label
              htmlFor={radioId}
              className={cn(radioLabelVariants())}
            >
              {label}
            </label>
          )}
        </div>
        {helperText && !error && (
          <p
            id={`${radioId}-helper`}
            className={cn(radioHelperTextVariants())}
          >
            {helperText}
          </p>
        )}
        {error && errorMessage && (
          <p
            id={`${radioId}-error`}
            className={cn(radioErrorVariants())}
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Radio.displayName = "Radio";
