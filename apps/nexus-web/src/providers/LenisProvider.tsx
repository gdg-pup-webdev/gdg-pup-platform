"use client";

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

// ─── Context ─────────────────────────────────────────────────────────────────

interface LenisContextValue {
  lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextValue>({ lenis: null });

/**
 * Returns the current Lenis instance.
 * Useful for programmatic scrolling (e.g. `lenis?.scrollTo("#section")`).
 */
export function useLenis() {
  return useContext(LenisContext).lenis;
}

// ─── Provider ────────────────────────────────────────────────────────────────

/**
 * Initialises Lenis smooth scroll for the entire application.
 * Wrap this around the root layout body content.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      // How long (in seconds) a scroll "gesture" coasts after the wheel stops.
      //   1.1 default nito
      duration: 1.1,
      // Smooth easing that decelerates naturally, similar to iOS rubber-banding.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    let rafId: number;

    function raf(time: DOMHighResTimeStamp) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current }}>
      {children}
    </LenisContext.Provider>
  );
}
