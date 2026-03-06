"use client";

import React from "react";
import { Spotlight, Box, Inline } from "@packages/spark-ui";
import { useBeamAnimation } from "../hooks/useBeamAnimation";

/**
 * Renders the four coloured spotlight beams behind the hero card.
 *
 * Layout geometry:
 *   - Container height = calc(50% + var(--outer-y)), which pins the bottom
 *     of the beam container exactly to the spiral platform at every viewport.
 *   - Box > Inline distributes four equal flex slots; each slot is the
 *     positioned ancestor for its Spotlight SVG, so width % resolves
 *     per-slot rather than per-group.
 *   - z-35: above spirals (z 10/20/30), below decoratives (z 40) and card (z 50).
 *
 * The top gradient stop of each beam breathes independently via useBeamAnimation.
 * The bottom shoulder stop is hardcoded at 80 % so only the top edge animates.
 */
export function IdHeroBeams() {
  const stopRedRef = React.useRef<SVGStopElement>(null);
  const stopGreenRef = React.useRef<SVGStopElement>(null);
  const stopBlueRef = React.useRef<SVGStopElement>(null);
  const stopYellowRef = React.useRef<SVGStopElement>(null);

  useBeamAnimation(stopRedRef, stopGreenRef, stopBlueRef, stopYellowRef);

  return (
    <div
      className="absolute top-0 left-0 right-0 z-35 pointer-events-none"
      style={{
        height: "calc(50% + var(--outer-y))",
        filter: "blur(8px)",
        WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
      }}
    >
      <Box
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-full"
        style={{ width: "clamp(220px, 85vw, 370px)" }}
      >
        <Inline gap="none" className="h-full">
          <div className="relative flex-1 h-full">
            <Spotlight id="red" fill="url(#hero-red)" style={{ width: "var(--beam-w)", height: "var(--beam-h)", top: "var(--beam-1-y)", left: "var(--beam-1-x)" } as React.CSSProperties} />
          </div>
          <div className="relative flex-1 h-full">
            <Spotlight id="green" fill="url(#hero-green)" style={{ width: "var(--beam-w)", height: "var(--beam-h)", top: "var(--beam-2-y)", left: "var(--beam-2-x)" } as React.CSSProperties} />
          </div>
          <div className="relative flex-1 h-full">
            <Spotlight id="blue" fill="url(#hero-blue)" style={{ width: "var(--beam-w)", height: "var(--beam-h)", top: "var(--beam-3-y)", left: "var(--beam-3-x)" } as React.CSSProperties} />
          </div>
          <div className="relative flex-1 h-full">
            <Spotlight id="yellow" fill="url(#hero-yellow)" style={{ width: "var(--beam-w)", height: "var(--beam-h)", top: "var(--beam-4-y)", left: "var(--beam-4-x)" } as React.CSSProperties} />
          </div>
        </Inline>
      </Box>

      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          <linearGradient id="hero-red" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(234, 67, 53, 0)" />
            <stop ref={stopRedRef} offset="20%" stopColor="#EA4335" />
            <stop offset="80%" stopColor="#EA4335" />
            <stop offset="100%" stopColor="rgba(234, 67, 53, 0)" />
          </linearGradient>
          <linearGradient id="hero-green" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(52, 168, 83, 0)" />
            <stop ref={stopGreenRef} offset="20%" stopColor="#34A853" />
            <stop offset="80%" stopColor="#34A853" />
            <stop offset="100%" stopColor="rgba(52, 168, 83, 0)" />
          </linearGradient>
          <linearGradient id="hero-blue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(66, 133, 244, 0)" />
            <stop ref={stopBlueRef} offset="20%" stopColor="#4285F4" />
            <stop offset="80%" stopColor="#4285F4" />
            <stop offset="100%" stopColor="rgba(66, 133, 244, 0)" />
          </linearGradient>
          <linearGradient id="hero-yellow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(249, 171, 0, 0)" />
            <stop ref={stopYellowRef} offset="20%" stopColor="#F9AB00" />
            <stop offset="80%" stopColor="#F9AB00" />
            <stop offset="100%" stopColor="rgba(249, 171, 0, 0)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
