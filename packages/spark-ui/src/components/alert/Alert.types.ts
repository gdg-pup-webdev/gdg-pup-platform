import type { AlertVariants } from "./Alert.styles";

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    AlertVariants {}

export interface AlertTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export interface AlertDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export type { AlertVariants };
