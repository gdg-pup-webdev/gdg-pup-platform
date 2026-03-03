import * as React from "react";
import { cn } from "../../utils/cn";
import { avatarVariants, avatarImageVariants, avatarFallbackVariants } from "./Avatar.styles";
import type { AvatarProps } from "./Avatar.types";

/**
 * Default avatar shown when the user is unauthenticated or no src is provided.
 * Points to a transparent PNG in the Next.js public folder.
 */
const DEFAULT_AVATAR_SRC = "/images/auth/avatar-default.png";

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

    // Use provided src if available and not errored; else fall back to default avatar PNG.
    // The default avatar is a transparent PNG — no bg circle is shown behind it.
    const imageSrc = src && !imageError ? src : DEFAULT_AVATAR_SRC;
    const isDefaultAvatar = !src || imageError;

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        {/* Show text fallback only if explicitly provided AND we have no image at all */}
        {isDefaultAvatar && fallback ? (
          <span className={cn(avatarFallbackVariants())}>
            {fallback}
          </span>
        ) : (
          <img
            src={imageSrc}
            alt={alt || "Avatar"}
            className={cn(avatarImageVariants())}
            onError={() => setImageError(true)}
            draggable={false}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";
