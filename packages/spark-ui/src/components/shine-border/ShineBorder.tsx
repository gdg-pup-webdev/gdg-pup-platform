"use client";

import * as React from "react";

import { cn } from "../../utils/cn";

/**
 * Google 4-color brand palette — used as the default shine sweep.
 */
export const GOOGLE_SHINE_COLORS = ["#4285F4", "#34A853", "#F9AB00", "#EA4335"] as const;

export interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Width of the border in pixels.
   * @default 4.5
   */
  borderWidth?: number;
  /**
   * Duration of one full animation cycle in seconds.
   * @default 10
   */
  duration?: number;
  /**
   * One colour or an array of colours for the shine sweep.
   * Defaults to the 4-colour Google gradient.
   */
  shineColor?: string | string[];
}

/**
 * ShineBorder
 *
 * An animated gradient border ring that sweeps across the card with a
 * radial-gradient highlight. Adapted from Magic UI's ShineBorder recipe and
 * tuned to complement TeamCard's Google-colour palette.
 *
 * @example
 * ```tsx
 * <div className="relative rounded-[28px]">
 *   <ShineBorder shineColor={["#4285F4", "#34A853", "#F9AB00", "#EA4335"]} borderWidth={4.5} />
 *   {children}
 * </div>
 * ```
 */
export function ShineBorder({
  borderWidth = 4.5,
  duration = 10,
  shineColor = GOOGLE_SHINE_COLORS as unknown as string[],
  className,
  style,
  ...props
}: ShineBorderProps) {
  const colors = Array.isArray(shineColor) ? shineColor.join(",") : shineColor;

  return (
    <div
      style={
        {
          "--border-width": `${borderWidth}px`,
          // --duration is read by the .motion-safe:animate-shine utility via
          // @theme inline { --animate-shine: shine var(--duration) ... }
          "--duration": `${duration}s`,
          backgroundImage: `radial-gradient(transparent,transparent, ${colors},transparent,transparent)`,
          backgroundSize: "300% 300%",
          mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "var(--border-width)",
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "motion-safe:animate-shine",
        // shine-border-ring class (defined in spark-ui styles.css) sets z-index: 1 so the
        // animated sweep always renders above the card's ::before static gradient border
        "shine-border-ring pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position]",
        className
      )}
      {...props}
    />
  );
}
