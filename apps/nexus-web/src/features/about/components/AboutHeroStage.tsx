"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ASSETS } from "@/lib/constants/assets";

/**
 * CSS custom properties that control spiral depths.
 * Values are adjusted to fit within the About section layout.
 * Using 'top' instead of 'y' for these offsets to avoid transform conflicts.
 */
const STAGE_STYLE = {
  width: "100%",
  height: "100%",
  minHeight: "clamp(200px, 40vw, 500px)",
  "--outer-y": "clamp(115px, 15vw, 210px)",
  "--center-y": "clamp(110px, 14vw, 205px)",
  "--inner-y": "clamp(100px, 13vw, 200px)",
} as React.CSSProperties;

/**
 * AboutHeroStage: A decorative stage with three spiral rings
 * and a floating mascot on top.
 *
 * Optimized for mobile performance by:
 * 1. Reducing expensive 'filter: blur' animations.
 * 2. Using 'will-change' for smoother transforms.
 * 3. Moving static offsets to 'top' property to free up 'transform' for animations.
 */
export function AboutHeroStage() {
  return (
    <div
      className="relative flex items-center justify-center w-full overflow-visible"
      style={STAGE_STYLE}
    >
      {/* Spirals unit with shared floating animation */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
        }}
        className="absolute inset-0 pointer-events-none select-none will-change-transform"
      >
        {/* Spiral outer — z 10 */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 10, top: "var(--outer-y)" }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.7, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          <div
            className="relative"
            style={{
              width: "clamp(300px, 60vw, 900px)",
              aspectRatio: "var(--spiral-outer-ratio)",
            }}
          >
            <Image
              src={ASSETS.ID.SPIRAL_OUTER}
              alt=""
              aria-hidden
              fill
              className="object-contain"
              priority
              style={{
                filter: "drop-shadow(0 10px 30px rgba(234, 67, 53, 0.15))",
              }}
            />
          </div>
        </motion.div>

        {/* Spiral center — z 20 */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 20, top: "var(--center-y)" }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.85, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div
            className="relative"
            style={{
              width: "clamp(250px, 50vw, 750px)",
              aspectRatio: "var(--spiral-center-ratio)",
            }}
          >
            <Image
              src={ASSETS.ID.SPIRAL_CENTER}
              alt=""
              aria-hidden
              fill
              className="object-contain"
              priority
              style={{
                filter: "drop-shadow(0 10px 30px rgba(234, 67, 53, 0.15))",
              }}
            />
          </div>
        </motion.div>

        {/* Spiral inner — z 30 */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 30, top: "var(--inner-y)" }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0 }}
        >
          <div
            className="relative"
            style={{
              width: "clamp(200px, 40vw, 600px)",
              aspectRatio: "var(--spiral-inner-ratio)",
            }}
          >
            <Image
              src={ASSETS.ID.SPIRAL_INNER}
              alt=""
              aria-hidden
              fill
              className="object-contain"
              priority
              style={{
                filter: "drop-shadow(0 10px 30px rgba(234, 67, 53, 0.2))",
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Mascot — z 30 (topmost) with its own floating animation */}
      <motion.div
        className="relative z-30 flex items-center justify-center w-full h-full will-change-transform"
        initial={{ opacity: 0, scale: 0.8, y: 20, x: 0 }}
        whileInView={{ opacity: 1, scale: 1, y: -40, x: -30 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: 0.5 }}
      >
        <motion.div
          animate={{ y: [-15, 15, -15] }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
          }}
          className="w-full flex justify-center items-center"
        >
          <Image
            src={ASSETS.ABOUT.WHO.MASCOT_2}
            alt="Our Values - Sparky Flying"
            width={400}
            height={400}
            className="w-full max-w-[450px] h-auto object-contain pointer-events-none"
            style={{
              filter: "drop-shadow(0 10px 30px rgba(234, 67, 53, 0.3))",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
