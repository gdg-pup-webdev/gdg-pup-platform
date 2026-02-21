import type { GridVariants } from "./Grid.styles";

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>, GridVariants {
  /**
   * The content to be arranged in a grid
   */
  children: React.ReactNode;

  /**
   * Render as a different HTML element
   * @example "section", "ul"
   */
  as?: React.ElementType;
}

export type { GridVariants };
