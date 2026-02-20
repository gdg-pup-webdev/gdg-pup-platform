import type { AvatarVariants } from "./Avatar.styles";

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    AvatarVariants {
  /**
   * Image source URL
   */
  src?: string;
  
  /**
   * Alt text for the image
   */
  alt?: string;
  
  /**
   * Fallback content (usually initials)
   */
  fallback?: string;
}

export type { AvatarVariants };
