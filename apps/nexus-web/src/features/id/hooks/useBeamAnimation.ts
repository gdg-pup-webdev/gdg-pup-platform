"use client";

import React from "react";

/**
 * Drives the breathing animation on the four hero spotlight beams.
 *
 * Each beam's top gradient stop oscillates independently via a sine wave,
 * swinging between ~5 % and ~35 % (center = 20, amplitude = 15).
 * The bottom shoulder stop is fixed at 80 %, so only the top edge moves.
 *
 * Implemented with requestAnimationFrame + direct DOM setAttribute to avoid
 * triggering React re-renders on every frame.
 */
export function useBeamAnimation(
  stopRedRef: React.RefObject<SVGStopElement | null>,
  stopGreenRef: React.RefObject<SVGStopElement | null>,
  stopBlueRef: React.RefObject<SVGStopElement | null>,
  stopYellowRef: React.RefObject<SVGStopElement | null>,
): void {
  React.useEffect(() => {
    const CENTER = 20;
    const AMP = 15;
    let rafId: number;
    const origin = performance.now();

    const tick = (now: number) => {
      const t = (now - origin) / 1000;
      stopRedRef.current?.setAttribute("offset", `${CENTER + AMP * Math.sin(t * 1.1)}%`);
      stopGreenRef.current?.setAttribute("offset", `${CENTER + AMP * Math.sin(t * 0.8 + 1.2)}%`);
      stopBlueRef.current?.setAttribute("offset", `${CENTER + AMP * Math.sin(t * 1.3 + 2.4)}%`);
      stopYellowRef.current?.setAttribute("offset", `${CENTER + AMP * Math.sin(t * 0.9 + 0.8)}%`);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);
}
