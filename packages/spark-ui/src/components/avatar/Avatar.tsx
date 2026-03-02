import * as React from "react";
import { cn } from "../../utils/cn";
import { avatarVariants, avatarImageVariants } from "./Avatar.styles";
import type { AvatarProps } from "./Avatar.types";

/**
 * Avatar Component
 * 
 * Displays a user profile image with fallback support.
 * 
 * @example With image
 * ```tsx
 * <Avatar src="/avatar.jpg" alt="John Doe" />
 * ```
 * 
 * @example With fallback initials
 * ```tsx
 * <Avatar fallback="JD" />
 * ```
 * 
 * @example Different sizes
 * ```tsx
 * <Avatar src="/avatar.jpg" size="sm" />
 * <Avatar src="/avatar.jpg" size="lg" />
 * <Avatar src="/avatar.jpg" size="xl" />
 * ```
 */
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, fallback, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const showImage = src && !imageError;

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || "Avatar"}
            className={cn(avatarImageVariants())}
            onError={() => setImageError(true)}
          />
        ) : (
          <span>{fallback || alt?.[0]?.toUpperCase() || "?"}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";
