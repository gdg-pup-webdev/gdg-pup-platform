import * as React from "react";
import { cn } from "../../utils/cn";
import { inputContainerVariants, inputInnerVariants } from "./Input.styles";
import type { InputProps } from "./Input.types";

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant,
      inputSize,
      leftIcon,
      rightIcon,
      // Container-level className
      containerClassName,
      // Input-level className
      className,
      // Native input props → forwarded to <input>
      type = "text",
      disabled,
      ...inputProps
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return;
      const input = containerRef.current?.querySelector("input");
      input?.focus();
    };

    return (
      <div
        ref={containerRef}
        className={cn(
          inputContainerVariants({ variant, inputSize }),
          containerClassName
        )}
        onClick={handleContainerClick}
      >
        {leftIcon && (
          <span className="shrink-0 text-muted-foreground">{leftIcon}</span>
        )}

        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={cn(inputInnerVariants(), className)}
          {...inputProps}
        />

        {rightIcon && (
          <span className="shrink-0 text-muted-foreground">{rightIcon}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";