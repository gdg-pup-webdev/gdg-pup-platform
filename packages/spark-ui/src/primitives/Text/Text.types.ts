import type { TextVariants } from "./Text.styles";

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">, TextVariants {
  /**
   * The content of the text element
   */
  children: React.ReactNode;

  /**
   * Render as a different HTML element
   * @example "p", "span", "div", "label"
   */
  as?: React.ElementType;
}

export type { TextVariants };
