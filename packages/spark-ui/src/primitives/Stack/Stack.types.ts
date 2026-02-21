import type { StackVariants } from "./Stack.styles";

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>, StackVariants {
  /**
   * The content to be stacked vertically
   */
  children: React.ReactNode;

  /**
   * Render as a different HTML element
   * @example "ul", "ol", "section"
   */
  as?: React.ElementType;
}

export type { StackVariants };
