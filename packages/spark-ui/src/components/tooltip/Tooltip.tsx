import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/cn";
import { tooltipStyles, tooltipTriggerStyles } from "./Tooltip.styles";
import type { TooltipProps } from "./Tooltip.types";

/**
 * A tooltip component that displays additional information on hover.
 *
 * @example
 * ```tsx
 * <Tooltip content="This is a tooltip" side="top">
 *   <button>Hover me</button>
 * </Tooltip>
 * ```
 */
export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      children,
      side = "top",
      showArrow = false,
      className,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    return (
      <div
        ref={triggerRef}
        className={cn(tooltipTriggerStyles())}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {children}
        <div
          ref={ref}
          role="tooltip"
          className={cn(
            tooltipStyles({ side }),
            isVisible && "opacity-100 visible",
            className
          )}
          {...props}
        >
          {content}
        </div>
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";
