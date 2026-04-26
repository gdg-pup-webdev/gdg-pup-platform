"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "motion/react";

/**
 * A horizontal rainbow gradient streak that sits on the spiral platform.
 * Features a soft glow, mouse parallax, and a subtle shimmer animation.
 */
export function IdHeroRainbowStreak() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse parallax setup
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1 range
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Smooth springs for parallax
  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mousePosition.x, springConfig);
  const smoothY = useSpring(mousePosition.y, springConfig);

  // Map mouse movement to subtle translations
  const translateX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const translateY = useTransform(smoothY, [-1, 1], [-25, -25]);

  return (
    <motion.div
      className="absolute inset-0 hidden sm:flex items-center justify-center pointer-events-none select-none overflow-hidden"
      style={{
        zIndex: 32,
        y: "var(--outer-y)",
      }}
    >
      <motion.div
        className="relative"
        style={{
          width: "clamp(520px, 90vw, 904px)", // Match the outer spiral's max width
          height: "240px",
          x: translateX,
          y: translateY,
          // Masking it to an elliptical shape to keep it on the platform "floor"
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 50%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 50% 50%, black 0%, transparent 75%)",
        }}
      >
        {/* The main gradient streak */}
        <motion.div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[120px] opacity-50"
          style={{
            background: `linear-gradient(90deg, 
              rgba(234, 67, 53, 0) 0%, 
              #EA4335 15%, 
              #34A853 35%, 
              #4285F4 65%, 
              #F9AB00 85%, 
              rgba(249, 171, 0, 0) 100%
            )`,
            filter: "blur(5px)",
            mixBlendMode: "screen",
          }}
          animate={{
            scaleX: [1, 1.05, 1],
            opacity: [0.45, 0.65, 0.45],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Inner core shimmer for extra vibrancy */}
        <motion.div
          className="absolute inset-0 w-full h-[30%] top-1/2 -translate-y-1/2 opacity-40"
          style={{
            background: `linear-gradient(90deg, 
              rgba(255, 255, 255, 0) 0%, 
              rgba(255, 255, 255, 0.8) 50%, 
              rgba(255, 255, 255, 0) 100%
            )`,
            filter: "blur(40px)",
            mixBlendMode: "overlay",
          }}
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
