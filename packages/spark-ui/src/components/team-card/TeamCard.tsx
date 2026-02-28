"use client";

import * as React from "react";

import { cn } from "../../utils/cn";
import { ShineBorder } from "../shine-border";
import {
  teamCardVariants,
  teamCardImageVariants,
  teamCardNameVariants,
  teamCardRoleVariants,
  teamCardSocialsVariants,
} from "./TeamCard.styles";
import {
  TEAM_CARD_SHINE_COLORS,
  TEAM_CARD_SHINE_DURATION,
  TEAM_CARD_SHINE_DURATION_HOVER,
  TEAM_CARD_BORDER_WIDTH,
  TEAM_CARD_TILT_MAX,
  TEAM_CARD_PERSPECTIVE,
  TEAM_CARD_IMAGE_ASPECT,
  TEAM_CARD_IMAGE_WIDTH,
  TEAM_CARD_IMAGE_MARGIN_TOP,
  TEAM_CARD_MASCOT_SIZE,
  TEAM_CARD_MASCOT_OFFSET_Y,
  TEAM_CARD_MAX_WIDTH,
  TEAM_CARD_MIN_HEIGHT,
  TEAM_CARD_PADDING_BOTTOM,
} from "./TeamCard.tokens";
import type { TeamCardProps } from "./TeamCard.types";

// ---------------------------------------------------------------------------
// Icon SVGs (inline, no external icon library required in the UI package)
// ---------------------------------------------------------------------------

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("size-[18px]", className)}
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterXIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("size-[18px]", className)}
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("size-[18px]", className)}
      aria-hidden
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("size-[18px]", className)}
      aria-hidden
    >
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.884v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// TeamCard
// ---------------------------------------------------------------------------

/**
 * TeamCard
 *
 * A 3D tiltable card for team member profiles. Features:
 * - Deep purple-to-blue background gradient.
 * - Animated 4-colour Google-palette ShineBorder ring.
 * - Perspective tilt on hover driven by CSS transforms (no animation library).
 *
 * Lives in `@packages/spark-ui` — consume in any Next.js page with:
 * ```tsx
 * import { TeamCard } from "@packages/spark-ui";
 *
 * <TeamCard
 *   name="Jane Doe"
 *   role="Web Development Lead"
 *   imageSrc="/team/jane.jpg"
 *   socials={{ linkedin: "https://linkedin.com/in/janedoe", twitter: "https://x.com/janedoe" }}
 * />
 * ```
 */
