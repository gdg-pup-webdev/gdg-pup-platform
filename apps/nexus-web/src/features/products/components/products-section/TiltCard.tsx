"use client";

import React from "react";
import { ShineBorder } from "@packages/spark-ui";

// ---------------------------------------------------------------------------
// TiltCard — replicates the TeamCard 3-D tilt + ShineBorder hover effect
// ---------------------------------------------------------------------------
const TILT_MAX = 6;       // degrees
const PERSPECTIVE = 1000; // px
const SHINE_IDLE = 14;    // seconds per ShineBorder cycle
const SHINE_HOVER = 3;    // seconds per ShineBorder cycle on hover
const SHINE_COLORS = ["#4285F4", "#34A853", "#F9AB00", "#EA4335"];

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export function TiltCard({ children, className }: TiltCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const shineRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      Object.assign(cardRef.current.style, {
        transform: `perspective(${PERSPECTIVE}px) rotateX(${-ny * TILT_MAX}deg) rotateY(${nx * TILT_MAX}deg)`,
        transition: "transform 0.1s ease",
        zIndex: "10",
      });
      shineRef.current?.style.setProperty("--duration", `${SHINE_HOVER}s`);
    },
    []
  );

  const handleMouseLeave = React.useCallback(() => {
    if (!cardRef.current) return;
    Object.assign(cardRef.current.style, {
      transform: `perspective(${PERSPECTIVE}px) rotateX(0deg) rotateY(0deg)`,
      transition: "transform 0.4s ease",
      zIndex: "",
    });
    shineRef.current?.style.setProperty("--duration", `${SHINE_IDLE}s`);
  }, []);

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: "transform" }}
    >
      <ShineBorder
        ref={shineRef}
        borderWidth={3}
        duration={SHINE_IDLE}
        shineColor={SHINE_COLORS}
        style={{ borderRadius: 30 }}
      />
      {children}
    </div>
  );
}
