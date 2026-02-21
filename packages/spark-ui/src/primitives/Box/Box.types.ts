import type { BoxVariants } from "./Box.styles";

export interface BoxProps
  extends React.HTMLAttributes<HTMLDivElement>, BoxVariants {
  /**
   * The content of the box
   */
  children: React.ReactNode;

  /**
   * Render as a different HTML element
   * @example "section", "article", "aside"
   */
  as?: React.ElementType;
}

export type { BoxVariants };
