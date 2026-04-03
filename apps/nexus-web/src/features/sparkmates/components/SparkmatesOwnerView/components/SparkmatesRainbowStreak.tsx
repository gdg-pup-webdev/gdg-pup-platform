"use client";
import Image from "next/image";
import { useState, useEffect } from "react";





/**
 * Displays the rainbow streak. 
 * For background. 
 */
export const SparkmatesRainbowStreak = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="absolute pointer-events-none z-0 mix-blend-screen opacity-60 transition-transform duration-1000 ease-out"
      style={{
        width: "854px",
        height: "1518px",
        left: "65%",
        top: "55%",
        // Use translate based on mouse, but let CSS handle the rotation and drift inside
        transform: `translate(calc(-50% + ${mousePosition.x * -30}px), calc(-50% + ${mousePosition.y * -30}px))`,
      }}
    >
      <div className="relative w-full h-full animate-sparkmates-drift origin-center">
        <Image
          src="/auth/auth-rainbow-streak.png"
          alt="Rainbow Streak"
          className="object-cover blur-[60px]"
          fill
          priority />
      </div>
    </div>
  );
};
