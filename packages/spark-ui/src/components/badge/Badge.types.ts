import type { BadgeVariants } from "./Badge.styles";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BadgeVariants {
  /**
   * The content of the badge
   */
  children: React.ReactNode;
  
  /**
   * Render as a different HTML element
   * @example "span", "div"
   * @default "div"
   */
  as?: React.ElementType;

  /**
   * Optional icon rendered before the badge content.
   */
  leadingIcon?: React.ReactNode;

  /**
   * Optional icon rendered after the badge content.
   */
  trailingIcon?: React.ReactNode;
}

export type { BadgeVariants };
