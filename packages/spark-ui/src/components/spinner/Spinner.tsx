import * as React from "react";

import { cn } from "../../utils/cn";
import { spinnerVariants } from "./Spinner.styles";
import type { SpinnerProps } from "./Spinner.types";

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={label || "Loading"}
        className={cn(spinnerVariants({ size, variant }), className)}
        {...props}
      >
        <span className="sr-only">{label || "Loading..."}</span>
      </div>
    );
  }
);

Spinner.displayName = "Spinner";
