import type { ContainerVariants } from "./Container.styles";

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ContainerVariants {
  /**
   * The content to be contained
   */
  children: React.ReactNode;
  
  /**
   * Render as a different HTML element
   * @example "section", "main"
   */
  as?: React.ElementType;
}

export type { ContainerVariants };
