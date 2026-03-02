import * as React from "react";
import { cn } from "../../utils/cn";
import {
  textareaVariants,
  textareaLabelVariants,
  textareaHelperTextVariants,
  textareaErrorVariants,
  textareaCountVariants,
} from "./Textarea.styles";
import type { TextareaProps } from "./Textarea.types";

/**
 * Textarea Component
 * 
 * A multi-line text input with label, helper text, and error state support.
 * 
 * @example Basic textarea
 * ```tsx
 * <Textarea label="Description" placeholder="Enter description..." />
 * ```
 * 
 * @example With helper text
 * ```tsx
 * <Textarea
 *   label="Bio"
 *   helperText="Tell us about yourself"
 *   placeholder="Write your bio..."
 * />
 * ```
 * 
 * @example With character count
 * ```tsx
 * <Textarea
 *   label="Tweet"
 *   maxLength={280}
 *   showCount
 *   placeholder="What's happening?"
 * />
 * ```
 * 
 * @example With error
 * ```tsx
 * <Textarea
 *   label="Message"
 *   error
 *   errorMessage="Message is required"
 * />
 * ```
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      textareaSize,
      label,
      helperText,
      error,
      errorMessage,
      maxLength,
      showCount,
      id,
      value,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    const currentLength =
      typeof value === "string" ? value.length : 0;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(textareaLabelVariants())}
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(textareaVariants({ textareaSize, error }), className)}
          maxLength={maxLength}
          value={value}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error && errorMessage
              ? `${textareaId}-error`
              : helperText
                ? `${textareaId}-helper`
                : undefined
          }
          {...props}
        />
        <div className="flex items-center justify-between">
          <div>
            {helperText && !error && (
              <p
                id={`${textareaId}-helper`}
                className={cn(textareaHelperTextVariants())}
              >
                {helperText}
              </p>
            )}
            {error && errorMessage && (
              <p
                id={`${textareaId}-error`}
                className={cn(textareaErrorVariants())}
              >
                {errorMessage}
              </p>
            )}
          </div>
          {showCount && maxLength && (
            <span className={cn(textareaCountVariants())}>
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
