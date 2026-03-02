import type { VariantProps } from "class-variance-authority";
import type { tooltipStyles } from "./Tooltip.styles";

export interface TooltipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "content">,
    VariantProps<typeof tooltipStyles> {
  /**
   * The content to display in the tooltip
   */
  content: React.ReactNode;
  /**
   * The element that triggers the tooltip
   */
  children: React.ReactNode;
  /**
   * Side of the trigger to display the tooltip
   */
  side?: "top" | "right" | "bottom" | "left";
  /**
   * Whether to show an arrow pointing to the trigger
   */
  showArrow?: boolean;
}
