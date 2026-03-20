"use client";

import { useEffect, useState } from "react";

/**
 * useEventModal
 *
 * Manages the two-phase open/close animation for the desktop event modal:
 *   1. `shouldRender`   — mounts/unmounts DOM node
 *   2. `isVisible`      — drives CSS transition (opacity + transform)
 *
 * Opening:  mount immediately → next paint → set visible
 * Closing:  clear visible → wait 800 ms for exit animation → unmount
 */
export function useEventModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);

      let raf1 = 0;
      let raf2 = 0;

      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });

      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }

    setIsVisible(false);

    const timeout = setTimeout(() => {
      setShouldRender(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [isOpen]);

  return {
    shouldRender,
    isVisible,
    openModal: () => setIsOpen(true),
    closeModal: () => setIsOpen(false),
  };
}
