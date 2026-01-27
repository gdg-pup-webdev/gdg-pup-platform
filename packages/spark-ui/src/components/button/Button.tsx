import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "../../utils/cn";
import { buttonVariants } from "./Button.styles";
import type { ButtonProps } from "./Button.types";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