export const TeamCard = React.forwardRef<HTMLDivElement, TeamCardProps>(
  (
    {
      name,
      role,
      imageSrc,
      imageAlt,
      mascotSrc,
      socials,
      shineColor = TEAM_CARD_SHINE_COLORS as unknown as string[],
      shineDuration = TEAM_CARD_SHINE_DURATION,
      tiltMax = TEAM_CARD_TILT_MAX,
      tiltEnabled = true,
      className,
      style,
      onMouseMove,
      onMouseLeave,
      children,
      ...props
    },
    ref
  ) => {
    const cardRef = React.useRef<HTMLDivElement>(null);
    // Ref for direct DOM mutation of the mascot tilt — avoids React re-renders on mousemove
    const mascotRef = React.useRef<HTMLImageElement>(null);
    // Ref to ShineBorder element for direct --duration manipulation on hover
    const shineRef = React.useRef<HTMLDivElement>(null);

    // Merge forwarded ref + internal ref
    const setRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );

    // 3D tilt state (inline-style driven, no re-render loop)
    const tiltStyle = React.useRef<React.CSSProperties>({});

    const handleMouseMove = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        onMouseMove?.(e);
        if (!tiltEnabled || !cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Normalise to -1 … +1
        const nx = (x / rect.width) * 2 - 1;
        const ny = (y / rect.height) * 2 - 1;

        const rotateY = nx * tiltMax;
        const rotateX = -ny * tiltMax;

        const nextStyle: React.CSSProperties = {
          // No scale — keeps card within its grid cell and avoids clipping siblings
          transform: `perspective(${TEAM_CARD_PERSPECTIVE}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: "transform 0.1s ease",
          zIndex: "10",
        };

        tiltStyle.current = nextStyle;
        // Apply directly to DOM to avoid React re-render on every mousemove
        Object.assign(cardRef.current.style, nextStyle);

        // Speed up the shine border on hover for emphasis
        if (shineRef.current) {
          shineRef.current.style.setProperty("--duration", `${TEAM_CARD_SHINE_DURATION_HOVER}s`);
        }

        // Tilt the mascot slightly based on horizontal cursor position
        if (mascotRef.current) {
          const mascotRotate = nx * 18; // max ±18deg
          mascotRef.current.style.transform = `rotate(${mascotRotate}deg)`;
          mascotRef.current.style.transition = "transform 0.15s ease";
        }
      },
      [tiltEnabled, tiltMax, onMouseMove]
    );

    const handleMouseLeave = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        onMouseLeave?.(e);
        if (!cardRef.current) return;

        const resetStyle: React.CSSProperties = {
          transform: `perspective(${TEAM_CARD_PERSPECTIVE}px) rotateX(0deg) rotateY(0deg)`,
          transition: "transform 0.4s ease",
          zIndex: "",
        };

        tiltStyle.current = resetStyle;
        Object.assign(cardRef.current.style, resetStyle);

        // Slow the shine border back to idle speed
        if (shineRef.current) {
          shineRef.current.style.setProperty("--duration", `${shineDuration}s`);
        }

        // Reset mascot back to neutral
        if (mascotRef.current) {
          mascotRef.current.style.transform = "rotate(0deg)";
          mascotRef.current.style.transition = "transform 0.4s ease";
        }
      },
      [onMouseLeave]
    );

    const [imgError, setImgError] = React.useState(false);

    const hasSocials =
      socials &&
      (socials.linkedin ?? socials.twitter ?? socials.instagram ?? socials.facebook);

    return (
      <div
        ref={setRef}
        className={cn(teamCardVariants(), className)}
        style={{ maxWidth: TEAM_CARD_MAX_WIDTH, minHeight: TEAM_CARD_MIN_HEIGHT, paddingBottom: TEAM_CARD_PADDING_BOTTOM, ...style }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Animated ShineBorder ring — ref lets us update --duration directly on hover */}
        <ShineBorder
          ref={shineRef}
          borderWidth={TEAM_CARD_BORDER_WIDTH}
          duration={shineDuration}
          shineColor={shineColor}
        />

        {/* Team member photo — width + aspect ratio controlled by
             TEAM_CARD_IMAGE_WIDTH and TEAM_CARD_IMAGE_ASPECT in TeamCard.tokens.ts.
             Vertical nudge controlled by TEAM_CARD_IMAGE_MARGIN_TOP. */}
        <div
          className={cn(teamCardImageVariants())}
          style={{ width: TEAM_CARD_IMAGE_WIDTH, aspectRatio: TEAM_CARD_IMAGE_ASPECT, marginTop: TEAM_CARD_IMAGE_MARGIN_TOP }}
        >
          {!imgError ? (
            <img
              src={imageSrc}
              alt={imageAlt ?? name}
              className="size-full object-cover object-top rounded-t-3xl rounded-b-2xl overflow-hidden pointer-events-none select-none"
              draggable={false}
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="flex size-full items-center justify-center bg-white/10 text-3xl font-bold text-white rounded-t-3xl rounded-b-2xl overflow-hidden pointer-events-none select-none">
              {name[0]?.toUpperCase() ?? "?"}
            </span>
          )}

          {/* Mascot overlay — centering is on the wrapper div; rotation is on the img only
              so the two transforms never interfere with each other.
              Size controlled by TEAM_CARD_MASCOT_SIZE in TeamCard.tokens.ts.
              Y position controlled by TEAM_CARD_MASCOT_OFFSET_Y (positive = further down). */}
          {mascotSrc && (
            <div
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-10"
              style={{ bottom: -TEAM_CARD_MASCOT_OFFSET_Y }}
            >
              <img
                ref={mascotRef}
                src={mascotSrc}
                alt=""
                aria-hidden
                className="object-contain drop-shadow-xl"
                style={{
                  width: TEAM_CARD_MASCOT_SIZE,
                  height: TEAM_CARD_MASCOT_SIZE,
                  transformOrigin: "center center",
                }}
              />
            </div>
          )}
        </div>

        {/* Name & role — top padding clears the mascot that hangs below the photo.
             Formula: mascot overhang (MASCOT_OFFSET_Y=24) minus flex gap (gap-3=12) = 12px minimum.
             Extra 4px added for breathing room between mascot and name. */}
        <div className="flex flex-col gap-0.5" style={{ paddingTop: TEAM_CARD_MASCOT_OFFSET_Y - 8 }}>
          <p className={teamCardNameVariants()}>{name}</p>
          <p className={teamCardRoleVariants()}>{role}</p>
        </div>

        {/* Optional extra content slot */}
        {children}

        {/* Socials */}
        {hasSocials && (
          <div className={teamCardSocialsVariants()}>
            {socials?.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 transition-colors hover:text-[#0A66C2]"
                aria-label={`${name} on LinkedIn`}
              >
                <LinkedInIcon />
              </a>
            )}
            {socials?.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 transition-colors hover:text-white"
                aria-label={`${name} on X / Twitter`}
              >
                <TwitterXIcon />
              </a>
            )}
            {socials?.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 transition-colors hover:text-[#E1306C]"
                aria-label={`${name} on Instagram`}
              >
                <InstagramIcon />
              </a>
            )}
            {socials?.facebook && (
              <a
                href={socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 transition-colors hover:text-[#1877F2]"
                aria-label={`${name} on Facebook`}
              >
                <FacebookIcon />
              </a>
            )}
          </div>
        )}
      </div>
    );
  }
);

TeamCard.displayName = "TeamCard";
