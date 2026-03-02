import type { InlineVariants } from "./Inline.styles";

export interface InlineProps
  extends React.HTMLAttributes<HTMLDivElement>,
    InlineVariants {
  /**
   * The content to be laid out horizontally
   */
  children: React.ReactNode;
  
  /**
   * Render as a different HTML element
   * @example "ul", "nav"
   */
  as?: React.ElementType;
}

export type { InlineVariants };
