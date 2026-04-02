"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  PAST_EVENTS,
  PAST_EVENTS_CARDS_PER_STEP,
} from "../data/past-events";

/**
 * useCarousel
 *
 * Encapsulates all carousel state, refs, and interaction logic for the
 * desktop infinite-scroll past-events carousel.
 *
 * Returns everything the carousel UI needs: refs, drag handlers, and
 * prev/next click handlers.
 */
export function useCarousel() {
  const [isPastEventsHovered, setIsPastEventsHovered] = useState(false);
  const [isPastEventsDragging, setIsPastEventsDragging] = useState(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef(0);
  const setWidthRef = useRef(0);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const clickAnimRef = useRef<number | null>(null);

  const applyOffset = useCallback(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-offsetRef.current}px)`;
    }
  }, []);

  const normalizeOffset = useCallback(() => {
    const sw = setWidthRef.current;
    if (!sw) return;
    if (offsetRef.current < sw * 0.5) offsetRef.current += sw;
    else if (offsetRef.current > sw * 1.5) offsetRef.current -= sw;
  }, []);

  const getCardSpan = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const cards = track.querySelectorAll<HTMLElement>("[data-past-event-card]");
    if (cards.length < 2) return cards[0]?.offsetWidth ?? 0;
    return cards[1].offsetLeft - cards[0].offsetLeft;
  }, []);

  // Initialise offset on mount (or layout change)
  useEffect(() => {
    const init = () => {
      const span = getCardSpan();
      if (!span) return false;
      const sw = span * PAST_EVENTS.length;
      setWidthRef.current = sw;
      if (offsetRef.current < sw * 0.1) {
        offsetRef.current = sw;
        applyOffset();
      }
      return true;
    };

    if (init()) return;
    const observer = new ResizeObserver(() => {
      if (init()) observer.disconnect();
    });
    if (trackRef.current) observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, [getCardSpan, applyOffset]);

  // Auto-scroll animation — pauses while hovered or dragging
  useEffect(() => {
    if (isPastEventsHovered || isPastEventsDragging) return;

    let rafId = 0;
    let lastTime = 0;
    const PX_PER_SEC = 85;

    const tick = (time: number) => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;
      offsetRef.current += (PX_PER_SEC * delta) / 1000;
      normalizeOffset();
      applyOffset();
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPastEventsHovered, isPastEventsDragging, applyOffset, normalizeOffset]);

  const animateScrollBy = useCallback(
    (delta: number) => {
      if (clickAnimRef.current != null) {
        cancelAnimationFrame(clickAnimRef.current);
      }
      const start = offsetRef.current;
      const DURATION = 420;
      let startTime: number | null = null;

      const easeInOut = (t: number) =>
        t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      const tick = (time: number) => {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / DURATION, 1);
        offsetRef.current = start + delta * easeInOut(progress);
        normalizeOffset();
        applyOffset();
        if (progress < 1) {
          clickAnimRef.current = requestAnimationFrame(tick);
        } else {
          clickAnimRef.current = null;
        }
      };

      clickAnimRef.current = requestAnimationFrame(tick);
    },
    [applyOffset, normalizeOffset],
  );

  const handlePrev = useCallback(() => {
    const span = getCardSpan();
    if (span) animateScrollBy(-span * PAST_EVENTS_CARDS_PER_STEP);
  }, [getCardSpan, animateScrollBy]);

  const handleNext = useCallback(() => {
    const span = getCardSpan();
    if (span) animateScrollBy(span * PAST_EVENTS_CARDS_PER_STEP);
  }, [getCardSpan, animateScrollBy]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest("button"))
      return;
    if (clickAnimRef.current != null) {
      cancelAnimationFrame(clickAnimRef.current);
      clickAnimRef.current = null;
    }
    setIsPastEventsDragging(true);
    dragStartXRef.current = event.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isPastEventsDragging) return;
    const dx = event.clientX - dragStartXRef.current;
    offsetRef.current = dragStartOffsetRef.current - dx;
    normalizeOffset();
    applyOffset();
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isPastEventsDragging) return;
    setIsPastEventsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    normalizeOffset();
    applyOffset();
  };

  return {
    trackRef,
    isPastEventsDragging,
    setIsPastEventsHovered,
    handlePrev,
    handleNext,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
