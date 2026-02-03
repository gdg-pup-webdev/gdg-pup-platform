import * as React from "react";

import { cn } from "../../utils/cn";
import {
  alertVariants,
  alertTitleVariants,
  alertDescriptionVariants,
} from "./Alert.styles";
import type {
  AlertProps,
  AlertTitleProps,
  AlertDescriptionProps,
} from "./Alert.types";

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Alert.displayName = "Alert";

export const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h5
        ref={ref}
        className={cn(alertTitleVariants(), className)}
        {...props}
      />
    );
  }
);
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  AlertDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(alertDescriptionVariants(), className)}
      {...props}
    />
  );
});
AlertDescription.displayName = "AlertDescription";
